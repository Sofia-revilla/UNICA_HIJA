import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, User, Bed, Activity, DollarSign, Package, AlertTriangle, 
  Search, Plus, Bell, Settings, LayoutDashboard, Database, 
  Stethoscope, FlaskConical, Pill, Receipt, History, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { REVENUE_DATA, ADMISSION_TRENDS } from './constants';
import { DataProvider, useData } from './context/DataContext';
import { ProfileView } from './components/ProfileView';

const Logo = () => (
  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-wah-lavender/30 shadow-xl p-1.5 overflow-hidden transition-transform hover:scale-110 duration-500">
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full">
      <Activity size={24} className="text-white drop-shadow-md" />
      <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, description, active, onClick }: { icon: any, label: string, description?: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative group flex flex-col items-center justify-center w-full px-1 py-3 rounded-xl transition-all duration-300 outline-none gap-1.5",
      active ? "bg-wah-purple text-white shadow-lg shadow-wah-purple/20" : "text-text-muted hover:text-foreground hover:bg-glass-bg"
    )}
  >
    <Icon size={24} className={cn("transition-transform group-hover:scale-110")} />
    <span className="text-[9px] font-black uppercase tracking-tight text-center leading-none px-1">{label}</span>
    
    <AnimatePresence>
      <div className="absolute left-24 px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[100] shadow-2xl w-52 scale-90 group-hover:scale-100 origin-left translate-x-2 group-hover:translate-x-0">
        <p className="text-xs font-bold mb-1 text-wah-neon">MODULE: {label}</p>
        <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{description || `Access and manage ${label.toLowerCase()} records.`}</p>
      </div>
    </AnimatePresence>
    
    {active && <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-10 bg-white rounded-r-full" />}
  </button>
);

