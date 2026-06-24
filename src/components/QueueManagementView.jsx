import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, XCircle, Activity } from 'lucide-react';

export default function QueueManagementView({ showToast }) {
  const [pendingAppointments, setPendingAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = () => {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const pending = allAppointments.filter(app => app.status === 'Pending Approval');
      setPendingAppointments(pending);
    };
    fetchAppointments();
    // In a real app we might poll or listen to events, but we'll fetch on mount for now.
  }, []);

  const handleApprove = (appointment) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = allAppointments.findIndex(app => app.id === appointment.id);
    
    if (index !== -1) {
      // Generate Token, Room, Queue Position
      const token = `#${String(Math.floor(Math.random() * 900) + 100)}`; // E.g., #482
      const room = `Room ${Math.floor(Math.random() * 10) + 1}`; // E.g., Room 4
      
      // Calculate a mock queue position based on existing approved appointments for that doctor
      const doctorLoad = allAppointments.filter(a => a.doctorId === appointment.doctorId && a.status === 'APPROVED').length;
      const queuePosition = doctorLoad + 1;

      allAppointments[index] = {
        ...allAppointments[index],
        status: 'APPROVED',
        token,
        room,
        queuePosition
      };

      localStorage.setItem('appointments', JSON.stringify(allAppointments));
      
      // Update local state
      setPendingAppointments(prev => prev.filter(app => app.id !== appointment.id));
      if (showToast) showToast(`Appointment Approved. Assigned Token: ${token}`, 'success');
    }
  };

  const handleReject = (appointment) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = allAppointments.findIndex(app => app.id === appointment.id);
    
    if (index !== -1) {
      allAppointments[index].status = 'REJECTED';
      localStorage.setItem('appointments', JSON.stringify(allAppointments));
      
      setPendingAppointments(prev => prev.filter(app => app.id !== appointment.id));
      if (showToast) showToast(`Appointment Rejected.`, 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="max-w-[1440px] mx-auto space-y-6 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[16px] bg-[#F4F4FF] text-[#6C5CE7] flex items-center justify-center border border-[#6C5CE7]/10">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold text-slate-800">Queue Management</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Review and triage incoming patient appointment requests.</p>
          </div>
        </div>

        {pendingAppointments.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
            <Activity className="w-12 h-12 text-[#6C5CE7] mb-4 opacity-50" />
            <h3 className="text-[16px] font-bold text-slate-700">No Pending Requests</h3>
            <p className="text-[13px] font-medium text-slate-400 mt-1">The queue is currently clear.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF2FF] bg-[#FAFBFF] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="py-4 pl-6 rounded-tl-xl">Patient Name</th>
                  <th className="py-4">Doctor</th>
                  <th className="py-4">Department</th>
                  <th className="py-4">Date & Time</th>
                  <th className="py-4">Symptoms</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 rounded-tr-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-bold text-slate-700">
                {pendingAppointments.map((appt, i) => (
                  <motion.tr variants={itemVariants} key={appt.id} className="border-b border-[#EEF2FF] hover:bg-[#FAFBFF] transition-colors">
                    <td className="py-5 pl-6 font-extrabold text-slate-800">Patient #{appt.patientId}</td>
                    <td className="py-5">{appt.doctorName}</td>
                    <td className="py-5 text-slate-500">{appt.department}</td>
                    <td className="py-5">
                      <p className="text-slate-800">{appt.appointmentDate}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{appt.slotTime}</p>
                    </td>
                    <td className="py-5 text-slate-500 font-medium max-w-[150px] truncate" title={appt.symptoms}>
                      {appt.symptoms}
                    </td>
                    <td className="py-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 border border-orange-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(appt)}
                          className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center border border-emerald-100 hover:border-emerald-500"
                          title="Approve & Generate Token"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleReject(appt)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center border border-red-100 hover:border-red-500"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
