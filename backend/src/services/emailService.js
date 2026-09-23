import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.EMAIL_DEV_MODE === 'true' || !process.env.EMAIL_USER) {
    console.log('\n================== [DEV EMAIL SERVICE] ==================');
    console.log(`✉️  To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Content:\n${text || html}`);
    console.log('=========================================================\n');
    return { devMode: true, success: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"LearnSphere LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
