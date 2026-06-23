import React, { useState } from 'react';
import { 
  Activity, 
  BrainCircuit, 
  CalendarCheck, 
  Pill, 
  Workflow, 
  UserSquare2, 
  Stethoscope, 
  User, 
  FlaskConical, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import illustration from './assets/illustration.png';

export default function App() {
  const [selectedRole, setSelectedRole] = useState('Receptionist');
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: "Smart Triage & Prioritization",
      desc: "AI scores symptoms and prioritizes patients by urgency",
      bgColor: "bg-primary/10"
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-green-500" />,
      title: "Predictive Overbooking",
      desc: "Reduce no-shows and maximize doctor availability",
      bgColor: "bg-green-500/10"
    },
    {
      icon: <Pill className="w-6 h-6 text-orange-500" />,
      title: "Pre-emptive Pharmacy",
      desc: "Medicines prepared in advance for zero-wait pickup",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: <Workflow className="w-6 h-6 text-accent" />,
      title: "Exit Flow Optimizer",
      desc: "Optimize post-consultation flow across billing, lab and pharmacy",
      bgColor: "bg-accent/10"
    }
  ];

  const roles = [
    {
      id: 'Receptionist',
      icon: <UserSquare2 className="w-8 h-8" />,
      title: "Receptionist",
      desc: "Manage bookings, triage & tokens"
    },
    {
      id: 'Doctor',
      icon: <Stethoscope className="w-8 h-8 text-green-600" />,
      title: "Doctor",
      desc: "Consult patients & prescribe"
    },
    {
      id: 'Patient',
      icon: <User className="w-8 h-8 text-blue-500" />,
      title: "Patient",
      desc: "Book appointment & track queue"
    },
    {
      id: 'Lab',
      icon: <FlaskConical className="w-8 h-8 text-orange-500" />,
      title: "Lab",
      desc: "Manage tests & reports"
    },
    {
      id: 'Pharmacy',
      icon: <Pill className="w-8 h-8 text-rose-500" />,
      title: "Pharmacy",
      desc: "Manage medicines & prescriptions"
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#F6F8FD] font-sans selection:bg-primary/20 selection:text-primary">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col w-[40%] px-12 py-10 justify-between relative overflow-hidden bg-white/40">
        {/* Abstract Background Element */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="z-10 flex flex-col h-full">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">SmartClinic AI</h1>
              <p className="text-sm text-slate-500 font-medium">Smarter Care. Zero Wait.</p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">
              AI-Powered Clinic <br />Flow Optimization
            </h2>
            <p className="text-slate-600 text-base leading-relaxed pr-8">
              Streamline patient flow, reduce wait times and deliver exceptional care.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col gap-4 mb-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/80 hover:shadow-sm cursor-default">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${feature.bgColor}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Illustration */}
          <div className="mt-8 relative -mx-4 -mb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8FD] to-transparent z-10 h-24 bottom-0 top-auto"></div>
            <img src={illustration} alt="Clinic Illustration" className="w-full h-auto object-cover opacity-90 mix-blend-multiply" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Subtle decorative blob */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[800px] glass-panel rounded-[2rem] p-8 lg:p-12 z-10">
          
          {/* Top Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Welcome Back!</h2>
            <p className="text-slate-500">Login to access your dashboard</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Select Your Role</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {roles.map((role) => {
                const isActive = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'role-card-active bg-white' 
                        : 'role-card-inactive bg-white/50 text-slate-600'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`mb-3 ${isActive ? 'text-primary' : ''}`}>
                      {role.icon}
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                      {role.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-tight hidden md:block">
                      {role.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-xs font-medium text-slate-400">OR</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Enter your email or username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Enter your password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded group-hover:border-primary transition-colors">
                  <input type="checkbox" className="peer opacity-0 absolute inset-0 cursor-pointer" />
                  <CheckCircle2 className="w-4 h-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              
              <a href="#" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                Forgot Password?
              </a>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <a href="#" className="text-primary hover:text-secondary font-semibold ml-1">Contact Admin</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
