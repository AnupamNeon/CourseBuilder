import { useEffect, useState } from 'react';

const Outline = ({ modules, activeModuleId, onModuleClick }) => {
  return (
    <div className="course-outline">
      <h3 className="outline-title">Outline</h3>
      <ul className="outline-list">
        {modules.map(module => (
          <li 
            key={module.id}
            className={`outline-item ${activeModuleId === module.id ? 'active' : ''}`}
            onClick={() => onModuleClick(module.id)}
          >
            {module.name}
            {module.resources?.length > 0 && (
              <span className="item-count">
                {module.resources.length} item{module.resources.length !== 1 ? 's' : ''}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Outline;