# 🏗️ Day One AI - System Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        DAY ONE AI LEARNING PLATFORM                           ║
║                         Stable Architecture v1.0                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌──────────────────────────────────────────────────────────────────────────────┐
│                           👥 USER LAYER                                       │
└──────────────────────────────────────────────────────────────────────────────┘

    🎓 Student          👨‍🏫 Teacher         👨‍👩‍👧 Parent         🔧 Admin
       │                   │                   │                 │
       │                   │                   │                 │
       └───────────────────┴───────────────────┴─────────────────┘
                                   │
                                   ▼

┌──────────────────────────────────────────────────────────────────────────────┐
│                        🌐 FRONTEND LAYER (Static)                             │
│                                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ index.html  │  │ admin.html  │  │pdf_viewer   │  │student_exam │       │
│  │             │  │             │  │   .html     │  │  .html      │       │
│  │ Main App    │  │ Admin Panel │  │ PDF + AI    │  │ Exam UI     │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                               │
│  Served via:  file:///  OR  Live Server  OR  Netlify/Vercel                 │
│  Port: NONE (Static files)                                                   │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                │ Relative API Calls
                                │ /api/login
                                │ /api/student/assessments
                                │ /api/modulator
                                │ (Browser auto-resolves origin)
                                │
                                ▼

┌──────────────────────────────────────────────────────────────────────────────┐
│                        ⚙️ BACKEND LAYER (Node.js)                            │
│                             PORT: 5000                                        │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  Express.js Server (server.js)                                         │ │
│  │                                                                         │ │
│  │  Health Check:                                                         │ │
│  │  ✓ GET  /health          → Server status                              │ │
│  │  ✓ GET  /api/info        → API documentation                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Auth      │  │  Student    │  │  Teacher    │  │   Admin     │       │
│  │   Routes    │  │   Routes    │  │   Routes    │  │   Routes    │       │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤       │
│  │ /api/signup │  │/assessments │  │/students    │  │/users       │       │
│  │ /api/login  │  │/materials   │  │/attendance  │  │/upload      │       │
│  │ /api/logout │  │/attendance  │  │/reports     │  │/question-   │       │
│  │ /api/profile│  │             │  │             │  │  bank       │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    🤖 AI Services Layer                              │   │
│  │                                                                       │   │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│  │  │  Modulator   │   │  Summarizer  │   │  Gemini API  │           │   │
│  │  │  (AI Tutor)  │   │  Service     │   │  Integration │           │   │
│  │  ├──────────────┤   ├──────────────┤   ├──────────────┤           │   │
│  │  │/api/modulator│   │/api/ai/      │   │generateReply │           │   │
│  │  │              │   │  summarize   │   │summarizeText │           │   │
│  │  │ - Q&A        │   │              │   │              │           │   │
│  │  │ - Explain    │   │ - Page       │   │ Google       │           │   │
│  │  │ - Examples   │   │ - Document   │   │ Gemini       │           │   │
│  │  └──────────────┘   └──────────────┘   └──────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      📦 Middleware Layer                             │   │
│  │                                                                       │   │
│  │  • CORS (all origins allowed)                                       │   │
│  │  • JSON Body Parser (150MB limit)                                   │   │
│  │  • Multer File Upload (profiles, PDFs, question banks)             │   │
│  │  • JWT Authentication (token verification)                          │   │
│  │  • Error Handler (centralized error responses)                      │   │
│  │  • Request Logger (debug logging)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  Startup: START_BACKEND.bat  OR  node server.js                             │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                │ MySQL Connection Pool
                                │ mysql2/promise
                                │
                                ▼

