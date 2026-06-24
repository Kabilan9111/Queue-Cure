import React from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, DoorOpen, Users, Hash } from 'lucide-react';

export default function DoctorsView() {
  const doctors = [
    { id: 1, name: 'Dr. Priya Sharma', spec: 'Dermatology', room: 'Room 402', count: 14, token: '#410', status: 'Available' },
    { id: 2, name: 'Dr. Arjun Kumar', spec: 'Cardiology', room: 'Room 201', count: 8, token: '#205', status: 'Available' },
    { id: 3, name: 'Dr. Meera Nair', spec: 'Gynecology', room: 'Room 305', count: 22, token: '#318', status: 'Busy' },
    { id: 4, name: 'Dr. Raj Patel', spec: 'Orthopedics', room: 'Room 105', count: 11, token: '#108', status: 'Available' },
    { id: 5, name: 'Dr. Amit Verma', spec: 'General Medicine', room: 'Room 101', count: 35, token: '#130', status: 'Busy' },
    { id: 6, name: 'Dr. Neha Gupta', spec: 'Neurology', room: 'Room 501', count: 5, token: '#502', status: 'Available' },
    { id: 7, name: 'Dr. Karthik Rao', spec: 'ENT', room: 'Room 208', count: 19, token: '#215', status: 'Available' },
    { id: 8, name: 'Dr. Sarah Joseph', spec: 'Pediatrics', room: 'Room 302', count: 27, token: '#322', status: 'Busy' },
  ];

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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-[16px] bg-[#F4F4FF] text-[#6C5CE7] flex items-center justify-center border border-[#6C5CE7]/10 shadow-sm">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-slate-800">Specialist Doctors Overview</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Live tracking of doctor availability and current load.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map(doc => (
          <motion.div 
            key={doc.id}
            variants={itemVariants}
            className="bg-white rounded-[24px] p-6 border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(108,92,231,0.08)] transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-extrabold text-slate-800">{doc.name}</h3>
                  <p className="text-[11px] font-bold text-[#6C5CE7]">{doc.spec}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold border ${
                doc.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#FAFBFF] p-3 rounded-xl border border-[#EEF2FF]">
                <div className="flex items-center gap-2 text-slate-500">
                  <DoorOpen className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Room</span>
                </div>
                <span className="text-[13px] font-black text-slate-800">{doc.room}</span>
              </div>

              <div className="flex items-center justify-between bg-[#FAFBFF] p-3 rounded-xl border border-[#EEF2FF]">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today's Load</span>
                </div>
                <span className="text-[13px] font-black text-slate-800">{doc.count} Patients</span>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-r from-[#6C5CE7]/10 to-[#8B7CFF]/10 p-3 rounded-xl border border-[#6C5CE7]/20">
                <div className="flex items-center gap-2 text-[#6C5CE7]">
                  <Hash className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Serving Now</span>
                </div>
                <span className="text-[15px] font-black text-[#6C5CE7] bg-white px-2 py-0.5 rounded shadow-sm">
                  {doc.token}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
