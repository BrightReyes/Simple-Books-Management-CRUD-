import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useBooks } from '../hooks/useBooks';
import { updateBook, deleteAssignment, deleteBook } from '../api/api';
import ConfirmModal from '../components/ConfirmModal';

export default function ManageBooksPage() {
  const { books, loading, error, refetch: fetchBooks } = useBooks(true);
  const navigate = useNavigate();

  const [editingBookId, setEditingBookId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [bookToDelete, setBookToDelete] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setEditTitle(book.title);
    setEditDescription(book.description);
    setActionError('');
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditTitle('');
    setEditDescription('');
    setActionError('');
  };

  const handleSaveEdit = async (bookId) => {
    try {
      setUpdating(true);
      setActionError('');
      await updateBook(bookId, { title: editTitle, description: editDescription });
      await fetchBooks();
      setEditingBookId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to update book');
    } finally {
      setUpdating(false);
    }
  };

  const executeDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      setUpdating(true);
      setActionError('');
      await deleteBook(bookToDelete.id);
      await fetchBooks();
      setBookToDelete(null);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to delete book');
    } finally {
      setUpdating(false);
    }
  };

  const executeUnassign = async () => {
    if (!assignmentToDelete) return;
    try {
      setUpdating(true);
      setActionError('');
      await deleteAssignment(assignmentToDelete.studentId, assignmentToDelete.bookId);
      await fetchBooks();
      setAssignmentToDelete(null);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to remove assignment');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <div className="flex-row">
            <h1 className="page__title">Manage Books & Assignments</h1>
          </div>
          <p className="page__subtitle">
            Edit your books, delete books, and remove assignments if you misclicked.
          </p>
        </div>

        <div className="pill-container">
          {error && <div className="alert alert--error">{error}</div>}
          {actionError && <div className="alert alert--error">{actionError}</div>}

          {loading ? (
            <div className="spinner">
              <div className="spinner__circle"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No books found</p>
            </div>
          ) : (
            <div className="manage-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {books.map((book) => (
                <div key={book.id} className="manage-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>

                  {editingBookId === book.id ? (
                    <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <input
                        type="text"
                        className="form-group__input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Book Title"
                        disabled={updating}
                      />
                      <textarea
                        className="form-group__input"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Book Description"
                        rows="3"
                        disabled={updating}
                      />
                      <div className="action-bar__actions" style={{ marginTop: '0.5rem' }}>
                        <button className="btn btn--primary" onClick={() => handleSaveEdit(book.id)} disabled={updating}>
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn btn--secondary" onClick={handleCancelEdit} disabled={updating}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="book-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>{book.title}</h3>
                        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{book.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn--secondary" 
                          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Book"
                          onClick={() => handleEditClick(book)} 
                          disabled={updating}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn btn--secondary" 
                          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#ef4444', color: '#ef4444' }}
                          title="Delete Book"
                          onClick={() => setBookToDelete(book)} 
                          disabled={updating}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="assignments-section" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--bg-input)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                      Assigned Students
                    </h4>

                    {book.assignments && book.assignments.length > 0 ? (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {book.assignments.map((assignment) => (
                          <li key={assignment.student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                            <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              {assignment.student.username}
                            </span>
                            <button
                              className="btn btn--secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444' }}
                              onClick={() => setAssignmentToDelete({ 
                                studentId: assignment.student.id, 
                                bookId: book.id, 
                                studentName: assignment.student.username, 
                                bookTitle: book.title 
                              })}
                              disabled={updating}
                            >
                              Unassign
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic' }}>No student assigned to this book yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={!!bookToDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${bookToDelete?.title}"? This will permanently remove the book and all its assignments.`}
        onConfirm={executeDeleteBook}
        onCancel={() => setBookToDelete(null)}
      />

      <ConfirmModal 
        isOpen={!!assignmentToDelete}
        title="Remove Assignment"
        message={`Are you sure you want to unassign "${assignmentToDelete?.bookTitle}" from ${assignmentToDelete?.studentName}?`}
        onConfirm={executeUnassign}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </>
  );
}
