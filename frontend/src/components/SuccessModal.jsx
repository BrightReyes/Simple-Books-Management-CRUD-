export default function SuccessModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '400px', padding: '2.5rem', textAlign: 'center' }}
      >
        <div style={{ marginBottom: '1.5rem', color: 'var(--accent-success)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-heading)', marginBottom: '1rem' }}>
          {title}
        </h2>
        
        <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <button 
          className="btn btn--primary" 
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Okay
        </button>
      </div>
    </div>
  );
}
