import { useState, useEffect, useCallback } from 'react';
import { getBooks, getAllBooks, createBook as createBookApi } from '../api/api';

export function useBooks(teacherOnly = true) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = teacherOnly ? await getBooks() : await getAllBooks();
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [teacherOnly]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (formData) => {
    const response = await createBookApi(formData);
    setBooks((prev) => [response.data, ...prev]);
    return response.data;
  };

  return { books, loading, error, refetch: fetchBooks, addBook };
}
