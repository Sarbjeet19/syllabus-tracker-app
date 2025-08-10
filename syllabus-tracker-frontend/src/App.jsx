import { Outlet } from 'react-router-dom';

function App() {
  // This component just provides a layout for the router to render pages into.
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
