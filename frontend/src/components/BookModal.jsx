import React, { useState, useEffect } from 'react';
import { getStudents, assignBook } from '../api/api';

const API_URL = 'http://localhost:3000';

export default function BookModal({ book, onClose, role, onAssignmentAdded }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (role === 'teacher') {
      const fetchStudents = async () => {
        try {
          const response = await getStudents();
          // Adjust to response structure (data might be nested or direct)
          const data = response.data.data || response.data;
          setStudents(data);
        } catch (err) {
          console.error('Failed to fetch students:', err);
        }
      };
      fetchStudents();
    }
  }, [role]);

  const handleAssign = async () => {
    if (!selectedStudentId) return;
    
    try {
      setAssigning(true);
      setError(null);
      await assignBook(parseInt(selectedStudentId, 10), book.id);
      
      // Notify parent to refresh data
      if (onAssignmentAdded) {
        onAssignmentAdded();
      }
      setSelectedStudentId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign book');
    } finally {
      setAssigning(false);
    }
  };

  if (!book) return null;

  const imageUrl = book.coverImage ? `${API_URL}${book.coverImage}` : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="modal-layout">
          <div className="modal-image-wrapper">
            {imageUrl ? (
              <img
                className="modal-image"
                src={imageUrl}
                alt={book.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="modal-image-placeholder"
              style={{ display: imageUrl ? 'none' : 'flex' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
          </div>

          <div className="modal-details">
            <h2 className="modal-title">{book.title}</h2>
            
            <div className="modal-section">
              <h3 className="modal-section-title">Description</h3>
              <p className="modal-description">{book.description}</p>
            </div>

            <div className="modal-section">
              {role === 'teacher' ? (
                <>
                  <h3 className="modal-section-title">Assigned Student</h3>
                  {book.assignments && book.assignments.length > 0 ? (
                    <ul className="modal-assignment-list">
                      {book.assignments.map((assignment) => (
                        <li key={assignment.student.id} className="modal-assignment-item">
                          <span className="modal-user-icon">👤</span>
                          {assignment.student.username}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="modal-empty-text">No student assigned to this book yet.</p>
                  )}
                  
                  <div 
                    className="modal-assign-form" 
                    style={{ 
                      marginTop: '1.5rem', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '0.75rem',
                      background: 'var(--bg-glass)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {error && <div className="alert alert--error" style={{ fontSize: '0.875rem', padding: '0.5rem', marginBottom: 0 }}>{error}</div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <select 
                        value={selectedStudentId} 
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="form-group__select"
                        style={{ width: '100%', margin: 0 }}
                        disabled={assigning}
                      >
                        <option value="">Select Student...</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.username}
                          </option>
                        ))}
                      </select>
                      <button 
                        className="btn btn--primary" 
                        onClick={handleAssign}
                        disabled={!selectedStudentId || assigning}
                        style={{ width: '100%' }}
                      >
                        {assigning ? 'Assigning...' : 'Assign Book'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="modal-section-title">Assigned By</h3>
                  {book.teacher ? (
                    <div className="modal-assignment-item">
                      <span className="modal-user-icon">🎓</span>
                      {book.teacher.username}
                    </div>
                  ) : (
                    <p className="modal-empty-text">Teacher information unavailable.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
