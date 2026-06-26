import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { useAssignments } from '../hooks/useAssignments';

export default function StudentDashboard() {
  const { assignedBooks, loading, error, fetchAssignedBooks } = useAssignments();
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchAssignedBooks();
  }, [fetchAssignedBooks]);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">My Books</h1>
          <p className="page__subtitle">
            Books assigned to you by your teachers
          </p>
        </div>

        <div className="pill-container">
          <div className="action-bar">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {assignedBooks.length} book{assignedBooks.length !== 1 ? 's' : ''} assigned
            </span>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          {loading ? (
            <div className="spinner">
              <div className="spinner__circle"></div>
            </div>
          ) : assignedBooks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No books assigned yet</p>
              <p className="empty-state__sub">
                Your teacher will assign books to you soon
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {assignedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  showTeacher={true} 
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          role="student" 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </>
  );
}
