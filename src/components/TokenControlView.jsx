import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Play, SkipForward, ArrowUpCircle, ArrowDownCircle, CheckSquare, Activity } from 'lucide-react';

export default function TokenControlView({ showToast }) {
  const [approvedTokens, setApprovedTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = () => {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const approved = allAppointments
        .filter(app => app.status === 'APPROVED')
        .sort((a, b) => a.queuePosition - b.queuePosition);
      setApprovedTokens(approved);
    };
    fetchTokens();
  }, []);

  const updateAppointment = (appointmentId, updates, message) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = allAppointments.findIndex(app => app.id === appointmentId);
    if (index !== -1) {
      allAppointments[index] = { ...allAppointments[index], ...updates };
      localStorage.setItem('appointments', JSON.stringify(allAppointments));
      
      const approved = allAppointments
        .filter(app => app.status === 'APPROVED')
        .sort((a, b) => a.queuePosition - b.queuePosition);
      setApprovedTokens(approved);
      
      if (showToast) showToast(message, 'success');
    }
  };

  const handleCallNext = (appt) => {
    // In a real app, this might set a "Currently Serving" status or broadcast to a TV display
    showToast(`Calling Token ${appt.token}...`, 'success');
  };

  const handleSkip = (appt) => {
    updateAppointment(appt.id, { queuePosition: appt.queuePosition + 5 }, `Skipped Token ${appt.token}`);
  };

  const handleMoveUp = (appt) => {
    updateAppointment(appt.id, { queuePosition: Math.max(1, appt.queuePosition - 1) }, `Moved ${appt.token} up in queue`);
  };

  const handleMoveDown = (appt) => {
    updateAppointment(appt.id, { queuePosition: appt.queuePosition + 1 }, `Moved ${appt.token} down in queue`);
  };

  const handleComplete = (appt) => {
    updateAppointment(appt.id, { status: 'COMPLETED' }, `Marked Token ${appt.token} as Completed`);
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
          <div className="w-12 h-12 rounded-[16px] bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold text-slate-800">Token Control</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage live queue flow and active tokens.</p>
          </div>
        </div>

        {approvedTokens.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
            <Activity className="w-12 h-12 text-emerald-500 mb-4 opacity-50" />
            <h3 className="text-[16px] font-bold text-slate-700">No Active Tokens</h3>
            <p className="text-[13px] font-medium text-slate-400 mt-1">There are no approved appointments waiting in the queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF2FF] bg-[#FAFBFF] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="py-4 pl-6 rounded-tl-xl w-32">Token</th>
                  <th className="py-4">Patient</th>
                  <th className="py-4">Doctor</th>
                  <th className="py-4">Pos</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 rounded-tr-xl text-right">Queue Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-bold text-slate-700">
                {approvedTokens.map((appt) => (
                  <motion.tr variants={itemVariants} key={appt.id} className="border-b border-[#EEF2FF] hover:bg-[#FAFBFF] transition-colors">
                    <td className="py-5 pl-6">
                      <div className="inline-flex items-center justify-center bg-gradient-to-br from-[#6C5CE7] to-[#8B7CFF] text-white px-4 py-1.5 rounded-xl text-[16px] font-black shadow-[0_4px_10px_rgba(108,92,231,0.2)]">
                        {appt.token}
                      </div>
                    </td>
                    <td className="py-5 font-extrabold text-slate-800">Patient #{appt.patientId}</td>
                    <td className="py-5">
                      <p className="text-slate-800">{appt.doctorName}</p>
                      <p className="text-[11px] text-[#6C5CE7] mt-0.5">{appt.room}</p>
                    </td>
                    <td className="py-5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-black text-slate-600">
                        {appt.queuePosition}
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleCallNext(appt)}
                          className="px-3 py-1.5 rounded-lg bg-[#6C5CE7] text-white text-[11px] hover:bg-[#5a4cdb] transition-colors flex items-center gap-1.5"
                          title="Call on Display"
                        >
                          <Play className="w-3.5 h-3.5" /> Call
                        </button>
                        <button 
                          onClick={() => handleSkip(appt)}
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors border border-orange-100 hover:border-orange-500"
                          title="Skip Token"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMoveUp(appt)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors border border-blue-100 hover:border-blue-500"
                          title="Move Up"
                        >
                          <ArrowUpCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMoveDown(appt)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-500 hover:text-white transition-colors border border-slate-200 hover:border-slate-500"
                          title="Move Down"
                        >
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleComplete(appt)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-100 hover:border-emerald-500 ml-2"
                          title="Mark Completed"
                        >
                          <CheckSquare className="w-4 h-4" />
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
