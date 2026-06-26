import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isTeacher, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span>AklatAssign</span>
      </div>

      <div className="navbar__links">
        {isTeacher && (
          <>
            <button
              className={`navbar__link ${isActive('/teacher') ? 'active' : ''}`}
              onClick={() => navigate('/teacher')}
            >
              Dashboard
            </button>
            <button
              className={`navbar__link ${isActive('/teacher/create-book') ? 'active' : ''}`}
              onClick={() => navigate('/teacher/create-book')}
            >
              Create Book
            </button>
            <button
              className={`navbar__link ${isActive('/teacher/assign-book') ? 'active' : ''}`}
              onClick={() => navigate('/teacher/assign-book')}
            >
              Assign Book
            </button>
            <button
              className={`navbar__link ${isActive('/teacher/manage-books') ? 'active' : ''}`}
              onClick={() => navigate('/teacher/manage-books')}
            >
              Manage Books
            </button>
          </>
        )}
      </div>

      <div className="navbar__user">
        <span className="navbar__role-badge">{user?.role}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {user?.username}
        </span>
        <button className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
