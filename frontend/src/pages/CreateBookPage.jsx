import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { createBook } from '../api/api';

export default function CreateBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      await createBook(formData);
      setSuccess('Book created successfully!');
      setTitle('');
      setDescription('');
      setCoverImage(null);
      setImagePreview(null);

      // Redirect after a short delay
      setTimeout(() => navigate('/teacher'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Create New Book</h1>
          <p className="page__subtitle">
            Add a new book to your collection
          </p>
        </div>

        <div className="form-card">
          <h2 className="form-card__title">Book Details</h2>

          {success && <div className="alert alert--success">{success}</div>}
          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-group__label" htmlFor="book-title">
                Title
              </label>
              <input
                id="book-title"
                type="text"
                className="form-group__input"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="book-description">
                Description
              </label>
              <textarea
                id="book-description"
                className="form-group__textarea"
                placeholder="Enter book description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="book-cover">
                Cover Image (optional)
              </label>
              <input
                id="book-cover"
                type="file"
                className="form-group__file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Cover preview" />
                </div>
              )}
            </div>

            <div className="form-card__actions">
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                {isLoading ? 'Creating...' : 'Create Book'}
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
