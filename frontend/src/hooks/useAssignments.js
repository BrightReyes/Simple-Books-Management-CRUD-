import { useState, useEffect, useCallback } from 'react';
import {
  getMyAssignedBooks,
  assignBook as assignBookApi,
  getAssignments as getAssignmentsApi,
} from '../api/api';

export function useAssignments() {
  const [assignedBooks, setAssignedBooks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignedBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyAssignedBooks();
      setAssignedBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assigned books');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAssignmentsApi();
      setAssignments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  const assignBook = async (studentId, bookId) => {
    const response = await assignBookApi(studentId, bookId);
    return response.data;
  };

  return {
    assignedBooks,
    assignments,
    loading,
    error,
    fetchAssignedBooks,
    fetchAssignments,
    assignBook,
  };
}
