import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log(`[LoginPage] Form submitted with username: ${username}`);

    try {
      const user = await login(username, password);
      console.log(`[LoginPage] Received user from context:`, user);

      // Redirect based on role
      if (user.role === 'TEACHER') {
        console.log(`[LoginPage] Redirecting to /teacher`);
        navigate('/teacher');
      } else {
        console.log(`[LoginPage] Redirecting to /student`);
        navigate('/student');
      }
    } catch (err) {
      console.error(`[LoginPage] Login error caught:`, err);
      setError(
        err.response?.data?.message || 'Invalid username or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__header">

          <h1 className="login-card__title">AklatAssign</h1>
          <p className="login-card__desc">
            Simple Books Management System
          </p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-group__input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-group__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <span 
              style={{ 
                color: 'var(--primary-color)', 
                cursor: 'pointer', 
                fontWeight: '600',
                transition: 'color 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
