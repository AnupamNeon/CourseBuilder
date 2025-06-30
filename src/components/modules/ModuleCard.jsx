import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ModuleItem from './ModuleItem';

const ModuleCard = ({
  module,
  index,
  items = [],
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  moveModule,
  moveResource,
  dropResourceToModule,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Module drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MODULE',
    item: { id: module.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Module drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MODULE',
    hover: (draggedItem) => {
      if (draggedItem.id !== module.id) {
        moveModule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Resource drop target
  const [{ isOverResource }, dropResource] = useDrop(() => ({
    accept: 'RESOURCE',
    drop: (item) => {
      if (item.moduleId !== module.id) {
        dropResourceToModule(item, module.id);
      }
    },
    hover: (draggedItem) => {
      if (draggedItem.id !== module.id) {
        // Handle resource reordering if needed
      }
    },
    collect: (monitor) => ({
      isOverResource: !!monitor.isOver(),
    }),
  }));

  const moduleItems = items.filter(item => item.moduleId === module.id);

  const toggleOptions = (e) => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = (e) => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = (type) => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  return (
    <div 
      ref={drop}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isOver ? '2px dashed #0caeba' : '1px solid #e1e1e1',
        backgroundColor: isOver ? '#f0f8ff' : 'white',
      }}
      className="module-card-container"
    >
      <div 
        ref={drag}
        className="module-card"
        onClick={toggleExpanded}
        style={{ cursor: 'move' }}
      >
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div 
          ref={dropResource}
          className="module-content-expanded"
          style={{
            backgroundColor: isOverResource ? '#f0f8ff' : '#f9f9f9',
            border: isOverResource ? '2px dashed #0caeba' : '1px solid #e1e1e1',
          }}
        >
          {moduleItems.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="module-items">
              <div className="module-items-list">
                {moduleItems.map((item, index) => (
                  <ModuleItem
                    key={item.id}
                    item={item}
                    index={index}
                    onDelete={onDeleteItem}
                    moveResource={moveResource}
                  />
                ))}
              </div>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;