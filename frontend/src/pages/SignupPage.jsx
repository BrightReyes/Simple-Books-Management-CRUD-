import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await signup(username, password);
      setSuccess('Signup successful! You can now log in.');
      // Optionally redirect after a brief delay so they can read the success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to sign up. Username may be taken.'
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
            Student Registration
          </p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success" style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-group__input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={isLoading || !!success}
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
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || !!success}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={isLoading || !!success}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Already have an account?{' '}
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
              onClick={() => navigate('/')}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
