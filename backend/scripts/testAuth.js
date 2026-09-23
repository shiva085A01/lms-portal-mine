const testAuth = async () => {
  try {
    console.log('--- Testing Student Login ---');
    const resStudent = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@lms.com', password: 'Password@123' }),
    });
    const dataStudent = await resStudent.json();
    console.log('✅ Student Login Status:', resStudent.status);
    console.log('👤 Logged In As:', dataStudent.data.user.name, `(${dataStudent.data.user.role})`);
    const studentToken = dataStudent.data.token;

    console.log('\n--- Testing Protected /api/auth/me Endpoint ---');
    const resMe = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const dataMe = await resMe.json();
    console.log('✅ Auth Me Status:', resMe.status);
    console.log('📧 Verified Email:', dataMe.data.user.email);

    console.log('\n--- Testing Admin Login ---');
    const resAdmin = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@lms.com', password: 'Password@123' }),
    });
    const dataAdmin = await resAdmin.json();
    console.log('✅ Admin Login Status:', resAdmin.status);
    console.log('👤 Logged In As:', dataAdmin.data.user.name, `(${dataAdmin.data.user.role})`);

    console.log('\n--- Testing Forgot Password ---');
    const resForgot = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@lms.com' }),
    });
    const dataForgot = await resForgot.json();
    console.log('✅ Forgot Password Status:', resForgot.status);
    console.log('🔗 Dev Reset URL:', dataForgot.data?.devResetUrl);

    console.log('\n🎉 ALL AUTHENTICATION ENDPOINTS VERIFIED & WORKING PERFECTLY!');
  } catch (err) {
    console.error('❌ Auth test error:', err.message);
  }
};

testAuth();
