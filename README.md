# 🎓 Day One AI Learning Platform

> An AI-powered educational platform for students, teachers, and parents with intelligent study materials, assessments, and real-time progress tracking.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-red)

---

## 🌟 Features

### For Students
- 📚 **AI-Powered Study Materials** - Access subject-wise PDFs with AI summarization
- 📝 **Smart Assessments** - Take exams with instant AI-generated feedback
- 🎯 **Modulator (AI Tutor)** - Ask questions and get AI-powered explanations
- 📊 **Progress Dashboard** - Track attendance, grades, and achievements
- 🔍 **PDF Search** - Find content in study materials with intelligent search
- 🔊 **Voice Narration** - Listen to AI-generated summaries

### For Teachers
- 👥 **Student Management** - Track student progress and attendance
- 📋 **Assessment Builder** - Create custom exams from question banks
- 📊 **Analytics Dashboard** - View class performance metrics
- 📄 **Report Generation** - Generate detailed student reports
- 📤 **Material Upload** - Share study materials with students

### For Parents
- 👀 **Child Monitoring** - View child's academic progress
- 📈 **Performance Reports** - Access detailed performance analytics
- 📱 **Real-time Updates** - Stay informed about attendance and grades

### For Admins
- 🗄️ **User Management** - Manage students, teachers, and parents
- 📁 **Content Management** - Upload study materials and question banks
- 🎯 **System Configuration** - Control platform settings and access

---

## 🏗️ Architecture

### **Stable 3-Layer Architecture**

```
┌─────────────────────────────────────────────┐
│         Frontend (Static Files)             │
│    HTML / CSS / Vanilla JavaScript          │
│         file:// or web server                │
└──────────────────┬──────────────────────────┘
                   │ Relative API Calls (/api/*)
                   ▼
┌─────────────────────────────────────────────┐
│       Backend (Node.js + Express)           │
│            Port 5000                        │
└──────────────────┬──────────────────────────┘
                   │ DB Queries
                   ▼
┌─────────────────────────────────────────────┐
│       Database (MySQL via XAMPP)            │
│            Port 3306                        │
└─────────────────────────────────────────────┘
```

### **Why This Architecture is Stable**

✅ **No Hardcoded URLs** - All API calls use relative paths
✅ **Environment-Independent** - Works on file://, localhost, LAN, production
✅ **No Build Process** - Pure HTML/CSS/JS, no compilation needed
✅ **Single Backend Port** - Clear separation of concerns
✅ **Portable** - Easy to deploy anywhere

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **XAMPP** (for MySQL)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone/Extract the Project**
```bash
cd "c:\Users\akabi\OneDrive\Pictures\New folder\Final Year project"
```

2. **Install Dependencies**
```bash
cd backend
npm install
```

3. **Configure Environment**
```bash
# Create .env file in backend folder
cp .env.example .env

# Edit .env with your settings:
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=school_db
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key_here
```

4. **Setup Database**
```bash
cd backend
node setup_db_fixed.js
```

5. **Create Test User**
```bash
node force_create_user.js
```

### Running the Application

**Option 1: Using the Batch File** ⭐ Recommended
```bash
# Just double-click START_BACKEND.bat
```

**Option 2: Manual Start**
```bash
# 1. Start MySQL in XAMPP
# 2. Start Backend
cd backend
node server.js

# 3. Open index.html in browser
```

---

## 📁 Project Structure

```
Final Year project/
├── 📄 index.html              # Main dashboard (Student/Teacher/Parent)
├── 📄 admin.html              # Admin portal
├── 📄 pdf_viewer.html         # PDF viewer with AI features
├── 📄 student_exam.html       # Student exam interface
├── 🎨 styles.css              # Global styles
├── 📘 README.md               # This file
├── 📗 STARTUP_GUIDE.md        # Detailed setup guide
├── 📋 QUICK_REFERENCE.txt     # Quick reference card
├── ⚡ START_BACKEND.bat       # Backend launcher
│
├── backend/
│   ├── 📄 server.js           # Main Express server (Port 5000)
│   ├── 📄 db.js               # MySQL connection pool
│   ├── 🔧 .env                # Environment variables
│   ├── 📄 setup_db_fixed.js   # Database setup script
│   ├── 📄 force_create_user.js # Test user creator
│   │
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── teacher.routes.js
│   │   ├── admin.routes.js
│   │   └── questionBank.routes.js
│   │
│   ├── services/              # Business logic
│   │   ├── gemini.service.js  # Google Gemini AI integration
│   │   ├── summarizer.client.js
│   │   └── pdfText.service.js
│   │
│   └── middleware/            # Custom middleware
│       └── auth.middleware.js
│
├── uploads/                   # User uploads
│   ├── profiles/             # Profile images
│   ├── study_materials/      # Study PDFs
│   └── question_banks/       # Question bank files
│
└── public/
    └── landing.html          # Landing page
```

