import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, LayoutDashboard, Users, UserCheck, Stethoscope, FileText, HelpCircle,
  Activity, ArrowRight, Clock, Star, Calendar, UserPlus, Sparkles, CheckCircle2,
  SkipForward, Play, ChevronRight, Eye, MoreHorizontal, AlertCircle
} from 'lucide-react';
import aiRobot from '../assets/ai-robot.png';
import userAvatar from '../assets/user_avatar.png';
import robotHead from '../assets/robot_head.png';

// New Views
import QueueManagementView from '../components/QueueManagementView';
import TokenControlView from '../components/TokenControlView';
import DoctorsView from '../components/DoctorsView';

const initialPatients = [
  { id: 1, token: 'P-03', name: 'Ramesh Kumar', symptoms: 'Chest pain, breathlessness since 2hrs', doctor: 'Dr. Arjun', time: '9:00 AM', score: 9.2, status: 'In Progress' },
  { id: 2, token: 'P-07', name: 'Lakshmi Nair', symptoms: 'High fever 103°F, vomiting', doctor: 'Dr. Meera', time: '9:30 AM', score: 7.8, status: 'Waiting' },
  { id: 3, token: 'P-11', name: 'Suresh Pillai', symptoms: 'BP checkup, monthly follow-up', doctor: 'Dr. Rajan', time: '10:00 AM', score: 3.5, status: 'Waiting' },
  { id: 4, token: 'P-14', name: 'Anitha Selvam', symptoms: 'Severe migraine, light sensitivity', doctor: 'Dr. Priya', time: '10:00 AM', score: 7.1, status: 'Pending' },
  { id: 5, token: 'P-19', name: 'Vijay Mohan', symptoms: 'General checkup, no complaint', doctor: 'Dr. Arjun', time: '10:30 AM', score: 2.2, status: 'Pending' },
];

const initialNotifications = [
  { id: 1, type: 'red', text: 'New booking: Ramesh Kumar — chest pain, Dr. Arjun 9AM. AI score 9.2 — urgent.', time: '2 mins ago' },
  { id: 2, type: 'amber', text: 'Deepa Krishnan (P-23) marked no-show. 11AM slot with Dr. Meera is now free.', time: '11 mins ago' },
];

const doctorsList = [
  { name: 'Dr. Arjun', color: { dot: 'bg-purple-500', avatarBg: 'bg-purple-100', avatarText: 'text-purple-600' } },
  { name: 'Dr. Meera', color: { dot: 'bg-green-500', avatarBg: 'bg-green-100', avatarText: 'text-green-600' } },
  { name: 'Dr. Rajan', color: { dot: 'bg-amber-500', avatarBg: 'bg-amber-100', avatarText: 'text-amber-600' } },
  { name: 'Dr. Priya', color: { dot: 'bg-pink-500', avatarBg: 'bg-pink-100', avatarText: 'text-pink-600' } }
];

