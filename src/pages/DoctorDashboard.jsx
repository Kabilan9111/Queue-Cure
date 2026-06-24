import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Pill,
  FlaskConical,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Send
} from 'lucide-react';
import robotHead from '../assets/robot_head.png';

// --- MOCK DATA ---
const schedule = [
  { id: 1, time: '09:00 AM', token: '#21', name: 'Ramesh Kumar', details: '28 Y • Male', status: 'In Progress' },
  { id: 2, time: '09:20 AM', token: '#22', name: 'Anjali Verma', details: '32 Y • Female', status: 'Waiting' },
  { id: 3, time: '09:40 AM', token: '#23', name: 'Vikram Singh', details: '45 Y • Male', status: 'Waiting' },
  { id: 4, time: '10:00 AM', token: '#24', name: 'Neha Patel', details: '27 Y • Female', status: 'Upcoming' },
  { id: 5, time: '10:20 AM', token: '#25', name: 'Suresh Yadav', details: '50 Y • Male', status: 'Upcoming' },
];

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeProfileTab, setActiveProfileTab] = useState('Overview');
  const [doctor, setDoctor] = useState({ name: 'Dr. Priya Sharma', specialization: 'Dermatologist' });
  const [toastMessage, setToastMessage] = useState(null);
  
  // Pharmacy Builder State
  const [medicines, setMedicines] = useState([
    { id: 1, name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [pharmacyNotes, setPharmacyNotes] = useState('');

  // Lab Builder State
  const commonLabTests = [
    'Complete Blood Count (CBC)', 'Blood Sugar (Fasting)', 'Urine Analysis', 
    'Lipid Profile', 'Thyroid Profile (T3, T4, TSH)', 'ECG', 
    'MRI', 'CT Scan', 'X-Ray', 'Ultrasound'
  ];
  const [selectedTests, setSelectedTests] = useState([]);
  const [customTest, setCustomTest] = useState('');
  const [labNotes, setLabNotes] = useState('');

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  useEffect(() => {
    const savedDoc = localStorage.getItem('doctor');
    if (savedDoc) {
      setDoctor(JSON.parse(savedDoc));
    }
  }, []);

  const navLinks = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Pharmacy', icon: Pill, label: 'Pharmacy' },
    { id: 'Lab', icon: FlaskConical, label: 'Lab' }
  ];

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pharmacy Handlers
  const handleAddMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleMedicineChange = (id, field, value) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const submitPharmacyOrder = () => {
    const validMeds = medicines.filter(m => m.name.trim() !== '');
    if (validMeds.length === 0) {
      showToast('Please add at least one medicine', 'error');
      return;
    }
    const order = {
      id: Date.now(),
      patientToken: '#21',
      patientName: 'Ramesh Kumar',
      doctorName: doctor.name,
      department: doctor.specialization,
      medicines: validMeds,
      notes: pharmacyNotes,
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    const existing = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
    localStorage.setItem('pharmacyOrders', JSON.stringify([order, ...existing]));
    
    setMedicines([{ id: Date.now(), name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    setPharmacyNotes('');
    showToast('Prescription Sent Successfully!', 'success');
  };

  // Lab Handlers
  const handleToggleTest = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleAddCustomTest = (e) => {
    e.preventDefault();
    if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
      setSelectedTests([...selectedTests, customTest.trim()]);
      setCustomTest('');
    }
  };

  const submitLabOrder = () => {
    if (selectedTests.length === 0) {
      showToast('Please select at least one lab test', 'error');
      return;
    }
    const order = {
      id: Date.now(),
      patientToken: '#21',
      patientName: 'Ramesh Kumar',
      doctorName: doctor.name,
      department: doctor.specialization,
      tests: selectedTests,
      notes: labNotes,
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    const existing = JSON.parse(localStorage.getItem('labOrders') || '[]');
    localStorage.setItem('labOrders', JSON.stringify([order, ...existing]));
    
    setSelectedTests([]);
    setLabNotes('');
    showToast('Lab Request Sent Successfully!', 'success');
  };


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

      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-[#EEF2FF] flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)] shrink-0">
        <div className="p-7 pb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shadow-[0_4px_16px_rgba(108,92,231,0.3)]">
            <Stethoscope className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-[16px] leading-tight text-slate-800 tracking-tight">SmartClinic AI</h1>
            <p className="text-[10px] text-[#6C5CE7] font-bold tracking-wide mt-0.5">Doctor Portal</p>
          </div>
        </div>

        <div className="flex-1 px-5 space-y-1.5 mt-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button 
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[16px] text-[13px] font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#8079FF] text-white shadow-[0_4px_20px_rgba(108,92,231,0.25)]' 
                    : 'text-slate-500 hover:bg-[#FAFBFF] hover:text-slate-800'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.label}
              </button>
            )
          })}
        </div>

        {/* AI Assistant Banner */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-[#F4F4FF] to-[#FAFBFF] rounded-[24px] p-6 text-center border border-[#EEF2FF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 text-[#6C5CE7] mb-3 font-bold text-[13px]">
              <Sparkles className="w-4 h-4" />
              <h3>AI Clinical Assistant</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-5 leading-relaxed font-medium">Get AI-powered insights for better diagnosis and treatment.</p>
            <button className="w-full text-[12px] font-bold text-[#6C5CE7] bg-white py-2.5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#EEF2FF] hover:shadow-md transition-all flex items-center justify-center gap-1.5">
              Ask AI Assistant <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-[80px] bg-white border-b border-[#EEF2FF] flex items-center justify-between px-8 lg:px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors border border-[#EEF2FF]">
              <Activity className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-bold text-[14px] text-slate-800">Today, 24 Jun 2026</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer hover:bg-slate-50 p-2.5 rounded-full transition-colors border border-transparent hover:border-[#EEF2FF]">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">5</span>
            </div>
            
            <div className="flex items-center gap-3 cursor-pointer group pl-2 border-l border-slate-100">
              <div className="hidden xl:block text-right pr-1">
                <p className="text-[13px] font-bold text-slate-800 leading-tight">{doctor.name}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{doctor.specialization}</p>
              </div>
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:border-[#6C5CE7] transition-colors bg-gradient-to-tr from-purple-200 to-blue-200 flex items-center justify-center text-[#6C5CE7] font-bold text-[14px]">
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </header>

        {/* MAIN VIEWS */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 no-scrollbar bg-[#FAFBFF]">
          <AnimatePresence mode="wait">
            
            {/* --- HOME VIEW (3 COLUMNS) --- */}
            {activeTab === 'Home' && (
              <motion.div 
                key="home"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full"
              >
                {/* COLUMN 1: Schedule (approx 3/12) */}
                <motion.div variants={itemVariants} className="xl:col-span-3 bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden h-[calc(100vh-140px)]">
                  <div className="p-6 border-b border-[#EEF2FF]">
                    <div className="flex items-center gap-2.5 mb-1">
                      <Clock className="w-[18px] h-[18px] text-[#6C5CE7]" />
                      <h2 className="font-extrabold text-[16px] text-slate-800">Today's Schedule</h2>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium pl-[28px]">14 Appointments</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    {schedule.map((item, idx) => {
                      const isActive = idx === 0;
                      return (
                        <div key={item.id} className={`p-4 rounded-[16px] border ${isActive ? 'border-[#6C5CE7] bg-[#F4F4FF]' : 'border-[#EEF2FF] bg-white'} hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase">{item.time}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'In Progress' ? 'bg-[#6C5CE7]/10 text-[#6C5CE7]' :
                              item.status === 'Waiting' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-500'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={`font-bold text-[14px] mb-0.5 ${isActive ? 'text-[#6C5CE7]' : 'text-slate-800'}`}>{item.name}</h3>
                              <p className="text-[11px] font-semibold text-slate-400">{item.token} <span className="mx-1">•</span> {item.details}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#6C5CE7]' : 'text-slate-300 group-hover:text-slate-400'}`} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="p-4 border-t border-[#EEF2FF]">
                    <button className="w-full py-3 rounded-[12px] bg-white border border-[#EEF2FF] text-[#6C5CE7] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#F4F4FF] transition-colors">
                      <Calendar className="w-4 h-4" /> View All Appointments
                    </button>
                  </div>
                </motion.div>

                {/* COLUMN 2: Patient Profile & Details (approx 6/12) */}
                <motion.div variants={itemVariants} className="xl:col-span-6 flex flex-col gap-6 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-6">
                  
                  {/* Top Profile Banner */}
                  <div className="bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-[20px] bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Ramesh`} alt="Patient" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-black text-slate-800">Ramesh Kumar</h2>
                            <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                          </div>
                          <p className="text-[13px] text-slate-500 font-medium mb-3">28 Years, Male <span className="mx-2">•</span> 9876543210</p>
                          <div className="flex items-center gap-4 text-[12px] font-bold text-slate-600">
                            <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Token No: <span className="text-slate-800">#21</span></span>
                            <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Time: <span className="text-slate-800">09:00 AM</span></span>
                            <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Dept: <span className="text-slate-800">{doctor.specialization}</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white border border-[#EEF2FF] p-1 rounded-xl shadow-sm mb-2">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=RameshKumar21`} alt="QR" className="w-full h-full opacity-80" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">Scan to Verify</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-8 border-b border-[#EEF2FF] px-2">
                    {['Overview', 'Medical History', 'Vitals', 'Documents', 'Notes'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveProfileTab(tab)}
                        className={`pb-4 text-[13px] font-bold transition-all relative ${activeProfileTab === tab ? 'text-[#6C5CE7]' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                        {activeProfileTab === tab && (
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6C5CE7] rounded-t-full"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Chief Complaint */}
                    <div className="col-span-1 bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#F4F4FF] text-[#6C5CE7] flex items-center justify-center">
                          <span className="text-lg font-serif">"</span>
                        </div>
                        <h3 className="font-extrabold text-[14px] text-slate-800">Chief Complaint</h3>
                      </div>
                      <p className="text-[13px] leading-relaxed text-slate-600 font-medium">
                        Severe acne, skin irritation and itching on face and back for the last 2 weeks. Redness increases after sweating.
                      </p>
                    </div>

                    {/* Vitals */}
                    <div className="col-span-1 bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <Activity className="w-[16px] h-[16px] text-[#6C5CE7]" />
                          <h3 className="font-extrabold text-[14px] text-slate-800">Vitals</h3>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">(Today, 08:55 AM)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-0.5">BP</p>
                          <p className="text-[14px] font-black text-slate-800">120/80 <span className="text-[10px] text-slate-400 font-medium">mmHg</span></p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-0.5">Pulse</p>
                          <p className="text-[14px] font-black text-slate-800">78 <span className="text-[10px] text-slate-400 font-medium">bpm</span></p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-0.5">Weight</p>
                          <p className="text-[14px] font-black text-slate-800">72 <span className="text-[10px] text-slate-400 font-medium">kg</span></p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-0.5">Height</p>
                          <p className="text-[14px] font-black text-slate-800">175 <span className="text-[10px] text-slate-400 font-medium">cm</span></p>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="col-span-2 bg-gradient-to-br from-[#F4F4FF] to-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2 text-[#6C5CE7]">
                          <Sparkles className="w-[18px] h-[18px]" />
                          <h3 className="font-extrabold text-[14px] text-slate-800">AI Suggested Insights</h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Confidence 83%</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-1">Likely Condition</p>
                          <p className="text-[14px] font-black text-slate-800">Acne Vulgaris</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-1">Severity</p>
                          <p className="text-[14px] font-black text-amber-500">Moderate</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 mb-1.5">Recommended Actions</p>
                          <ul className="text-[12px] font-semibold text-slate-600 space-y-1">
                            <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Topical Treatment</li>
                            <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-slate-400 rounded-full"></div> Skin Care Routine</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>

                {/* COLUMN 3: Treatment Plan (approx 3/12) */}
                <motion.div variants={itemVariants} className="xl:col-span-3 flex flex-col gap-6 h-[calc(100vh-140px)]">
                  <div className="flex-1 bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col overflow-hidden">
                    <h2 className="font-extrabold text-[16px] text-slate-800 mb-6">Treatment Plan</h2>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                      
                      {/* Medicines List */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[13px] font-bold text-slate-800">Prescribe Medicines</h3>
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">3</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3 items-start border-b border-slate-50 pb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-700">Cetirizine 10mg</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">1-0-1 (After Food)</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start border-b border-slate-50 pb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-700">Clindamycin Gel</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Apply at night</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start border-b border-slate-50 pb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-700">Vitamin B Complex</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">1-0-1 (After Food)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lab Tests List */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[13px] font-bold text-slate-800">Request Lab Tests</h3>
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">2</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-3 items-start border-b border-slate-50 pb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></div>
                            <p className="text-[13px] font-bold text-slate-700">Complete Blood Count (CBC)</p>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0"></div>
                            <p className="text-[13px] font-bold text-slate-700">Allergy Panel</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 shrink-0">
                    <button onClick={() => setActiveTab('Pharmacy')} className="py-3.5 rounded-[16px] bg-[#6C5CE7] text-white text-[13px] font-bold shadow-[0_4px_15px_rgba(108,92,231,0.25)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <Pill className="w-4 h-4" /> Go to Pharmacy
                    </button>
                    <button onClick={() => setActiveTab('Lab')} className="py-3.5 rounded-[16px] bg-white border border-[#EEF2FF] text-[#6C5CE7] text-[13px] font-bold shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:bg-[#F4F4FF] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <FlaskConical className="w-4 h-4" /> Go to Lab
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}


            {/* --- PHARMACY BUILDER VIEW --- */}
            {activeTab === 'Pharmacy' && (
              <motion.div 
                key="pharmacy-builder"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="max-w-5xl mx-auto space-y-6 pb-20"
              >
                {/* Header & Patient Info */}
                <div className="bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-[20px] font-black text-slate-800 mb-1 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-[#6C5CE7]" /> Prescription Builder
                      </h2>
                      <p className="text-[13px] text-slate-500 font-medium">Create a new prescription for the pharmacy</p>
                    </div>
                    <div className="bg-[#F4F4FF] border border-[#EEF2FF] px-5 py-3 rounded-[16px] text-right">
                      <p className="text-[11px] font-bold text-[#6C5CE7] mb-0.5">Active Patient</p>
                      <p className="text-[14px] font-black text-slate-800">Ramesh Kumar <span className="text-[12px] text-slate-400 font-semibold ml-2">#21</span></p>
                    </div>
                  </div>

                  {/* Medicines Table */}
                  <div className="border border-[#EEF2FF] rounded-[16px] overflow-hidden mb-6">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-[#EEF2FF]">
                        <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-4 pl-6">Medicine Name</th>
                          <th className="py-4">Dosage</th>
                          <th className="py-4">Frequency</th>
                          <th className="py-4">Duration</th>
                          <th className="py-4">Instructions</th>
                          <th className="py-4 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEF2FF] bg-white">
                        {medicines.map((med) => (
                          <tr key={med.id} className="group">
                            <td className="p-3 pl-6">
                              <input 
                                type="text" 
                                placeholder="e.g. Paracetamol" 
                                value={med.name} 
                                onChange={(e) => handleMedicineChange(med.id, 'name', e.target.value)}
                                className="w-full bg-transparent border border-transparent focus:border-[#EEF2FF] focus:bg-slate-50 rounded-[8px] px-3 py-2 text-[13px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                placeholder="500mg" 
                                value={med.dosage} 
                                onChange={(e) => handleMedicineChange(med.id, 'dosage', e.target.value)}
                                className="w-full bg-transparent border border-transparent focus:border-[#EEF2FF] focus:bg-slate-50 rounded-[8px] px-3 py-2 text-[13px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                placeholder="1-0-1" 
                                value={med.frequency} 
                                onChange={(e) => handleMedicineChange(med.id, 'frequency', e.target.value)}
                                className="w-full bg-transparent border border-transparent focus:border-[#EEF2FF] focus:bg-slate-50 rounded-[8px] px-3 py-2 text-[13px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                placeholder="5 Days" 
                                value={med.duration} 
                                onChange={(e) => handleMedicineChange(med.id, 'duration', e.target.value)}
                                className="w-full bg-transparent border border-transparent focus:border-[#EEF2FF] focus:bg-slate-50 rounded-[8px] px-3 py-2 text-[13px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                placeholder="After food" 
                                value={med.instructions} 
                                onChange={(e) => handleMedicineChange(med.id, 'instructions', e.target.value)}
                                className="w-full bg-transparent border border-transparent focus:border-[#EEF2FF] focus:bg-slate-50 rounded-[8px] px-3 py-2 text-[13px] font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
                              />
                            </td>
                            <td className="p-3 pr-4 text-center">
                              {medicines.length > 1 && (
                                <button 
                                  onClick={() => handleRemoveMedicine(med.id)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-3 bg-slate-50/50 border-t border-[#EEF2FF]">
                      <button 
                        onClick={handleAddMedicine}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-[#6C5CE7] hover:bg-[#F4F4FF] px-4 py-2 rounded-[8px] transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Medicine
                      </button>
                    </div>
                  </div>

                  {/* Notes & Submit */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Special Instructions / Notes</label>
                      <textarea 
                        rows={3} 
                        value={pharmacyNotes}
                        onChange={(e) => setPharmacyNotes(e.target.value)}
                        placeholder="Add any general notes for the pharmacist..."
                        className="w-full border border-[#EEF2FF] bg-slate-50 rounded-[12px] p-4 text-[13px] text-slate-700 font-medium outline-none focus:border-[#6C5CE7] focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                      ></textarea>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={submitPharmacyOrder}
                        className="bg-[#6C5CE7] hover:bg-[#5a4cdb] text-white px-8 py-3.5 rounded-[16px] text-[14px] font-bold shadow-[0_4px_20px_rgba(108,92,231,0.25)] hover:shadow-[0_8px_25px_rgba(108,92,231,0.35)] transition-all hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Send To Pharmacy
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* --- LAB BUILDER VIEW --- */}
            {activeTab === 'Lab' && (
              <motion.div 
                key="lab-builder"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="max-w-4xl mx-auto space-y-6 pb-20"
              >
                {/* Header & Patient Info */}
                <div className="bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-[20px] font-black text-slate-800 mb-1 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-[#6C5CE7]" /> Lab Request Builder
                      </h2>
                      <p className="text-[13px] text-slate-500 font-medium">Select and request lab tests for the patient</p>
                    </div>
                    <div className="bg-[#F4F4FF] border border-[#EEF2FF] px-5 py-3 rounded-[16px] text-right">
                      <p className="text-[11px] font-bold text-[#6C5CE7] mb-0.5">Active Patient</p>
                      <p className="text-[14px] font-black text-slate-800">Ramesh Kumar <span className="text-[12px] text-slate-400 font-semibold ml-2">#21</span></p>
                    </div>
                  </div>

                  {/* Test Selection Grid */}
                  <div className="mb-8">
                    <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]"></div> Common Tests
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {commonLabTests.map(test => {
                        const isSelected = selectedTests.includes(test);
                        return (
                          <button
                            key={test}
                            onClick={() => handleToggleTest(test)}
                            className={`flex items-center gap-3 p-4 rounded-[16px] border transition-all text-left ${
                              isSelected 
                                ? 'bg-[#F4F4FF] border-[#6C5CE7] text-[#6C5CE7] shadow-sm' 
                                : 'bg-white border-[#EEF2FF] text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected ? 'bg-[#6C5CE7] border-[#6C5CE7]' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-[13px] font-bold leading-tight">{test}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Test Entry */}
                  <div className="mb-8 p-6 bg-slate-50 rounded-[20px] border border-[#EEF2FF]">
                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Other Tests
                    </h3>
                    <form onSubmit={handleAddCustomTest} className="flex gap-3">
                      <input 
                        type="text" 
                        value={customTest}
                        onChange={(e) => setCustomTest(e.target.value)}
                        placeholder="Type test name and press add..." 
                        className="flex-1 bg-white border border-[#EEF2FF] rounded-[12px] px-4 py-3 text-[13px] font-bold text-slate-700 outline-none focus:border-[#6C5CE7] shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                      />
                      <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-[12px] text-[13px] font-bold shadow-sm transition-colors flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </form>

                    {/* Display Custom Tests inside selection */}
                    {selectedTests.filter(t => !commonLabTests.includes(t)).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedTests.filter(t => !commonLabTests.includes(t)).map(test => (
                          <div key={test} className="bg-white border border-[#EEF2FF] px-3 py-1.5 rounded-full text-[12px] font-bold text-slate-700 flex items-center gap-2 shadow-sm">
                            {test}
                            <button onClick={() => handleToggleTest(test)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes & Submit */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2">Instructions for Lab</label>
                      <textarea 
                        rows={3} 
                        value={labNotes}
                        onChange={(e) => setLabNotes(e.target.value)}
                        placeholder="e.g., Patient must fast for 12 hours..."
                        className="w-full border border-[#EEF2FF] bg-slate-50 rounded-[12px] p-4 text-[13px] text-slate-700 font-medium outline-none focus:border-[#6C5CE7] focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                      ></textarea>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-[#EEF2FF] mt-6">
                      <button 
                        onClick={submitLabOrder}
                        className="bg-[#6C5CE7] hover:bg-[#5a4cdb] text-white px-8 py-3.5 rounded-[16px] text-[14px] font-bold shadow-[0_4px_20px_rgba(108,92,231,0.25)] hover:shadow-[0_8px_25px_rgba(108,92,231,0.35)] transition-all hover:-translate-y-0.5 flex items-center gap-2 mt-4"
                      >
                        <Send className="w-4 h-4" /> Send To Laboratory
                      </button>
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
