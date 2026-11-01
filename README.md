# 🎓 VinnPro AI Education OS

> **A full-stack AI-powered Learning Management System** built with React, Flask & embedded JSON storage — no external database required!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-6366f1?style=for-the-badge&logo=render)](https://vinnpro-frontend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-tanish0050-181717?style=for-the-badge&logo=github)](https://github.com/tanish0050/vinnpro-lms)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth System** | Student & Admin roles, JWT tokens, public registration |
| 📚 **Course Catalog** | 9+ coding courses (Python, JS, Java, C++, SQL, Git, DSA...) |
| 📡 **Live Meetings** | Admin schedules meetings → Students see pulsing live banner |
| 🧠 **AI Tutor** | RAG-powered curriculum chatbot with source references |
| 🎯 **Quiz System** | 5 MCQs per subject (Python/JS/DSA) with instant feedback |
| 📊 **Live Analytics** | Real-time active user counter, study hours, per-course stats |
| 💬 **Discussions** | Community forum, posts & replies |
| 🏆 **Leaderboard** | XP-based student rankings |
| 📖 **E-Library** | Digital ebook library with categories |
| 🌙 **Dark/Light Theme** | Full theme switcher |

---

## 🛠️ Tech Stack

```
Frontend         Backend          Database         Deployment
────────         ───────          ────────         ──────────
React 18         Flask 3.1        JSON (embedded)  Render (free)
Vite + TS        Flask-JWT        No MongoDB!      GitHub Actions
Tailwind CSS     Flask-CORS       Self-contained   Static Site
Zustand          gunicorn
Lucide Icons     bcrypt
```

---

## 🚀 Quick Start (Local)

### 1. Clone the repo
```bash
git clone https://github.com/tanish0050/vinnpro-lms.git
cd vinnpro-lms
```

### 2. Run Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# ✅ Runs on http://localhost:5000
# ✅ Auto-seeds demo data (admin, student, 9 courses)
# ✅ No MongoDB or external DB needed!
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
# ✅ Runs on http://localhost:3000
```

### 4. Login with demo credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@vinnpro.com` | `Admin@123` |
| 🎓 Student | `student@vinnpro.com` | `Student@123` |

---

## 🌐 Deploy to Render (Free — No Database Needed!)

### Step 1: Fork / Clone to your GitHub

### Step 2: Create Render Account
Go to [render.com](https://render.com) → Sign up with GitHub (free)

### Step 3: Deploy via Blueprint
1. Click **New** → **Blueprint**
2. Connect your GitHub repo
3. `render.yaml` is auto-detected → **Apply**
4. Two services are created automatically:
   - `vinnpro-backend` (Flask API)
   - `vinnpro-frontend` (React static site)

### Step 4: Set Environment Variables

**In `vinnpro-backend` → Environment:**
| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | `https://vinnpro-frontend.onrender.com` |

**In `vinnpro-frontend` → Environment:**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://vinnpro-backend.onrender.com/api` |

### Step 5: Deploy! 🎉

> ⚠️ On Render free tier, the first request after 15min idle may take ~30 seconds (cold start). This is normal.

---

## 📁 Project Structure

```
vinnpro-lms/
├── backend/                    # Flask REST API
│   ├── app.py                  # Main entry point + CORS
│   ├── config.py               # Dev/Prod config
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── auth.py             # Login, register, JWT
│   │   ├── courses.py          # Course CRUD + enrollment
│   │   ├── admin.py            # Admin user management
│   │   ├── live_classes.py     # Meeting create/delete/status
│   │   ├── ai_tutor.py         # AI chat endpoint
│   │   ├── students.py         # Student dashboard data
│   │   ├── discussions.py      # Forum posts
│   │   ├── ebooks.py           # E-library
│   │   └── misc_routes.py      # Notifications, analytics, leaderboard
│   └── utils/
│       ├── db.py               # Pure JSON embedded database
│       ├── seed_data.py        # Auto-seeds demo data on startup
│       ├── auth_helper.py      # JWT decorators
│       └── helpers.py          # Serialization, responses
│
├── frontend/                   # React + Vite App
│   └── src/
│       ├── pages/
│       │   ├── admin/          # AdminDashboard, Courses, Meetings, Analytics
│       │   ├── student/        # Dashboard, Catalog, AITutor, Quiz, Progress
│       │   ├── auth/           # Login, Register
│       │   └── shared/         # Profile, EbookLibrary, NotFound
│       ├── components/
│       │   ├── layout/         # Sidebar, Topbar, NotificationPanel
│       │   ├── quiz/           # QuizModal (5-MCQ interactive)
│       │   └── ui/             # SharedUI (Card, Badge, Modal, StatCard)
│       ├── store/              # Zustand (auth, notifications)
│       ├── contexts/           # AuthContext, ThemeContext
│       └── api/                # Axios instance + interceptors
│
├── render.yaml                 # Render.com deployment config
└── README.md
```

---

## 🎯 Student Features

- ✅ Register new account (student only)
- ✅ Browse 9+ coding courses with search & filter
- ✅ Enroll in free/paid courses
- ✅ Take interactive quizzes with instant right/wrong feedback
- ✅ Chat with AI Curriculum Tutor
- ✅ View live meeting banner when admin goes live
- ✅ Track learning progress & XP
- ✅ Community discussions forum
- ✅ Digital E-Library access
- ✅ Leaderboard ranking

## 👑 Admin Features

- ✅ Dashboard with platform-wide stats
- ✅ User management (view/delete students)
- ✅ Course management (edit title, description, price, status)
- ✅ Live Meeting control (create, go live, end, delete)
- ✅ Real-time Analytics (live active users, study hours, per-course charts)

---

## 📝 License

MIT License — free to use, modify, and deploy.

---

<div align="center">
  Built with ❤️ by <strong>Tanish</strong>
</div>
