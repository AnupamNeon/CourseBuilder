import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ModuleItem from './ModuleItem';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Handle adding different types of content
  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Modal handlers
  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  // Module CRUD operations
  const handleSaveModule = module => {
    if (currentModule) {
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      setModules([...modules, { ...module, id: Date.now().toString() }]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  // Resource operations
  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    setItems(prev => [...prev, {
      ...linkItem,
      id: Date.now().toString(),
      type: 'link',
      moduleId: currentModuleId || null
    }]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    setItems(prev => [...prev, {
      ...fileItem,
      id: Date.now().toString(),
      type: 'file',
      moduleId: currentModuleId || null
    }]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Search functionality
  const handleSearch = query => {
    setSearchQuery(query);
  };

  // Drag and Drop functionality
  const moveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex];
    const newModules = [...modules];
    newModules.splice(dragIndex, 1);
    newModules.splice(hoverIndex, 0, draggedModule);
    setModules(newModules);
  };

  const moveResource = (dragItem, hoverItem) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const dragIndex = newItems.findIndex(item => item.id === dragItem.id);
      const hoverIndex = newItems.findIndex(item => item.id === hoverItem.id);
      
      if (dragIndex === -1 || hoverIndex === -1) return prevItems;
      
      // If moving within same module or both are unassigned
      if (dragItem.moduleId === hoverItem.moduleId || 
          (!dragItem.moduleId && !hoverItem.moduleId)) {
        const [removed] = newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, removed);
        return newItems;
      }
      
      // If moving between modules
      return prevItems.map(item => 
        item.id === dragItem.id 
          ? { ...item, moduleId: hoverItem.moduleId } 
          : item
      );
    });
  };

  const dropResourceToModule = (item, moduleId) => {
    if (item.moduleId === moduleId) return; // No change if same module
    
    setItems(prevItems => 
      prevItems.map(resource => 
        resource.id === item.id 
          ? { ...resource, moduleId: moduleId } 
          : resource
      )
    );
  };

  // Filter modules and resources based on search
  const filteredModules = modules
    .map(module => {
      const matchedItems = items.filter(
        item =>
          item.moduleId === module.id &&
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const moduleMatches = module.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (moduleMatches) {
        return { ...module, resources: items.filter(item => item.moduleId === module.id) };
      } else if (matchedItems.length > 0) {
        return { ...module, resources: matchedItems };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  const filteredUnassignedItems = items.filter(
    item =>
      !item.moduleId &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="course-builder">
      <Header onAddClick={handleAddClick} onSearch={handleSearch} />

      <div className="builder-content">
        {modules.length === 0 && items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="module-list">
            {filteredUnassignedItems.length > 0 && (
              <div className="module-card-container unassigned-resources">
                <h3>Unassigned Resources</h3>
                <div className="module-items-list">
                  {filteredUnassignedItems.map(item => (
                  <ModuleItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteItem}
                    onEdit={(item) => {
                      if (item.type === 'link') {
                        setCurrentModuleId(item.moduleId);
                        setCurrentLinkItem(item); 
                        setIsLinkModalOpen(true);
                      } else if (item.type === 'file') {
                        setCurrentModuleId(item.moduleId);
                        setCurrentFileItem(item); 
                        setIsUploadModalOpen(true);
                      }
                    }}
                    moveResource={moveResource}
                  />
                  ))}
                </div>
              </div>
            )}
            {filteredModules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                items={module.resources}
                onEdit={handleEditModule}
                onDelete={handleDeleteModule}
                onAddItem={handleAddItem}
                onDeleteItem={handleDeleteItem}
                moveModule={moveModule}
                moveResource={moveResource}
                dropResourceToModule={dropResourceToModule}
              />
            ))}
          </div>
        )}
      </div>

      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;