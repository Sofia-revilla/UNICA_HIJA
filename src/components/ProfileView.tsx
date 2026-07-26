import React from 'react';
import {
  User, IdCard, Briefcase, Phone, Mail, FileText,
  Save, RotateCcw, Sparkles, Check, Activity, ShieldAlert,
  KeyRound, Award, HeartHandshake, Eye, Upload, Image, Trash2, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface StaffProfile {
  name: string;
  role: 'Doctor' | 'Nurse' | 'IT';
  department: string;
  license: string;
  status: 'Duty Active' | 'In Surgery' | 'On Call' | 'Resting' | 'Emergency Ward';
  avatarSeed: string;
  customAvatar?: string;
  phoneNumber: string;
  email: string;
  bio: string;
}

interface ProfileViewProps {
  user: StaffProfile;
  onUpdate: (updated: StaffProfile) => void;
  isLight: boolean;
}

// all avatar requests go through /api/avatar (server-side proxy)
const _av = (seed: string, hair: string, role: string) =>
  `/api/avatar?seed=${encodeURIComponent(seed)}&hair=${hair}&role=${role}`;

// female slots: bun/bob/shoulder-length  |  male slots: short cuts
const AVATAR_PRESETS: Record<string, string[]> = {
  Doctor: [
    _av('Jonathan', 'shortHairShortFlat',   'Doctor'),
    _av('Aria',     'longHairBun',           'Doctor'),
    _av('Carlos',   'shortHairTheCaesar',    'Doctor'),
    _av('Mei',      'longHairBob',           'Doctor'),
    _av('Kwame',    'shortHairShortRound',   'Doctor'),
    _av('Priya',    'longHairBun',           'Doctor'),
    _av('Sofia',    'longHairNotTooLong',    'Doctor'),
    _av('Alexis',   'shortHairShortCurly',   'Doctor'),
  ],
  Nurse: [
    _av('Sarah',   'longHairBun',           'Nurse'),
    _av('Emma',    'longHairBob',           'Nurse'),
    _av('Oliver',  'shortHairShortFlat',    'Nurse'),
    _av('Chloe',   'longHairBun',           'Nurse'),
    _av('Marco',   'shortHairTheCaesar',    'Nurse'),
    _av('Diana',   'longHairNotTooLong',    'Nurse'),
    _av('Jasmine', 'longHairBun',           'Nurse'),
    _av('Nina',    'longHairBob',           'Nurse'),
  ],
  IT: [
    _av('Felix',    'shortHairShortFlat',   'IT'),
    _av('Clara',    'longHairBun',          'IT'),
    _av('Raj',      'shortHairTheCaesar',   'IT'),
    _av('Maya',     'longHairBob',          'IT'),
    _av('Thomas',   'shortHairShortRound',  'IT'),
    _av('Grace',    'longHairBun',          'IT'),
    _av('Leonardo', 'shortHairShortCurly',  'IT'),
    _av('Nadia',    'longHairNotTooLong',   'IT'),
  ],
};

const CLINICAL_STATUSES = [
  { label: 'Duty Active', color: 'bg-green-500', text: 'text-green-500', glow: 'shadow-[0_0_12px_#22c55e]' },
  { label: 'In Surgery', color: 'bg-red-500', text: 'text-red-500', glow: 'shadow-[0_0_12px_#ef4444]' },
  { label: 'On Call', color: 'bg-amber-500', text: 'text-amber-500', glow: 'shadow-[0_0_12px_#f59e0b]' },
  { label: 'Resting', color: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-[0_0_12px_#3b82f6]' },
  { label: 'Emergency Ward', color: 'bg-purple-500', text: 'text-purple-500', glow: 'shadow-[0_0_12px_#a855f7]' }
];

export const ProfileView = ({ user, onUpdate, isLight }: ProfileViewProps) => {
  const [formData, setFormData] = React.useState<StaffProfile>({ ...user });
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const [showNotification, setShowNotification] = React.useState(false);
  const [customSeed, setCustomSeed] = React.useState('');
  const [dragActive, setDragActive] = React.useState(false);
  const [customUrl, setCustomUrl] = React.useState('');

  // re-sync form if user switches login
  React.useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleInputChange = (field: keyof StaffProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetSelect = (url: string) => {
    setFormData(prev => ({ ...prev, customAvatar: url }));
  };

  const handleCustomSeedApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSeed.trim()) return;
    setFormData(prev => ({ ...prev, avatarSeed: customSeed.trim(), customAvatar: undefined }));
    setCustomSeed('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG/JPG/WEBP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, customAvatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setFormData(prev => ({ ...prev, customAvatar: customUrl.trim() }));
    setCustomUrl('');
  };

  const handleClearCustomAvatar = () => {
    setFormData(prev => ({ ...prev, customAvatar: undefined }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdate(formData);
      setSaveStatus('saved');
      setShowNotification(true);
      setTimeout(() => {
        setSaveStatus('idle');
        setShowNotification(false);
      }, 3000);
    }, 1200);
  };

  const handleReset = () => {
    const defaultProfile: StaffProfile = {
      name: user.role === 'Doctor' ? "Dr. Jonathan Smith" : user.role === 'IT' ? "IT Operations Admin" : "Nurse Sarah Johnson",
      role: user.role,
      department: user.role === 'Doctor' ? "Cardiology" : user.role === 'IT' ? "IT Infrastructure" : "Triage/Emergency",
      license: user.role === 'Doctor' ? "MED-1234-5678" : user.role === 'IT' ? "IT-9901-2026" : "NURSE-5678-1234",
      status: 'Duty Active',
      avatarSeed: user.role === 'Doctor' ? "Jonathan" : user.role === 'IT' ? "ITAdmin" : "Sarah",
      customAvatar: undefined,
      phoneNumber: '+1 (555) 0192-384',
      email: user.role === 'Doctor' ? 'j.smith@wah4h.com' : user.role === 'IT' ? 'it.admin@wah4h.com' : 'sarah.johnson@wah4h.com',
      bio: user.role === 'Doctor'
        ? 'Dedicated senior physician specializing in cardiovascular diagnostics and clinical care.'
        : user.role === 'IT'
        ? 'Lead systems administrator and IT infrastructure analyst managing healthcare security policies.'
        : 'Dedicated triage and charge nurse with deep experience in emergency operations and critical patient monitoring.'
    };
    setFormData(defaultProfile);
  };

  const avatarUrl = formData.customAvatar || `/api/avatar?seed=${encodeURIComponent(formData.avatarSeed)}&role=${formData.role}`;

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] glass px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 border-green-500 max-w-sm"
          >
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
              <Check size={20} className="animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-black text-foreground uppercase tracking-wider">Clinical Directory Updated</p>
              <p className="text-[10px] text-text-muted mt-0.5">Staff profile details have been securely synchronized.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden glass rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-glass-border">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-wah-neon animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wah-neon">Module: Profile Workspace</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Staff Identity & Credentials
          </h1>
          <p className="text-sm text-text-muted max-w-xl font-medium leading-relaxed">
            Manage your personal data, specialty focus, active working status, and contact details as registered in the WAH2.0 central clinician directory.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-wah-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-20 w-32 h-32 bg-wah-neon/5 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* left: ID badge preview + avatar picker */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6">
          <div className="w-full max-w-[360px] relative aspect-[2/3] rounded-[2.5rem] p-6 text-white overflow-hidden shadow-2xl select-none group focus-within:ring-2 focus-within:ring-wah-purple transition-all border border-white/10 flex flex-col justify-between"
               style={{
                 background: isLight
                   ? 'linear-gradient(135deg, #2e1065 0%, #0f0728 100%)'
                   : 'linear-gradient(135deg, #230b4d 0%, #0c041f 100%)'
               }}>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />

            <div className="flex justify-between items-start z-10 w-full">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                  <Activity size={18} className="text-wah-accent animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black tracking-widest text-white leading-none">WAH2.0</h3>
                  <span className="text-[8px] text-white/50 font-mono tracking-widest uppercase">CLINIC STAFF</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", CLINICAL_STATUSES.find(s => s.label === formData.status)?.color || 'bg-green-500')} />
                  <span className="text-[7px] font-black uppercase tracking-wider text-white/90">
                    {formData.status}
                  </span>
                </div>
                <span className="text-[7px] text-white/40 font-mono mt-1">SECURE BLOCK: A</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-4 z-10 relative">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-gradient-to-tr from-wah-purple to-wah-neon rounded-full blur-md opacity-70 animate-pulse" />
                <div className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white/5 backdrop-blur-md p-1">
                  <img
                    src={avatarUrl}
                    alt="Clinician Avatar"
                    className="w-full h-full rounded-full bg-slate-900/30 object-contain transition-transform group-hover/avatar:scale-110 duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-white/20 flex items-center justify-center text-wah-accent shadow-md">
                  {formData.role === 'Doctor' ? <Award size={14} /> : formData.role === 'IT' ? <ShieldAlert size={14} /> : <HeartHandshake size={14} />}
                </div>
              </div>

              <div className="text-center mt-4 space-y-1">
                <h4 className="text-lg font-extrabold tracking-tight text-white leading-tight break-words px-2">
                  {formData.name || 'Staff Member'}
                </h4>
                <p className="text-[9px] font-black tracking-widest text-[#d8b4fe] uppercase leading-none">
                  DEPARTMENT OF {formData.department || 'GENERAL CLINIC'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 z-10 space-y-3 w-full">
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[7px] text-white/40 font-mono uppercase block">LICENSE CODE</span>
                  <span className="text-[10px] font-mono font-bold text-white tracking-wide">
                    {formData.license || 'N/A'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] text-white/40 font-mono uppercase block">DESIGNATION</span>
                  <span className="text-[10px] font-bold text-wah-accent tracking-wider uppercase">
                    {formData.role === 'IT' ? 'ADMINISTRATOR' : formData.role} PORTAL
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[6px] text-white/40 font-mono uppercase">EMULATOR SYS ID</span>
                  <span className="text-[8px] font-mono text-white/60 tracking-tight">NHS-992-0192-X883</span>
                </div>
                <div className="flex flex-row gap-0.5 items-end h-6 opacity-60">
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-[1px] h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-[1px] h-full bg-white" />
                  <div className="w-1 h-full bg-white" />
                  <div className="w-0.5 h-full bg-white" />
                  <div className="w-1.5 h-full bg-white" />
                  <div className="w-[1px] h-full bg-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[360px] glass rounded-3xl p-5 border border-glass-border space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-wah-neon" />
                Quick Avatar Presets
              </h4>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                {formData.role === 'Doctor'
                  ? 'Clinical portraits in white coat attire — diverse skin tones, long & short hair.'
                  : formData.role === 'Nurse'
                  ? 'Nursing portraits in blue scrubs — diverse skin tones, long & short hair.'
                  : 'Administrator portraits in professional polo & collar — diverse skin tones, long & short hair.'}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(AVATAR_PRESETS[formData.role] || AVATAR_PRESETS['Doctor']).map((url, idx) => (
                <button
                  key={url}
                  onClick={() => handlePresetSelect(url)}
                  className={cn(
                    "relative aspect-square rounded-xl bg-background border border-glass-border overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95",
                    formData.customAvatar === url ? "border-wah-purple shadow-md ring-2 ring-wah-purple/20" : ""
                  )}
                >
                  <img
                    src={url}
                    className="w-full h-full object-contain p-1"
                    alt={`Avatar preset ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {formData.customAvatar === url && (
                    <div className="absolute inset-0 bg-wah-purple/15 flex items-center justify-center">
                      <div className="p-0.5 bg-wah-purple text-white rounded-full">
                        <Check size={8} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSeedApply} className="flex gap-2 pt-2 border-t border-glass-border/40">
              <input
                type="text"
                placeholder="Enter custom seed keyword..."
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value)}
                className="flex-1 bg-background border border-glass-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-wah-purple"
              />
              <button
                type="submit"
                className="bg-wah-purple/20 text-wah-lavender border border-wah-purple/30 text-[10px] font-black uppercase tracking-wider px-3 rounded-xl hover:bg-wah-purple/40 transition-colors"
              >
                Apply
              </button>
            </form>
          </div>

          <div className="w-full max-w-[360px] glass rounded-3xl p-5 border border-glass-border space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Camera size={14} className="text-wah-neon" />
                Personal Clinician Portrait
              </h4>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Upload a JPEG/PNG picture file or link an external photo to display a custom photo on your secure physical ID badge.
              </p>
            </div>

            {formData.customAvatar ? (
              <div className="bg-background/40 border border-wah-purple/20 rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-wah-purple bg-background shadow-lg">
                  <img src={formData.customAvatar} className="w-full h-full object-cover" alt="Custom Preview" referrerPolicy="no-referrer" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-foreground">Custom Staff portrait active</p>
                  <button
                    onClick={handleClearCustomAvatar}
                    className="mt-2 flex items-center justify-center gap-1 mx-auto text-[9px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1 rounded-lg"
                  >
                    <Trash2 size={10} />
                    Reset to Default Seed
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center gap-2 group min-h-[140px]",
                  dragActive
                    ? "border-wah-neon bg-wah-neon/10"
                    : "border-glass-border hover:border-wah-purple bg-background/20 hover:bg-background/40"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="portrait-file-upload"
                  aria-label="Upload personal portrait"
                />
                <div className="p-2.5 bg-wah-purple/10 text-wah-purple rounded-xl group-hover:bg-wah-purple/20 group-hover:text-wah-neon transition-all transform group-hover:scale-110">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground">Drag & drop portrait here</p>
                  <p className="text-[9px] text-text-muted mt-0.5">or click to browse local files</p>
                </div>
                <p className="text-[8px] text-text-muted/60 font-mono">Max size: 2MB (JPEG, PNG, WEBP)</p>
              </div>
            )}

            <form onSubmit={handleUrlApply} className="flex gap-2 pt-2 border-t border-glass-border/40">
              <input
                type="text"
                placeholder="Or paste direct image URL..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 bg-background border border-glass-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-wah-purple focus:border-wah-purple"
              />
              <button
                type="submit"
                className="bg-wah-purple/20 text-wah-lavender border border-wah-purple/30 text-[10px] font-black uppercase tracking-wider px-3 rounded-xl hover:bg-wah-purple/40 transition-colors"
              >
                Link
              </button>
            </form>
          </div>
        </div>

        {/* right: form fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-[2rem] p-6 lg:p-8 border border-glass-border space-y-6">
            <div className="flex justify-between items-center border-b border-glass-border/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Clinician Profile Records</h3>
                <p className="text-[11px] text-text-muted mt-0.5">Please ensure all field entries are clinical-grade identifiers.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="p-2.5 bg-glass-bg border border-glass-border hover:bg-glass-bg/80 text-text-secondary hover:text-foreground rounded-xl transition-all hover:scale-105 active:scale-95"
                  title="Restore default database entries"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus !== 'idle'}
                  className={cn(
                    "px-4 py-2 bg-wah-purple text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:bg-wah-neon flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md",
                    saveStatus !== 'idle' && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Sync Matrix</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <User size={12} />
                  Staff Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors"
                  placeholder="e.g. Dr. Jonathan Smith"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <Briefcase size={12} />
                  Clinical Specialty / Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors"
                  placeholder="e.g. Cardiology"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <IdCard size={12} />
                  License / Employee Badge Code
                </label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => handleInputChange('license', e.target.value)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors font-mono"
                  placeholder="MED-XXXX-XXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <Activity size={12} />
                  Operational Active Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-2.5 px-4 text-foreground font-medium text-xs appearance-none transition-colors"
                >
                  {CLINICAL_STATUSES.map(st => (
                    <option key={st.label} value={st.label} className="bg-background">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <Mail size={12} />
                  Clinician Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors"
                  placeholder="smith@wah4h.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                  <Phone size={12} />
                  Direct Line / Pager Number
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe] ml-1 flex items-center gap-1">
                <FileText size={12} />
                Medical background & Clinical Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full bg-background border-2 border-glass-border focus:border-wah-purple focus:outline-none rounded-xl py-3 px-4 text-foreground font-medium text-xs transition-colors resize-none leading-relaxed"
                placeholder="Give a brief summary of clinical history..."
              />
            </div>
          </div>

          <div className="glass rounded-[2xl] p-6 border-l-4 border-wah-neon border-y border-r border-glass-border flex gap-4 items-start">
            <div className="p-3 bg-wah-neon/15 text-wah-neon rounded-2xl">
              <KeyRound size={22} className="animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Central Medical Directory Sync</h4>
              <p className="text-[10px] text-text-muted leading-relaxed">
                Changes to your name, license credentials, or operation status are visible network-wide. Emergency dispatch trackers automatically pull status feeds from your badge. Ensure entries remain authentic.
              </p>
              <div className="text-[9px] text-[#a855f7] font-bold uppercase tracking-widest pt-1 flex items-center gap-1">
                <ShieldAlert size={10} />
                SECURITY CRYPOTOGRAPHIC SIGNATURE ACTIVE IN BACKGROUND
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
