# VinnPro AI Education OS

A full-stack AI-powered Learning Management System (LMS) built with **React + Flask + MongoDB**.

## 🚀 Features
- Student & Admin roles (register/login)
- Course Catalog with 9+ coding courses
- Live Meeting system (Admin schedules → Students see pulsing banner)
- Interactive Quiz system (5 MCQs per subject, instant feedback)
- AI Curriculum Tutor (RAG-powered chat)
- Discussion Forums, Leaderboard, E-Library
- Live Analytics dashboard
- Dark/Light theme support

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend**: Flask, MongoDB (PyMongo), JWT Auth
- **Deployment**: Render (Backend: Web Service, Frontend: Static Site)

## 📦 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vinnpro.com | Admin@123 |
| Student | student@vinnpro.com | Student@123 |

## 🌐 Deploy to Render

### Step 1: MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Create a database user with password
3. Whitelist IP: `0.0.0.0/0` (allow all)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/vinnpro`

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: VinnPro AI LMS"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml`
4. Set environment variables in Render Dashboard:

**Backend service** (`vinnpro-backend`):
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `FRONTEND_URL` | `https://vinnpro-frontend.onrender.com` |

**Frontend service** (`vinnpro-frontend`):
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://vinnpro-backend.onrender.com/api` |

5. Click **Apply** → Both services deploy automatically!

## 📁 Project Structure
```
hi/
├── backend/          # Flask API
│   ├── app.py        # Main entry point
│   ├── config.py     # Config (dev/prod)
│   ├── routes/       # API blueprints
│   ├── utils/        # DB, helpers, seed data
│   └── requirements.txt
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/    # Student, Admin pages
│   │   ├── components/
│   │   ├── store/    # Zustand state
│   │   └── api/      # Axios config
│   └── package.json
├── render.yaml       # Render deployment config
└── README.md
```
