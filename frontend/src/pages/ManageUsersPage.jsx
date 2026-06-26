import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreateTeacherModal from '../components/CreateTeacherModal';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { getStudents, deleteUser } from '../api/api';

export default function ManageUsersPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      await deleteUser(studentToDelete.id);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student. ' + (err.response?.data?.message || ''));
      setStudentToDelete(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page__header">
          <h1 className="page__title">Manage Users</h1>
          <p className="page__subtitle">
            View student accounts, manage access, and invite new teachers
          </p>
        </div>

        <div className="pill-container">
          <div className="action-bar">
            <span className="badge-highlight">
              {students.length} student{students.length !== 1 ? 's' : ''} registered
            </span>
            <div className="action-bar__actions">
              <button
                className="btn btn--primary"
                onClick={() => setShowTeacherModal(true)}
              >
                Invite New Teacher
              </button>
            </div>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          {loading ? (
            <div className="spinner">
              <div className="spinner__circle"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No students found</p>
              <p className="empty-state__sub">
                Students must register an account first.
              </p>
            </div>
          ) : (
            <div className="users-grid">
              {students.map((student) => (
                <div key={student.id} className="user-card">
                  <div className="user-card__header">
                    <div className="user-card__avatar">
                      {student.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-card__info">
                      <h3 className="user-card__username">{student.username}</h3>
                      <p className="user-card__role">{student.role}</p>
                    </div>
                  </div>
                  <div className="user-card__footer">
                    <button 
                      className="btn btn--secondary" 
                      style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                      onClick={() => setStudentToDelete(student)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTeacherModal && (
        <CreateTeacherModal 
          onClose={() => setShowTeacherModal(false)}
          onSuccess={() => {
            setShowTeacherModal(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        title="Teacher Invited"
        message="The new teacher account has been successfully created. They can now log in using their credentials."
        onClose={() => setShowSuccessModal(false)}
      />

      <ConfirmModal
        isOpen={!!studentToDelete}
        title="Remove Student?"
        message={`Are you sure you want to delete ${studentToDelete?.username}? All of their book assignments will also be permanently deleted. This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />
    </>
  );
}
