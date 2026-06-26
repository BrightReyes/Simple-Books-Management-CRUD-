import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getStudents, getAllBooks, assignBook } from '../api/api';

export default function AssignBookPage() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, booksRes] = await Promise.all([
          getStudents(),
          getAllBooks(),
        ]);
        setStudents(studentsRes.data);
        setBooks(booksRes.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await assignBook(parseInt(selectedStudent), parseInt(selectedBook));
      setSuccess('Book assigned successfully!');
      setSelectedStudent('');
      setSelectedBook('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to assign book';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div className="spinner">
          <div className="spinner__circle"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Assign Book</h1>
          <p className="page__subtitle">
            Assign a book to a student
          </p>
        </div>

        <div className="form-card">
          <h2 className="form-card__title">Assignment Details</h2>

          {success && <div className="alert alert--success">{success}</div>}
          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-group__label" htmlFor="assign-student">
                Select Student
              </label>
              <select
                id="assign-student"
                className="form-group__select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">-- Choose a student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="assign-book">
                Select Book
              </label>
              <select
                id="assign-book"
                className="form-group__select"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                required
              >
                <option value="">-- Choose a book --</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-card__actions">
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                {isLoading ? 'Assigning...' : 'Assign Book'}
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--lg"
                onClick={() => navigate('/teacher')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
