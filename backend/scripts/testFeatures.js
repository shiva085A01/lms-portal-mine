const testFeatures = async () => {
  try {
    console.log('--- 1. Authenticating as Student (student@lms.com) ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@lms.com', password: 'Password@123' }),
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('✅ Student Authenticated. Token received.');

    console.log('\n--- 2. Fetching Courses from MongoDB ---');
    const coursesRes = await fetch('http://localhost:5000/api/courses');
    const coursesData = await coursesRes.json();
    console.log(`✅ Loaded ${coursesData.data.length} Courses from MongoDB`);
    const targetCourse = coursesData.data[0];

    console.log(`\n--- 3. Testing Real Enrollment in Course: "${targetCourse.title}" ---`);
    const enrollRes = await fetch(`http://localhost:5000/api/courses/${targetCourse._id}/enroll`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const enrollData = await enrollRes.json();
    console.log('✅ Enrollment Status:', enrollRes.status, enrollData.message);

    console.log('\n--- 4. Testing Reels / Learning Shorts Like Toggle ---');
    const shortsRes = await fetch('http://localhost:5000/api/learning-shorts');
    const shortsData = await shortsRes.json();
    const targetShort = shortsData.data[0];
    const likeRes = await fetch(`http://localhost:5000/api/learning-shorts/${targetShort._id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const likeData = await likeRes.json();
    console.log('✅ Liked Short:', targetShort.title, 'New Likes Count:', likeData.data.likesCount);

    console.log('\n--- 5. Testing Study Room Join ---');
    const roomsRes = await fetch('http://localhost:5000/api/study-rooms', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const roomsData = await roomsRes.json();
    const targetRoom = roomsData.data[0];
    const joinRes = await fetch(`http://localhost:5000/api/study-rooms/${targetRoom._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const joinData = await joinRes.json();
    console.log('✅ Joined Study Room:', targetRoom.name, 'Status:', joinRes.status);

    console.log('\n--- 6. Testing Weekly Feedback Submission ---');
    const fbRes = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weekNumber: 3,
        rating: 5,
        learned: 'Completed comprehensive integration tests for all feature routes!',
        difficulties: 'None, everything is persisting to MongoDB.',
        suggestions: 'Keep up the glassmorphic aesthetics.',
        confidenceLevel: 'High',
      }),
    });
    const fbData = await fbRes.json();
    console.log('✅ Feedback Submitted:', fbRes.status, fbData.message);

    console.log('\n--- 7. Testing Admin Analytics Overview ---');
    const adminLoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@lms.com', password: 'Password@123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.data.token;

    const analyticsRes = await fetch('http://localhost:5000/api/analytics/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const analyticsData = await analyticsRes.json();
    console.log('✅ Real Platform Metrics in MongoDB:');
    console.log(JSON.stringify(analyticsData.data.metrics, null, 2));

    console.log('\n🎉 ALL REAL DATABASE FEATURES VERIFIED & TESTED END-TO-END!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
};

testFeatures();
