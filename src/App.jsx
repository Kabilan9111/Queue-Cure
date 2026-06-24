import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';

import ReceptionDashboard from './pages/ReceptionDashboard';

// Placeholders for other dashboards
const DoctorDashboard = () => <div className="p-10 text-2xl font-bold">Doctor Dashboard (Coming Soon)</div>;
const LabDashboard = () => <div className="p-10 text-2xl font-bold">Lab Dashboard (Coming Soon)</div>;
const PharmacyDashboard = () => <div className="p-10 text-2xl font-bold">Pharmacy Dashboard (Coming Soon)</div>;

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