---

## 🔑 Default Credentials

### Test Student
- **Email**: `deepak@gmail.com`
- **Password**: `password`

### Admin Portal
- **Key**: `admin123`
- **URL**: Open `admin.html`

---

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- PDF.js (for PDF rendering)
- No frameworks - Pure vanilla JS

### Backend
- Node.js + Express.js
- MySQL (via mysql2)
- JWT Authentication
- Multer (file uploads)
- PDF-Parse (text extraction)

### AI Services
- Google Gemini API (text generation & summarization)
- Web Speech API (text-to-speech)

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/signup          # User registration
POST   /api/login           # User login
POST   /api/logout          # User logout
GET    /api/profile         # Get user profile
PATCH  /api/profile         # Update profile
```

### Student
```
GET    /api/student/assessments        # Get available assessments
POST   /api/student/submit-assessment  # Submit assessment
GET    /api/student/study-materials    # Get study materials
GET    /api/student/attendance         # Get attendance records
```

### Teacher
```
GET    /api/teacher/students           # Get student list
POST   /api/teacher/attendance         # Mark attendance
POST   /api/teacher/create-assessment  # Create assessment
GET    /api/teacher/reports            # Generate reports
```

### Admin
```
GET    /api/admin/users               # Get all users
PATCH  /api/admin/users/:id/status   # Enable/Disable user
POST   /api/admin/study-material/upload  # Upload materials
POST   /api/admin/upload-question-bank-json  # Upload question banks
```

### AI Features
```
POST   /api/modulator                 # AI tutor chat
POST   /api/ai/summarize             # Summarize text
POST   /api/pdf/summarize            # Summarize PDF document
```

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if MySQL is running in XAMPP
# Check if port 5000 is available
netstat -ano | findstr :5000

# If port is in use, change it in backend/server.js
const PORT = 5001;  # or any other available port
```

### Database connection errors
```bash
# Verify MySQL is running
# Check .env file:
DB_HOST=127.0.0.1     # Use IP instead of localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Leave empty if no password

# Reset database
cd backend
node setup_db_fixed.js
```

### Login not working
```bash
# Create a fresh test user
cd backend
node force_create_user.js
```

### AI features not working
```bash
# Check GEMINI_API_KEY in .env
# Get a free API key from: https://makersuite.google.com/app/apikey
```

---

## 📱 Deployment

### Local Network Deployment
1. Find your local IP: `ipconfig`
2. Start backend: `node server.js`
3. Access from other devices: `http://YOUR_IP:5000`

### Production Deployment

**Frontend** (Any Static Hosting)
- Netlify, Vercel, GitHub Pages
- Upload: index.html, admin.html, pdf_viewer.html, styles.css

**Backend** (Node.js Hosting)
- Railway, Render, Heroku
- Set environment variables
- Deploy backend folder

**Database** (Managed MySQL)
- PlanetScale, Railway, AWS RDS
- Update connection strings in .env

**No code changes needed!** Relative paths work everywhere.

---

## 🔒 Security Features

- ✅ bcrypt password hashing
- ✅ JWT authentication
- ✅ SQL injection prevention (parameterized queries)
- ✅ File type validation
- ✅ Role-based access control
- ✅ Session management

---

## 🧪 Testing

### Manual Testing
```bash
# 1. Test database setup
cd backend
node setup_db_fixed.js

# 2. Create test users
node force_create_user.js

# 3. Start server
node server.js

# 4. Open index.html and test:
# - Login/Signup
# - Student dashboard
# - Teacher portal
# - Admin panel
```

---

## 📚 Documentation

- 📗 **STARTUP_GUIDE.md** - Complete setup instructions
- 📋 **QUICK_REFERENCE.txt** - Quick command reference
- 💻 **Inline Code Comments** - Every function documented

---

## 🤝 Contributing

This is a final year project. For educational purposes only.

---

## 📄 License

Educational Project - Not for commercial use

---

## 👨‍💻 Developer

**Final Year Project**  
Built with ❤️ using Node.js, MySQL, and Google Gemini AI

---

## 🆘 Need Help?

1. Check **STARTUP_GUIDE.md** for detailed instructions
2. Check **QUICK_REFERENCE.txt** for quick commands
3. Review error messages in browser console (F12)
4. Check backend terminal for server logs

---

**🎉 Ready to start? Just run `START_BACKEND.bat` and open `index.html`!**
