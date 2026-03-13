# 🚀 Day One AI - Stable Startup Guide

## ✅ Architecture Overview

**Frontend**: Static HTML/CSS/JS (No port needed)  
**Backend**: Node.js Express API (Port 5000)  
**Database**: MySQL via XAMPP (Port 3306)

---

## 📋 Prerequisites

1. **XAMPP** installed with MySQL running
2. **Node.js** installed (v14 or higher)
3. All project files in: `c:\Users\akabi\OneDrive\Pictures\New folder\Final Year project`

---

## 🎯 STABLE STARTUP PROCEDURE

### Step 1: Start MySQL (XAMPP)
1. Open **XAMPP Control Panel**
2. Click **Start** for **MySQL**
3. ❌ Apache is **NOT required** (no port 3000 needed!)
4. Verify: MySQL shows "Running" (green highlight)

### Step 2: Setup Database (First Time Only)
```bash
cd "c:\Users\akabi\OneDrive\Pictures\New folder\Final Year project\backend"
node setup_db_fixed.js
```

**Expected Output:**
```
✅ Database 'school_db' created
✅ Users table created with columns: id, name, email, phone, password, role, class, term, profile_image, bio, avatar, is_active, created_at
```

### Step 3: Start Backend Server
```bash
cd "c:\Users\akabi\OneDrive\Pictures\New folder\Final Year project\backend"
node server.js
```

**Expected Output:**
```
🔗 MySQL Connected
🎯 Day One AI - AI Learning Platform API
SERVER RUNNING → http://localhost:5000
```

### Step 4: Open Frontend
**Option A: Direct File Open** (Recommended)
- Double-click `index.html` in File Explorer
- URL will be: `file:///c:/Users/akabi/OneDrive/Pictures/New%20folder/Final%20Year%20project/index.html`

**Option B: Using Live Server (VSCode Extension)**
- Right-click `index.html` → "Open with Live Server"
- URL will be: `http://127.0.0.1:5500/index.html`

---

## ✨ Key Changes Made (Stable Architecture)

### URLs Fixed (Relative Paths)
All API calls now use **relative paths** instead of hardcoded localhost:

**Before (Unstable):**
```javascript
fetch("http://localhost:3000/api/login")
```

**After (Stable):**
```javascript
fetch("/api/login")
```

**Files Updated:**
- ✅ `index.html` - All API calls (signup, modulator, study materials)
- ✅ `admin.html` - All admin API calls
- ✅ `pdf_viewer.html` - AI summarization and PDF endpoints

---

## 🎓 Test Login Credentials

After running `setup_db_fixed.js`, create a test user:

```bash
cd backend
node force_create_user.js
```

**Test Login:**
- **Email**: `deepak@gmail.com`
- **Password**: `password`
- **Role**: Student

---

## 🔥 Common Issues & Solutions

### Issue 1: "Backend server is not running"
**Solution:**
1. Check if `node server.js` is running in terminal
2. Ensure MySQL is running in XAMPP
3. Check `.env` file has `DB_HOST=127.0.0.1`

### Issue 2: "Connection refused" or ETIMEDOUT
**Solution:**
1. Stop the backend (`Ctrl+C`)
2. Verify MySQL is running
3. Edit `.env`: Change `DB_HOST=localhost` to `DB_HOST=127.0.0.1`
4. Restart backend

### Issue 3: "Unknown column" errors
**Solution:**
```bash
cd backend
node setup_db_fixed.js
```

### Issue 4: Port 3000 already in use
**This should NOT happen!** The backend runs on **port 5000**, not 3000.

If you see this error:
- Check what's using port 5000: `netstat -ano | findstr :5000`
- Kill the process if needed
- Or change the port in `backend/server.js`:
  ```javascript
  const PORT = process.env.PORT || 5001;
  ```

---

## 📁 Project Structure

```
Final Year project/
├── index.html          ✅ Student/Teacher/Parent Dashboard
├── admin.html          ✅ Admin Portal
├── pdf_viewer.html     ✅ PDF Viewer with AI
├── styles.css          ✅ Main styles
├── backend/
│   ├── server.js       ✅ Main Express server (Port 5000)
│   ├── db.js           ✅ MySQL connection pool
│   ├── .env            ✅ Environment variables
│   ├── setup_db_fixed.js ✅ Database setup script
│   └── routes/         ✅ API endpoints
└── uploads/            ✅ Study materials storage
```

---

## 🛡️ Why This is Stable

### 1. **No Hardcoded Ports**
- Frontend uses relative paths: `/api/login`
- Browser automatically resolves to correct origin
- Works on: `file://`, `localhost`, LAN IP, demo machines

### 2. **Single Backend Port**
- Backend: **Port 5000** only
- No port 3000 confusion
- No frontend server needed

### 3. **Static Frontend**
- Pure HTML/CSS/JS
- No build process
- No npm dependencies for frontend
- Just open `index.html` and it works!

### 4. **Clear Startup**
```
1. Start MySQL (XAMPP)
2. Start Backend (node server.js)
3. Open index.html
```

---

## 🎯 Production Deployment

For deployment to a live server:

1. **Frontend**: Upload all `.html`, `.css`, `.js` files to web hosting
2. **Backend**: Deploy to Node.js hosting (Heroku, Railway, Render, etc.)
3. **Database**: Use hosted MySQL (PlanetScale, Railway, etc.)
4. **Update .env** with production credentials

**No code changes needed!** Relative paths work everywhere.

---

## 📞 Quick Reference

| Component | Location |
|-----------|----------|
| **Frontend** | `file:///` or any web server |
| **Backend API** | `http://localhost:5000` |
| **Database
