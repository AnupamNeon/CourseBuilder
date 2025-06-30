import { useDrag } from 'react-dnd';

const ModuleItem = ({ item, index, onDelete, onEdit, moveResource }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RESOURCE',
    item: { id: item.id, index, moduleId: item.moduleId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  if (item.type === 'link') {
    return (
      <div
        ref={drag}
        className="module-item link-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          backgroundColor: isDragging ? '#f0f8ff' : 'white',
        }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-link">🔗</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <a
              href={item.url}
              className="item-url"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {item.url}
            </a>
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit}>
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete}>
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  if (item.type === 'file') {
    return (
      <div
        ref={drag}
        className="module-item file-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          backgroundColor: isDragging ? '#f0f8ff' : 'white',
        }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-file">📄</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <p className="item-details">
              {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
            </p>
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit}>
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete}>
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ModuleItem;