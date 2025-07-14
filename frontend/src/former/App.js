import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library2 from './pages/library2';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <h1>OContest Frontend</h1>
              <p>Development server is running</p>
            </header>
          </div>
        } />
        <Route path="/library" element={<Library2 />} />
      </Routes>
    </Router>
  );
}

export default App;
