import './App.css';
import CourseBuilder from './components/modules/CourseBuilder';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <CourseBuilder />
      </DndProvider>
    </div>
  );
}

export default App;
