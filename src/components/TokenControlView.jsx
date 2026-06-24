import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Play, SkipForward, ArrowUpCircle, ArrowDownCircle, CheckSquare, Activity, ChevronLeft, Stethoscope, Users, Clock, Send } from 'lucide-react';

const doctorsList = [
  { id: 1, name: 'Dr. Priya Sharma', specialization: 'Dermatology', room: 'Room 1' },
  { id: 2, name: 'Dr. Arjun Kumar', specialization: 'Cardiology', room: 'Room 2' },
  { id: 3, name: 'Dr. Meera Nair', specialization: 'Gynecology', room: 'Room 3' },
  { id: 4, name: 'Dr. Raj Patel', specialization: 'Orthopedics', room: 'Room 4' },
  { id: 5, name: 'Dr. Amit Verma', specialization: 'General Medicine', room: 'Room 5' },
  { id: 6, name: 'Dr. Neha Gupta', specialization: 'Neurology', room: 'Room 6' },
  { id: 7, name: 'Dr. Karthik Rao', specialization: 'ENT', room: 'Room 7' },
  { id: 8, name: 'Dr. Sarah Joseph', specialization: 'Pediatrics', room: 'Room 8' },
];

export default function TokenControlView({ showToast }) {
  const [allTokens, setAllTokens] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchTokens = () => {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const approved = allAppointments.filter(app => app.status === 'APPROVED');
      setAllTokens(approved);
    };
    fetchTokens();
  }, []);

  const updateAppointment = (appointmentId, updates, message) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const index = allAppointments.findIndex(app => app.id === appointmentId);
    if (index !== -1) {
      allAppointments[index] = { ...allAppointments[index], ...updates };
      localStorage.setItem('appointments', JSON.stringify(allAppointments));
      
      const approved = allAppointments.filter(app => app.status === 'APPROVED');
      setAllTokens(approved);
      
      if (showToast) showToast(message, 'success');
    }
  };

  const handleCallNext = (appt) => {
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

  const handleAssignQueue = () => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const doctorQueues = JSON.parse(localStorage.getItem('doctorQueues') || '{}');
    const docName = selectedDoctor.name;
    
    if (!doctorQueues[docName]) {
      doctorQueues[docName] = [];
    }

    // Find all approved appointments for this doctor
    const toAssign = allAppointments.filter(app => app.status === 'APPROVED' && app.doctorName === docName);
    
    if (toAssign.length === 0) {
      if (showToast) showToast('No approved patients to assign in this queue', 'error');
      return;
    }

    toAssign.forEach(appt => {
      // 1. Update global appointment status
      const index = allAppointments.findIndex(app => app.id === appt.id);
      if (index !== -1) {
        allAppointments[index] = { 
          ...allAppointments[index], 
          status: 'ASSIGNED_TO_DOCTOR',
          assignedAt: new Date().toISOString()
        };
      }
      
      // 2. Add to doctor queue if not already there
      const alreadyAssigned = doctorQueues[docName].some(a => a.id === appt.id);
      if (!alreadyAssigned) {
        doctorQueues[docName].push({ ...appt, status: 'ASSIGNED_TO_DOCTOR', assignedAt: new Date().toISOString() });
      }
    });

    localStorage.setItem('appointments', JSON.stringify(allAppointments));
    localStorage.setItem('doctorQueues', JSON.stringify(doctorQueues));

    // 3. Update local state
    const approved = allAppointments.filter(app => app.status === 'APPROVED');
    setAllTokens(approved);

    if (showToast) showToast(`Assigned ${toAssign.length} patients to ${docName}'s Dashboard`, 'success');
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', bar: 'bg-red-500' };
      case 'High': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', bar: 'bg-orange-500' };
      case 'Medium': return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', bar: 'bg-blue-500' };
      case 'Low': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', bar: 'bg-emerald-500' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', bar: 'bg-slate-500' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // View 1: Doctor Dashboard
  if (!selectedDoctor) {
    return (
      <motion.div 
        className="max-w-[1440px] mx-auto space-y-6 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[16px] bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold text-slate-800">Doctor Queues</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Manage live token flow for individual specialists.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctorsList.map((doc) => {
            const docTokens = allTokens
              .filter(app => app.doctorName === doc.name)
              .sort((a, b) => a.queuePosition - b.queuePosition);
            
            const currentToken = docTokens.length > 0 ? docTokens[0].token : 'None';
            const avgWaitTime = docTokens.length > 0 ? `${docTokens.length * 15} mins` : '0 mins';

            return (
              <motion.div 
                key={doc.id} 
                variants={itemVariants} 
                className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(108,92,231,0.08)] transition-all flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8B7CFF] text-white flex items-center justify-center shadow-md">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${docTokens.length > 5 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {docTokens.length > 5 ? 'Busy' : 'Available'}
                  </span>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-[16px] font-black text-slate-800 leading-tight mb-1">{doc.name}</h3>
                  <p className="text-[12px] font-bold text-[#6C5CE7]">{doc.specialization} • {doc.room}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 bg-[#FAFBFF] p-3 rounded-xl border border-[#EEF2FF]">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Queue</p>
                    <p className="text-[16px] font-black text-slate-800">{docTokens.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Active</p>
                    <p className="text-[14px] font-black text-[#6C5CE7] bg-[#6C5CE7]/10 inline-block px-2 py-0.5 rounded-lg">{currentToken}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedDoctor(doc)}
                  className="w-full py-3 rounded-xl bg-slate-50 text-[#6C5CE7] font-bold text-[13px] border border-slate-200 group-hover:bg-[#6C5CE7] group-hover:text-white group-hover:border-[#6C5CE7] transition-colors"
                >
                  View Queue
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // View 2: Individual Doctor Queue
  const docTokens = allTokens
    .filter(app => app.doctorName === selectedDoctor.name)
    .sort((a, b) => a.queuePosition - b.queuePosition);

  return (
    <motion.div 
      className="max-w-[1440px] mx-auto space-y-6 pb-20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button 
        onClick={() => setSelectedDoctor(null)}
        className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#6C5CE7] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8B7CFF] text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-[24px] font-extrabold text-slate-800">{selectedDoctor.name}</h2>
              <p className="text-[14px] text-[#6C5CE7] font-bold">{selectedDoctor.specialization} • {selectedDoctor.room}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAssignQueue}
              className="bg-[#6C5CE7] hover:bg-[#5a4cdb] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_4px_15px_rgba(108,92,231,0.25)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.3)] transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Assign Queue To Doctor
            </button>
            <div className="bg-[#FAFBFF] border border-[#EEF2FF] px-4 py-2.5 rounded-xl flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Waiting</p>
                <p className="text-[15px] font-black text-slate-800 leading-tight">{docTokens.length}</p>
              </div>
            </div>
            <div className="bg-[#FAFBFF] border border-[#EEF2FF] px-4 py-2.5 rounded-xl flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Wait</p>
                <p className="text-[15px] font-black text-slate-800 leading-tight">{docTokens.length * 15}m</p>
              </div>
            </div>
          </div>
        </div>

        {docTokens.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
            <Activity className="w-12 h-12 text-[#6C5CE7] mb-4 opacity-50" />
            <h3 className="text-[16px] font-bold text-slate-700">Queue is Empty</h3>
            <p className="text-[13px] font-medium text-slate-400 mt-1">There are no waiting patients for {selectedDoctor.name}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEF2FF] bg-[#FAFBFF] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="py-4 pl-6 rounded-tl-xl w-32">Token</th>
                  <th className="py-4">Patient</th>
                  <th className="py-4">Symptoms</th>
                  <th className="py-4">AI Score</th>
                  <th className="py-4">Severity</th>
                  <th className="py-4">Pos</th>
                  <th className="py-4 pr-6 rounded-tr-xl text-right">Queue Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-bold text-slate-700">
                {docTokens.map((appt) => {
                  const style = getSeverityStyle(appt.severity || 'Low');
                  const score = appt.priorityScore || 3.5;
                  
                  return (
                    <motion.tr variants={itemVariants} initial="hidden" animate="visible" key={appt.id} className="border-b border-[#EEF2FF] hover:bg-[#FAFBFF] transition-colors">
                      <td className="py-5 pl-6">
                        <div className="inline-flex items-center justify-center bg-gradient-to-br from-[#6C5CE7] to-[#8B7CFF] text-white px-4 py-1.5 rounded-xl text-[16px] font-black shadow-[0_4px_10px_rgba(108,92,231,0.2)]">
                          {appt.token}
                        </div>
                      </td>
                      <td className="py-5 font-extrabold text-slate-800">{appt.patientName || 'Unknown Patient'}</td>
                      <td className="py-5 text-slate-500 font-medium max-w-[200px] truncate" title={appt.symptoms}>
                        {appt.symptoms}
                      </td>
                      <td className="py-5">
                        <span className={`text-[13px] font-black ${style.text}`}>{score.toFixed(1)}</span>
                      </td>
                      <td className="py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-bold border ${style.text} ${style.bg} ${style.border}`}>
                          {appt.severity || 'Low'}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-black text-slate-600">
                          {appt.queuePosition}
                        </div>
                      </td>
                      <td className="py-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleCallNext(appt)}
                            className="px-3 py-1.5 rounded-lg bg-[#6C5CE7] text-white text-[11px] hover:bg-[#5a4cdb] transition-colors flex items-center gap-1.5 shadow-sm"
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
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-100 hover:border-emerald-500 ml-1"
                            title="Mark Completed"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
