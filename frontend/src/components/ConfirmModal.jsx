export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-heading)', marginBottom: '1rem' }}>
          {title}
        </h2>
        
        <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn--secondary" 
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button 
            className="btn btn--primary" 
            onClick={onConfirm}
            style={{ flex: 1, backgroundColor: '#ef4444', borderColor: '#ef4444' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