const LoginScreen = ({ onLogin }: { onLogin: (role: 'Doctor' | 'Nurse' | 'IT', name: string, department?: string, license?: string) => void }) => {
  const [mode, setMode] = React.useState<'select' | 'login' | 'signup' | 'verify'>('select');
  const [selectedRole, setSelectedRole] = React.useState<'Doctor' | 'Nurse' | 'IT' | null>(null);
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [license, setLicense] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [secureCode, setSecureCode] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !selectedRole) return;
    
    setIsLoading(true);
    // fake delay so it feels like a real login
    setTimeout(() => {
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setSecureCode(generatedCode);
      setVerificationCode('');
      setVerificationError('');
      setMode('verify');
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== secureCode) {
      setVerificationError("Verification passkey is invalid or has expired.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin(selectedRole!, name, department, license);
      setIsLoading(false);
    }, 1200);
  };

  const resetForm = () => {
    setMode('select');
    setSelectedRole(null);
    setName('');
    setPassword('');
    setDepartment('');
    setLicense('');
    setVerificationCode('');
    setVerificationError('');
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[200] p-4 lg:p-10 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 glass rounded-[3rem] overflow-hidden shadow-2xl border-2 border-wah-lavender/20"
      >
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-wah-purple via-indigo-600 to-indigo-800 text-white relative overflow-hidden">
           <div className="relative z-10">
             <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-10 backdrop-blur-md border border-white/20 shadow-2xl rotate-3">
               <Activity size={40} className="text-white drop-shadow-glow" />
             </div>
             <h1 className="text-5xl font-black mb-6 tracking-tighter leading-none">
               WAH<span className="text-wah-accent">2</span><span className="text-wah-neon">.0</span>
             </h1>
             <div className="space-y-4 max-w-sm">
                <p className="text-xl text-wah-lavender font-medium leading-tight">
                  Professional Hospital Management
                </p>
                <div className="h-1 w-20 bg-wah-neon rounded-full" />
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  Experience a seamless, clinical-grade interface designed for speed and clarity. Empowering healthcare heroes with real-time data.
                </p>
             </div>
             <div className="mt-auto pt-8">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                 © UNICA-HIJA
               </p>
               <p className="text-[8px] font-mono text-white/20 tracking-widest mt-0.5">
                 WAH2.0 · HOSPITAL MANAGEMENT SYSTEM
               </p>
             </div>
           </div>
           <Activity size={400} className="absolute -bottom-24 -right-24 text-white/5 rotate-12" />
           <div className="absolute top-0 right-0 w-64 h-64 bg-wah-neon/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        
        <div className="p-8 lg:p-16 bg-card-bg flex flex-col justify-center relative min-h-[700px]">
           <AnimatePresence mode="wait">
             {mode === 'select' ? (
               <motion.div 
                 key="role-selection"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="w-full"
               >
                 <div className="mb-12">
                   <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight text-center md:text-left">System Access</h2>
                   <p className="text-text-muted text-sm font-medium text-center md:text-left">Select your portal to begin</p>
                 </div>
                 
                 <div className="space-y-5">
                    <button 
                      onClick={() => { setSelectedRole('Doctor'); setMode('login'); }}
                      className="w-full group flex items-center gap-6 p-6 rounded-[2rem] border-2 border-glass-border hover:border-wah-purple hover:bg-wah-purple/5 transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-wah-purple/10 text-wah-purple flex items-center justify-center group-hover:bg-wah-purple group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                        <Stethoscope size={32} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl leading-tight text-foreground">Doctor's Portal</h3>
                        <p className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest">Clinical Care</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setSelectedRole('Nurse'); setMode('login'); }}
                      className="w-full group flex items-center gap-6 p-6 rounded-[2rem] border-2 border-glass-border hover:border-wah-neon hover:bg-wah-neon/5 transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-wah-neon/10 text-wah-neon flex items-center justify-center group-hover:bg-wah-neon group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                        <Users size={32} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl leading-tight text-foreground">Nurse's Portal</h3>
                        <p className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest">Ward Operations</p>
                      </div>
                    </button>

                     <button 
                       onClick={() => { setSelectedRole('IT'); setMode('login'); }}
                       className="w-full group flex items-center gap-6 p-6 rounded-[2rem] border-2 border-glass-border hover:border-rose-500 hover:bg-rose-500/5 transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                     >
                       <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                         <Database size={32} />
                       </div>
                       <div>
                         <h3 className="font-black text-xl leading-tight text-foreground">Administrator Portal</h3>
                         <p className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest">System Diagnostics</p>
                       </div>
                     </button>
                    
                    <div className="pt-8 text-center">
                      <button 
                        onClick={() => setMode('signup')}
                        className="text-wah-purple font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                      >
                        Create New Staff Account
                      </button>
                    </div>
                 </div>
               </motion.div>
              ) : mode === 'verify' ? (
                <motion.div 
                  key="verify-challenge"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  className="w-full space-y-6"
                >
                  <button 
                    onClick={() => { setMode('login'); setVerificationCode(''); setVerificationError(''); }}
                    className="flex items-center gap-2 text-text-muted hover:text-wah-purple transition-colors mb-4 font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                    <Activity size={14} className="rotate-180" />
                    Back to authentication
                  </button>

                  <div className="mb-6">
                    <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                      Security Verification Gate
                    </span>
                    <h2 className="text-3xl font-black text-foreground tracking-tight mt-2">
                      Access Key Verification
                    </h2>
                    <p className="text-text-muted text-sm font-medium mt-1 leading-relaxed">
                      A two-factor validation challenge has been dispatched. Enter the access key to authorize this terminal session.
                    </p>
                  </div>

                  <div className="p-5 bg-wah-purple/10 border border-wah-purple/20 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-wah-neon animate-pulse" />
                      <span className="text-[9px] font-mono font-black text-wah-neon uppercase tracking-wider block">Security Token Channel [STAFF-BADGE]:</span>
                    </div>
                    <div className="text-xs font-mono text-text-secondary leading-relaxed font-bold">
                      WAH2.0 DISPATCHED ACCESS KEY: <span className="text-white px-3 py-1.5 bg-wah-purple rounded-xl font-black text-sm tracking-widest shadow-md">{secureCode}</span>
                    </div>
                  </div>

                  <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-0.5">Verification Pin Code</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-wah-purple transition-colors">
                          <Activity size={18} />
                        </div>
                        <input 
                          type="text" 
                          maxLength={4}
                          value={verificationCode}
                          onChange={(e) => {
                            setVerificationCode(e.target.value.replace(/\D/g, ''));
                            setVerificationError('');
                          }}
                          placeholder="••••"
                          className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 pl-14 pr-6 text-foreground font-mono font-black tracking-[0.5em] text-center text-xl transition-all placeholder:font-sans placeholder:tracking-normal placeholder:text-sm placeholder:text-text-muted/60"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    {verificationError && (
                      <p className="text-xs text-red-500 font-bold tracking-tight bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl animate-bounce">
                        🚨 {verificationError}
                      </p>
                    )}

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 mt-4",
                        selectedRole === 'Doctor' ? "bg-wah-purple hover:bg-wah-purple/90" : "bg-wah-neon hover:bg-wah-neon/90",
                        isLoading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying Passkey...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Access System</span>
                          <Activity size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
               <motion.div 
                 key="auth-form"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="w-full"
               >
                 <button 
                   onClick={resetForm}
                   className="flex items-center gap-2 text-text-muted hover:text-wah-purple transition-colors mb-6 font-black text-[10px] uppercase tracking-[0.2em]"
                 >
                   <Activity size={14} className="rotate-180" />
                   Go Back
                 </button>

                 <div className="mb-8">
                   <div className="flex items-center gap-3 mb-2">
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                       mode === 'signup' ? "bg-wah-accent/20 text-wah-purple" : 
                       (selectedRole === 'Doctor' ? "bg-wah-purple/10 text-wah-purple" : selectedRole === 'IT' ? "bg-rose-500/10 text-rose-500" : "bg-wah-neon/10 text-wah-neon")
                     )}>
                       {mode === 'signup' ? 'New Staff' : selectedRole === 'IT' ? 'Administrator Portal' : `${selectedRole} Portal`}
                     </span>
                   </div>
                   <h2 className="text-3xl font-black text-foreground tracking-tight">
                     {mode === 'signup' ? 'New Staff' : 'Staff Login'}
                   </h2>
                   <p className="text-text-muted text-sm font-medium mt-1">
                     {mode === 'signup' ? 'Register your credentials in the medical directory' : 'Enter your assigned medical credentials'}
                   </p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4">
                   {mode === 'signup' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Staff Role</label>
                          <select 
                            value={selectedRole || ''}
                            onChange={(e) => setSelectedRole(e.target.value as any)}
                            className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 px-4 text-foreground font-medium text-sm appearance-none"
                            required
                          >
                            <option value="">Select Role</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                            <option value="IT">Administrator</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Department</label>
                          <input 
                            type="text" 
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Cardiology"
                            className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 px-4 text-foreground font-medium text-sm"
                            required
                          />
                        </div>
                     </div>
                   )}

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                     <div className="relative group">
                       <div className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-wah-purple transition-colors">
                         <Users size={18} />
                       </div>
                       <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         placeholder={selectedRole === 'Doctor' ? "e.g. Dr. Jonathan Smith" : "e.g. Sarah Johnson"}
                         className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 pl-14 pr-6 text-foreground font-medium transition-all text-sm"
                         required
                       />
                     </div>
                   </div>

                   {mode === 'signup' && (
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">License / Employee ID</label>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-wah-purple transition-colors">
                           <LayoutDashboard size={18} />
                         </div>
                         <input 
                           type="text" 
                           value={license}
                           onChange={(e) => setLicense(e.target.value)}
                           placeholder="MED-XXXX-XXXX"
                           className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 pl-14 pr-6 text-foreground font-medium transition-all text-sm"
                           required
                         />
                       </div>
                     </div>
                   )}

                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Access PIN / Password</label>
                     <div className="relative group">
                       <div className="absolute inset-y-0 left-5 flex items-center text-text-muted group-focus-within:text-wah-purple transition-colors">
                         <Activity size={18} />
                       </div>
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••"
                         className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-2xl py-3.5 pl-14 pr-6 text-foreground font-medium transition-all text-sm"
                         required
                       />
                     </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={isLoading}
                     className={cn(
                       "w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 mt-4",
                       selectedRole === 'Doctor' ? "bg-wah-purple hover:bg-wah-purple/90" : "bg-wah-neon hover:bg-wah-neon/90",
                       isLoading && "opacity-70 cursor-not-allowed"
                     )}
                   >
                     {isLoading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         <span>Processing...</span>
                       </>
                     ) : (
                       <>
                         <span>{mode === 'signup' ? 'Create Account' : 'Open Portal'}</span>
                         <Activity size={16} />
                       </>
                     )}
                   </button>
                 </form>
                 
                 {mode === 'login' && (
                   <div className="mt-6 text-center">
                     <button 
                        onClick={() => setMode('signup')}
                        className="text-text-muted text-[9px] font-bold uppercase tracking-widest hover:text-wah-purple transition-colors"
                     >
                       New employee? <span className="text-wah-purple">Create account</span>
                     </button>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
           
           <div className="mt-auto pt-8 border-t border-glass-border flex items-center justify-between">
              <div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                  Secure Access • v2.41
                </p>
                <p className="text-[9px] text-wah-purple/60 font-black uppercase tracking-[0.25em] mt-0.5">
                  UNICA-HIJA
                </p>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-text-muted uppercase">Server: Online</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon: Icon, trend }: { title: string, value: string, sub: string, icon: any, trend?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass rounded-2xl p-5 relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl bg-wah-purple/20 text-wah-neon">
        <Icon size={22} />
      </div>
      {trend && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-wah-neon bg-wah-neon/10 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
      <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
      <p className="text-xs text-text-muted font-mono uppercase tracking-widest">{sub}</p>
    </div>
    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-wah-purple">
      <Icon size={120} />
    </div>
  </motion.div>
);

const PatientCard = ({ patient }: { patient: (typeof PATIENTS)[0]; key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-card-bg rounded-2xl p-4 purple-shadow group hover:ring-2 hover:ring-wah-purple/20 transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full border-2 border-wah-lavender shadow-inner" />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
          patient.status === 'Critical' ? 'bg-red-500 animate-pulse' : 
          patient.status === 'Stable' ? 'bg-green-500' : 'bg-orange-400'
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-foreground font-semibold truncate leading-tight">{patient.name}</h4>
        <p className="text-xs text-text-secondary font-mono">{patient.id}</p>
      </div>
      <button className="bg-wah-lavender text-wah-purple hover:bg-wah-purple hover:text-white transition-colors p-2 rounded-xl text-[10px] font-bold uppercase tracking-widest px-3">
        JOIN
      </button>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between items-end text-[10px] uppercase tracking-wider font-bold">
        <span className="text-text-muted">MEWS SCORE</span>
        <span className={cn(
          patient.mewsScore > 5 ? 'text-red-500' : patient.mewsScore > 3 ? 'text-orange-500' : 'text-wah-purple'
        )}>
          {patient.mewsScore}/10
        </span>
      </div>
      <div className="w-full h-1.5 bg-background border border-glass-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(patient.mewsScore / 10) * 100}%` }}
          className={cn(
            "h-full rounded-full",
            patient.mewsScore > 5 ? 'bg-red-500' : patient.mewsScore > 3 ? 'bg-orange-500' : 'bg-wah-purple'
          )} 
        />
      </div>
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-background text-text-muted border border-glass-border rounded-md text-[9px] font-bold uppercase">
          {patient.department}
        </span>
        <span className="px-2 py-1 bg-background text-text-muted border border-glass-border rounded-md text-[9px] font-bold uppercase">
          {patient.age} Y/O
        </span>
      </div>
    </div>
  </motion.div>
);

const InventoryRow = ({ item }: { item: (typeof INVENTORY)[0]; key?: any }) => (
  <tr className="border-b border-glass-border hover:bg-glass-bg transition-colors group">
    <td className="py-4 pl-4 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          item.category === 'Medication' ? "bg-blue-500/10 text-blue-600" : 
          item.category === 'Supply' ? "bg-amber-500/10 text-amber-600" : "bg-wah-purple/10 text-wah-purple"
        )}>
          {item.category === 'Medication' ? <Pill size={16} /> : item.category === 'Supply' ? <Package size={16} /> : <Database size={16} />}
        </div>
        <div>
          <div className="font-medium text-foreground">{item.name}</div>
          <div className="text-[10px] text-text-muted uppercase font-mono">{item.id}</div>
        </div>
      </div>
    </td>
    <td className="py-4 text-text-secondary text-sm font-mono">{item.stock} {item.unit}</td>
    <td className="py-4">
      <div className="w-24 h-1.5 bg-glass-bg rounded-full overflow-hidden border border-glass-border">
        <div 
          className={cn(
            "h-full rounded-full",
            item.status === 'Critical' ? 'bg-red-500' : item.status === 'Low' ? 'bg-orange-500' : 'bg-green-500'
          )}
          style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
        />
      </div>
    </td>
    <td className="py-4">
      <span className={cn(
        "px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider",
        item.status === 'Critical' ? 'bg-red-500/10 text-red-600 font-black' : 
        item.status === 'Low' ? 'bg-orange-500/10 text-orange-600 font-black' : 
        'bg-green-500/10 text-green-600 font-black'
      )}>
        {item.status}
      </span>
    </td>
    <td className="py-4">
      <button className="text-text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 p-2">
        <History size={16} />
      </button>
    </td>
  </tr>
);

const DashboardView = ({ isLight }: { isLight: boolean }) => {
  const { patients, inventory } = useData();
  return (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Tuesday, May 5, 2026</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Hospital Operations Center</h2>
      </div>
      <div className="glass px-4 py-2 rounded-xl flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-wah-neon animate-pulse" />
        <span className="text-xs font-mono text-text-secondary">CONNECTIVITY: OPTIMAL</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Patients" value="1,248" sub="ADMITTED ACTIVE" icon={Users} trend="+12%" />
      <StatCard title="Bed Occupancy" value="84%" sub="WEST WARD FULL" icon={Bed} trend="STABLE" />
      <StatCard title="MEWS Alerts" value="03" sub="REQUIRES ATTENTION" icon={Activity} trend="CRITICAL" />
      <StatCard title="Daily Revenue" value="₱ 242,500" sub="PENDING FILING" icon={DollarSign} trend="+8.4%" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 flex flex-col gap-8">
        <div className="glass rounded-[2rem] p-8 border-wah-lavender/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Revenue & Admissions</h3>
              <p className="text-xs text-text-muted font-mono tracking-widest uppercase">7-Day Analysis</p>
            </div>
            <select className="bg-background border border-glass-border rounded-lg px-3 py-1.5 text-xs text-text-secondary focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-wah-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-wah-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-glass-border)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₱${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isLight ? '#ffffff' : '#0f0a1e', 
                    border: '1px solid var(--color-glass-border)', 
                    borderRadius: '12px',
                    color: 'var(--color-foreground)'
                  }} 
                  itemStyle={{ color: 'var(--color-wah-purple)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-wah-neon)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Inventory Status</h3>
              <p className="text-xs text-text-muted font-mono tracking-widest uppercase">Stock Watchlist</p>
            </div>
            <button className="text-wah-neon text-xs font-bold hover:underline">VIEW ALL</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-text-muted text-[10px] uppercase tracking-widest border-b border-glass-border">
                  <th className="pb-4 pl-4 font-bold">ITEM NAME</th>
                  <th className="pb-4 font-bold">QUANTITY</th>
                  <th className="pb-4 font-bold">STOCK LEVEL</th>
                  <th className="pb-4 font-bold">STATUS</th>
                  <th className="pb-4 font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 4).map(item => <InventoryRow key={item.id} item={item} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between p-2 glass rounded-full px-6">
          <span className="text-xs font-bold tracking-widest uppercase text-text-muted">Active Cases</span>
          <span className="w-5 h-5 flex items-center justify-center bg-wah-purple text-white rounded-full text-[10px] font-bold">12</span>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-320px)] lg:max-h-[800px] hide-scrollbar pr-1 pb-10">
          {patients.map(patient => <PatientCard key={patient.id} patient={patient} />)}
          
          <div className="p-6 glass rounded-3xl border-dashed border-glass-border flex flex-col items-center justify-center text-center gap-3">
             <div className="w-10 h-10 rounded-full bg-glass-bg flex items-center justify-center text-text-muted">
                <Plus size={20} />
             </div>
             <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">End of Daily Feed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const LaboratoryView = ({ isLight }: { isLight: boolean }) => {
  const { inventory, labTests } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Laboratory Information System</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Diagnostic Workflows</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatCard title="Pending Tests" value="12" sub="LAB WORKLIST" icon={FlaskConical} trend="BUSY" />
      <StatCard title="Tests Processed" value="48" sub="LAST 24 HOURS" icon={Activity} />
      <StatCard title="Critical Results" value="02" sub="NOTIFY DOCTOR" icon={AlertTriangle} trend="URGENT" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold">Laboratory Worklist</h3>
          <div className="flex bg-glass-bg p-1 rounded-xl border border-glass-border">
             <button className="px-4 py-1.5 bg-wah-purple rounded-lg text-[10px] font-bold uppercase transition-all text-white shadow-sm">Queue</button>
             <button className="px-4 py-1.5 text-text-muted rounded-lg text-[10px] font-bold uppercase transition-all hover:text-foreground">Results</button>
          </div>
        </div>
        <div className="space-y-4">
          {labTests.map(test => (
            <div key={test.id} className="bg-glass-bg border border-glass-border rounded-2xl p-5 flex items-center justify-between group hover:border-wah-purple/50 transition-all">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  test.status === 'Completed' ? "bg-green-500/10 text-green-600" : "bg-wah-purple/10 text-wah-purple"
                )}>
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground tracking-tight">{test.test}</h4>
                  <p className="text-xs text-text-muted font-medium">{test.patient}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-1",
                    test.priority === 'Urgent' ? "text-red-500 font-black" : "text-text-muted"
                  )}>{test.priority}</div>
                  <div className="text-xs text-text-muted font-mono">{test.id}</div>
                </div>
                <div className="text-right min-w-[100px]">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider",
                    test.status === 'Completed' ? "bg-green-500/20 text-green-600" : "bg-wah-purple/20 text-wah-purple font-black"
                  )}>{test.status}</span>
                </div>
                <button className="bg-wah-purple text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wah-neon transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-wah-purple/20">
                  {test.status === 'Completed' ? 'VIEW' : 'PROCESS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
        <div className="glass rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Testing Slots</h3>
            <span className="text-[10px] font-bold text-wah-neon bg-wah-neon/10 px-2 py-0.5 rounded-full tracking-widest">REAL-TIME</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className={cn(
                  "aspect-square rounded-xl flex items-center justify-center border transition-all",
                  i < 5 ? "bg-wah-purple/20 border-wah-purple/50 text-wah-purple" : "bg-glass-bg border-glass-border text-text-muted"
                )}>
                  <Activity size={14} />
                </div>
                <div className="text-[8px] text-center font-bold text-text-muted font-mono">B-0{i+1}</div>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-bold mb-4">Lab Inventory</h3>
          <div className="space-y-6">
            {inventory.filter(i => i.category !== 'Medication').map(item => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className="text-text-muted uppercase font-mono">{item.stock} {item.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-glass-bg rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className="h-full bg-wah-neon shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                  />
                </div>
              </div>
            ))}
            <button className="w-full mt-4 py-3.5 bg-glass-bg border border-glass-border rounded-2xl text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-glass-bg/80 hover:border-wah-purple transition-all">
              MANAGE REAGENTS
            </button>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-wah-purple/10 rounded-3xl border border-glass-border">
           <h4 className="text-sm font-bold mb-2">Automated Calibration</h4>
           <p className="text-xs text-text-muted leading-relaxed mb-4">Hematology analyzer scheduled for maintenance in 48 hours.</p>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Status: Ready</span>
              <Settings size={14} className="text-text-muted" />
           </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const BedManagementView = ({ isLight }: { isLight: boolean }) => {
  const { wards } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Facility Management</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Bed Management Board</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatCard title="Total Beds" value="70" sub="HOSPITAL CAPACITY" icon={Bed} />
      <StatCard title="Available" value="23" sub="READY FOR ADMISSION" icon={Plus} trend="OPEN" />
      <StatCard title="Waitlist" value="08" sub="PENDING ER" icon={History} trend="URGENT" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">Wards & Occupancy</h3>
            <p className="text-xs text-text-muted font-mono tracking-widest uppercase font-black">Visual Grid Layout</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-wah-purple shadow-lg shadow-wah-purple/50" />
               <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Occupied</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-glass-bg border border-glass-border" />
               <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Available</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wards.map(ward => (
            <div key={ward.id} className="bg-glass-bg border border-glass-border rounded-[2rem] p-6 hover:border-wah-lavender/30 transition-all cursor-pointer group hover:bg-glass-bg/80">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-foreground tracking-tight">{ward.name}</h4>
                  <p className="text-[10px] text-text-muted uppercase font-mono tracking-widest font-black">{ward.type}</p>
                </div>
                <span className="bg-wah-purple/10 px-3 py-1 rounded-full text-[10px] font-bold text-wah-purple border border-wah-lavender/20">
                  {ward.occupied}/{ward.capacity} BEDS
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-2.5">
                {[...Array(ward.capacity)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "aspect-square rounded-lg transition-all duration-300",
                      i < ward.occupied ? "bg-wah-purple shadow-md ring-1 ring-white/10" : "bg-glass-bg border border-glass-border"
                    )}
                  />
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1 mr-6">
                  <div className="h-1.5 bg-glass-bg rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(ward.occupied/ward.capacity)*100}%` }}
                      className="h-full bg-wah-neon" 
                    />
                  </div>
                </div>
                <button className="bg-white text-wah-deep px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-xl">MANAGE</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
        <div className="glass rounded-[2rem] p-8">
          <h3 className="text-lg font-bold mb-6">Near-Empty Wards</h3>
          <div className="space-y-4">
            {wards.filter(w => (w.capacity - w.occupied) > 5).map(ward => (
              <div key={ward.id} className="flex items-center justify-between p-4 bg-wah-lavender/5 rounded-2xl border border-white/5 hover:border-wah-purple/30 transition-all">
                <div>
                  <div className="text-sm font-bold text-foreground tracking-tight">{ward.name}</div>
                  <div className="text-[10px] text-wah-neon font-bold font-mono tracking-widest">{ward.capacity - ward.occupied} VACANT SLOTS</div>
                </div>
                <button className="bg-wah-purple text-white p-2.5 rounded-xl hover:bg-wah-neon transition-all shadow-lg shadow-wah-purple/20">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8 bg-gradient-to-br from-wah-purple to-wah-neon rounded-[2rem] border border-glass-border relative overflow-hidden flex flex-col justify-end group shadow-xl">
           <div className="relative z-10">
             <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-md border border-white/20">
                <Activity size={24} className="text-white" />
             </div>
             <h4 className="text-xl font-bold text-white mb-2">Smart Referral</h4>
             <p className="text-xs text-white/90 leading-relaxed mb-6 font-medium">Automatic resource routing active across Tarlac Health Network.</p>
             <button className="w-full py-3 bg-white text-wah-purple font-bold rounded-2xl text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">ROUTING ENGINE</button>
           </div>
           <Activity size={200} className="absolute -top-10 -right-10 text-white/10 group-hover:text-white/20 transition-all" />
        </div>
      </div>
    </div>
  </div>
  );
};





const PharmacyView = ({ isLight }: { isLight: boolean }) => {
  const { inventory } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Pharmacy Module</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Medication & Inventory</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatCard title="Active Orders" value="18" sub="PENDING DISPENSING" icon={Pill} trend="HIGH" />
      <StatCard title="Low Stock" value="05" sub="RESUPPLY NEEDED" icon={Package} trend="ALERT" />
      <StatCard title="Expired Soon" value="02" sub="B-BLOCKERS BATCH" icon={AlertTriangle} />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <h3 className="text-lg font-bold mb-6">Prescription Worklist</h3>
        <div className="space-y-4">
          {[
            { id: 'RX-7721', patient: 'James Smith', med: 'Amoxicillin 500mg', dose: '1 tab TID', status: 'Pending' },
            { id: 'RX-7722', patient: 'Mary Johnson', med: 'Paracetamol 500mg', dose: '1 tab PRN', status: 'Dispensed' },
            { id: 'RX-7723', patient: 'Robert Williams', med: 'Metformin 500mg', dose: '1 tab OD', status: 'Review' },
          ].map((rx, i) => (
            <div key={i} className="bg-glass-bg border border-glass-border rounded-2xl p-5 flex items-center justify-between group hover:border-wah-purple/50 transition-all">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-wah-lavender/5 rounded-xl text-wah-neon">
                  <Pill size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground tracking-tight">{rx.med}</h4>
                  <p className="text-xs text-text-muted">{rx.patient} • {rx.dose}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                  <span className={cn(
                    "px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider",
                    rx.status === 'Dispensed' ? "bg-green-500/10 text-green-600 font-black" : "bg-wah-purple/10 text-wah-purple font-black"
                  )}>{rx.status}</span>
                <button className="bg-wah-purple text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-wah-neon">
                  {rx.status === 'Dispensed' ? 'VIEW' : 'DISPENSE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 glass rounded-[2rem] p-8">
        <h3 className="text-lg font-bold mb-6">Drug Inventory</h3>
        <div className="space-y-6">
          {inventory.filter(i => i.category === 'Medication').map(item => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">{item.name}</span>
                <span className="text-text-muted">{item.stock} {item.unit}</span>
              </div>
              <div className="w-full h-1.5 bg-glass-bg rounded-full overflow-hidden">
                <div className={cn(
                  "h-full rounded-full transition-all",
                  item.status === 'Critical' ? 'bg-red-500' : 'bg-wah-neon'
                )} style={{ width: `${(item.stock/item.minStock)*50}%` }} />
              </div>
            </div>
          ))}
          <button className="w-full mt-4 py-3 bg-glass-bg border border-glass-border rounded-2xl text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-glass-bg transition-all">
            STOCK MANAGEMENT
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

const BillingView = ({ isLight }: { isLight: boolean }) => {
  const { patients } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Billing & Claims</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Financial Dashboard</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <StatCard title="Pending Claims" value="124" sub="PHILHEALTH YAKAP" icon={Receipt} />
      <StatCard title="Daily Collection" value="₱ 84k" sub="CASH & CARD" icon={DollarSign} trend="+12%" />
      <StatCard title="Unbilled" value="₱ 156k" sub="ACTIVE ENCOUNTERS" icon={History} />
      <StatCard title="Audit Alerts" value="03" sub="DATA INCOMPLETE" icon={AlertTriangle} trend="URGENT" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <h3 className="text-lg font-bold mb-6">Patient Billing Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-text-muted text-[10px] uppercase font-bold tracking-widest border-b border-glass-border">
                <th className="pb-4 pl-4">Patient</th>
                <th className="pb-4">Admission</th>
                <th className="pb-4">Balance</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map((p, i) => (
                <tr key={i} className="border-b border-glass-border hover:bg-glass-bg transition-colors group">
                  <td className="py-4 pl-4">
                    <div className="font-semibold text-foreground">{p.name}</div>
                    <div className="text-[10px] text-text-muted font-mono">{p.id}</div>
                  </td>
                  <td className="py-4 text-text-secondary text-sm">{new Date(p.admittedAt).toLocaleDateString()}</td>
                  <td className="py-4 text-foreground font-mono text-sm">₱ { (Math.random()*15000 + 5000).toLocaleString(undefined, {minimumFractionDigits: 2}) }</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded text-[9px] font-bold uppercase">Pending</span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="text-wah-neon text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Generate SOA</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
         <div className="glass rounded-[2rem] p-8 border-l-4 border-wah-neon">
            <h4 className="font-bold text-foreground mb-2">PhilHealth 3.0 Ready</h4>
            <p className="text-xs text-text-muted leading-relaxed mb-6">Automatically mapping attributes for eClaims submission. 80% coverage on active cases.</p>
            <div className="flex items-center justify-between text-[10px] font-bold text-wah-neon uppercase tracking-widest">
               <span>System Sync</span>
               <span>LIVE</span>
            </div>
         </div>
         
         <div className="bg-wah-purple/40 rounded-[2rem] p-8 text-center border border-glass-border">
            <DollarSign size={40} className="mx-auto mb-4 text-white" />
            <h4 className="font-bold text-white mb-2">End-of-Day Report</h4>
            <p className="text-xs text-wah-lavender/80 mb-6">Consolidate all departmental charges for financial closing.</p>
            <button className="w-full py-3 bg-white text-wah-deep font-bold rounded-xl text-xs uppercase tracking-widest transition-transform hover:scale-105">RECONCILE ALL</button>
         </div>
      </div>
    </div>
  </div>
  );
};

const PrescriptionView = ({ isLight }: { isLight: boolean }) => {
  const { patients, labTests } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Electronic Prescription Pad</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">E-Prescribing</h2>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold">Compose New Prescription</h3>
          <div className="flex gap-2">
            <button className="p-2 glass rounded-lg text-text-secondary hover:text-foreground"><History size={18} /></button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Patient Selection</label>
              <select className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-wah-purple text-foreground">
                {patients.map(p => <option key={p.id}>{p.name} ({p.id})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Medication</label>
              <input type="text" placeholder="Search drug inventory..." className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-wah-purple text-foreground placeholder:text-text-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dosage</label>
                <input type="text" placeholder="e.g. 500mg" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none text-foreground placeholder:text-text-muted" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Frequency</label>
                <input type="text" placeholder="e.g. TID" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none text-foreground placeholder:text-text-muted" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Duration</label>
                <input type="text" placeholder="e.g. 7 days" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none text-foreground placeholder:text-text-muted" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Route</label>
                <input type="text" placeholder="e.g. PO" className="w-full bg-glass-bg border border-glass-border rounded-xl p-3 text-sm focus:outline-none text-foreground placeholder:text-text-muted" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Instructions / Sig</label>
            <textarea className="w-full bg-glass-bg border border-glass-border rounded-2xl p-4 text-sm focus:outline-none h-32 text-foreground placeholder:text-text-muted" placeholder="Enter special instructions for the pharmacist or patient..."></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4">
             <button className="px-8 py-3 bg-glass-bg text-text-secondary font-bold rounded-xl text-xs uppercase tracking-widest transition-colors hover:text-foreground">SAVE AS TEMPLATE</button>
             <button className="px-8 py-3 bg-wah-purple text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-lg shadow-wah-purple/20">E-SIGN & SEND</button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 glass rounded-[2rem] p-8">
         <h3 className="text-lg font-bold mb-6">Recent Prescriptions</h3>
         <div className="space-y-4">
            {labTests.slice(0, 3).map((l, i) => (
              <div key={i} className="p-4 bg-glass-bg rounded-2xl border border-glass-border">
                 <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-foreground tracking-tight">Cefuroxime 500mg</div>
                    <div className="text-[10px] text-text-muted font-mono">2H AGO</div>
                 </div>
                 <p className="text-[10px] text-text-muted font-medium">{l.patient}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  </div>
  );
};

const PatientsView = ({ isLight }: { isLight: boolean }) => {
  const { patients } = useData();
  const [search, setSearch] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filtered = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'ER' && p.department === 'ER') ||
      (activeFilter === 'In-Patient' && p.status !== 'Discharged') ||
      (activeFilter === 'Discharged' && p.status === 'Discharged') ||
      (activeFilter === 'Out-Patient' && p.department !== 'ICU');
    return matchesSearch && matchesFilter;
  });

  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Master Directory</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient Management</h2>
      </div>
      <div className="flex gap-3">
        <button className="bg-glass-bg border border-glass-border text-foreground px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-glass-bg">EXCEL EXPORT</button>
        <button className="bg-wah-purple text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-wah-purple/20 hover:scale-105 transition-all text-white">+ NEW REGISTRATION</button>
      </div>
    </div>

    <div className="xl:col-span-12 gap-8 grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-12 glass rounded-[2rem] p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 bg-glass-bg border border-glass-border rounded-2xl px-4 py-2 flex-1 max-w-md focus-within:ring-2 focus-within:ring-wah-purple/40 transition-all">
            <Search size={18} className="text-text-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or department..."
              className="bg-transparent border-none focus:outline-none text-sm w-full text-foreground placeholder:text-text-muted"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-foreground transition-colors shrink-0">
                <Plus size={16} className="rotate-45" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'In-Patient', 'Out-Patient', 'ER', 'Discharged'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeFilter === f ? "bg-wah-purple text-white shadow-lg shadow-wah-purple/20" : "text-text-muted hover:text-foreground hover:bg-glass-bg"
                )}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-text-muted text-[10px] uppercase font-bold tracking-widest border-b border-glass-border">
                <th className="pb-4 pl-4">Patient Profile</th>
                <th className="pb-4">Age / Gender</th>
                <th className="pb-4">Ward / Bed</th>
                <th className="pb-4">Primary Diagnosis</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-muted">
                      <Search size={32} className="opacity-30" />
                      <p className="text-sm font-bold uppercase tracking-widest">No patients found</p>
                      <p className="text-xs">Try a different name, ID, or department</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr key={i} className="border-b border-glass-border hover:bg-glass-bg transition-colors group">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border border-glass-border" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">{p.name}</div>
                        <div className="text-[10px] text-text-muted font-mono italic">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-text-secondary">{p.age}Y • {i % 2 === 0 ? 'Male' : 'Female'}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-text-secondary">{p.department}</div>
                    <div className="text-[10px] text-wah-neon font-bold">Room 30{i+1}-B</div>
                  </td>
                  <td className="py-4">
                    <div className="max-w-[200px] truncate text-xs text-foreground">Chronic Respiratory Failure with associated symptoms...</div>
                  </td>
                  <td className="py-4 text-[10px] font-bold">
                    <span className={cn(
                      "px-2 py-1 rounded-md uppercase",
                      p.status === 'Critical' ? 'bg-red-500/10 text-red-600 font-black' : 'bg-green-500/10 text-green-600 font-black'
                    )}>{p.status}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-glass-bg rounded-lg text-text-muted hover:text-foreground"><Activity size={14} /></button>
                      <button className="p-2 bg-glass-bg rounded-lg text-text-muted hover:text-foreground"><Settings size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

const InventoryView = ({ isLight }: { isLight: boolean }) => {
  const { inventory } = useData();
  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Supply Chain & Logistics</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h2>
      </div>
      <div className="flex gap-3">
        <button className="bg-glass-bg border border-glass-border text-foreground px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-glass-bg">STOCK AUDIT</button>
        <button className="bg-wah-purple text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-wah-purple/20 hover:scale-105 transition-all text-white">ADD NEW BATCH</button>
      </div>
    </div>

    <div className="bg-glass-bg border border-glass-border rounded-[2rem] p-8">
      <h4 className="text-xs font-bold text-wah-neon mb-2 uppercase tracking-widest">Module Vision</h4>
      <p className="text-text-secondary text-sm leading-relaxed max-w-4xl">
        Automated Inter-Hospital Resource Routing: Utilizing an Automatic Logic Engine to manage medical supply distribution. 
        The system continuously scans inventory for items nearing expiration and matches them with hospitals reporting low stock levels, 
        effectively eliminating medical waste and optimizing life-saving resource turnover.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <StatCard title="Total SKU" value="482" sub="ACTIVE ITEMS" icon={Package} />
      <StatCard title="Critical Stock" value="12" sub="IMMEDIATE ACTION" icon={AlertTriangle} trend="URGENT" />
      <StatCard title="Value" value="₱ 2.4M" sub="ON-HAND TOTAL" icon={DollarSign} />
      <StatCard title="Turnover" value="84%" sub="MONTHLY RATIO" icon={Activity} trend="+4.2%" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="xl:col-span-8 glass rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold">Comprehensive Inventory</h3>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
             {['All', 'Meds', 'Equip', 'Surgical'].map(tag => (
               <button key={tag} className="px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg hover:bg-white/10 text-gray-400 transition-all">{tag}</button>
             ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-text-muted text-[10px] uppercase font-bold tracking-widest border-b border-glass-border">
                <th className="pb-4">Item Details</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4">Min. Threshold</th>
                <th className="pb-4">Expiry</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i} className="border-b border-glass-border hover:bg-glass-bg transition-colors group">
                  <td className="py-4">
                    <div className="font-semibold text-foreground">{item.name}</div>
                    <div className="text-[10px] text-text-muted font-mono italic">{item.id}</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 bg-glass-bg border border-glass-border rounded text-[9px] font-bold text-text-muted">{item.category}</span>
                  </td>
                  <td className="py-4 text-sm font-mono text-foreground">{item.stock} {item.unit}</td>
                  <td className="py-4 text-sm font-mono text-text-muted">{item.minStock} {item.unit}</td>
                  <td className="py-4 text-sm text-text-secondary">05/2026</td>
                  <td className="py-4 text-right">
                    <button className="p-2 text-wah-neon opacity-0 group-hover:opacity-100"><History size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
        <div className="glass rounded-[2rem] p-8 border-l-4 border-wah-lavender/30">
          <h3 className="text-lg font-bold mb-6">Expiry Watch</h3>
          <div className="space-y-4">
             {[
               { name: "Cefuroxime 500", date: "12 Days", status: "Critical" },
               { name: "Surgical Kit B", date: "24 Days", status: "Warning" },
               { name: "N95 Mask Box", date: "45 Days", status: "Safe" }
             ].map((ex, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-glass-bg rounded-xl border border-glass-border">
                 <div>
                   <div className="text-xs font-bold text-foreground tracking-tight">{ex.name}</div>
                   <div className="text-[10px] text-text-muted font-mono">EXPIRES IN {ex.date}</div>
                 </div>
                 <span className={cn(
                   "w-2 h-2 rounded-full",
                   ex.status === 'Critical' ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-orange-500"
                 )} />
               </div>
             ))}
          </div>
          <button className="w-full mt-6 py-3 bg-wah-lavender/10 text-wah-lavender font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-wah-lavender/20">ROUTING SUGGESTIONS</button>
        </div>

        <div className="bg-gradient-to-br from-wah-purple/40 to-wah-neon/10 rounded-[2rem] p-8 relative overflow-hidden">
           <div className="relative z-10">
              <h4 className="font-bold text-foreground mb-2">Automated Ordering</h4>
              <p className="text-[11px] text-wah-lavender/70 mb-6">AI detected low levels in 4 critical items. Re-order drafts created.</p>
              <button className="bg-white text-wah-deep px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Review Drafts</button>
           </div>
           <Activity size={120} className="absolute -bottom-6 -right-6 text-white/5" />
        </div>
      </div>
    </div>
  </div>
  );
};

const PlaceholderView = ({ title, isLight }: { title: string, isLight?: boolean }) => (
  <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
    <div className="p-10 glass rounded-full text-wah-neon border-wah-lavender/10 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
      <LayoutDashboard size={80} />
    </div>
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">{title} Module</h2>
      <p className="text-text-muted font-mono text-sm uppercase tracking-widest">Module under construction in Phase 2</p>
    </div>
  </div>
);

const ArchitectureStatusView = ({ isLight }: { isLight: boolean }) => {
  const [selectedRole, setSelectedRole] = React.useState<'GUEST' | 'NURSE' | 'DOCTOR'>('GUEST');
  const [activeTab, setActiveTab] = React.useState<'interceptor' | 'jsonb'>('interceptor');
  const [isFlushingCache, setIsFlushingCache] = React.useState(false);
  const [cacheMetrics, setCacheMetrics] = React.useState({ hitRate: 98.4, keysCount: 18, memory: "1.25 MB" });
  const [selectedPatientId, setSelectedPatientId] = React.useState<'WAH-2026-00001' | 'WAH-2026-00002'>('WAH-2026-00001');
  const [dbFetchSource, setDbFetchSource] = React.useState<'None' | 'Database (Supabase PostgreSQL JSONB)' | 'Cache (Redis Node)'>('None');
  
  const [logs, setLogs] = React.useState<Array<{ time: string; type: 'info' | 'warn' | 'success' | 'err'; message: string }>>([
    { time: '04:28:18', type: 'info', message: 'Hospital Compose environment initialized on subnet 172.24.0.0/16' },
    { time: '04:28:19', type: 'success', message: 'NestJS controller bindings parsed: POST /api/auth, GET /api/patients' },
    { time: '04:28:20', type: 'success', message: 'Database connected. SSL handshake completed with Supabase cluster.' }
  ]);

  const addLog = (type: 'info' | 'warn' | 'success' | 'err', message: string) => {
    const now = new Date();
    const stamp = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { time: stamp, type, message }].slice(-10));
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    addLog('warn', 'Redis cluster command issued: FLUSHALL');
    setTimeout(() => {
      setCacheMetrics({ hitRate: 0.0, keysCount: 0, memory: "0.00 KB" });
      setIsFlushingCache(false);
      addLog('success', 'Redis key buffer flushed completely. Session state reset.');
    }, 1200);
  };

  const simulatedVitalsJSONB = {
    'WAH-2026-00001': {
      patientId: 'WAH-2026-00001',
      name: 'James Smith',
      clinicalData: {
        vitalsHistory: [
          { stamp: '2026-05-19T06:00:00Z', bp: '120/80', hr: 72, temp: 36.8, rr: 16 },
          { stamp: '2026-05-20T04:00:00Z', bp: '118/76', hr: 70, temp: 36.6, rr: 14 }
        ],
        pastHistory: ['Type-2 Diabetes', 'Hypertension'],
        allergies: ['Penicillin'],
        unstructuredDoctorNotes: 'Patient stable. MEWS score reflects consistent recovery. Scheduled discharge protocol phase 2.'
      }
    },
    'WAH-2026-00002': {
      patientId: 'WAH-2026-00002',
      name: 'Mary Johnson',
      clinicalData: {
        vitalsHistory: [
          { stamp: '2026-05-19T10:00:00Z', bp: '142/95', hr: 98, temp: 38.5, rr: 22 },
          { stamp: '2026-05-20T03:30:00Z', bp: '150/102', hr: 104, temp: 39.1, rr: 24 }
        ],
        pastHistory: ['Chronic Renal Insufficiency', 'Asthma'],
        allergies: ['Sulfonamides', 'Aspirin'],
        unstructuredDoctorNotes: 'Patient MEWS score exceeds critical threshold. Hyperpyrexia precautions. Injected broad-spectrum cephalosporins.'
      }
    }
  };

  const simulatedJwtTokens = {
    GUEST: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3Vlc3QgT3BlcmF0b3IiLCJyb2xlIjoiR3Vlc3QifQ.none",
    NURSE: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU2FyYWggSm9obnNvbiIsInJvbGUiOiJOdXJzZSIsImRlcHQiOiJUcmlhZ2UifQ.validated_wah",
    DOCTOR: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9uYXRoYW4gU21pdGgiLCJyb2xlIjoiRG9jdG9yIiwiZGVwdCI6IkNhcmRpbyJ9.validated_signed_rsa"
  };

  const triggerMockApiRequest = () => {
    addLog('info', `Securing path [GET /api/patients/${selectedPatientId}/clinical-data]`);
    addLog('info', `Header attached: Authorization: Bearer ${simulatedJwtTokens[selectedRole].substring(0, 24)}...`);
    
    setTimeout(() => {
      if (selectedRole === 'GUEST') {
        setDbFetchSource('None');
        addLog('err', `NestJS JWT Guard Refused Request: HTTP 401 Unauthorized - Token Signature Check Failed.`);
      } else if (selectedRole === 'NURSE') {
        setDbFetchSource('None');
        addLog('warn', `NestJS Auth Interceptor: Client has authenticated JWT payload, but fails RolesGuard [DOCTOR].`);
        addLog('err', `HTTP 403 Forbidden - Role [NURSE] lacks permission clearance to read clinical details JSONB columns.`);
      } else {
        // doctor role has access
        const hitCache = Math.random() > 0.4 && cacheMetrics.keysCount > 0;
        if (hitCache) {
          setDbFetchSource('Cache (Redis Node)');
          setCacheMetrics(prev => ({ ...prev, hitRate: Math.min(100.0, prev.hitRate + 0.1) }));
          addLog('success', `Redis Cache HIT for key [patient:clinical:${selectedPatientId}]. Zero latency return.`);
        } else {
          setDbFetchSource('Database (Supabase PostgreSQL JSONB)');
          if (cacheMetrics.keysCount === 0) {
            setCacheMetrics({ hitRate: 15.2, keysCount: 1, memory: "0.15 MB" });
          } else {
            setCacheMetrics(prev => ({ ...prev, keysCount: prev.keysCount + 1, memory: (parseFloat(prev.memory) + 0.08).toFixed(2) + " MB" }));
          }
          addLog('success', `Redis Cache MISS. Directed query to SQL. Decrypted hybrid JSONB clinData column on PostgreSQL.`);
        }
        addLog('success', `HTTP 200 OK - Return structured clinical payload for ${simulatedVitalsJSONB[selectedPatientId].name}`);
      }
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-wah-purple font-bold text-sm mb-1 uppercase tracking-widest">Active System Architecture Monitor</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Infrastructure Stack Panel</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border-l-4 border-foreground">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a855f7]">Web Frontend</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[9px] font-bold">ONLINE</span>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold font-mono">Next.js Framework</h3>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-mono tracking-widest">Type-Safe Client Container</p>
          </div>
          <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-glass-border">
            PORT: 3000 • SSR & HYDRATION STATUS: OK
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border-l-4 border-wah-purple">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-widest text-wah-neon">REST Gateway</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[9px] font-bold">ACTIVE</span>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold font-mono">NestJS Controller</h3>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-mono tracking-widest">Guard Interceptors Enabled</p>
          </div>
          <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-glass-border">
            PORT: 3001 • JWT STRATEGY: VERIFIED
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-500">PostgreSQL Engine</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[9px] font-bold">CONNECTED</span>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold font-mono">Supabase Database</h3>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-mono tracking-widest">Hybrid Tables + JSONB</p>
          </div>
          <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-glass-border">
            POOL: 12/20 • DB ENGINE: v15.4
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-widest text-red-500">Cache Cluster</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[9px] font-bold">READY</span>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold font-mono">Redis Node</h3>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-mono tracking-widest">Hit Matrix: {cacheMetrics.hitRate.toFixed(1)}%</p>
          </div>
          <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-glass-border">
            KEYS: {cacheMetrics.keysCount} • MEM: {cacheMetrics.memory}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-500">Orchestrator</span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[9px] font-bold">RUNNING</span>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold font-mono">Docker Compose</h3>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-mono tracking-widest">4 Container Pods Active</p>
          </div>
          <div className="text-[9px] font-mono text-text-secondary pt-2 border-t border-glass-border">
            SUBNET: 172.24.0.0/16 • CPU: 2.1%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6 border-b border-glass-border/40 pb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('interceptor')}
                  className={cn(
                    "pb-3 text-sm font-bold uppercase tracking-widest transition-all",
                    activeTab === 'interceptor' ? "text-wah-neon border-b-2 border-wah-neon" : "text-text-muted hover:text-foreground"
                  )}
                >
                  JWT & RBAC Interceptors Tester
                </button>
                <button
                  onClick={() => setActiveTab('jsonb')}
                  className={cn(
                    "pb-3 text-sm font-bold uppercase tracking-widest transition-all",
                    activeTab === 'jsonb' ? "text-wah-neon border-b-2 border-wah-neon" : "text-text-muted hover:text-foreground"
                  )}
                >
                  PostgreSQL JSONB Column Viewer
                </button>
              </div>
            </div>

            {activeTab === 'interceptor' ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#d8b4fe] mb-1">Role-Based Access Sandbox</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                    Simulate how NestJS route guards interrogate incoming credentials. Assign a JWT token role below, select a patient file, and trigger an endpoint test.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Simulated User JWT Token Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['GUEST', 'NURSE', 'DOCTOR'] as const).map((rl) => (
                        <button
                          key={rl}
                          onClick={() => { setSelectedRole(rl); addLog('info', `Simulated client login swapped to: Role [${rl}]`); }}
                          className={cn(
                            "py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                            selectedRole === rl 
                              ? "bg-wah-purple text-white shadow-md border-wah-purple" 
                              : "bg-background/40 hover:bg-background/80 text-text-secondary border-glass-border"
                          )}
                        >
                          {rl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Target Directory Patient ID</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value as any)}
                      className="w-full bg-background border border-glass-border rounded-lg p-2.5 text-xs text-foreground focus:outline-none"
                    >
                      <option value="WAH-2026-00001">James Smith (WAH-2026-00001)</option>
                      <option value="WAH-2026-00002">Mary Johnson (WAH-2026-00002)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#a855f7] uppercase tracking-wider block">Generated Bearer JWT Signature Token:</span>
                  <div className="text-[10px] font-mono text-slate-300 break-all select-all font-semibold leading-relaxed">
                    {simulatedJwtTokens[selectedRole]}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <button
                    onClick={triggerMockApiRequest}
                    className="w-full md:w-auto bg-wah-purple hover:bg-wah-neon text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-wah-purple/20"
                  >
                    Send Restricted API Request (`GET /clinical-data`)
                  </button>

                  {dbFetchSource !== 'None' && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-wah-neon bg-wah-lavender/5 px-4 py-2.5 rounded-xl border border-wah-purple/20">
                      <span>FETCH PATH SOURCE:</span>
                      <span className="text-foreground">{dbFetchSource}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#d8b4fe] mb-1">PostgreSQL Hybrid Relational + JSONB Schema</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                    In Supabase, we store core relational identifiers (id, name, age) normally. Semi-structured, high-speed vital arrays, history, and medical records are packed directly into the dynamic `Json` PostgreSQL DB column, allowing for fast retrieval and infinite flexibility.
                  </p>
                </div>

                <div className="flex gap-4">
                  {(['WAH-2026-00001', 'WAH-2026-00002'] as const).map(id => (
                    <button
                      key={id}
                      onClick={() => setSelectedPatientId(id)}
                      className={cn(
                        "py-1.5 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        selectedPatientId === id 
                          ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-sm" 
                          : "bg-background/20 text-text-muted border-glass-border"
                      )}
                    >
                      {simulatedVitalsJSONB[id].name}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-950 text-slate-300 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto space-y-1">
                  <span className="text-[9px] text-[#eab308] font-bold uppercase tracking-widest block mb-2 border-b border-slate-800 pb-1">SQL DB Record Row Mapping:</span>
                  <pre className="text-[11px] leading-relaxed select-all">
                    {JSON.stringify(simulatedVitalsJSONB[selectedPatientId], null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 justify-between border-l-4 border-l-red-500/50">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Cache Strategy Dashboard</span>
              <h3 className="text-lg font-bold">Redis Caching (IOREDIS Service Layer)</h3>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                To bypass SQL load during active ward telemetry updates, the clinical client holds sessions inside a Redis memory layer. Flushing the Redis buffer drops active cache nodes, forcing subsequent API controller routes to fallback back dynamically to Supabase PostgreSQL.
              </p>
              <div className="grid grid-cols-3 pt-2 text-[10px] font-mono text-text-secondary font-bold gap-4">
                <div>KEYS IN SESSION: <span className="text-foreground">{cacheMetrics.keysCount}</span></div>
                <div>CACHE HIT RATIO: <span className="text-foreground">{cacheMetrics.hitRate.toFixed(1)}%</span></div>
                <div>ALLOCATED MEMORY: <span className="text-foreground">{cacheMetrics.memory}</span></div>
              </div>
            </div>

            <button
              onClick={handleFlushCache}
              disabled={isFlushingCache}
              className={cn(
                "w-full md:w-auto px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95",
                isFlushingCache && "opacity-60 cursor-not-allowed"
              )}
            >
              {isFlushingCache ? "FLUSHING EX..." : "FLUSH REDIS CACHE BUFFER"}
            </button>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col h-full min-h-[500px] justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-glass-border/40 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-foreground">Docker Compose Node Logs</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              </div>

              <div className="space-y-3 font-mono text-[10px] pr-2 max-h-[480px] overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start leading-relaxed border-b border-white/5 pb-2">
                    <span className="text-text-muted select-none">[{log.time}]</span>
                    <span className={cn(
                      "font-bold uppercase tracking-widest text-[8px] px-1 rounded",
                      log.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                      log.type === 'warn' ? 'bg-amber-500/10 text-amber-400' :
                      log.type === 'success' ? 'bg-green-500/10 text-green-400' :
                      'bg-red-500/10 text-red-400'
                    )}>
                      {log.type}
                    </span>
                    <span className="text-slate-300 break-words flex-1 leading-normal font-semibold">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-glass-border/40 text-center">
              <button
                onClick={() => setLogs([])}
                className="text-[9px] font-black text-text-muted hover:text-foreground uppercase tracking-widest"
              >
                Clear Log Buffers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f0a1e] overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-wah-purple/25 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-wah-neon/15 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
        className="relative mb-10 z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 -m-8 rounded-full bg-wah-purple/20"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute inset-0 -m-4 rounded-full bg-wah-neon/15"
        />
        <div className="w-32 h-32 bg-gradient-to-br from-wah-purple via-purple-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-wah-purple/60 relative">
          <Activity size={60} className="text-white drop-shadow-lg" />
          <div className="absolute inset-0 border-2 border-white/20 rounded-[2rem]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-black text-white tracking-tight mb-3 leading-none">
          WAH<span className="text-wah-accent">2</span><span className="text-wah-neon">.0</span>
        </h1>
        <p className="text-wah-lavender/60 text-xs font-bold tracking-[0.35em] uppercase mb-8">
          Hospital Management System
        </p>

        <div className="flex items-center justify-center gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-wah-neon"
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.3, 0.7] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.45em] text-white/25 z-10"
      >
        © UNICA-HIJA
      </motion.p>
    </motion.div>
  );
};

const LogoutConfirmModal = ({ onConfirm, onCancel, isLight }: { onConfirm: () => void; onCancel: () => void; isLight: boolean }) => (
  <motion.div
    key="logout-modal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
    style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.82, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.82, opacity: 0, y: 24 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "w-full max-w-sm rounded-3xl p-8 border shadow-2xl",
        isLight ? "bg-white border-slate-100" : "bg-[#1a1030] border-white/10"
      )}
    >
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ rotate: -12 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20"
        >
          <Activity size={30} className="text-red-500 rotate-90" />
        </motion.div>
      </div>

      <div className="text-center mb-8">
        <h2 className={cn("text-xl font-black mb-2 tracking-tight", isLight ? "text-slate-800" : "text-white")}>
          Sign Out?
        </h2>
        <p className={cn("text-sm leading-relaxed", isLight ? "text-slate-500" : "text-text-muted")}>
          Are you sure you want to sign out of{' '}
          <span className="font-bold text-wah-purple">WAH2.0</span>?
          You will need to log in again to access the system.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className={cn(
            "flex-1 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-200",
            isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-text-secondary hover:bg-white/10"
          )}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider bg-red-500 hover:bg-red-600 active:scale-95 text-white transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          Sign Out
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAiOpen, setIsAiOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'Doctor' | 'Nurse' | 'IT' | null>(null);
  const [profile, setProfile] = React.useState({
    name: '',
    role: 'Doctor' as 'Doctor' | 'Nurse' | 'IT',
    department: '',
    license: '',
    status: 'Duty Active' as 'Duty Active' | 'In Surgery' | 'On Call' | 'Resting' | 'Emergency Ward',
    avatarSeed: '',
    phoneNumber: '+1 (555) 0184-2192',
    email: '',
    bio: ''
  });
  const [isLight, setIsLight] = React.useState(true);
  const [showSplash, setShowSplash] = React.useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  React.useEffect(() => {
    if (isLight) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isLight]);

  const user = {
    name: profile.name || (userRole === 'Doctor' ? "Dr. Jonathan Smith" : userRole === 'IT' ? "IT Operations Admin" : "Nurse Sarah Johnson"),
    role: userRole || 'Guest',
    avatarSeed: profile.avatarSeed || (userRole === 'Doctor' ? "Jonathan" : userRole === 'IT' ? "ITAdmin" : "Sarah"),
    avatar: `/api/avatar?seed=${encodeURIComponent(profile.avatarSeed || (userRole === 'Doctor' ? "Jonathan" : userRole === 'IT' ? "ITAdmin" : "Sarah"))}&role=${userRole}`,
    department: profile.department || (userRole === 'Doctor' ? "Cardiology" : userRole === 'IT' ? "IT Infrastructure" : "Triage/Emergency"),
    license: profile.license || (userRole === 'Doctor' ? "MED-1234-5678" : userRole === 'IT' ? "IT-9901-2026" : "NURSE-5678-1234"),
    status: profile.status,
    phoneNumber: profile.phoneNumber,
    email: profile.email || `${(profile.name || (userRole === 'Doctor' ? "Jonathan Smith" : userRole === "IT" ? "IT Operations" : "Sarah Johnson")).toLowerCase().replace(/\s+/g, '')}@wah4h.com`,
    bio: profile.bio || (userRole === 'Doctor' 
      ? 'Dedicated senior physician specializing in cardiovascular diagnostics and clinical care.' 
      : userRole === 'IT'
      ? 'Lead systems administrator and IT infrastructure analyst managing healthcare security policies.'
      : 'Dedicated triage and charge nurse with deep experience in emergency operations and critical patient monitoring.')
  };

  const handleLogin = (role: 'Doctor' | 'Nurse' | 'IT', customName?: string, customDept?: string, customLicense?: string) => {
    setUserRole(role);
    setActiveTab(role === 'IT' ? 'architecture' : 'dashboard');
    setProfile({
      name: customName || (role === 'Doctor' ? "Dr. Jonathan Smith" : "Nurse Sarah Johnson"),
      role: role,
      department: customDept || (role === 'Doctor' ? "Cardiology" : "Triage/Emergency"),
      license: customLicense || (role === 'Doctor' ? "MED-1234-5678" : "NURSE-5678-1234"),
      status: 'Duty Active',
      avatarSeed: customName ? customName.replace(/^(Dr\\. |Nurse |IT )/, '') : (role === 'Doctor' ? "Jonathan" : role === 'IT' ? "ITAdmin" : "Sarah"),
      phoneNumber: '+1 (555) 0184-2192',
      email: `${(customName || (role === 'Doctor' ? "Jonathan Smith" : "Sarah Johnson")).toLowerCase().replace(/\s+/g, '')}@wah4h.com`,
      bio: role === 'Doctor' 
        ? 'Dedicated senior physician specializing in cardiovascular diagnostics and clinical care.' 
        : 'Dedicated triage and charge nurse with deep experience in emergency operations and critical patient monitoring.'
    });
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('dashboard');
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView isLight={isLight} />;
      case 'lab': return <LaboratoryView isLight={isLight} />;
      case 'inventory': return <InventoryView isLight={isLight} />; 
      case 'rooms': return <BedManagementView isLight={isLight} />;
      case 'patients': return <PatientsView isLight={isLight} />;
      case 'pharmacy': return <PharmacyView isLight={isLight} />;
      case 'billing': return <BillingView isLight={isLight} />;
      case 'prescription': return <PrescriptionView isLight={isLight} />;
      case 'profile': 
        return (
          <ProfileView 
            user={{
              name: user.name,
              role: user.role as 'Doctor' | 'Nurse',
              department: user.department,
              license: user.license,
              status: user.status as any,
              avatarSeed: user.avatarSeed,
              phoneNumber: user.phoneNumber,
              email: user.email,
              bio: user.bio
            }} 
            onUpdate={(updated) => {
              setProfile(updated);
            }} 
            isLight={isLight} 
          />
        );
      case 'architecture': return <ArchitectureStatusView isLight={isLight} />;
      default: return <DashboardView isLight={isLight} />;
    }
  };

  const NavItems = () => (
    <>
      {userRole !== 'IT' && (
        <>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Home" 
            description="Daily operations overview, revenue analytics, and critical alerts."
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={Users} 
            label="Patients" 
            description="Master patient directory with medical history and case management."
            active={activeTab === 'patients'} 
            onClick={() => { setActiveTab('patients'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={Bed} 
            label="Wards" 
            description="Real-time bed occupancy and facility management."
            active={activeTab === 'rooms'} 
            onClick={() => { setActiveTab('rooms'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={FlaskConical} 
            label="Laboratory" 
            description="Blood tests, diagnostic results, and laboratory workflow."
            active={activeTab === 'lab'} 
            onClick={() => { setActiveTab('lab'); setIsMobileMenuOpen(false); }} 
          />
        </>
      )}
      
      {/* doctor-only nav item */}
      {userRole === 'Doctor' && (
        <SidebarItem 
          icon={Stethoscope} 
          label="Scripts" 
          description="Electronic prescription pad with automated drug checks."
          active={activeTab === 'prescription'} 
          onClick={() => { setActiveTab('prescription'); setIsMobileMenuOpen(false); }} 
        />
      )}
      
      {userRole !== 'IT' && (
        <>
          <SidebarItem 
            icon={Pill} 
            label="Pharmacy" 
            description="Medication inventory, dispensing queue, and drug resupply."
            active={activeTab === 'pharmacy'} 
            onClick={() => { setActiveTab('pharmacy'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={Receipt} 
            label="Billing" 
            description="Claims processing, financial reconciliations, and patient invoices."
            active={activeTab === 'billing'} 
            onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={Package} 
            label="Stock" 
            description="General hospital supplies and equipment inventory monitoring."
            active={activeTab === 'inventory'} 
            onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }} 
          />
        </>
      )}
      {userRole === 'IT' && (
        <SidebarItem 
          icon={Database} 
          label="Arch Status" 
          description="Interactive testing portal for Next.js, NestJS REST endpoints, JWT roles, Redis hits, and postgres JSONB schema."
          active={activeTab === 'architecture'} 
          onClick={() => { setActiveTab('architecture'); setIsMobileMenuOpen(false); }} 
        />
      )}
      <SidebarItem 
        icon={User} 
        label="Profile" 
        description="Manage clinician biography, active duty status, and digital badge."
        active={activeTab === 'profile'} 
        onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} 
      />
    </>
  );

  return (
    <DataProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirmModal
            onConfirm={() => { handleLogout(); setShowLogoutConfirm(false); }}
            onCancel={() => setShowLogoutConfirm(false)}
            isLight={isLight}
          />
        )}
      </AnimatePresence>

    <div className={cn(
      "flex h-screen overflow-hidden relative transition-colors duration-300 font-sans",
      isLight ? "bg-[#f8f7ff] text-[#0f0a1e]" : "bg-wah-deep text-white"
    )}>
      {!userRole && <LoginScreen onLogin={handleLogin} />}
      
      {/* desktop sidebar */}
      <aside className="hidden lg:flex w-24 glass h-full flex-col items-center py-6 border-r border-glass-border z-40">
        <div className="mb-10">
          <Logo />
        </div>
        
        <nav className="flex-1 flex flex-col gap-3 w-full px-2 overflow-y-auto hide-scrollbar">
          <NavItems />
        </nav>

        <nav className="flex flex-col gap-3 w-full px-2 mt-6">
          <div className="flex flex-col items-center py-2 gap-0.5">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-wah-purple/50">UNICA-HIJA</span>
            <span className="text-[6px] font-mono text-text-muted/30 tracking-widest">v2.41</span>
          </div>

          <button
             onClick={() => setIsLight(!isLight)}
             title="Switch Design Mode"
             className="flex flex-col items-center justify-center w-full py-3 rounded-xl text-text-secondary hover:text-foreground hover:bg-glass-bg transition-all gap-1"
          >
            {isLight ? <Moon size={24} /> : <Sun size={24} />}
            <span className="text-[9px] font-bold uppercase">{isLight ? 'Dark' : 'Light'}</span>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex flex-col items-center justify-center w-full py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all gap-1"
          >
            <Activity size={24} className="rotate-90" />
            <span className="text-[9px] font-bold uppercase">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                "fixed top-0 left-0 bottom-0 w-72 z-[60] p-6 lg:hidden flex flex-col gap-6 shadow-2xl border-r",
                isLight ? "bg-white text-[#0f0a1e] border-slate-200" : "glass border-glass-border"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo />
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    WAH<span className="text-wah-neon">2</span><span className="text-wah-accent">.0</span>
                  </h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-glass-bg text-text-muted"
                  )}
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className={cn("h-px w-full", isLight ? "bg-slate-200" : "bg-glass-border")} />

              <nav className="flex-1 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
                <NavItems />
              </nav>

              <div className={cn("pt-4 border-t space-y-4", isLight ? "border-slate-200" : "border-glass-border")}>
                 <button
                    onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 text-left w-full p-3 rounded-2xl border transition-all cursor-pointer",
                      isLight ? "hover:bg-slate-50 border-slate-200" : "hover:bg-glass-bg border-glass-border"
                    )}
                 >
                    <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-wah-lavender/30 shadow-lg" />
                    <div>
                       <p className="text-sm font-black text-foreground leading-tight">{user.name}</p>
                       <p className="text-[10px] text-wah-purple uppercase tracking-[0.15em] font-black">{userRole} PORTAL</p>
                    </div>
                 </button>

                 <div className="space-y-3">
                    <button
                      onClick={() => setIsLight(!isLight)}
                      className={cn(
                        "w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        isLight ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" : "bg-glass-bg border-glass-border text-text-secondary"
                      )}
                    >
                      {isLight ? <Moon size={18} /> : <Sun size={18} />}
                      <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center justify-center gap-3 py-3.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      <Activity size={18} className="rotate-90" />
                      <span>Log Out System</span>
                    </button>
                 </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 relative h-full w-full">
        <header className="h-16 lg:h-20 glass flex items-center justify-between px-4 lg:px-8 z-30 border-b border-glass-border">
          <div className="flex items-center gap-4 lg:gap-8 flex-1 max-w-2xl">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-secondary hover:text-foreground transition-colors"
            >
              <LayoutDashboard size={24} />
            </button>
              <div className="flex flex-col">
                <h1 className="text-lg lg:text-xl font-bold tracking-tight text-foreground hidden sm:block leading-none">
                  WAH4<span className="text-wah-neon">H</span> <span className="text-wah-accent">V2</span>
                </h1>
                <div className="hidden sm:flex items-center gap-2 mt-1 text-[10px] font-black text-wah-purple tracking-widest uppercase">
                  <Activity size={10} className="animate-pulse" />
                  <span>LOGGED IN AS {userRole === 'IT' ? 'ADMINISTRATOR' : userRole}</span>
                </div>
              </div>
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-glass-bg border border-glass-border rounded-full py-2 lg:py-2.5 pl-10 lg:pl-12 pr-6 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-wah-purple/50 focus:border-wah-purple/50 hover:bg-glass-bg/80 transition-all font-sans text-foreground placeholder:text-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 ml-3 lg:ml-6">
             <button 
               id="ai-assistant-trigger"
               onClick={() => setIsAiOpen(true)}
               className={cn(
                 "relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110",
                 isAiOpen ? "bg-wah-neon text-white ring-4 ring-wah-neon/20 shadow-[0_0_30px_rgba(168,85,247,0.5)]" : "text-wah-lavender/80 hover:text-wah-neon bg-glass-bg"
               )}
             >
                <Stethoscope size={22} />
                {!isAiOpen && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wah-neon opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-wah-neon border-2 border-background"></span>
                  </span>
                )}
             </button>
             <button id="notif-trigger" className="relative p-2 text-text-secondary hover:text-foreground transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-wah-purple rounded-full" />
             </button>
            <button 
              onClick={() => setActiveTab('profile')}
              title="Configure Dynamic Badge"
              className="group flex items-center gap-3 hover:opacity-95 active:scale-95 transition-all text-right cursor-pointer"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground group-hover:text-wah-neon transition-colors leading-tight">{user.name}</span>
                <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase transition-colors group-hover:text-wah-accent">{user.role === 'IT' ? 'Administrator' : user.role} Badge</span>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-wah-lavender/20 group-hover:border-wah-neon transition-colors flex items-center justify-center p-0.5 relative">
                <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-contain" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-background shadow-[0_0_6px_#22c55e]" />
              </div>
            </button>
            <button className="hidden sm:flex bg-wah-purple text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-xs lg:text-sm font-bold items-center gap-2 hover:bg-wah-neon transition-all hover:scale-105 active:scale-95 neon-glow">
              <Plus size={18} />
              <span className="hidden lg:inline">CREATE</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 hide-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
               >
                 {renderView()}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </main>
      {/* AI Assistant Drawer */}
      <AnimatePresence>
        {isAiOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.aside 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className={cn(
                "fixed top-0 right-0 bottom-0 w-80 lg:w-96 z-[80] shadow-[0_0_100px_rgba(139,92,246,0.15)] flex flex-col outline-none border-l",
                isLight ? "bg-white text-[#0f0a1e] border-slate-200" : "glass border-glass-border"
              )}
            >
              <div className={cn("p-6 flex items-center justify-between border-b", isLight ? "border-slate-100" : "border-glass-border")}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-wah-purple rounded-xl flex items-center justify-center shadow-lg shadow-wah-purple/20">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground tracking-tight">UNICA AI</h3>
                    <p className="text-[10px] text-wah-neon font-bold uppercase tracking-widest">Clinical Assistant</p>
                  </div>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="p-2 text-text-secondary hover:text-foreground transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                <div className={cn(
                  "border rounded-2xl p-5",
                  isLight ? "bg-purple-50/80 border-purple-100 text-slate-800" : "bg-wah-purple/10 border-wah-purple/20"
                )}>
                   <p className="text-xs text-text-secondary leading-relaxed italic">
                     "UNICA Smart Inter-Hospital Referral Support: I assist in patient transfers by analyzing proximity, bed availability, and specialist requirements. I coordinate with the CDS module to provide data-driven recommendations."
                   </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Intelligence</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Referral Support", desc: "ML-based analysis for inter-hospital transfer optimization.", icon: Activity },
                      { title: "Admission Prediction", desc: "Expecting high ER volume between 18:00 - 21:00 based on trends.", icon: Package },
                      { title: "Staff Efficiency", desc: "Protocol-based recommendations for shift optimization.", icon: History }
                    ].map((insight, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "border rounded-2xl p-4 flex gap-4 transition-all cursor-pointer",
                          isLight 
                            ? "bg-slate-50 hover:bg-slate-100 border-slate-200/80" 
                            : "bg-glass-bg hover:bg-glass-bg/80 border-glass-border"
                        )}
                      >
                        <div className="p-2 bg-wah-lavender/10 rounded-lg text-wah-purple h-fit border border-wah-lavender/20">
                          <insight.icon size={16} />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-foreground">{insight.title}</h5>
                          <p className="text-[11px] text-text-muted leading-normal mt-1">{insight.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cn("p-6 border-t", isLight ? "border-slate-100" : "border-glass-border")}>
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="Ask Clinical Assistant..." 
                     className={cn(
                       "w-full border rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-wah-purple/50 text-foreground placeholder:text-text-muted/60",
                       isLight ? "bg-slate-50 border-slate-200" : "bg-glass-bg border-glass-border"
                     )}
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-wah-purple text-white rounded-xl hover:bg-wah-neon transition-all">
                      <Plus size={16} />
                   </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
    </DataProvider>
  );
}
