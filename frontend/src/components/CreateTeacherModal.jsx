import React, { useState, useEffect } from 'react';
import { createTeacher } from '../api/api';

export default function CreateTeacherModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await createTeacher(username, password);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create teacher account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2.5rem' }}>
        <div className="modal-header" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="modal-title" style={{ margin: 0, fontSize: '1.75rem' }}>Invite New Teacher</h2>
          <button className="modal-close" style={{ position: 'static' }} onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div className="alert alert--error" style={{ marginBottom: 0 }}>{error}</div>}
          
          <div>
            <label className="form-group__label">Username</label>
            <input 
              type="text" 
              className="form-group__input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              disabled={loading}
              placeholder="e.g. teacher2"
            />
          </div>
          
          <div>
            <label className="form-group__label">Password</label>
            <input 
              type="password" 
              className="form-group__input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Enter a secure password"
            />
          </div>

          <div>
            <label className="form-group__label">Confirm Password</label>
            <input 
              type="password" 
              className="form-group__input" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Confirm password"
            />
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading || !username || !password}>
              {loading ? 'Creating...' : 'Create Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
