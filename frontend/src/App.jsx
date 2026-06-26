import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateBookPage from './pages/CreateBookPage';
import AssignBookPage from './pages/AssignBookPage';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageUsersPage from './pages/ManageUsersPage';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/create-book"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <CreateBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assign-book"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <AssignBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/manage-books"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <ManageBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/manage-users"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <ManageUsersPage />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
