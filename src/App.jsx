import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';

import ReceptionDashboard from './pages/ReceptionDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import LabDashboard from './pages/LabDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/reception" element={<ReceptionDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/lab" element={<LabDashboard />} />
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
