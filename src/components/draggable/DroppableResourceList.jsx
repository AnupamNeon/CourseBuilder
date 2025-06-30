import { useDrop } from 'react-dnd';

const DroppableResourceList = ({ moduleId, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'RESOURCE',
    drop: (item) => onDrop(item, moduleId),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? '#f0f0f0' : 'transparent',
        minHeight: isOver ? '50px' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

export default DroppableResourceList;