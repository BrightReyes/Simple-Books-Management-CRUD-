import React, { useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export default function BookModal({ book, onClose, role }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
