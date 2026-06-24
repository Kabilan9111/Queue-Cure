import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, User, Stethoscope, Calendar } from 'lucide-react';

export default function BookAppointmentView({ setActiveTab, showToast }) {
  // State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContact: ''
  });

  const [symptoms, setSymptoms] = useState('');

  // Data
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const doctors = [
    { id: 1, name: 'Dr. Priya Sharma', spec: 'Dermatology' },
    { id: 2, name: 'Dr. Arjun Kumar', spec: 'Cardiology' },
    { id: 3, name: 'Dr. Meera Nair', spec: 'Gynecology' },
    { id: 4, name: 'Dr. Raj Patel', spec: 'Orthopedics' },
    { id: 5, name: 'Dr. Amit Verma', spec: 'General Medicine' },
    { id: 6, name: 'Dr. Neha Gupta', spec: 'Neurology' },
    { id: 7, name: 'Dr. Karthik Rao', spec: 'ENT' },
    { id: 8, name: 'Dr. Sarah Joseph', spec: 'Pediatrics' },
  ];

  // Calendar Logic (Mock for current month)
  const daysInMonth = 30;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const currentDay = 24;

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !patientInfo.fullName) {
      showToast('Please complete all required sections.', 'error');
      return;
    }

    const newAppt = {
      id: Date.now(),
      patientId: 1,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.spec,
      appointmentDate: `2026-06-${selectedDate < 10 ? '0'+selectedDate : selectedDate}`,
      slotTime: selectedTime,
      status: 'Pending Approval',
      symptoms,
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
    localStorage.setItem('appointments', JSON.stringify([newAppt, ...existing]));
    
    showToast('Appointment requested! Awaiting reception approval.', 'success');
    setTimeout(() => setActiveTab('My Appointments'), 1500);
  };

  // Glass Styles
  const glassPanel = "bg-white/55 backdrop-blur-[30px] border border-white/70 shadow-[0_20px_60px_rgba(108,92,231,0.12)] rounded-[32px] p-6 lg:p-8";
  const glassInput = "bg-white/40 backdrop-blur-md border border-white/60 focus:border-[#6C5CE7] outline-none rounded-[20px] px-5 py-3.5 text-[14px] text-slate-800 font-medium shadow-sm transition-all placeholder:text-slate-500 w-full";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      className="max-w-[1440px] mx-auto pb-20 px-4 sm:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="mb-10 text-center">
        <h2 className="text-[32px] font-black text-slate-800 tracking-tight">Book an Appointment</h2>
        <p className="text-[15px] font-medium text-slate-500 mt-2">Select a date, time, and specialist to continue.</p>
      </div>

      {/* TOP SECTION: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT: Calendar Selector */}
        <motion.div variants={itemVariants} className={glassPanel}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-extrabold text-slate-800">June 2026</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white/50 border border-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/50 border border-white/80 flex items-center justify-center hover:bg-white transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <span key={d} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-2 text-center">
            {/* Empty slots for offset */}
            <div className="h-10 w-10"></div>
            
            {calendarDays.map(day => {
              const isSelected = selectedDate === day;
              const isToday = currentDay === day;
              const isPast = day < currentDay;

              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => setSelectedDate(day)}
                  className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-[14px] font-bold transition-all relative z-10
                    ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-white/80 cursor-pointer'}
                    ${isToday && !isSelected ? 'text-[#6C5CE7] bg-[#6C5CE7]/10' : ''}
                    ${!isSelected && !isPast && !isToday ? 'text-slate-700' : ''}
                  `}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="selectedDateGlow"
                      className="absolute inset-0 bg-[#6C5CE7] rounded-full shadow-[0_4px_15px_rgba(108,92,231,0.4)] z-[-1]"
                    />
                  )}
                  <span className={isSelected ? 'text-white' : ''}>{day}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CENTER: Time Slot Selector */}
        <motion.div variants={itemVariants} className={glassPanel}>
          <h3 className="text-[18px] font-extrabold text-slate-800 mb-6">Available Times</h3>
          
          {!selectedDate ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center opacity-60">
              <Calendar className="w-10 h-10 text-slate-400 mb-4" />
              <p className="text-[13px] font-bold text-slate-500">Please select a date first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((time, i) => {
                const isSelected = selectedTime === time;
                return (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3.5 rounded-full text-[13px] font-extrabold transition-all border
                      ${isSelected 
                        ? 'bg-gradient-to-r from-[#6C5CE7] to-[#8B7CFF] text-white border-transparent shadow-[0_4px_15px_rgba(108,92,231,0.4)]' 
                        : 'bg-white/40 border-white/80 text-slate-700 hover:bg-white'
                      }
                    `}
                  >
                    {time}
                  </motion.button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* RIGHT: Doctor Selector */}
        <motion.div variants={itemVariants} className={`${glassPanel} flex flex-col h-[400px]`}>
          <h3 className="text-[18px] font-extrabold text-slate-800 mb-6 shrink-0">Select Specialist</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
            {doctors.map(doc => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <motion.div 
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-[20px] cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden
                    ${isSelected 
                      ? 'bg-white border-[#6C5CE7] border-2 shadow-[0_8px_20px_rgba(108,92,231,0.15)]' 
                      : 'bg-white/40 border-white/80 border hover:bg-white/60'
                    }
                  `}
                >
                  {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-[#6C5CE7]"></div>}
                  
                  <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  <div>
                    <h4 className="text-[14px] font-extrabold text-slate-800">{doc.name}</h4>
                    <p className="text-[11px] font-bold text-[#6C5CE7]">{doc.spec}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase tracking-wider">
                      Available
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

      </div>

      {/* BOTTOM SECTION: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Patient Info & Symptoms (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Patient Information Sheet */}
          <motion.div variants={itemVariants} className={glassPanel}>
            <h3 className="text-[18px] font-extrabold text-slate-800 mb-6">Patient Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="text" placeholder="Full Name" className={glassInput} 
                value={patientInfo.fullName} onChange={(e) => setPatientInfo({...patientInfo, fullName: e.target.value})} />
              
              <div className="flex gap-5">
                <input type="number" placeholder="Age" className={glassInput} 
                  value={patientInfo.age} onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})} />
                
                <select className={glassInput} value={patientInfo.gender} onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}>
                  <option value="" disabled>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <input type="text" placeholder="Phone Number" className={glassInput} 
                value={patientInfo.phone} onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})} />
              
              <select className={glassInput} value={patientInfo.bloodGroup} onChange={(e) => setPatientInfo({...patientInfo, bloodGroup: e.target.value})}>
                <option value="" disabled>Blood Group</option>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>

              <input type="text" placeholder="Address" className={`sm:col-span-2 ${glassInput}`} 
                value={patientInfo.address} onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})} />
            </div>
          </motion.div>

          {/* Illness Description Sheet */}
          <motion.div variants={itemVariants} className={glassPanel}>
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="w-5 h-5 text-[#6C5CE7]" />
              <h3 className="text-[18px] font-extrabold text-slate-800">Describe Your Problem</h3>
            </div>
            <textarea 
              className={`${glassInput} min-h-[220px] resize-none`}
              placeholder="Explain your symptoms, pain level, duration, previous history and any concerns in detail..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            ></textarea>
          </motion.div>

        </div>

        {/* RIGHT: AI Preview & Submit (Span 4) */}
        <div className="lg:col-span-4">
          <motion.div variants={itemVariants} className={`${glassPanel} sticky top-28`}>
            <h3 className="text-[16px] font-extrabold text-slate-800 mb-6 border-b border-white pb-4">Booking Summary</h3>
            
            <div className="space-y-5 mb-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Selected Doctor</p>
                <p className="text-[15px] font-bold text-slate-800">{selectedDoctor ? selectedDoctor.name : <span className="text-slate-300">Pending Selection</span>}</p>
                {selectedDoctor && <p className="text-[12px] font-bold text-[#6C5CE7]">{selectedDoctor.spec}</p>}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                <p className="text-[15px] font-bold text-slate-800">
                  {selectedDate ? `June ${selectedDate}, 2026` : <span className="text-slate-300">Pending Date</span>}
                </p>
                <p className="text-[15px] font-bold text-slate-800">
                  {selectedTime || <span className="text-slate-300">Pending Time</span>}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Initial Status</p>
                <span className="inline-flex items-center gap-2 bg-orange-50/80 border border-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-[11px] font-bold mt-1 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  Waiting for Reception Approval
                </span>
                <p className="text-[10px] text-slate-500 font-medium mt-3 leading-relaxed">
                  Tokens and wait times are assigned securely by the receptionist upon approval.
                </p>
              </div>
            </div>

            <motion.button 
              onClick={handleSubmit}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CFF] text-white py-4 rounded-[24px] text-[15px] font-black shadow-[0_10px_30px_rgba(108,92,231,0.3)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.4)] transition-all flex items-center justify-center gap-2"
            >
              Request Appointment <CheckCircle2 className="w-5 h-5" />
            </motion.button>

          </motion.div>
        </div>

      </div>

    </motion.div>
  );
}
