import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { useAuthStore } from './store/useAuthStore'

// Layout
import MainLayout from './components/layout/MainLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCourses from './pages/admin/AdminCourses'
import AdminSettings from './pages/admin/AdminSettings'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminMeetings from './pages/admin/AdminMeetings'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import CreateCourse from './pages/teacher/CreateCourse'
import ManageCourse from './pages/teacher/ManageCourse'
import GradeSubmissions from './pages/teacher/GradeSubmissions'
import TeacherAnalytics from './pages/teacher/TeacherAnalytics'
import ScheduleLiveClass from './pages/teacher/ScheduleLiveClass'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import CourseCatalog from './pages/student/CourseCatalog'
import CourseDetail from './pages/student/CourseDetail'
import LessonPlayer from './pages/student/LessonPlayer'
import QuizPage from './pages/student/QuizPage'
import AssignmentPage from './pages/student/AssignmentPage'
import DiscussionForum from './pages/student/DiscussionForum'
import AITutor from './pages/student/AITutor'
import MyProgress from './pages/student/MyProgress'
import Leaderboard from './pages/student/Leaderboard'
import LiveClasses from './pages/student/LiveClasses'
import MyCertificates from './pages/student/MyCertificates'

// Shared Pages
import ProfilePage from './pages/shared/ProfilePage'
import EbookLibrary from './pages/shared/EbookLibrary'
import NotFoundPage from './pages/shared/NotFoundPage'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />
    return <Navigate to="/student" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="meetings" element={<AdminMeetings />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="ebooks" element={<EbookLibrary />} />
            </Route>

            {/* Teacher Routes */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<TeacherDashboard />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="manage-course/:courseId" element={<ManageCourse />} />
              <Route path="grade-submissions" element={<GradeSubmissions />} />
              <Route path="analytics" element={<TeacherAnalytics />} />
              <Route path="schedule-class" element={<ScheduleLiveClass />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="ebooks" element={<EbookLibrary />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="catalog" element={<CourseCatalog />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />
              <Route path="course/:courseId" element={<CourseDetail />} />
              <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPlayer />} />
              <Route path="lesson/:lessonId" element={<LessonPlayer />} />
              <Route path="quiz/:quizId" element={<QuizPage />} />
              <Route path="assignments/:assignmentId" element={<AssignmentPage />} />
              <Route path="discussions" element={<DiscussionForum />} />
              <Route path="ai-tutor" element={<AITutor />} />
              <Route path="progress" element={<MyProgress />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="ebooks" element={<EbookLibrary />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

function RootRedirect() {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />
  return <Navigate to="/student" replace />
}

export default App
