import './App.css';
import Maze from './Maze';
function App() {
  return (
    <div className="App">
      <Maze
        cellSize={7}
        backgroundColor="#1a1a1a"
        strokeColor="white"
        strokeWeight={1.2}
        speed={8}
      />
    </div>
  );
}

export default App;
