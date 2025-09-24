import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesignEstimationForm from './form.jsx';
import DesignEstimationResults from './EstimationResults.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DesignEstimationForm />} />
        <Route path="/estimation" element={<DesignEstimationResults />} />
      </Routes>
    </Router>
  );
}

export default App;