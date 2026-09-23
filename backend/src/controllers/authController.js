import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../services/emailService.js';

/**
 * Format sanitized user object for API responses
 */
const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  phone: user.phone,
  bio: user.bio,
  skills: user.skills,
  interests: user.interests,
  enrolledCourses: user.enrolledCourses,
  createdAt: user.createdAt,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 400, 'An account with this email address already exists.');
  }

  // Create new user (role defaults to student, but can be requested)
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: role || 'student',
  });

  const token = user.getSignedJwtToken();

  return successResponse(res, 201, 'Account registered successfully', {
    token,
    user: sanitizeUser(user),
  });
});

/**
 * @desc    Login user with email & password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Query user with password explicitly included
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return errorResponse(res, 401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    return errorResponse(res, 403, 'Your account has been deactivated. Please contact support.');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return errorResponse(res, 401, 'Invalid email or password.');
  }

  const token = user.getSignedJwtToken();

  return successResponse(res, 200, 'Login successful', {
    token,
    user: sanitizeUser(user),
  });
});

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found.');
  }

  return successResponse(res, 200, 'Profile retrieved successfully', {
    user: sanitizeUser(user),
  });
});

/**
 * @desc    Logout user (clears client token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'Successfully logged out.');
});

/**
 * @desc    Forgot Password - Request reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Avoid user enumeration: return generic success message
    return successResponse(
      res,
      200,
      'If an account with that email exists, a password reset link has been sent.'
    );
  }

  // Generate random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiration to 15 minutes from now
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  // Reset URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const message = `
    Hello ${user.name},\n\n
    You have requested a password reset for your LearnSphere LMS account.\n
    Please click the following link (or paste it into your browser) to reset your password:\n\n
    ${resetUrl}\n\n
    This link is valid for 15 minutes.\n
    If you did not request this, please ignore this email.
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'LearnSphere LMS — Password Reset Request',
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 10px;">
          <h2 style="color: #818cf8;">Password Reset Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your LearnSphere LMS account password.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset My Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This link will expire in 15 minutes.</p>
          <p style="color: #64748b; font-size: 12px;">If you did not request a password reset, you can safely ignore this message.</p>
        </div>
      `,
    });

    const isDev = process.env.NODE_ENV === 'development' || process.env.EMAIL_DEV_MODE === 'true';

    return successResponse(
      res,
      200,
      'Password reset instructions sent to your email.',
      isDev ? { devResetUrl: resetUrl, resetToken } : null
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return errorResponse(res, 500, 'Email could not be sent. Please try again later.');
  }
});

/**
 * @desc    Reset Password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return errorResponse(res, 400, 'Password reset token is invalid or has expired.');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const token = user.getSignedJwtToken();

  return successResponse(res, 200, 'Password updated successfully. You are now logged in.', {
    token,
    user: sanitizeUser(user),
  });
});
