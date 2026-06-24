import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Search, Bell, Activity } from 'lucide-react';

export default function LabDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('labOrders') || '[]');
    setOrders(savedOrders);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('labOrders', JSON.stringify(updated));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending':
        return <span className="bg-amber-50 text-amber-500 border border-amber-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Pending</span>;
      case 'Waiting Sample':
        return <span className="bg-blue-50 text-blue-500 border border-blue-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Waiting Sample</span>;
      case 'Processing':
        return <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Processing</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-500 border border-emerald-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Completed</span>;
      default:
        return <span className="bg-slate-50 text-slate-500 border border-slate-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.patientName.toLowerCase().includes(search.toLowerCase()) || o.patientToken.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col font-sans text-slate-800 selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7]">
      {/* HEADER */}
      <header className="h-[80px] bg-white border-b border-[#EEF2FF] flex items-center justify-between px-8 lg:px-10 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shadow-[0_4px_16px_rgba(108,92,231,0.3)]">
            <FlaskConical className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-extrabold text-[16px] leading-tight text-slate-800 tracking-tight">SmartClinic AI</h1>
            <p className="text-[10px] text-[#6C5CE7] font-bold tracking-wide mt-0.5">Lab Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer hover:bg-slate-50 p-2.5 rounded-full transition-colors border border-transparent hover:border-[#EEF2FF]">
            <Bell className="w-5 h-5 text-slate-500" />
          </div>
          <div className="flex items-center gap-3 cursor-pointer group pl-2 border-l border-slate-100">
            <div className="text-right pr-1">
              <p className="text-[13px] font-bold text-slate-800 leading-tight">Central Lab</p>
            </div>
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:border-[#6C5CE7] transition-colors bg-gradient-to-tr from-cyan-200 to-blue-200 flex items-center justify-center text-cyan-700 font-bold text-[14px]">
              LB
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] border border-[#EEF2FF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[calc(100vh-140px)]"
        >
          <div className="p-8 border-b border-[#EEF2FF]">
            <h2 className="text-[20px] font-black text-slate-800 mb-1">Lab Requests</h2>
            <p className="text-[13px] text-slate-500 font-medium">Manage tests requested by doctors</p>
            
            <div className="flex items-center gap-6 mt-8">
              {['All', 'Pending', 'Waiting Sample', 'Processing', 'Completed'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13px] font-bold pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#6C5CE7] text-[#6C5CE7]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {tab !== 'All' && orders.filter(o => o.status === tab).length > 0 && (
                    <span className="ml-1 bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full">
                      {orders.filter(o => o.status === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by patient name or token..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EEF2FF] rounded-[12px] text-[13px] font-medium text-slate-700 outline-none shadow-sm focus:border-[#6C5CE7]" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-10">
                <Activity className="w-12 h-12 mb-4 text-slate-200" />
                <p className="font-bold text-[14px]">No lab requests found</p>
                <p className="text-[12px]">New requests will appear here automatically.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                    <th className="py-4 pl-8">Token</th>
                    <th className="py-4">Patient Name</th>
                    <th className="py-4">Tests Requested</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="border-b border-slate-50 hover:bg-[#FAFBFF] transition-colors group"
                      >
                        <td className="py-6 pl-8 text-[#6C5CE7] text-[14px]">{order.patientToken}</td>
                        <td className="py-6">
                          <p className="text-slate-800">{order.patientName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Dr. {order.doctorName}</p>
                        </td>
                        <td className="py-6">
                          <div className="space-y-1">
                            {order.tests.map((t, i) => (
                              <p key={i} className="text-[12px] font-semibold text-slate-600 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div> {t}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-6">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-6">
                          <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            {order.status === 'Pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Waiting Sample')}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors"
                              >
                                Request Sample
                              </button>
                            )}
                            {order.status === 'Waiting Sample' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Processing')}
                                className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors"
                              >
                                Start Processing
                              </button>
                            )}
                            {order.status === 'Processing' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Completed')}
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors"
                              >
                                Mark Completed
                              </button>
                            )}
                            {order.status === 'Completed' && (
                              <span className="text-slate-300 text-[11px] font-bold px-2 py-1">All Done</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