┌──────────────────────────────────────────────────────────────────────────────┐
│                      💾 DATABASE LAYER (MySQL)                                │
│                           PORT: 3306                                          │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         Database: school_db                             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   users     │  │assessments  │  │ attendance  │  │study_       │       │
│  │             │  │             │  │             │  │materials    │       │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤       │
│  │ id          │  │ id          │  │ id          │  │ id          │       │
│  │ name        │  │ title       │  │ student_id  │  │ title       │       │
│  │ email       │  │ subject     │  │ date        │  │ subject     │       │
│  │ phone       │  │ class       │  │ status      │  │ class       │       │
│  │ password    │  │ total_marks │  │ created_at  │  │ file_path   │       │
│  │ role        │  │ questions   │  └─────────────┘  │ uploaded_by │       │
│  │ class       │  │ created_by  │                   │ created_at  │       │
│  │ is_active   │  │ is_published│  ┌─────────────┐  └─────────────┘       │
│  │ created_at  │  │ created_at  │  │submissions  │                         │
│  └─────────────┘  └─────────────┘  │             │  ┌─────────────┐       │
│                                     ├─────────────┤  │question_    │       │
│                                     │ id          │  │banks        │       │
│                                     │ student_id  │  ├─────────────┤       │
│                                     │ assessment  │  │ id          │       │
│                                     │ answers     │  │ title       │       │
│                                     │ score       │  │ subject     │       │
│                                     │ submitted_at│  │ class       │       │
│                                     └─────────────┘  │ questions   │       │
│                                                      │ created_at  │       │
│                                                      └─────────────┘       │
│                                                                               │
│  Running on: XAMPP Control Panel                                             │
│  Setup: node setup_db_fixed.js                                               │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                      📁 FILE STORAGE LAYER                                    │
│                                                                               │
│  uploads/                                                                     │
│  ├── profiles/              → User profile images                           │
│  ├── study_materials/       → PDF study materials                           │
│  └── question_banks/        → Question bank files (CSV, JSON, PDF)          │
│                                                                               │
│  Storage: Local filesystem (backend/uploads/)                                │
│  Access: Served via Express static middleware                                │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                      🔐 AUTHENTICATION FLOW                                   │
│                                                                               │
│  1. User → POST /api/login (email + password)                               │
│  2. Backend → Verify password (bcrypt compare)                               │
│  3. Backend → Generate JWT token                                             │
│  4. Backend → Return { user, token }                                         │
│  5. Frontend → Store in localStorage                                         │
│  6. Frontend → Include token in all API requests                             │
│  7. Backend → Verify token (JWT middleware)                                  │
│  8. Backend → Allow/Deny based on role                                       │
│                                                                               │
│  Token Format: Bearer <jwt_token>                                            │
│  Token Expiry: 24 hours (configurable)                                       │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                      🚀 DEPLOYMENT ARCHITECTURE                               │
│                                                                               │
│  LOCAL (DEVELOPMENT)                                                          │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          │
│  │  file:///      │────▶│ localhost:5000 │────▶│ localhost:3306 │          │
│  │  index.html    │     │  Node.js       │     │  MySQL         │          │
│  └────────────────┘     └────────────────┘     └────────────────┘          │
│                                                                               │
│  PRODUCTION (CLOUD)                                                           │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐          │
│  │  Netlify       │────▶│  Railway       │────▶│  PlanetScale   │          │
│  │  Static Site   │     │  Node.js       │     │  MySQL         │          │
│  └────────────────┘     └────────────────┘     └────────────────┘          │
│                                                                               │
│  KEY: Uses relative paths (/api/*) → works in both environments!            │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                      ⚡ STARTUP SEQUENCE                                      │
│                                                                               │
│  Step 1: Start MySQL (XAMPP)                                                 │
│          ├─ Open XAMPP Control Panel                                         │
│          └─ Click "Start" for MySQL (Port 3306)                             │
│                                                                               │
│  Step 2: Start Backend                                                       │
│          ├─ Option A: Double-click START_BACKEND.bat                        │
│          └─ Option B: cd backend && node server.js                          │
│          ✓ Server running on Port 5000                                       │
│          ✓ Database connected                                                │
│          ✓ Ready to accept requests                                          │
│                                                                               │
│  Step 3: Open Frontend                                                       │
│          ├─ Option A: Double-click index.html                               │
│          └─ Option B: Open via Live Server                                  │
│          ✓ Frontend loads                                                    │
│          ✓ API calls resolve to backend                                      │
│          ✓ Everything works!                                                 │
│                                                                               │
│  Total Time: ~30 seconds                                                     │
└──────────────────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════╗
║                          ✨ STABILITY FEATURES ✨                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ✅ No hardcoded URLs           → Relative paths (/api/*)
  ✅ Environment independent     → Works on file://, localhost, LAN, cloud
  ✅ Single backend port         → Port 5000 only
  ✅ No build process            → Pure HTML/CSS/JS
  ✅ Clear documentation         → 5 comprehensive guides
  ✅ Health check endpoint       → /health for diagnostics
  ✅ Error handling              → User-friendly messages
  ✅ One-click startup           → START_BACKEND.bat
  ✅ Automatic DB setup          → setup_db_fixed.js
  ✅ Test user creation          → force_create_user.js

╔══════════════════════════════════════════════════════════════════════════════╗
║                    🎓 PERFECT FOR FINAL YEAR PROJECT                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ✓ Works offline (core features)
  ✓ Simple 3-step startup
  ✓ No external dependencies for frontend
  ✓ Well documented (README, guides, diagrams)
  ✓ Easy to demo (even non-technical evaluators can run it)
  ✓ Deployment ready (cloud or local network)
  ✓ Professional architecture (industry standard patterns)

```
