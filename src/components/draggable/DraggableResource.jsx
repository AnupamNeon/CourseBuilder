import { useDrag } from 'react-dnd';

const DraggableResource = ({ item, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'RESOURCE',
    item: { id: item.id, moduleId: item.moduleId },
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

export default DraggableResource;