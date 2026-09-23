# LearnSphere — AI-Powered Next-Gen Full-Stack LMS Portal

A full-stack, production-ready Learning Management System (LMS) built with the **MERN stack** (MongoDB Atlas, Express.js, React 18 + Vite, Node.js) featuring a glassmorphism design system, role-based access control, interactive Reels-style microlearning, study rooms, live webinars, weekly feedback surveys, and career acceleration tools.

---

## 🚀 Key Features

### 🎓 Student Ecosystem
* **Personalized Learning Command Center**: Real-time progress tracking, enrolled courses, learning streak, and upcoming webinars.
* **Curriculum Catalog**: Filterable course directory with syllabus outlines, modules, lessons, and 1-click MongoDB-persisted enrollment.
* **Scrollable Learning (Reels/Shorts)**: TikTok / YouTube Shorts-inspired vertical microlearning feed with autoplay, mute/unmute, like counter, and topic tags.
* **Group Study Rooms**: Collaborative peer learning spaces with membership management and learning goals.
* **Live Seminars & Masterclasses**: Tech talks led by industry architects with free seat reservations and Google Meet links.
* **Career Acceleration Hub**: ATS-optimized resume guidelines, top 75 LeetCode algorithmic patterns, system design frameworks, and interactive checklists.
* **Weekly Academic Feedback**: 5-star rating surveys and learning reflection forms saved directly to MongoDB.

### 🛡️ Administrator Governance
* **Live System Metrics**: Dynamic aggregations from MongoDB Atlas (Total Students, Instructors, Courses, Enrollments, Study Rooms, Seminars, Feedback).
* **User Directory**: Search and filter all registered platform users by role.
* **Webinar Management**: Schedule, publish, and supervise live masterclasses.
* **Feedback Oversight**: Monitor student sentiment, difficulties, and average weekly ratings.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS v3, React Router v6, Axios, Lucide React, Framer Motion, React Hot Toast
* **Backend**: Node.js, Express.js, Mongoose 8, JWT (JSON Web Tokens), bcryptjs, Morgan, Helmet, CORS, Express Validator
* **Database**: MongoDB Atlas (Cloud Cluster)
* **Styling**: Glassmorphism (Backdrop blur, translucent surfaces, gradient glows, Plus Jakarta Sans typography)

---

## 📂 Project Architecture

```
lms-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Atlas connection
│   │   ├── controllers/     # Auth, Course, Shorts, StudyRoom, Seminar, etc.
│   │   ├── middlewares/     # JWT verifyToken, role-based authorize, error handler
│   │   ├── models/          # User, Course, Enrollment, LearningShort, StudyRoom, Seminar, etc.
│   │   ├── routes/          # REST API endpoints
│   │   ├── services/        # Email, AI evaluation, and recommendations
│   │   ├── utils/           # apiResponse wrappers and asyncHandler
│   │   ├── app.js           # Express application configuration
│   │   └── server.js        # Server bootstrapper
│   ├── scripts/
│   │   ├── seed.js          # Full database seeder with real courses and users
│   │   └── testFeatures.js  # Automated end-to-end integration test suite
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # GlassCard, Button, Input, StudentNavbar, AdminNavbar
│   │   ├── context/         # AuthContext with token persistence
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── student/     # Dashboard, Courses, Shorts, StudyRooms, Seminars, Career, Feedback
│   │   │   └── admin/       # Dashboard, Users, Seminars, Feedback
│   │   ├── routes/          # AppRoutes with role route guards
│   │   ├── services/        # Centralized Axios client
│   │   ├── App.jsx          # Interactive landing page and diagnostic hub
│   │   ├── index.css        # Glassmorphism tokens & Tailwind directives
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: A free MongoDB Atlas cluster connection URI

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Open `backend/.env` and supply your MongoDB Atlas connection string:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/learnsphere_lms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

#### Seed Initial Database:
```bash
npm run seed
```

#### Start Backend Server:
```bash
npm run dev
# Server will listen on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Ensure `frontend/.env` points to the backend API:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LearnSphere LMS
```

#### Start Frontend Dev Server:
```bash
npm run dev
# Vite will launch on http://localhost:5173
```

---

## 🔑 Demo Test Credentials

After running `npm run seed`, you can sign in using:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@lms.com` | `Password@123` |
| **Student** | `student@lms.com` | `Password@123` |
| **Instructor** | `instructor@lms.com` | `Password@123` |

*(The login page also provides 1-click **Quick Demo Fill** buttons for immediate testing).*

---

## 🧪 Testing Verification

Run the automated end-to-end integration test:
```bash
cd backend
node scripts/testFeatures.js
```

---

## 🔒 Security Best Practices
* Passwords are encrypted using `bcryptjs` with salt rounds before saving.
* Bearer tokens are signed with HMAC SHA-256 and checked by role guards.
* `.env` files are strictly excluded via `.gitignore` to prevent credential leaks.
* HTTP headers are protected with Helmet and CORS origin whitelisting.

---

## 📜 License
ISC License. Built for modern educational institutions and EdTech engineering teams.
