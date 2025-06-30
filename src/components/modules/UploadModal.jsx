import { useState, useEffect } from 'react';

const UploadModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  moduleId,
  fileItem = null  // Add this prop for editing
}) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens or when fileItem changes
  useEffect(() => {
    if (isOpen) {
      setFileTitle(fileItem?.title || '');
      setSelectedFile(null); // Don't pre-select file for editing
      setError('');
    }
  }, [isOpen, fileItem]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fileTitle.trim()) {
      setError('Please enter a title');
      return;
    }

    // For new files, require a file selection
    if (!fileItem && !selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: fileItem?.id || Date.now().toString(),
        moduleId,
        type: 'file',
        title: fileTitle.trim(),
        fileName: selectedFile?.name || fileItem.fileName,
        fileSize: selectedFile?.size || fileItem.fileSize,
        fileType: selectedFile?.type || fileItem.fileType,
        // Include the original file data if not changed
        file: selectedFile || fileItem.file,
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
          <h2>{fileItem ? 'Edit File' : 'Upload File'}</h2>
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
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">
                {fileItem ? 'Replace file (optional)' : 'Select file (PDF, JPEG, PNG)'}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.jpg,.jpeg,.png"
                required={!fileItem} // Only required for new files
              />
              {selectedFile ? (
                <div className="selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              ) : fileItem ? (
                <div className="selected-file">
                  <span className="file-name">{fileItem.fileName}</span>
                  <span className="file-size">
                    ({Math.round(fileItem.fileSize / 1024)} KB)
                  </span>
                </div>
              ) : null}
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
              disabled={!fileTitle.trim() || isSubmitting || (!fileItem && !selectedFile)}
            >
              {isSubmitting ? 'Saving...' : fileItem ? 'Save Changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;