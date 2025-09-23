import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesignEstimationForm from './form.jsx';
import EstimationResults from './EstimationResults.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DesignEstimationForm />} />
        <Route path="/estimations" element={<DesignEstimationResults />} />
        <Route path="*" element={<DesignEstimationForm />} />
      </Routes>
    </Router>
  );
}

export default App;