import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Calendar, Users, FileText, Pill, 
  CreditCard, User, HelpCircle, Home, Clock, CheckCircle2, 
  Activity, Sparkles, ArrowRight, Star, Upload, Stethoscope, FlaskConical, Workflow, ChevronDown, ChevronRight, AlertCircle, Send
} from 'lucide-react';
import aiRobot from '../assets/ai-robot.png';
import heartBanner from '../assets/heart_banner.png';
import userAvatar from '../assets/user_avatar.png';
import robotHead from '../assets/robot_head.png';
import BookAppointmentView from '../components/BookAppointmentView';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [toastMessage, setToastMessage] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: '', slotTime: '', doctorId: '1', symptoms: ''
  });

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      // Because we aren't guaranteed backend is running, we'll gracefully fallback to localStorage
      const newAppt = {
        id: Date.now(),
        patientId: 1,
        doctorId: parseInt(bookingForm.doctorId),
        appointmentDate: bookingForm.appointmentDate,
        slotTime: bookingForm.slotTime,
        status: 'Pending Approval',
        symptoms: bookingForm.symptoms,
        createdAt: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
      localStorage.setItem('appointments', JSON.stringify([newAppt, ...existing]));
      
      showToast('Appointment booked successfully! Awaiting reception approval.', 'success');
      setBookingForm({ appointmentDate: '', slotTime: '', doctorId: '1', symptoms: '' });
      setTimeout(() => setActiveTab('My Appointments'), 1500);
    } catch (err) {
      showToast('Failed to book appointment.', 'error');
    }
  };

  const navLinks = [
    { name: 'Home', icon: Home, id: 'Home' },
    { name: 'Book Appointment', icon: Calendar, id: 'Book Appointment' },
    { name: 'Live Queue', icon: Users, id: 'Live Queue' },
    { name: 'My Appointments', icon: Calendar, id: 'My Appointments' },
    { name: 'Profile', icon: User, id: 'Profile' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Mock data for appointments view
  const myAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');

  if (myAppointments.length === 0) {
    myAppointments.push({ id: 1, appointmentDate: '2026-06-28', slotTime: '11:00 AM', doctorName: 'Dr. Priya Sharma', department: 'Dermatology', type: 'Follow-up', status: 'Confirmed' });
    myAppointments.push({ id: 2, appointmentDate: '2026-07-10', slotTime: '09:30 AM', doctorName: 'Dr. Amit Verma', department: 'General Medicine', type: 'Consultation', status: 'Confirmed' });
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex font-sans text-slate-800 selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-white border shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl px-6 py-4 flex items-center gap-3 ${toastMessage.type === 'error' ? 'border-red-100' : 'border-[#6C63FF]/20'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toastMessage.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-[#6C63FF]/10 text-[#6C63FF]'}`}>
              {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="text-sm font-bold text-slate-800">{toastMessage.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-[#EEF2FF] fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="p-7 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C63FF] flex items-center justify-center shadow-[0_4px_16px_rgba(108,99,255,0.3)]">
            <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-[16px] leading-tight text-slate-800 tracking-tight">SmartClinic AI</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Smarter Care. Zero Wait.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button 
                key={link.name}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#8079FF] text-white shadow-[0_4px_20px_rgba(108,99,255,0.25)]' 
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
          <div className="bg-gradient-to-br from-[#F4F4FF] to-[#FAFBFF] rounded-[24px] p-6 text-center border border-[#6C63FF]/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-center gap-1.5 text-[#6C63FF] mb-2 font-bold text-[13px] relative z-10">
              <Sparkles className="w-4 h-4" />
              <h3>AI-Powered Care</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed font-medium relative z-10">Smart triage, live tracking and faster healthcare for you.</p>
            <button className="text-[11px] font-bold text-[#6C63FF] bg-white px-5 py-2 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#EEF2FF] hover:shadow-md transition-all flex items-center gap-1.5 mx-auto relative z-10">
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
              placeholder="Search for doctors, departments, reports..." 
              className="w-full pl-11 pr-16 py-3.5 bg-white border border-[#EEF2FF] rounded-[20px] text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#6C63FF]/50 focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#FAFBFF] rounded-[8px] text-[10px] font-bold text-slate-400 border border-[#EEF2FF]">
              ⌘ K
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:bg-white p-2.5 rounded-full transition-colors border border-transparent hover:border-[#EEF2FF]">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAFBFF]">3</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:border-[#6C63FF] transition-colors">
                <img src={userAvatar} alt="Rahul Sharma" className="w-full h-full object-cover" />
              </div>
              <div className="hidden xl:block pr-2">
                <p className="text-[13px] font-bold text-slate-800 leading-tight">Rahul Sharma</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Patient</p>
              </div>
            </div>
            {/* Priority Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-[#6C63FF]/10 to-[#4F8CFF]/10 px-4 py-2.5 rounded-full border border-[#6C63FF]/20 shadow-sm ml-2">
              <span className="text-[11px] font-bold text-[#6C63FF]">Priority: Medium</span>
              <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 pt-4 no-scrollbar">
          
          <AnimatePresence mode="wait">
            {/* ===================== HOME TAB ===================== */}
            {activeTab === 'Home' && (
              <motion.div 
                key="home"
                className="max-w-[1440px] mx-auto space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* SECTION 1: Welcome Banner & Queue Status */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* WELCOME BANNER (Span 8) */}
                  <motion.div variants={itemVariants} className="xl:col-span-8 h-auto xl:h-[260px] bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="w-56 h-56 shrink-0 relative z-10 hidden md:block">
                      <img src={heartBanner} alt="Healthcare" className="w-full h-full object-contain drop-shadow-2xl" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left relative z-10 w-full">
                      <h2 className="text-[28px] font-extrabold text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2 mb-2">
                        Good Evening, Rahul! <span className="text-3xl">👋</span>
                      </h2>
                      <p className="text-slate-500 text-[14px] font-medium mb-10">Here's your healthcare journey for today.</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Age</p>
                          <p className="text-[16px] font-extrabold text-slate-800">28 Yrs</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Blood Group</p>
                          <p className="text-[16px] font-extrabold text-slate-800">O+</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Health ID</p>
                          <p className="text-[16px] font-extrabold text-slate-800">SC-89271</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Member Since</p>
                          <p className="text-[16px] font-extrabold text-slate-800">Feb 2024</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* QUEUE STATUS (Span 4) */}
                  <motion.div variants={itemVariants} className="xl:col-span-4 h-auto xl:h-[260px] bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between cursor-pointer group" onClick={() => setActiveTab('Live Queue')}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-[16px] text-slate-800">Queue Status</h3>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-6 bg-[#FAFBFF] rounded-[16px] p-4 border border-[#EEF2FF] group-hover:border-[#6C63FF]/30 transition-colors">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-semibold mb-1">Your Token</p>
                        <p className="text-3xl font-black text-[#6C63FF]">#23</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-semibold mb-1">Wait Time</p>
                        <p className="text-[16px] font-bold text-slate-800 flex items-center justify-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400"/> 12m</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-semibold mb-1">Ahead</p>
                        <p className="text-[16px] font-bold text-slate-800 flex items-center justify-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400"/> 8</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] font-bold text-slate-800">AI Priority Score</p>
                        <p className="text-[12px] font-bold text-slate-800">72<span className="text-[10px] text-slate-400 font-semibold">/100</span></p>
                      </div>
                      <div className="h-2.5 bg-[#EEF2FF] rounded-full mb-3 flex items-center justify-between relative pr-2">
                        <div className="absolute left-0 top-0 h-full w-[72%] bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] rounded-full"></div>
                        <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white bg-[#F4F4FF] shadow-sm flex items-center justify-center overflow-hidden z-10">
                          <img src={robotHead} alt="AI" className="w-6 h-6 object-cover" />
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-semibold group-hover:underline">Click to view Live Queue.</p>
                    </div>
                  </motion.div>

                </div>

                {/* SECTION 2: 4 Quick Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* Card 1: Next Appointment */}
                  <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(108,99,255,0.08)] transition-all flex flex-col justify-between h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-[#F4F4FF] text-[#6C63FF] flex items-center justify-center border border-[#6C63FF]/10">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-slate-800">Next Appointment</h3>
                      </div>
                      <p className="text-[14px] font-bold text-slate-800">Dr. Priya Sharma</p>
                      <p className="text-[11px] font-bold text-[#6C63FF] mb-2">Dermatology</p>
                      <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                        24 June 2026 <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 10:30 AM
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('My Appointments')} className="w-full mt-auto py-2.5 rounded-xl border border-[#EEF2FF] text-[11px] font-bold text-[#6C63FF] hover:bg-[#F4F4FF] transition-colors flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>

                  {/* Card 2: Medicine Status */}
                  <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(108,99,255,0.08)] transition-all flex flex-col justify-between h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                          <Pill className="w-5 h-5" />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-slate-800">Medicine Status</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[14px] font-bold text-slate-800">2 Medicines</p>
                      </div>
                      <span className="inline-block mb-3 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-md border border-emerald-100 uppercase tracking-wider">Ready Soon</span>
                      <p className="text-[11px] font-medium text-slate-500">
                        Will be ready in 15 mins
                      </p>
                    </div>
                    <button className="w-full mt-auto py-2.5 rounded-xl border border-[#EEF2FF] text-[11px] font-bold text-[#6C63FF] hover:bg-[#F4F4FF] transition-colors flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>

                  {/* Card 3: Reports Available */}
                  <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(108,99,255,0.08)] transition-all flex flex-col justify-between h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-slate-800">Reports Available</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[14px] font-bold text-slate-800">3 New Reports</p>
                        <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">New</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Blood Test, X-Ray, CBC
                      </p>
                    </div>
                    <button className="w-full mt-auto py-2.5 rounded-xl border border-[#EEF2FF] text-[11px] font-bold text-[#6C63FF] hover:bg-[#F4F4FF] transition-colors flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      View Reports <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>

                  {/* Card 4: Pending Payments */}
                  <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(108,99,255,0.08)] transition-all flex flex-col justify-between h-[190px]">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="text-[13px] font-extrabold text-slate-800">Pending Payments</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[18px] font-black text-slate-800">₹1,250</p>
                        <span className="bg-rose-100 text-rose-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Due</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">
                        Bill from 20 June 2026
                      </p>
                    </div>
                    <button className="w-full mt-auto py-2.5 rounded-xl border border-[#EEF2FF] text-[11px] font-bold text-[#6C63FF] hover:bg-[#F4F4FF] transition-colors flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      Make Payment <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>

                </div>

                {/* SECTION 3: Tracker & Symptom Analysis */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* LEFT COLUMN (Span 7) */}
                  <motion.div variants={itemVariants} className="xl:col-span-7 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-[18px] h-[18px] text-[#6C63FF]" />
                        <h3 className="font-extrabold text-[16px] text-slate-800">Live Queue Tracker</h3>
                      </div>
                      <button onClick={() => setActiveTab('Live Queue')} className="text-[11px] font-bold text-[#6C63FF] flex items-center gap-1.5 hover:underline">
                        View Live Updates <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="relative px-2 sm:px-8 pb-4">
                      {/* Background Line */}
                      <div className="absolute top-[22px] left-12 right-12 h-[2px] bg-slate-100 z-0"></div>
                      {/* Active Line */}
                      <div className="absolute top-[22px] left-12 w-[25%] h-[2px] bg-[#6C63FF] z-0"></div>

                      <div className="relative z-10 flex justify-between">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center w-16">
                          <div className="w-[44px] h-[44px] rounded-full bg-[#6C63FF] text-white flex items-center justify-center mb-3.5 font-bold text-[14px] border-[3px] border-white shadow-sm">
                            1
                          </div>
                          <p className="text-[12px] font-bold text-slate-800 mb-1">Reception</p>
                          <p className="text-[10px] font-bold text-emerald-500 mb-1">Completed</p>
                          <p className="text-[9px] font-medium text-slate-400 flex items-center justify-center gap-0.5">
                            09:40 AM <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center w-16">
                          <div className="w-[44px] h-[44px] rounded-full bg-[#6C63FF] text-white flex items-center justify-center mb-3.5 font-bold text-[14px] border-[3px] border-white shadow-[0_0_15px_rgba(108,99,255,0.4)] relative">
                            <div className="absolute inset-0 rounded-full border-2 border-[#6C63FF]/40 animate-ping"></div>
                            2
                          </div>
                          <p className="text-[12px] font-bold text-slate-800 mb-1">Doctor</p>
                          <p className="text-[10px] font-bold text-[#6C63FF] mb-1">In Progress</p>
                          <p className="text-[9px] font-medium text-slate-400">10:15 AM</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center w-16">
                          <div className="w-[44px] h-[44px] rounded-full bg-white text-slate-300 flex items-center justify-center mb-3.5 font-bold text-[14px] border-[2px] border-slate-200">
                            3
                          </div>
                          <p className="text-[12px] font-bold text-slate-800 mb-1">Lab</p>
                          <p className="text-[10px] font-bold text-slate-400">Pending</p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center text-center w-16 hidden sm:flex">
                          <div className="w-[44px] h-[44px] rounded-full bg-white text-slate-300 flex items-center justify-center mb-3.5 font-bold text-[14px] border-[2px] border-slate-200">
                            4
                          </div>
                          <p className="text-[12px] font-bold text-slate-800 mb-1">Pharmacy</p>
                          <p className="text-[10px] font-bold text-slate-400">Pending</p>
                        </div>

                        {/* Step 5 */}
                        <div className="flex flex-col items-center text-center w-16 hidden sm:flex">
                          <div className="w-[44px] h-[44px] rounded-full bg-white text-slate-300 flex items-center justify-center mb-3.5 font-bold text-[14px] border-[2px] border-slate-200">
                            5
                          </div>
                          <p className="text-[12px] font-bold text-slate-800 mb-1">Exit</p>
                          <p className="text-[10px] font-bold text-slate-400">Pending</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* RIGHT COLUMN (Span 5) */}
                  <motion.div variants={itemVariants} className="xl:col-span-5 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-8">
                      <Sparkles className="w-[18px] h-[18px] text-[#6C63FF]" />
                      <h3 className="font-extrabold text-[16px] text-slate-800">AI Symptom Analysis</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Analysis Result</p>
                        <h4 className="text-[18px] font-extrabold text-[#6C63FF] mb-6">Acne & Skin Irritation</h4>
                        
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Risk Score</p>
                        <div className="flex items-end gap-4">
                          <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-[8px]">Medium</span>
                          <span className="text-[22px] font-black text-slate-800 leading-none">62<span className="text-[14px] text-slate-400 font-bold">/100</span></span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6 pt-1">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Stethoscope className="w-4 h-4 text-[#6C63FF]" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Department</p>
                          </div>
                          <p className="text-[14px] font-bold text-[#6C63FF]">Dermatology</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Triage Priority</p>
                          </div>
                          <p className="text-[14px] font-bold text-orange-500">Medium</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#EEF2FF] flex items-center justify-between gap-4">
                      <p className="text-[11px] font-bold text-slate-800">AI Confidence</p>
                      <div className="flex-1 h-2 bg-[#EEF2FF] rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-[#6C63FF] rounded-full"></div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800">78%</p>
                    </div>
                  </motion.div>

                </div>

                {/* SECTION 4: Appointments Table & Exit Flow Optimizer */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-20">
                  
                  {/* LEFT COLUMN (Span 7) */}
                  <motion.div variants={itemVariants} className="xl:col-span-7 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-6">
                      <Calendar className="w-[18px] h-[18px] text-[#6C63FF]" />
                      <h3 className="font-extrabold text-[16px] text-slate-800">Upcoming Appointments</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <th className="pb-4 pl-2">Date & Time</th>
                            <th className="pb-4">Doctor</th>
                            <th className="pb-4">Department</th>
                            <th className="pb-4">Type</th>
                            <th className="pb-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-[12px] font-medium text-slate-600">
                          {myAppointments.slice(0, 3).map((appt, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-[#FAFBFF] transition-colors">
                              <td className="py-4 pl-2 text-slate-500">{appt.appointmentDate}, {appt.slotTime}</td>
                              <td className="py-4 text-slate-800 font-bold">{appt.doctorName}</td>
                              <td className="py-4">{appt.department}</td>
                              <td className="py-4">{appt.type || 'Consultation'}</td>
                              <td className="py-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                                  appt.status === 'Confirmed' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                                  'text-orange-600 bg-orange-50 border border-orange-100'
                                }`}>
                                  {appt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => setActiveTab('My Appointments')} className="w-full mt-2 text-[11px] font-bold text-[#6C63FF] hover:text-[#4F8CFF] transition-colors flex items-center justify-center gap-1.5 pt-5 border-t border-[#EEF2FF]">
                      View All Appointments <ArrowRight className="w-3.5 h-3.5"/>
                    </button>
                  </motion.div>
                  
                  {/* RIGHT COLUMN (Span 5) */}
                  <motion.div variants={itemVariants} className="xl:col-span-5 bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Workflow className="w-[18px] h-[18px] text-[#6C63FF]" />
                      <h3 className="font-extrabold text-[16px] text-slate-800">Exit Flow Optimizer</h3>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 mb-8">We recommend the fastest exit route for you.</p>

                    <div className="flex items-center justify-between text-center mb-10 px-2">
                      
                      <div className="flex flex-col items-center">
                        <p className="text-[13px] font-extrabold text-slate-800 mb-1.5">Billing</p>
                        <p className="text-[11px] font-medium text-slate-500 mb-3">2 mins</p>
                        <span className="text-[9px] font-bold text-slate-500 border border-[#EEF2FF] px-2.5 py-1 rounded-md bg-[#FAFBFF]">Counter 3</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300" />

                      <div className="flex flex-col items-center">
                        <p className="text-[13px] font-extrabold text-slate-800 mb-1.5">Lab</p>
                        <p className="text-[11px] font-medium text-slate-500 mb-3">10 mins</p>
                        <span className="text-[9px] font-bold text-slate-500 border border-[#EEF2FF] px-2.5 py-1 rounded-md bg-[#FAFBFF]">Pathology Lab</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300" />

                      <div className="flex flex-col items-center">
                        <p className="text-[13px] font-extrabold text-slate-800 mb-1.5">Pharmacy</p>
                        <p className="text-[11px] font-medium text-slate-500 mb-3">5 mins</p>
                        <span className="text-[9px] font-bold text-slate-500 border border-[#EEF2FF] px-2.5 py-1 rounded-md bg-[#FAFBFF]">Pharmacy 1</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />

                      <div className="flex-col items-center hidden sm:flex">
                        <p className="text-[13px] font-extrabold text-slate-800 mb-1.5">Exit</p>
                        <p className="text-[11px] font-medium text-slate-500 mb-3">2 mins</p>
                        <span className="text-[9px] font-bold text-slate-500 border border-[#EEF2FF] px-2.5 py-1 rounded-md bg-[#FAFBFF]">Gate 2</span>
                      </div>

                    </div>

                    <div className="bg-[#FAFBFF] rounded-[16px] py-4 px-6 flex items-center justify-center gap-2 border border-[#EEF2FF] text-[#6C63FF]">
                      <Clock className="w-4 h-4" />
                      <span className="text-[12px] font-semibold">Estimated Total Exit Time:</span>
                      <span className="text-[15px] font-black">19 mins</span>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}

            {/* ===================== BOOK APPOINTMENT TAB ===================== */}
            {activeTab === 'Book Appointment' && (
              <BookAppointmentView setActiveTab={setActiveTab} showToast={showToast} />
            )}

            {/* ===================== MY APPOINTMENTS TAB ===================== */}
            {activeTab === 'My Appointments' && (
              <motion.div 
                key="my-appointments"
                className="max-w-5xl mx-auto space-y-6 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="bg-white rounded-[24px] p-8 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-[16px] bg-[#F4F4FF] text-[#6C63FF] flex items-center justify-center border border-[#6C63FF]/10">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-extrabold text-slate-800">My Appointments</h2>
                      <p className="text-[13px] text-slate-500 font-medium mt-0.5">View and manage all your scheduled visits.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#EEF2FF] bg-[#FAFBFF] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <th className="py-4 pl-6">Date & Time</th>
                          <th className="py-4">Doctor</th>
                          <th className="py-4">Department</th>
                          <th className="py-4">Symptoms</th>
                          <th className="py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px] font-bold text-slate-700">
                        {myAppointments.map((appt, i) => (
                          <tr key={i} className="border-b border-[#EEF2FF] hover:bg-[#FAFBFF] transition-colors">
                            <td className="py-5 pl-6">
                              <p className="text-slate-800">{appt.appointmentDate}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{appt.slotTime}</p>
                            </td>
                            <td className="py-5">{appt.doctorName}</td>
                            <td className="py-5 text-slate-500">{appt.department}</td>
                            <td className="py-5 text-slate-500 font-medium max-w-xs truncate">{appt.symptoms || appt.type}</td>
                            <td className="py-5">
                              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                appt.status === 'Confirmed' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                                appt.status === 'Completed' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                                'text-orange-600 bg-orange-50 border border-orange-100'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===================== LIVE QUEUE TAB ===================== */}
            {activeTab === 'Live Queue' && (
              <motion.div 
                key="live-queue"
                className="max-w-4xl mx-auto space-y-6 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="bg-white rounded-[24px] p-8 lg:p-12 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
                  
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#F4F4FF] to-white pointer-events-none"></div>
                  <div className="absolute top-10 left-10 w-32 h-32 bg-[#6C63FF]/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute top-20 right-10 w-40 h-40 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 border border-emerald-100 mb-8 mx-auto w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Updates
                    </span>

                    <h2 className="text-[24px] font-black text-slate-800 mb-2">Dr. Priya Sharma</h2>
                    <p className="text-[13px] font-bold text-[#6C63FF] mb-12">Dermatology • Room 402</p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mb-12 w-full">
                      
                      <div className="flex flex-col items-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Now Serving</p>
                        <div className="w-32 h-32 rounded-[24px] bg-[#FAFBFF] border border-[#EEF2FF] flex items-center justify-center text-4xl font-black text-slate-400 shadow-inner">
                          #15
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col gap-2 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>

                      <div className="flex flex-col items-center relative">
                        <p className="text-[11px] font-bold text-[#6C63FF] uppercase tracking-wider mb-3">Your Token</p>
                        <div className="w-40 h-40 rounded-[24px] bg-gradient-to-br from-[#6C63FF] to-[#8079FF] shadow-[0_10px_30px_rgba(108,99,255,0.3)] border-[4px] border-white flex items-center justify-center text-5xl font-black text-white relative z-10">
                          #23
                        </div>
                        {/* Glow ring */}
                        <div className="absolute top-[26px] w-40 h-40 rounded-[24px] border-2 border-[#6C63FF]/30 animate-ping z-0 pointer-events-none"></div>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl bg-[#FAFBFF] rounded-[20px] p-6 border border-[#EEF2FF]">
                      <div className="text-center border-r border-[#EEF2FF]">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Wait Time</p>
                        <p className="text-[18px] font-black text-slate-800">12m</p>
                      </div>
                      <div className="text-center md:border-r border-[#EEF2FF]">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Ahead of You</p>
                        <p className="text-[18px] font-black text-slate-800">8</p>
                      </div>
                      <div className="text-center border-r border-[#EEF2FF]">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Est. Time</p>
                        <p className="text-[18px] font-black text-slate-800">10:45 AM</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Priority</p>
                        <p className="text-[18px] font-black text-orange-500">Medium</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
