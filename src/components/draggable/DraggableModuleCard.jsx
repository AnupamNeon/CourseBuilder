import { useDrag } from 'react-dnd';

const DraggableModuleCard = ({ module, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MODULE',
    item: { id: module.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableModuleCard;