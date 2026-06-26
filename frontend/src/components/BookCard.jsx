const API_URL = 'http://localhost:3000';

export default function BookCard({ book, showTeacher = false, onClick }) {
  const imageUrl = book.coverImage
    ? `${API_URL}${book.coverImage}`
    : null;

  return (
    <div className="book-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="book-card__image-wrapper">
        {imageUrl ? (
          <img
            className="book-card__image"
            src={imageUrl}
            alt={book.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="book-card__image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__desc">{book.description}</p>
      </div>

      {showTeacher && book.teacher && (
        <div className="book-card__footer">
          <span className="book-card__teacher">
            By: {book.teacher.username}
          </span>
        </div>
      )}
    </div>
  );
}
