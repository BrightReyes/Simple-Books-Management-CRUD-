import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { useBooks } from '../hooks/useBooks';

export default function TeacherDashboard() {
  const { books, loading, error, refetch: fetchBooks } = useBooks(true);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedBook, setSelectedBook] = useState(null);

  // Keep selectedBook synced with the latest data from 'books' array
  // so if an assignment is added, the modal updates automatically.
  useEffect(() => {
    if (selectedBook) {
      const updatedBook = books.find(b => b.id === selectedBook.id);
      if (updatedBook && updatedBook !== selectedBook) {
        setSelectedBook(updatedBook);
      }
    }
  }, [books, selectedBook]);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query)
      );
    }

    switch (sortOption) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }
    return result;
  }, [books, searchQuery, sortOption]);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Teacher Dashboard</h1>
          <p className="page__subtitle">
            Manage your books and assign them to students
          </p>
        </div>

        <div className="pill-container">
          <div className="action-bar">
            <span className="badge-highlight">
              {books.length} book{books.length !== 1 ? 's' : ''} created
            </span>
            <div className="action-bar__actions">
              <button
                className="btn btn--primary"
                onClick={() => navigate('/teacher/create-book')}
              >
                Create Book
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => navigate('/teacher/assign-book')}
              >
                Assign Book
              </button>
            </div>
          </div>

          <div className="filter-bar">
            <input
              type="text"
              className="form-group__input"
              placeholder="Search books by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <select
              className="form-group__input"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ width: 'auto', marginBottom: 0 }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          {loading ? (
            <div className="spinner">
              <div className="spinner__circle"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No books created yet</p>
              <p className="empty-state__sub">
                Click "Create Book" to add your first book
              </p>
            </div>
          ) : filteredAndSortedBooks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No matching books found</p>
              <p className="empty-state__sub">
                Try adjusting your search or sort filters
              </p>
            </div>
          ) : (
            <div className="books-grid">
              {filteredAndSortedBooks.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          role="teacher" 
          onClose={() => setSelectedBook(null)} 
          onAssignmentAdded={fetchBooks}
        />
      )}
    </>
  );
}
