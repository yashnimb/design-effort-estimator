import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesignEstimationForm from './form.jsx';
import EstimationResults from './EstimationResults.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DesignEstimationForm />} />
        <Route path="/estimation" element={<EstimationResults />} />
        {/* Catch-all route to handle direct URL access */}
        <Route path="*" element={<DesignEstimationForm />} />
      </Routes>
    </Router>
  );
}

export default App;