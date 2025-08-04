import './App.css';
import PredictiveSearch from './PredictiveSearch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Predictive Search Demo</h1>
        <div className="search-container">
          <PredictiveSearch />
        </div>
      </header>
    </div>
  );
}

export default App;
