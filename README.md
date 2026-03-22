⚡ Golf Impact Platform

A full-stack golf-based charity gaming platform where users submit scores, participate in draws, and contribute to charitable causes.

**Live Links**
Landing Page:
https://golf-platform-sigma.vercel.app/
User Dashboard:
https://golf-platform-sigma.vercel.app/user
Admin Dashboard:
https://golf-platform-sigma.vercel.app/admin
Demo Credentials:
User Panel
Email: user1@gmail.com  
Password: 123456

Admin Panel
Email: admin1@gmail.com  
Password: 123456

Features
**User Dashboard**
✅ Authentication (Signup/Login via Supabase)
✅ Subscription status (Active / Inactive)
✅ Add golf scores (auto-maintains latest 5 scores)
✅ View recent scores
✅ Select and save charity
✅ Participation in draw system
**Draw System**
✅ Random number generation (1–45)
✅ Match-based winner selection
✅ Prize pool calculation
✅ Charity contribution deduction
✅ Draw history tracking
✅ Winner storage with payout status
**Admin Dashboard**
✅ View all users
✅ View all scores
✅ Run draw manually
✅ View draw history
✅ Basic analytics (users, scores, draws)
**Public Pages**
✅ Landing page with hero section
✅ Charity exploration page
✅ "How It Works" explanation page


**Tech Stack**
 Frontend 
  React (Vite)
  React Router
  CSS (custom responsive UI)

 Backend / Database
  Supabase (PostgreSQL + Auth)

 Deployment
  Vercel
  
**Project Structure**
src/
│
├── App.jsx
├── main.jsx
├── supabaseClient.js
│
├── LandingPage.jsx
├── LoginPage.jsx
├── UserDashboard.jsx
├── AdminDashboard.jsx
├── CharityPage.jsx
├── HowItWorks.jsx
│
└── theme.css

**Setup Instructions**
1. Clone Repo
git clone https://github.com/lino345/golf-platform.git
cd golf-platform
2. Install Dependencies
npm install
3. Add Environment Variables
Create .env file:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
4. Run Locally
npm run dev

Deployment: (Vercel)
Framework: Vite
Build Command: npm run build
Output Directory: dist
Required Fix for Routing: vercel.json


**Future Improvements**
Stripe subscription integration
Automated monthly draw system
Admin management panel (CRUD)
Charity profiles & media
Email notifications
Role-based access security improvements 

**Key Highlights**
Clean role-based routing (User/Admin separation)
Fully functional draw system with prize logic
Mobile-responsive UI
Real-time backend using Supabase
Production-ready deployment on Vercel Author

Built as part of a Product Engineering assignment.

**Final Note**
This project focuses on delivering a functional MVP aligned with the PRD, prioritizing:
-Core logic (draw system, scoring)
-Clean UI/UX
-Scalable architecture