export default function ReceptionDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [patients, setPatients] = useState(initialPatients);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const [bookingForm, setBookingForm] = useState({ name: '', doctor: 'Dr. Arjun', time: '11:00 AM', symptoms: '' });
  const [simulatedScore, setSimulatedScore] = useState(null);
  const [isSimulatingScore, setIsSimulatingScore] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Nav Links
  const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Queue Management', icon: Users },
    { name: 'Token Control', icon: UserCheck },
    { name: 'Doctors', icon: Stethoscope },
  ];

  // Debounce AI Score
  useEffect(() => {
    if (bookingForm.symptoms.trim() === '') {
      setSimulatedScore(null);
      setIsSimulatingScore(false);
      return;
    }
    setIsSimulatingScore(true);
    const handler = setTimeout(() => {
      const lowerSymptoms = bookingForm.symptoms.toLowerCase();
      let score = 3.5;
      if (lowerSymptoms.includes('pain') || lowerSymptoms.includes('severe')) score += 3.5;
      if (lowerSymptoms.includes('chest') || lowerSymptoms.includes('breath')) score += 2.5;
      if (score > 9.9) score = 9.9;
      setSimulatedScore(score.toFixed(1));
      setIsSimulatingScore(false);
    }, 600);
    return () => clearTimeout(handler);
  }, [bookingForm.symptoms]);

  const submitNewBooking = () => {
    if (!bookingForm.name || !bookingForm.symptoms) return;
    const newScore = parseFloat(simulatedScore || 4.5);
    const newToken = `P-${patients.length + 20}`;
    const newPatient = {
      id: Date.now(),
      token: newToken,
      name: bookingForm.name,
      symptoms: bookingForm.symptoms,
      doctor: bookingForm.doctor,
      time: bookingForm.time,
      score: newScore,
      status: 'Pending'
    };
    setPatients([newPatient, ...patients]);
    
    const notifType = newScore >= 8 ? 'red' : (newScore >= 5 ? 'amber' : 'green');
    setNotifications([
      { id: Date.now() + 1, type: notifType, text: `New booking: ${newPatient.name} — ${newPatient.doctor}. AI score ${newScore}.`, time: 'Just now' },
      ...notifications
    ]);
    setBookingForm({ name: '', doctor: 'Dr. Arjun', time: '11:00 AM', symptoms: '' });
    setSimulatedScore(null);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100', badge: 'bg-red-500' };
    if (score >= 5) return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-100', badge: 'bg-amber-500' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-100', badge: 'bg-emerald-500' };
  };

  const getNotifStyle = (type) => {
    switch (type) {
      case 'red': return 'bg-red-500 shadow-red-500/40';
      case 'amber': return 'bg-amber-500 shadow-amber-500/40';
      case 'green': return 'bg-emerald-500 shadow-emerald-500/40';
      default: return 'bg-slate-500 shadow-slate-500/40';
    }
  };

  // KPI calculations
  const totalPatients = 47 + patients.length;
  const activeQueue = patients.filter(p => p.status === 'Waiting' || p.status === 'Pending').length + 15;
  const chairOccupancy = patients.filter(p => p.status === 'Waiting').length + 35;
  const nowServing = patients.find(p => p.status === 'In Progress') || patients[0];

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex font-sans text-slate-800 selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7]">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-white border shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl px-6 py-4 flex items-center gap-3 ${toastMessage.type === 'error' ? 'border-red-100' : 'border-[#6C5CE7]/20'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toastMessage.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-[#6C5CE7]/10 text-[#6C5CE7]'}`}>
              {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="text-sm font-bold text-slate-800">{toastMessage.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-[#EEF2FF] fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="p-7 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shadow-[0_4px_16px_rgba(108,92,231,0.3)]">
            <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-[16px] leading-tight text-slate-800 tracking-tight">SmartClinic AI</h1>
            <p className="text-[9px] text-[#6C5CE7] font-bold uppercase tracking-widest mt-0.5">Command Center</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.name;
            return (
              <button 
                key={link.name}
                onClick={() => setActiveTab(link.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#8079FF] text-white shadow-[0_4px_20px_rgba(108,92,231,0.25)]' 
                    : 'text-slate-500 hover:bg-[#FAFBFF] hover:text-slate-800'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.name}
              </button>
            )
          })}
        </div>

        {/* AI Promo Card */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-[#F4F4FF] to-[#FAFBFF] rounded-[24px] p-6 text-center border border-[#EEF2FF] relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-center gap-1.5 text-[#6C5CE7] mb-2 font-bold text-[13px] relative z-10">
              <Sparkles className="w-4 h-4" />
              <h3>AI-Powered Care</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed font-medium relative z-10">Smart triage, live tracking and faster healthcare for you.</p>
            <button className="text-[11px] font-bold text-[#6C5CE7] bg-white px-5 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#EEF2FF] hover:shadow-md transition-all flex items-center gap-1.5 mx-auto relative z-10">
              Learn More <ArrowRight className="w-3 h-3" />
            </button>
            <div className="mt-5 flex justify-center relative z-10 -mb-2">
              <img src={aiRobot} alt="AI Robot" className="w-24 h-24 object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:ml-[260px] flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-[80px] shrink-0 bg-[#FAFBFF] flex items-center justify-between px-8 lg:px-10 z-10">
          <div className="relative w-full max-w-[480px]">
            <Search className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for doctors, tokens, patients..." 
              className="w-full pl-11 pr-16 py-3.5 bg-white border border-[#EEF2FF] rounded-[20px] text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#6C5CE7]/50 focus:ring-4 focus:ring-[#6C5CE7]/10 transition-all placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#FAFBFF] rounded-[8px] text-[10px] font-bold text-slate-400 border border-[#EEF2FF]">
              ⌘ K
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:bg-white p-2.5 rounded-full transition-colors border border-transparent hover:border-[#EEF2FF]">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAFBFF]">2</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:border-[#6C5CE7] transition-colors bg-gradient-to-tr from-purple-200 to-blue-200 flex items-center justify-center text-[#6C5CE7] font-bold">
                RD
              </div>
              <div className="hidden xl:block pr-2">
                <p className="text-[13px] font-bold text-slate-800 leading-tight">Riya Devi</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Receptionist</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 pt-4 no-scrollbar">
          <AnimatePresence mode="wait">
            
            {activeTab === 'Dashboard' && (
              <motion.div 
                key="dashboard"
                className="flex flex-col xl:flex-row gap-6 lg:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
            
            {/* LEFT & CENTER COLUMN (Flex-1) */}
            <div className="flex-1 space-y-6 lg:space-y-8">
              
              {/* KPI SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.08)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F4F4FF] text-[#6C5CE7] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+12%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 mb-1">{totalPatients}</h3>
                    <p className="text-[13px] font-medium text-slate-500">Today's Patients</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.08)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-amber-500 mb-1">{activeQueue}</h3>
                    <p className="text-[13px] font-medium text-slate-500">Active Queue</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.08)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[12px] bg-emerald-50 text-emerald-500 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-emerald-500 mb-1">4<span className="text-[18px] text-slate-400 font-bold">/5</span></h3>
                    <p className="text-[13px] font-medium text-slate-500">Doctors Available</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.08)] transition-all flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F4F4FF] text-[#6C5CE7] flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-end gap-2 mb-2">
                      <h3 className="text-3xl font-black text-slate-800 leading-none">{chairOccupancy}</h3>
                      <span className="text-[16px] font-bold text-slate-400 pb-0.5">/ 50</span>
                    </div>
                    <p className="text-[13px] font-medium text-slate-500 mb-3">Chair Occupancy</p>
                    <div className="h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: `${(chairOccupancy/50)*100}%` }}></div>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* CURRENT QUEUE CONTROL & QUEUE TABLE ROW */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                
                {/* CURRENT QUEUE CONTROL (Span 4) */}
                <motion.div variants={itemVariants} className="xl:col-span-5 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#6C5CE7]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center gap-2">
                      <Play className="w-4 h-4 text-[#6C5CE7] fill-[#6C5CE7]" /> Now Serving
                    </h3>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                    </span>
                  </div>

                  <div className="text-center py-6 border-y border-[#EEF2FF] mb-6 relative z-10">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Token Number</p>
                    <h2 className="text-6xl font-black text-[#6C5CE7] tracking-tighter mb-4">{nowServing.token}</h2>
                    <p className="text-[18px] font-bold text-slate-800 mb-1">{nowServing.name}</p>
                    <p className="text-[13px] font-semibold text-slate-500">{nowServing.doctor} • Cardiology</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <button className="col-span-1 py-3 rounded-xl border border-[#EEF2FF] bg-[#FAFBFF] text-slate-600 font-bold text-[12px] hover:bg-slate-50 hover:text-slate-800 transition-all flex flex-col items-center justify-center gap-1">
                      <SkipForward className="w-4 h-4" /> Skip
                    </button>
                    <button className="col-span-2 py-3 rounded-xl bg-[#6C5CE7] text-white font-bold text-[13px] shadow-[0_4px_15px_rgba(108,92,231,0.25)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" /> Call Next
                    </button>
                  </div>
                </motion.div>

                {/* QUEUE TABLE (Span 8) */}
                <motion.div variants={itemVariants} className="xl:col-span-7 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-extrabold text-[16px] text-slate-800 flex items-center gap-2">
                      <Users className="w-[18px] h-[18px] text-[#6C5CE7]" /> Patient Queue
                    </h3>
                    <button className="text-[11px] font-bold text-[#6C5CE7] flex items-center gap-1.5 hover:underline">
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <th className="pb-4 pl-2">Token</th>
                          <th className="pb-4">Patient & Symptoms</th>
                          <th className="pb-4">Doctor</th>
                          <th className="pb-4">AI Priority</th>
                          <th className="pb-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[12px] font-medium text-slate-600">
                        {patients.slice(0, 4).map((p) => {
                          const scoreStyle = getScoreColor(p.score);
                          let statusClass = 'bg-amber-50 text-amber-600 border-amber-100';
                          if (p.status === 'In Progress') statusClass = 'bg-[#F4F4FF] text-[#6C5CE7] border-[#EEF2FF]';
                          
                          return (
                            <tr key={p.id} className="border-b border-slate-50 hover:bg-[#FAFBFF] transition-colors group">
                              <td className="py-4 pl-2">
                                <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${scoreStyle.bg} text-white shadow-sm`}>
                                  {p.token}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <p className="font-bold text-slate-800 text-[13px] mb-0.5">{p.name}</p>
                                <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{p.symptoms}</p>
                              </td>
                              <td className="py-4 font-semibold text-slate-700">{p.doctor}</td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[12px] font-black ${scoreStyle.text}`}>{p.score.toFixed(1)}</span>
                                  <div className="w-10 h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
                                    <div className={`h-full ${scoreStyle.bg} rounded-full`} style={{ width: `${(p.score/10)*100}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-center">
                                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md border ${statusClass}`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* RIGHT ACTION PANEL (Width 360px) */}
            <div className="w-full xl:w-[360px] space-y-6 lg:space-y-8 shrink-0">
              
              {/* QUICK BOOKING FORM */}
              <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-6">
                  <UserPlus className="w-[18px] h-[18px] text-[#6C5CE7]" />
                  <h3 className="font-extrabold text-[16px] text-slate-800">Quick Booking</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Patient Name</label>
                    <input 
                      type="text" 
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full bg-[#FAFBFF] border border-[#EEF2FF] focus:border-[#6C5CE7]/50 focus:ring-4 focus:ring-[#6C5CE7]/10 rounded-[12px] px-4 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor</label>
                      <select 
                        value={bookingForm.doctor}
                        onChange={e => setBookingForm({...bookingForm, doctor: e.target.value})}
                        className="w-full bg-[#FAFBFF] border border-[#EEF2FF] rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none appearance-none shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                      >
                        {doctorsList.map(doc => <option key={doc.name} value={doc.name}>{doc.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time</label>
                      <select 
                        value={bookingForm.time}
                        onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                        className="w-full bg-[#FAFBFF] border border-[#EEF2FF] rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none appearance-none shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                      >
                        <option>10:00 AM</option><option>10:30 AM</option>
                        <option>11:00 AM</option><option>11:30 AM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Symptoms</label>
                    <textarea 
                      rows="3" 
                      value={bookingForm.symptoms}
                      onChange={e => setBookingForm({...bookingForm, symptoms: e.target.value})}
                      className="w-full bg-[#FAFBFF] border border-[#EEF2FF] focus:border-[#6C5CE7]/50 focus:ring-4 focus:ring-[#6C5CE7]/10 rounded-[12px] px-4 py-2.5 text-[13px] font-medium text-slate-700 outline-none transition-all resize-none shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                    ></textarea>
                  </div>

                  <div className="bg-[#FAFBFF] border border-[#EEF2FF] rounded-[14px] p-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">AI Score Preview</span>
                    {isSimulatingScore ? (
                      <div className="w-10 h-5 bg-slate-200 rounded-full animate-pulse"></div>
                    ) : (
                      <span className={`text-[16px] font-black ${simulatedScore ? getScoreColor(simulatedScore).text : 'text-slate-400'}`}>
                        {simulatedScore || '—'}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={submitNewBooking}
                    className="w-full bg-[#6C5CE7] text-white text-[13px] font-bold py-3 rounded-[12px] shadow-[0_4px_15px_rgba(108,92,231,0.25)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.3)] hover:-translate-y-0.5 transition-all"
                  >
                    Confirm & Assign Token
                  </button>
                </div>
              </motion.div>

              {/* DOCTOR LOAD CARD */}
              <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5 mb-6">
                  <Stethoscope className="w-[18px] h-[18px] text-[#6C5CE7]" />
                  <h3 className="font-extrabold text-[16px] text-slate-800">Doctor Load Today</h3>
                </div>

                <div className="space-y-5">
                  {doctorsList.map((doc, idx) => {
                    const totalLoad = 14 - idx; // Mock load
                    let loadColor = 'bg-emerald-500';
                    if (totalLoad > 12) loadColor = 'bg-amber-500';
                    if (totalLoad > 15) loadColor = 'bg-red-500';
                    const percent = Math.min((totalLoad / 20) * 100, 100);

                    return (
                      <div key={doc.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-[26px] h-[26px] rounded-[8px] ${doc.color.avatarBg} ${doc.color.avatarText} flex items-center justify-center text-[10px] font-black`}>
                              {doc.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <span className="text-[13px] font-bold text-slate-700">{doc.name}</span>
                          </div>
                          <span className="text-[12px] font-bold text-slate-500">{totalLoad} <span className="text-[10px] font-medium text-slate-400">pts</span></span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-2 bg-[#EEF2FF] rounded-full overflow-hidden">
                            <div className={`h-full ${loadColor} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* LIVE NOTIFICATIONS */}
              <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-[18px] h-[18px] text-[#6C5CE7]" />
                    <h3 className="font-extrabold text-[16px] text-slate-800">Live Notifications</h3>
                  </div>
                  <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">2 new</span>
                </div>

                <div className="space-y-5">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-3.5 items-start">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${getNotifStyle(notif.type)}`} />
                      <div>
                        <p className="text-[12px] text-slate-700 font-medium leading-snug mb-1">{notif.text}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

          </motion.div>
          )}

          {activeTab === 'Queue Management' && (
            <QueueManagementView key="queue-management" showToast={showToast} />
          )}

          {activeTab === 'Token Control' && (
            <TokenControlView key="token-control" showToast={showToast} />
          )}

          {activeTab === 'Doctors' && (
            <DoctorsView key="doctors" />
          )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
