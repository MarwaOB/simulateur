/*import React, { useState } from 'react';
import { PetriNet } from './modules/Petri_Net.js';
import { transformPetriNetToElements } from './Utils.js';
import './Styles.css';


import ReactFlow from 'react-flow-renderer';


const App = () => {
  const [elements, setElements] = useState(transformPetriNetToElements(PetriNet)); // Initialize elements state

  const onNodeDragStop = (event, node) => {
    const updatedElements = elements.map((el) => {
      if (el.id === node.id) {
        return {
          ...el,
          position: { x: node.position.x, y: node.position.y },
        };
      }
      return el;
    });

    setElements(updatedElements); // Update the elements state
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={elements}
        onNodeDragStop={onNodeDragStop}
        snapToGrid={true} // Optional: Snap nodes to grid while dragging
      />
    </div>
  );
};

export default App;*/


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header.js';
import Navbar from './components/Navbar.jsx';
import Canvas from './components/Canvas.jsx';
import Home from './components/Home.js'; // Add this import statement


function App() {
  return (
    <div>
      <Router>
        <Header />
        <Navbar />
        <Canvas />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;