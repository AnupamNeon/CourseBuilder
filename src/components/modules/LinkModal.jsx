import { useState, useEffect } from 'react';

const LinkModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  moduleId,
  linkItem = null  // Add this prop for editing
}) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or when linkItem changes
  useEffect(() => {
    if (isOpen) {
      setLinkTitle(linkItem?.title || '');
      setLinkUrl(linkItem?.url || '');
      setError('');
    }
  }, [isOpen, linkItem]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!linkTitle.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!validateUrl(linkUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: linkItem?.id || Date.now().toString(),
        moduleId: moduleId || null,
        type: 'link',
        title: linkTitle.trim(),
        url: linkUrl.trim(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{linkItem ? 'Edit Link' : 'Add a Link'}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Enter title"
                className="form-input"
                autoFocus
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!linkTitle.trim() || !linkUrl.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : linkItem ? 'Save Changes' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;