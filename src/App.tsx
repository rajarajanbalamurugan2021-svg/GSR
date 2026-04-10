/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Shield, 
  Stethoscope, 
  Calendar, 
  FileText, 
  CreditCard, 
  Ambulance as AmbulanceIcon, 
  Utensils, 
  Pill, 
  Heart, 
  UserCircle, 
  LogOut, 
  Menu, 
  Bell, 
  Sun, 
  Moon,
  Plus,
  Search,
  X,
  Check,
  MapPin,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { 
  Button, 
  Badge, 
  Input, 
  Modal, 
  Table, 
  SectionHeader 
} from './components/Common';
import { 
  Role, 
  Doctor, 
  Patient, 
  Staff, 
  Ambulance, 
  AmbulanceBooking, 
  FoodItem, 
  FoodOrder, 
  Medicine, 
  MedicineOrder, 
  Appointment, 
  MedicalRecord, 
  Bill, 
  BloodDonor, 
  OrganDonor 
} from './types';
import { 
  SEED_DOCTORS, 
  SEED_PATIENTS, 
  SEED_STAFF, 
  SEED_AMBULANCES, 
  SEED_AMB_BOOKINGS, 
  SEED_FOOD_MENU, 
  SEED_MEDICINES, 
  SEED_APPOINTMENTS, 
  SEED_RECORDS, 
  SEED_BILLS, 
  SEED_BLOOD_DONORS, 
  SEED_ORGAN_DONORS 
} from './constants';

// --- Types ---
type Page = 'dashboard' | 'patients' | 'staff' | 'doctors' | 'appointments' | 'records' | 'billing' | 'ambulance' | 'food' | 'medicine' | 'blood' | 'organ';

interface AppState {
  doctors: Doctor[];
  patients: Patient[];
  staff: Staff[];
  ambulances: Ambulance[];
  ambBookings: AmbulanceBooking[];
  foodMenu: FoodItem[];
  foodOrders: FoodOrder[];
  medicines: Medicine[];
  medicineOrders: MedicineOrder[];
  appointments: Appointment[];
  records: MedicalRecord[];
  bills: Bill[];
  bloodDonors: BloodDonor[];
  organDonors: OrganDonor[];
  nextPatientId: number;
  nextStaffId: number;
  nextDoctorId: number;
  nextApptId: number;
  nextRecordId: number;
  nextBillId: number;
  nextAmbId: number;
  nextAmbBookId: number;
  nextFoodOrderId: number;
  nextMedOrderId: number;
  nextBloodId: number;
  nextOrganId: number;
}

// --- Main Component ---
export default function App() {
  // --- Global State ---
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gsr_hospital_db_v1');
    if (saved) return JSON.parse(saved);
    return {
      doctors: SEED_DOCTORS,
      patients: SEED_PATIENTS,
      staff: SEED_STAFF,
      ambulances: SEED_AMBULANCES,
      ambBookings: SEED_AMB_BOOKINGS,
      foodMenu: SEED_FOOD_MENU,
      foodOrders: [],
      medicines: SEED_MEDICINES,
      medicineOrders: [],
      appointments: SEED_APPOINTMENTS,
      records: SEED_RECORDS,
      bills: SEED_BILLS,
      bloodDonors: SEED_BLOOD_DONORS,
      organDonors: SEED_ORGAN_DONORS,
      nextPatientId: 1004,
      nextStaffId: 2004,
      nextDoctorId: 306,
      nextApptId: 4003,
      nextRecordId: 5002,
      nextBillId: 6002,
      nextAmbId: 7004,
      nextAmbBookId: 7102,
      nextFoodOrderId: 8001,
      nextMedOrderId: 9001,
      nextBloodId: 10003,
      nextOrganId: 11002,
    };
  });

  useEffect(() => {
    localStorage.setItem('gsr_hospital_db_v1', JSON.stringify(state));
  }, [state]);

  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>('Admin');
  const [userId, setUserId] = useState<number>(-1);
  const [page, setPage] = useState<Page>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // --- Login Logic ---
  const handleLogin = (r: Role, user: string, pass: string) => {
    if (r === 'Admin') {
      if (user === 'admin' && pass === 'admin123') {
        setIsLoggedIn(true);
        setRole('Admin');
        setPage('dashboard');
        return true;
      }
    } else if (r === 'Staff') {
      const found = state.staff.find(s => String(s.id) === user && s.pass === pass);
      if (found) {
        setIsLoggedIn(true);
        setRole('Staff');
        setUserId(found.id);
        setPage('dashboard');
        return true;
      }
    } else if (r === 'Doctor') {
      const found = state.doctors.find(d => String(d.id) === user && d.pass === pass);
      if (found) {
        setIsLoggedIn(true);
        setRole('Doctor');
        setUserId(found.id);
        setPage('dashboard');
        return true;
      }
    } else if (r === 'Patient') {
      const found = state.patients.find(p => String(p.id) === user && p.pass === pass);
      if (found) {
        setIsLoggedIn(true);
        setRole('Patient');
        setUserId(found.id);
        setPage('dashboard');
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('dashboard');
  };

  // --- Render ---
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} theme={theme} setTheme={setTheme} />;
  }

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans transition-colors duration-300",
      theme === 'dark' ? "bg-bg text-text" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar */}
      <Sidebar 
        role={role} 
        page={page} 
        setPage={setPage} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        theme={theme}
        setTheme={setTheme}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          page={page} 
          role={role} 
          userId={userId} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          setMobileNavOpen={setMobileNavOpen}
          theme={theme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PageRenderer 
                page={page} 
                role={role} 
                userId={userId} 
                state={state} 
                setState={setState}
                theme={theme}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- Sub-components ---

function LoginPage({ onLogin, theme, setTheme }: { onLogin: (r: Role, u: string, p: string) => boolean, theme: 'dark' | 'light', setTheme: (t: 'dark' | 'light') => void }) {
  const [loginRole, setLoginRole] = useState<Role>('Admin');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(loginRole, user, pass)) {
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "bg-[#080d18]" : "bg-slate-100"
    )}>
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-25%] right-[-15%] w-[700px] h-[700px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-info/5 blur-[100px]" />
      </div>

      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 p-2 rounded-xl bg-card border border-border flex items-center gap-2 text-sm font-semibold shadow-lg z-10"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-accent" />}
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-info items-center justify-center mb-4 shadow-xl shadow-accent/20">
            <span className="text-4xl">🏥</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">GSR HOSPITAL</h1>
          <p className="text-text-muted text-sm">Smart Hospital Management System</p>
        </div>

        <div className="bg-card border border-border rounded-[2rem] p-8 shadow-2xl">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Login As</p>
            <div className="grid grid-cols-4 gap-2">
              {(['Admin', 'Doctor', 'Staff', 'Patient'] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => setLoginRole(r)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200",
                    loginRole === r 
                      ? "bg-accent/10 border-accent text-accent" 
                      : "bg-input border-input-border text-text-muted hover:border-border-light"
                  )}
                >
                  {r === 'Admin' && <Shield className="w-5 h-5" />}
                  {r === 'Doctor' && <Stethoscope className="w-5 h-5" />}
                  {r === 'Staff' && <Users className="w-5 h-5" />}
                  {r === 'Patient' && <UserCircle className="w-5 h-5" />}
                  <span className="text-[11px] font-bold uppercase tracking-wider">{r}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5 ml-1">Username / ID</label>
              <input 
                type="text" 
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder={loginRole === 'Admin' ? 'admin' : loginRole === 'Doctor' ? '301' : loginRole === 'Staff' ? '2001' : '1001'}
                className="w-full bg-input border-2 border-input-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-input border-2 border-input-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-danger/10 border border-danger/20 rounded-xl p-3 flex items-center gap-2 text-danger text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-info text-white font-bold py-4 rounded-2xl shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In →
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-8 font-medium">
          GSR Hospital, Cuddalore, Tamil Nadu · Emergency: 104
        </p>
      </motion.div>
    </div>
  );
}

function Sidebar({ role, page, setPage, sidebarOpen, setSidebarOpen, mobileNavOpen, setMobileNavOpen, theme, setTheme, onLogout }: any) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['Admin', 'Doctor', 'Staff'] },
    { id: 'staff', label: 'Staff', icon: Shield, roles: ['Admin'] },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['Admin', 'Patient'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['Admin', 'Doctor', 'Patient'] },
    { id: 'records', label: 'Med Records', icon: FileText, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
    { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['Admin', 'Patient'] },
    { id: 'ambulance', label: 'Ambulance', icon: AmbulanceIcon, roles: ['Admin', 'Staff', 'Patient'] },
    { id: 'food', label: 'Food', icon: Utensils, roles: ['Admin', 'Staff', 'Patient'] },
    { id: 'medicine', label: 'Medicine', icon: Pill, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
    { id: 'blood', label: 'Blood Bank', icon: Heart, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
    { id: 'organ', label: 'Organ Registry', icon: UserCircle, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
  ].filter(item => item.roles.includes(role));

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center text-xl shadow-lg shadow-accent/20">🏥</div>
        {sidebarOpen && (
          <div className="overflow-hidden whitespace-nowrap">
            <div className="font-black text-sm tracking-tight">GSR HOSPITAL</div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{role} Panel</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setPage(item.id);
              setMobileNavOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
              page === item.id 
                ? "bg-accent/15 text-accent font-bold" 
                : "text-text-muted hover:bg-card-hover hover:text-text"
            )}
          >
            <item.icon className={cn("w-5 h-5", page === item.id ? "text-accent" : "text-text-muted group-hover:text-text")} />
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-text-muted hover:bg-card-hover hover:text-text transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-accent" />}
          {sidebarOpen && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-danger hover:bg-danger/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:block bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {content}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-[101] md:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Header({ page, role, userId, sidebarOpen, setSidebarOpen, setMobileNavOpen, theme }: any) {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            setMobileNavOpen(true);
          }}
          className="p-2 rounded-lg hover:bg-card-hover text-text-muted md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-card-hover text-text-muted hidden md:block"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold capitalize">{page.replace('-', ' ')}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-card-hover text-text-muted relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold">{role === 'Admin' ? 'Administrator' : role === 'Doctor' ? `Dr. #${userId}` : role === 'Staff' ? `Staff #${userId}` : `Patient #${userId}`}</div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-info flex items-center justify-center text-white shadow-lg shadow-accent/20">
            {role === 'Admin' ? <Shield className="w-5 h-5" /> : role === 'Doctor' ? <Stethoscope className="w-5 h-5" /> : role === 'Staff' ? <Users className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
          </div>
        </div>
      </div>
    </header>
  );
}

function PageRenderer({ page, role, userId, state, setState, theme }: any) {
  switch (page) {
    case 'dashboard': return <Dashboard role={role} userId={userId} state={state} theme={theme} />;
    case 'patients': return <Patients role={role} state={state} setState={setState} />;
    case 'doctors': return <Doctors role={role} state={state} setState={setState} />;
    case 'staff': return <StaffPage role={role} state={state} setState={setState} />;
    case 'appointments': return <Appointments role={role} userId={userId} state={state} setState={setState} />;
    case 'records': return <Records role={role} userId={userId} state={state} setState={setState} />;
    case 'billing': return <Billing role={role} userId={userId} state={state} setState={setState} />;
    case 'ambulance': return <AmbulancePage role={role} userId={userId} state={state} setState={setState} />;
    case 'food': return <Food role={role} userId={userId} state={state} setState={setState} />;
    case 'medicine': return <MedicinePage role={role} userId={userId} state={state} setState={setState} />;
    case 'blood': return <Blood role={role} state={state} setState={setState} />;
    case 'organ': return <Organ role={role} state={state} setState={setState} />;
    default: return <Dashboard role={role} userId={userId} state={state} theme={theme} />;
  }
}

// --- Page Components ---

function Dashboard({ role, userId, state, theme }: any) {
  const stats = role === 'Admin' ? [
    { label: 'Patients', val: state.patients.length, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Doctors', val: state.doctors.length, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Staff', val: state.staff.length, color: 'text-orange', bg: 'bg-orange/10' },
    { label: 'Appointments', val: state.appointments.length, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Ambulances', val: state.ambulances.length, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Total Bills', val: state.bills.length, color: 'text-danger', bg: 'bg-danger/10' },
  ] : role === 'Doctor' ? [
    { label: 'Total Patients', val: state.patients.length, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'My Appointments', val: state.appointments.filter((a: any) => a.doctorId === userId).length, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Medical Records', val: state.records.length, color: 'text-info', bg: 'bg-info/10' },
  ] : role === 'Staff' ? [
    { label: 'Total Patients', val: state.patients.length, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Food Orders', val: state.foodOrders.length, color: 'text-orange', bg: 'bg-orange/10' },
    { label: 'Medicine Orders', val: state.medicineOrders.length, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Available Ambulances', val: state.ambulances.filter((a: any) => a.status === 'Available').length, color: 'text-success', bg: 'bg-success/10' },
  ] : [
    { label: 'My Appointments', val: state.appointments.filter((a: any) => a.patientId === userId).length, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'My Bills', val: state.bills.filter((b: any) => b.patientId === userId).length, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'My Food Orders', val: state.foodOrders.filter((f: any) => f.requestedBy === `PATIENT-${userId}`).length, color: 'text-orange', bg: 'bg-orange/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-text-muted text-sm">Welcome back to GSR Hospital Management System.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl">
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold shadow-lg shadow-accent/20">Today</button>
          <button className="px-4 py-2 text-text-muted text-xs font-bold hover:text-text transition-colors">Week</button>
          <button className="px-4 py-2 text-text-muted text-xs font-bold hover:text-text transition-colors">Month</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-border-light transition-all group"
          >
            <div className={cn("text-3xl font-black mb-1 transition-transform group-hover:scale-110 origin-left", s.color)}>{s.val}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Recent Appointments</h3>
            <button className="text-accent text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {state.appointments.slice(0, 5).map((a: any) => {
              const p = state.patients.find((p: any) => p.id === a.patientId);
              const d = state.doctors.find((d: any) => d.id === a.doctorId);
              return (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-bg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{p?.name || 'Unknown Patient'}</div>
                      <div className="text-[10px] text-text-muted font-medium">with {d?.name || 'Unknown Doctor'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold">{a.date}</div>
                    <div className="text-[10px] text-text-muted">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Ambulance Status</h3>
            <button className="text-accent text-xs font-bold hover:underline">Track Fleet</button>
          </div>
          <div className="space-y-4">
            {state.ambulances.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-bg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    a.status === 'Available' ? "bg-success/10 text-success" : a.status === 'On-Duty' ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                  )}>
                    <AmbulanceIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{a.vehicleNo}</div>
                    <div className="text-[10px] text-text-muted font-medium">{a.location}</div>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  a.status === 'Available' ? "bg-success/10 text-success" : a.status === 'On-Duty' ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                )}>
                  {a.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Placeholder for other pages to be implemented in next turns ---
function Patients({ role, state, setState }: any) {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    blood: 'A+',
    address: '',
    pass: ''
  });

  const filteredPatients = state.patients.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    String(p.id).includes(search)
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = {
      ...formData,
      id: Number(formData.id),
      age: Number(formData.age),
      role: 'Patient',
      reg: new Date().toISOString().slice(0, 10)
    };
    
    setState((prev: any) => ({
      ...prev,
      patients: [...prev.patients, newPatient],
      nextPatientId: prev.nextPatientId + 1
    }));
    
    setIsAddModalOpen(false);
    setSelectedPatient(newPatient);
    setIsCredsModalOpen(true);
    setFormData({ id: '', name: '', age: '', gender: 'Male', phone: '', blood: 'A+', address: '', pass: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setState((prev: any) => ({
        ...prev,
        patients: prev.patients.filter((p: any) => p.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Patient Management" 
        subtitle={`${filteredPatients.length} patients registered`}
        action={role !== 'Patient' && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>Add Patient</Button>
        )}
      />

      <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
        <Search className="w-5 h-5 text-text-muted ml-1" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>

      <Table 
        headers={['ID', 'Name', 'Age', 'Gender', 'Blood', 'Phone', 'Address', 'Registered', 'Actions']}
        rows={filteredPatients.map((p: any) => [
          <span className="text-accent font-bold">#{p.id}</span>,
          <span className="text-text font-bold">{p.name}</span>,
          p.age,
          p.gender,
          <Badge label={p.blood} variant="danger" />,
          p.phone,
          <span className="max-w-[150px] truncate block">{p.address}</span>,
          p.reg,
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" icon={Shield} onClick={() => { setSelectedPatient(p); setIsCredsModalOpen(true); }} />
            {role === 'Admin' && (
              <Button size="sm" variant="ghost" icon={Trash2} className="text-danger hover:bg-danger/10" onClick={() => handleDelete(p.id)} />
            )}
          </div>
        ])}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Patient">
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 mb-4">
            <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">🔐 Login Credentials</div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Patient Login ID" id="f-pid" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required placeholder="e.g. 1004" />
              <Input label="Password" id="f-ppass" type="password" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} required placeholder="Set a password" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" id="f-pname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="col-span-2" />
            <Input label="Age" id="f-page" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            <Input label="Gender" id="f-pgender" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} options={['Male', 'Female', 'Other']} />
            <Input label="Phone" id="f-pphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <Input label="Blood Group" id="f-pblood" value={formData.blood} onChange={e => setFormData({...formData, blood: e.target.value})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
            <Input label="Address" id="f-paddress" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="col-span-2" />
          </div>
          <Button type="submit" className="w-full" icon={Check}>Register Patient</Button>
        </form>
      </Modal>

      <Modal isOpen={isCredsModalOpen} onClose={() => setIsCredsModalOpen(false)} title="Patient Credentials">
        {selectedPatient && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-info/10 to-accent/5 border border-info/20 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-info flex items-center justify-center text-white shadow-lg">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black">{selectedPatient.name}</h4>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Age {selectedPatient.age} · {selectedPatient.blood} · {selectedPatient.gender}</p>
                </div>
              </div>
              
              <div className="grid gap-3">
                {[
                  { l: 'Login ID (Patient ID)', v: selectedPatient.id, c: 'text-accent' },
                  { l: 'Password', v: selectedPatient.pass, c: 'text-info' },
                  { l: 'Phone', v: selectedPatient.phone, c: 'text-text-sub' },
                  { l: 'Address', v: selectedPatient.address || '—', c: 'text-text-sub' }
                ].map((item, i) => (
                  <div key={i} className="bg-bg border border-border rounded-xl p-3">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{item.l}</div>
                    <div className={cn("text-sm font-black font-mono", item.c)}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0" />
              <p className="text-xs text-warning font-semibold leading-relaxed">
                ⚠️ Share these credentials with the patient securely. They will need these to access their portal.
              </p>
            </div>
            <Button onClick={() => setIsCredsModalOpen(false)} className="w-full" variant="outline">Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
function Doctors({ role, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({ id: '', name: '', spec: '', phone: '', schedule: '', pass: '' });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor = {
      ...formData,
      id: Number(formData.id),
      role: 'Doctor',
      available: true
    };
    
    setState((prev: any) => ({
      ...prev,
      doctors: [...prev.doctors, newDoctor],
      nextDoctorId: prev.nextDoctorId + 1
    }));
    
    setIsAddModalOpen(false);
    setSelectedDoctor(newDoctor);
    setIsCredsModalOpen(true);
    setFormData({ id: '', name: '', spec: '', phone: '', schedule: '', pass: '' });
  };

  const toggleAvailability = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      doctors: prev.doctors.map((d: any) => d.id === id ? { ...d, available: !d.available } : d)
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Doctors" 
        subtitle={`${state.doctors.length} specialists available`}
        action={role === 'Admin' && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} variant="success">Add Doctor</Button>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.doctors.map((d: any) => (
          <motion.div 
            key={d.id}
            layout
            className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-accent/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <Badge label={d.available ? 'Available' : 'Unavailable'} variant={d.available ? 'success' : 'danger'} />
            </div>
            
            <h4 className="text-lg font-black mb-1">{d.name}</h4>
            <p className="text-accent text-sm font-bold mb-4">{d.spec}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <span className="w-4">📞</span> {d.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <span className="w-4">🕐</span> {d.schedule}
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/10 rounded-xl p-3 mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Doctor ID: #{d.id}</span>
            </div>

            {role === 'Admin' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={d.available ? "text-danger border-danger/20 hover:bg-danger/10 hover:border-danger" : "text-success border-success/20 hover:bg-success/10 hover:border-success"}
                  onClick={() => toggleAvailability(d.id)}
                >
                  {d.available ? 'Set Unavailable' : 'Set Available'}
                </Button>
                <Button size="sm" variant="ghost" icon={Shield} onClick={() => { setSelectedDoctor(d); setIsCredsModalOpen(true); }}>Creds</Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 mb-4">
            <div className="text-[10px] font-bold text-success uppercase tracking-widest mb-3">🔐 Login Credentials</div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Doctor ID" id="f-did" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required placeholder="e.g. 306" />
              <Input label="Password" id="f-dpass" type="password" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} required />
            </div>
          </div>
          <Input label="Full Name" id="f-dname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input label="Specialization" id="f-dspec" value={formData.spec} onChange={e => setFormData({...formData, spec: e.target.value})} />
          <Input label="Phone" id="f-dphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <Input label="Schedule (e.g. Mon-Fri 09-17)" id="f-dsched" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} />
          <Button type="submit" className="w-full" variant="success" icon={Check}>Add Doctor</Button>
        </form>
      </Modal>

      <Modal isOpen={isCredsModalOpen} onClose={() => setIsCredsModalOpen(false)} title="Doctor Login Credentials">
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-success/10 to-accent/5 border border-success/20 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-accent flex items-center justify-center text-white shadow-lg">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black">{selectedDoctor.name}</h4>
                  <p className="text-xs text-success font-bold uppercase tracking-wider">{selectedDoctor.spec}</p>
                </div>
              </div>
              
              <div className="grid gap-3">
                {[
                  { l: 'Doctor ID (Login)', v: selectedDoctor.id, c: 'text-accent' },
                  { l: 'Password', v: selectedDoctor.pass, c: 'text-info' },
                  { l: 'Phone', v: selectedDoctor.phone || '—', c: 'text-text-sub' },
                  { l: 'Schedule', v: selectedDoctor.schedule || '—', c: 'text-text-sub' }
                ].map((item, i) => (
                  <div key={i} className="bg-bg border border-border rounded-xl p-3">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{item.l}</div>
                    <div className={cn("text-sm font-black font-mono", item.c)}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0" />
              <p className="text-xs text-warning font-semibold leading-relaxed">
                ⚠️ Share these credentials with the doctor securely.
              </p>
            </div>
            <Button onClick={() => setIsCredsModalOpen(false)} className="w-full" variant="outline">Close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
function StaffPage({ role, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Nurse', dept: '', phone: '', shift: 'Morning', pass: '' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      ...formData,
      id: state.nextStaffId,
      role: formData.role as Role
    };
    
    setState((prev: any) => ({
      ...prev,
      staff: [...prev.staff, newStaff],
      nextStaffId: prev.nextStaffId + 1
    }));
    
    setIsAddModalOpen(false);
    setFormData({ name: '', role: 'Nurse', dept: '', phone: '', shift: 'Morning', pass: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setState((prev: any) => ({
        ...prev,
        staff: prev.staff.filter((s: any) => s.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Staff Management" 
        subtitle={`${state.staff.length} staff members active`}
        action={role === 'Admin' && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} variant="secondary">Add Staff</Button>
        )}
      />

      <Table 
        headers={['ID', 'Name', 'Role', 'Department', 'Phone', 'Shift', 'Action']}
        rows={state.staff.map((s: any) => [
          <span className="text-accent font-bold">#{s.id}</span>,
          <span className="text-text font-bold">{s.name}</span>,
          <Badge label={s.role} variant="purple" />,
          s.dept,
          s.phone,
          <Badge label={s.shift} variant="info" />,
          <Button size="sm" variant="ghost" icon={Trash2} className="text-danger hover:bg-danger/10" onClick={() => handleDelete(s.id)} />
        ])}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" id="f-sname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="col-span-2" />
            <Input label="Role" id="f-srole" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} options={['Doctor', 'Nurse', 'Lab Tech', 'Pharmacist', 'Admin Staff', 'Support']} />
            <Input label="Department" id="f-sdept" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} />
            <Input label="Phone" id="f-sphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <Input label="Shift" id="f-sshift" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} options={['Morning', 'Evening', 'Night']} />
            <Input label="Password" id="f-spass" type="password" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} required className="col-span-2" />
          </div>
          <Button type="submit" className="w-full" variant="secondary" icon={Check}>Add Staff</Button>
        </form>
      </Modal>
    </div>
  );
}
function Appointments({ role, userId, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: new Date().toISOString().slice(0, 10), time: '09:00', reason: '', priority: 'Normal' });

  const filteredAppointments = role === 'Patient' ? state.appointments.filter((a: any) => a.patientId === userId)
                             : role === 'Doctor' ? state.appointments.filter((a: any) => a.doctorId === userId)
                             : state.appointments;

  const handleAddAppt = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt = {
      ...formData,
      id: state.nextApptId,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      status: 'Pending'
    };
    
    setState((prev: any) => ({
      ...prev,
      appointments: [...prev.appointments, newAppt],
      nextApptId: prev.nextApptId + 1
    }));
    
    setIsAddModalOpen(false);
    setFormData({ patientId: '', doctorId: '', date: new Date().toISOString().slice(0, 10), time: '09:00', reason: '', priority: 'Normal' });
  };

  const updateStatus = (id: number, status: string) => {
    setState((prev: any) => ({
      ...prev,
      appointments: prev.appointments.map((a: any) => a.id === id ? { ...a, status } : a)
    }));
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete appointment?')) {
      setState((prev: any) => ({
        ...prev,
        appointments: prev.appointments.filter((a: any) => a.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Appointments" 
        subtitle={`${filteredAppointments.length} scheduled visits`}
        action={role !== 'Doctor' && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>Book Appointment</Button>
        )}
      />

      <Table 
        headers={['ID', 'Priority', 'Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status', 'Actions']}
        rows={filteredAppointments.map((a: any) => {
          const p = state.patients.find((x: any) => x.id === a.patientId);
          const d = state.doctors.find((x: any) => x.id === a.doctorId);
          const prioVariant = a.priority === 'Emergency' ? 'danger' : a.priority === 'Urgent' ? 'warning' : a.priority === 'Normal' ? 'info' : 'success';
          return [
            <span className="text-accent font-bold">#{a.id}</span>,
            <Badge label={a.priority} variant={prioVariant} />,
            p?.name || `#${a.patientId}`,
            d?.name || `#${a.doctorId}`,
            a.date,
            a.time,
            <span className="text-xs text-text-muted">{a.reason}</span>,
            <Badge label={a.status} variant={a.status === 'Confirmed' ? 'success' : a.status === 'Cancelled' ? 'danger' : 'warning'} />,
            <div className="flex gap-2">
              {a.status !== 'Completed' && a.status !== 'Cancelled' && (
                <Button size="sm" variant="ghost" className="text-success hover:bg-success/10" onClick={() => updateStatus(a.id, 'Completed')}>✓</Button>
              )}
              {a.status === 'Pending' && role === 'Admin' && (
                <Button size="sm" variant="ghost" className="text-success hover:bg-success/10" onClick={() => updateStatus(a.id, 'Confirmed')}>Confirm</Button>
              )}
              {a.status !== 'Cancelled' && (
                <Button size="sm" variant="ghost" className="text-warning hover:bg-warning/10" onClick={() => updateStatus(a.id, 'Cancelled')}>✗</Button>
              )}
              {role === 'Admin' && (
                <Button size="sm" variant="ghost" icon={Trash2} className="text-danger hover:bg-danger/10" onClick={() => handleDelete(a.id)} />
              )}
            </div>
          ];
        })}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Book Appointment">
        <form onSubmit={handleAddAppt} className="space-y-4">
          <Input 
            label="Patient" 
            id="f-apid" 
            value={formData.patientId} 
            onChange={e => setFormData({...formData, patientId: e.target.value})} 
            options={state.patients.map((p: any) => ({ v: p.id, l: `#${p.id} — ${p.name}` }))}
            required 
          />
          <Input 
            label="Doctor" 
            id="f-adid" 
            value={formData.doctorId} 
            onChange={e => setFormData({...formData, doctorId: e.target.value})} 
            options={state.doctors.map((d: any) => ({ v: d.id, l: `${d.name} (${d.spec})` }))}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" id="f-adate" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            <Input label="Time" id="f-atime" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <Input label="Reason" id="f-areason" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
          <Input label="Priority" id="f-apri" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} options={['Emergency', 'Urgent', 'Normal', 'Routine']} />
          <Button type="submit" className="w-full" icon={Check}>Book Appointment</Button>
        </form>
      </Modal>
    </div>
  );
}
function Records({ role, userId, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', diagnosis: '', prescription: '', notes: '' });

  const filteredRecords = role === 'Patient' ? state.records.filter((r: any) => r.patientId === userId)
                        : role === 'Doctor' ? state.records.filter((r: any) => r.doctorId === userId)
                        : state.records;

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      ...formData,
      id: state.nextRecordId,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      date: new Date().toISOString().slice(0, 10)
    };
    
    setState((prev: any) => ({
      ...prev,
      records: [...prev.records, newRecord],
      nextRecordId: prev.nextRecordId + 1
    }));
    
    setIsAddModalOpen(false);
    setFormData({ patientId: '', doctorId: '', diagnosis: '', prescription: '', notes: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete record?')) {
      setState((prev: any) => ({
        ...prev,
        records: prev.records.filter((r: any) => r.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Medical Records" 
        subtitle={`${filteredRecords.length} clinical histories`}
        action={(role === 'Admin' || role === 'Doctor') && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>Add Record</Button>
        )}
      />

      <Table 
        headers={['ID', 'Patient', 'Doctor', 'Date', 'Diagnosis', 'Prescription', 'Notes', 'Action']}
        rows={filteredRecords.map((rec: any) => {
          const p = state.patients.find((x: any) => x.id === rec.patientId);
          const d = state.doctors.find((x: any) => x.id === rec.doctorId);
          return [
            <span className="text-accent font-bold">#{rec.id}</span>,
            p?.name || `#${rec.patientId}`,
            d?.name || `#${rec.doctorId}`,
            rec.date,
            <span className="text-text font-bold">{rec.diagnosis}</span>,
            <span className="text-xs text-text-muted">{rec.prescription}</span>,
            <span className="text-[10px] text-text-muted italic">{rec.notes}</span>,
            (role === 'Admin' || role === 'Doctor') && (
              <Button size="sm" variant="ghost" icon={Trash2} className="text-danger hover:bg-danger/10" onClick={() => handleDelete(rec.id)} />
            )
          ];
        })}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Medical Record">
        <form onSubmit={handleAddRecord} className="space-y-4">
          <Input 
            label="Patient" 
            id="f-rpid" 
            value={formData.patientId} 
            onChange={e => setFormData({...formData, patientId: e.target.value})} 
            options={state.patients.map((p: any) => ({ v: p.id, l: `#${p.id} — ${p.name}` }))}
            required 
          />
          <Input 
            label="Doctor" 
            id="f-rdid" 
            value={formData.doctorId} 
            onChange={e => setFormData({...formData, doctorId: e.target.value})} 
            options={state.doctors.map((d: any) => ({ v: d.id, l: d.name }))}
            required 
          />
          <Input label="Diagnosis" id="f-rdiag" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} required />
          <Input label="Prescription" id="f-rpres" value={formData.prescription} onChange={e => setFormData({...formData, prescription: e.target.value})} />
          <Input label="Notes" id="f-rnotes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          <Button type="submit" className="w-full" icon={Check}>Save Record</Button>
        </form>
      </Modal>
    </div>
  );
}
function Billing({ role, userId, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [payMethod, setPayMethod] = useState('cash');
  const [txnId, setTxnId] = useState('');

  const [formData, setFormData] = useState({ patientId: '', consult: '', medicine: '', test: '', room: '', misc: '' });

  const filteredBills = role === 'Patient' ? state.bills.filter((b: any) => b.patientId === userId) : state.bills;
  const totalRevenue = filteredBills.filter((b: any) => b.status === 'Paid').reduce((a: any, b: any) => a + b.total, 0);
  const pendingAmount = filteredBills.filter((b: any) => b.status === 'Unpaid').reduce((a: any, b: any) => a + b.total, 0);

  const PAYMENT_METHODS = [
    { id: 'cash', label: 'Cash', icon: '💵', color: 'text-success' },
    { id: 'card', label: 'Card', icon: '💳', color: 'text-accent' },
    { id: 'upi', label: 'UPI', icon: '📱', color: 'text-info' },
    { id: 'online', label: 'Online', icon: '🌐', color: 'text-orange' },
  ];

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const consult = Number(formData.consult) || 0;
    const medicine = Number(formData.medicine) || 0;
    const test = Number(formData.test) || 0;
    const room = Number(formData.room) || 0;
    const misc = Number(formData.misc) || 0;
    const total = consult + medicine + test + room + misc;

    const newBill = {
      id: state.nextBillId,
      patientId: Number(formData.patientId),
      date: new Date().toISOString().slice(0, 10),
      status: 'Unpaid',
      consult, medicine, test, room, misc, total
    };
    
    setState((prev: any) => ({
      ...prev,
      bills: [...prev.bills, newBill],
      nextBillId: prev.nextBillId + 1
    }));
    
    setIsAddModalOpen(false);
    setFormData({ patientId: '', consult: '', medicine: '', test: '', room: '', misc: '' });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTxnId = ['card', 'upi', 'online'].includes(payMethod) ? txnId : `CASH-${selectedBill.id}-${Date.now().toString(36).toUpperCase()}`;
    
    setState((prev: any) => ({
      ...prev,
      bills: prev.bills.map((b: any) => b.id === selectedBill.id ? { 
        ...b, 
        status: 'Paid', 
        payMethod, 
        paidAt: new Date().toISOString().slice(0, 16).replace('T', ' '), 
        txnId: finalTxnId 
      } : b)
    }));
    
    setIsPayModalOpen(false);
    setIsViewModalOpen(true);
    setSelectedBill({ ...selectedBill, status: 'Paid', payMethod, txnId: finalTxnId });
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Billing & Payments" 
        subtitle={`₹${totalRevenue.toLocaleString()} collected · ₹${pendingAmount.toLocaleString()} pending`}
        action={role === 'Admin' && (
          <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>Generate Bill</Button>
        )}
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { l: 'Total Bills', v: filteredBills.length, c: 'text-accent' },
          { l: 'Paid', v: filteredBills.filter((b: any) => b.status === 'Paid').length, c: 'text-success' },
          { l: 'Unpaid', v: filteredBills.filter((b: any) => b.status === 'Unpaid').length, c: 'text-danger' },
          { l: 'Revenue', v: `₹${totalRevenue.toLocaleString()}`, c: 'text-success' },
          { l: 'Pending', v: `₹${pendingAmount.toLocaleString()}`, c: 'text-warning' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-2xl text-center">
            <div className={cn("text-xl font-black", s.c)}>{s.v}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <Table 
        headers={['Bill ID', 'Patient', 'Date', 'Amount', 'Method', 'Status', 'Actions']}
        rows={filteredBills.map((b: any) => {
          const p = state.patients.find((x: any) => x.id === b.patientId);
          return [
            <span className="text-accent font-bold">#{b.id}</span>,
            p?.name || `#${b.patientId}`,
            b.date,
            <span className="font-bold">₹{b.total.toLocaleString()}</span>,
            b.payMethod ? <span className="text-xs text-text-sub capitalize">{b.payMethod}</span> : <span className="text-text-muted">—</span>,
            <Badge label={b.status} variant={b.status === 'Paid' ? 'success' : 'warning'} />,
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" icon={FileText} onClick={() => { setSelectedBill(b); setIsViewModalOpen(true); }}>Receipt</Button>
              {role === 'Admin' && b.status !== 'Paid' && (
                <Button size="sm" variant="success" onClick={() => { setSelectedBill(b); setIsPayModalOpen(true); }}>Pay</Button>
              )}
            </div>
          ];
        })}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Generate Bill">
        <form onSubmit={handleAddBill} className="space-y-4">
          <Input 
            label="Patient" 
            id="f-bpid" 
            value={formData.patientId} 
            onChange={e => setFormData({...formData, patientId: e.target.value})} 
            options={state.patients.map((p: any) => ({ v: p.id, l: `#${p.id} — ${p.name}` }))}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Consultation (₹)" id="f-bconsult" type="number" value={formData.consult} onChange={e => setFormData({...formData, consult: e.target.value})} />
            <Input label="Medicine (₹)" id="f-bmed" type="number" value={formData.medicine} onChange={e => setFormData({...formData, medicine: e.target.value})} />
            <Input label="Tests (₹)" id="f-btest" type="number" value={formData.test} onChange={e => setFormData({...formData, test: e.target.value})} />
            <Input label="Room Charge (₹)" id="f-broom" type="number" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
            <Input label="Misc / Other (₹)" id="f-bmisc" type="number" value={formData.misc} onChange={e => setFormData({...formData, misc: e.target.value})} className="col-span-2" />
          </div>
          <Button type="submit" className="w-full" icon={Check}>Generate Bill</Button>
        </form>
      </Modal>

      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Process Payment">
        {selectedBill && (
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="bg-bg border border-border rounded-2xl p-5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-bold">Bill #{selectedBill.id}</span>
              <span className="text-2xl font-black text-accent">₹{selectedBill.total.toLocaleString()}</span>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPayMethod(pm.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                      payMethod === pm.id ? "bg-accent/10 border-accent text-accent" : "bg-input border-input-border text-text-muted hover:border-border-light"
                    )}
                  >
                    <span className="text-xl">{pm.icon}</span>
                    <span className="text-sm font-bold">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {['card', 'upi', 'online'].includes(payMethod) && (
              <Input 
                label={payMethod === 'upi' ? 'UPI Transaction ID' : 'Transaction Reference'} 
                id="f-txnid" 
                value={txnId} 
                onChange={e => setTxnId(e.target.value)} 
                required 
              />
            )}

            <Button type="submit" variant="success" className="w-full" icon={Check}>Confirm Payment</Button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Receipt">
        {selectedBill && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-accent/10 to-info/5 rounded-3xl border border-accent/20">
              <div className="text-3xl mb-2">🏥</div>
              <h4 className="text-lg font-black tracking-tight">GSR HOSPITAL</h4>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Cuddalore, Tamil Nadu · Emergency: 104</p>
              <div className={cn(
                "inline-block mt-4 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                selectedBill.status === 'Paid' ? "bg-success/20 text-success border border-success/30" : "bg-warning/20 text-warning border border-warning/30"
              )}>
                {selectedBill.status === 'Paid' ? '✓ PAID' : '⚠ UNPAID'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Patient', v: state.patients.find((x: any) => x.id === selectedBill.patientId)?.name || `#${selectedBill.patientId}` },
                { l: 'Bill ID', v: `#${selectedBill.id}` },
                { l: 'Bill Date', v: selectedBill.date },
                { l: 'Paid At', v: selectedBill.paidAt || '—' }
              ].map((item, i) => (
                <div key={i} className="bg-bg border border-border rounded-xl p-3">
                  <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{item.l}</div>
                  <div className="text-xs font-bold">{item.v}</div>
                </div>
              ))}
            </div>

            <div className="bg-bg border border-border rounded-2xl p-5 space-y-3">
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">Charges Breakdown</div>
              {[
                { l: 'Consultation', v: selectedBill.consult },
                { l: 'Medicine', v: selectedBill.medicine },
                { l: 'Tests', v: selectedBill.test },
                { l: 'Room Charge', v: selectedBill.room },
                { l: 'Misc / Other', v: selectedBill.misc }
              ].filter(item => item.v > 0).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-sub">{item.l}</span>
                  <span className="font-bold">₹{item.v.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="text-base font-black">Total Amount</span>
                <span className="text-xl font-black text-accent">₹{selectedBill.total.toLocaleString()}</span>
              </div>
            </div>

            {selectedBill.status === 'Paid' && (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">✓</span>
                  <span className="text-sm font-bold text-success">Paid via {selectedBill.payMethod}</span>
                </div>
                {selectedBill.txnId && (
                  <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                    Ref: <span className="font-mono text-text-sub">{selectedBill.txnId}</span>
                  </div>
                )}
              </div>
            )}
            
            <Button onClick={() => setIsViewModalOpen(false)} className="w-full" variant="outline">Close Receipt</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
function AmbulancePage({ role, userId, state, setState }: any) {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ambulanceId: '', pickup: '', dest: '' });
  const [addFormData, setAddFormData] = useState({ vehicleNo: '', driver: '', dPhone: '', location: '' });

  const requester = role === 'Patient' ? `PATIENT-${userId}` : role === 'Staff' ? `STAFF-${userId}` : role === 'Doctor' ? `DOCTOR-${userId}` : 'ADMIN';
  const myBookings = state.ambBookings.filter((b: any) => b.requestedBy === requester);

  const handleBookAmb = (e: React.FormEvent) => {
    e.preventDefault();
    const ambId = Number(formData.ambulanceId);
    const newBooking = {
      id: state.nextAmbBookId,
      ambulanceId: ambId,
      requestedBy: requester,
      pickup: formData.pickup,
      dest: formData.dest,
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Confirmed'
    };

    setState((prev: any) => ({
      ...prev,
      ambBookings: [...prev.ambBookings, newBooking],
      nextAmbBookId: prev.nextAmbBookId + 1,
      ambulances: prev.ambulances.map((a: any) => a.id === ambId ? { ...a, status: 'On-Duty' } : a)
    }));

    setIsBookModalOpen(false);
    setFormData({ ambulanceId: '', pickup: '', dest: '' });
  };

  const handleAddAmb = (e: React.FormEvent) => {
    e.preventDefault();
    const newAmb = {
      ...addFormData,
      id: state.nextAmbId,
      status: 'Available'
    };

    setState((prev: any) => ({
      ...prev,
      ambulances: [...prev.ambulances, newAmb],
      nextAmbId: prev.nextAmbId + 1
    }));

    setIsAddModalOpen(false);
    setAddFormData({ vehicleNo: '', driver: '', dPhone: '', location: '' });
  };

  const updateAmbStatus = (id: number, status: string) => {
    setState((prev: any) => ({
      ...prev,
      ambulances: prev.ambulances.map((a: any) => a.id === id ? { ...a, status } : a)
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Ambulance Management" 
        subtitle="Live fleet tracking & emergency booking"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setIsBookModalOpen(true)} icon={AmbulanceIcon} variant="danger">Book Ambulance</Button>
            {role === 'Admin' && <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} variant="outline">Add Vehicle</Button>}
          </div>
        }
      />

      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="font-bold">Live Map — Chennai Fleet</h3>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold text-success uppercase tracking-widest">Live Tracking Active</span>
          </div>
        </div>
        
        <div className="h-[300px] bg-bg rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-accent/20 border-2 border-accent flex items-center justify-center text-accent font-black text-xl shadow-2xl shadow-accent/40">H</div>
          
          {state.ambulances.map((a: any, i: number) => {
            const positions = [[20, 30], [70, 25], [35, 75], [80, 65], [15, 65]];
            const pos = positions[i % positions.length];
            return (
              <motion.div 
                key={a.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute flex flex-col items-center gap-1"
                style={{ top: `${pos[1]}%`, left: `${pos[0]}%` }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg",
                  a.status === 'Available' ? "bg-success/20 border-success text-success" : a.status === 'On-Duty' ? "bg-warning/20 border-warning text-warning" : "bg-danger/20 border-danger text-danger"
                )}>
                  <AmbulanceIcon className="w-5 h-5" />
                </div>
                <div className="bg-card border border-border px-2 py-0.5 rounded-md text-[8px] font-bold whitespace-nowrap shadow-sm">
                  {a.vehicleNo.slice(-4)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.ambulances.map((a: any) => (
          <div key={a.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:border-border-light transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-accent font-black tracking-tight">{a.vehicleNo}</span>
              <Badge label={a.status} variant={a.status === 'Available' ? 'success' : a.status === 'On-Duty' ? 'warning' : 'danger'} />
            </div>
            <div className="space-y-2 mb-6">
              <div className="text-sm font-bold">🧑‍✈️ {a.driver}</div>
              <div className="text-xs text-text-muted font-medium">📞 {a.dPhone}</div>
              <div className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> {a.location}
              </div>
            </div>
            {role === 'Admin' && (
              <div className="flex flex-wrap gap-2">
                {['Available', 'On-Duty', 'Maintenance'].map(st => (
                  <Button 
                    key={st} 
                    size="sm" 
                    variant="outline" 
                    className={cn(
                      "text-[10px] py-1 px-2",
                      a.status === st && "bg-accent/10 border-accent text-accent"
                    )}
                    onClick={() => updateAmbStatus(a.id, st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {myBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">My Bookings</h3>
          <Table 
            headers={['ID', 'Ambulance', 'Pickup', 'Destination', 'Time', 'Status']}
            rows={myBookings.map((b: any) => {
              const a = state.ambulances.find((x: any) => x.id === b.ambulanceId);
              return [
                <span className="text-accent font-bold">#{b.id}</span>,
                a?.vehicleNo || `#${b.ambulanceId}`,
                b.pickup,
                b.dest || '—',
                b.time,
                <Badge label={b.status} variant="success" />
              ];
            })}
          />
        </div>
      )}

      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Book Ambulance">
        <form onSubmit={handleBookAmb} className="space-y-4">
          <Input 
            label="Select Ambulance" 
            id="f-bambid" 
            value={formData.ambulanceId} 
            onChange={e => setFormData({...formData, ambulanceId: e.target.value})} 
            options={state.ambulances.filter((a: any) => a.status === 'Available').map((a: any) => ({ v: a.id, l: `${a.vehicleNo} — ${a.location}` }))}
            required 
          />
          <Input label="Pickup Location" id="f-bpickup" value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} required placeholder="Enter pickup address" />
          <Input label="Destination" id="f-bdest" value={formData.dest} onChange={e => setFormData({...formData, dest: e.target.value})} placeholder="GSR Hospital (Default)" />
          <Button type="submit" className="w-full" variant="danger" icon={Check}>Confirm Booking</Button>
        </form>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Ambulance">
        <form onSubmit={handleAddAmb} className="space-y-4">
          <Input label="Vehicle Number" id="f-avno" value={addFormData.vehicleNo} onChange={e => setAddFormData({...addFormData, vehicleNo: e.target.value})} required placeholder="e.g. TN01 AMB 004" />
          <Input label="Driver Name" id="f-adriver" value={addFormData.driver} onChange={e => setAddFormData({...addFormData, driver: e.target.value})} required />
          <Input label="Driver Phone" id="f-adphone" value={addFormData.dPhone} onChange={e => setAddFormData({...addFormData, dPhone: e.target.value})} />
          <Input label="Current Location" id="f-aloc" value={addFormData.location} onChange={e => setAddFormData({...addFormData, location: e.target.value})} />
          <Button type="submit" className="w-full" icon={Check}>Add Ambulance</Button>
        </form>
      </Modal>
    </div>
  );
}
function Food({ role, userId, state, setState }: any) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [foodCat, setFoodCat] = useState('All');
  const [formData, setFormData] = useState({ qty: '1', ward: '' });

  const requester = role === 'Patient' ? `PATIENT-${userId}` : role === 'Staff' ? `STAFF-${userId}` : role === 'Doctor' ? `DOCTOR-${userId}` : 'ADMIN';
  const myOrders = state.foodOrders.filter((o: any) => o.requestedBy === requester);
  const categories = ['All', ...new Set(state.foodMenu.map((m: any) => m.cat))];
  const menuList = foodCat === 'All' ? state.foodMenu : state.foodMenu.filter((m: any) => m.cat === foodCat);

  const handleOrderFood = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: state.nextFoodOrderId,
      menuItemId: selectedItem.id,
      qty: Number(formData.qty),
      ward: formData.ward,
      requestedBy: requester,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Pending'
    };

    setState((prev: any) => ({
      ...prev,
      foodOrders: [...prev.foodOrders, newOrder],
      nextFoodOrderId: prev.nextFoodOrderId + 1
    }));

    setIsOrderModalOpen(false);
    setSelectedItem(null);
    setFormData({ qty: '1', ward: '' });
  };

  const deliverOrder = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      foodOrders: prev.foodOrders.map((o: any) => o.id === id ? { ...o, status: 'Delivered' } : o)
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Food & Canteen" subtitle="Healthy hospital meals delivered to wards" />

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFoodCat(c)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              foodCat === c ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-card border border-border text-text-muted hover:border-border-light"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuList.map((item: any) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col"
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h4 className="text-base font-black mb-1">{item.name}</h4>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-6">{item.cat}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xl font-black text-accent">₹{item.price}</span>
              <Button size="sm" onClick={() => { setSelectedItem(item); setIsOrderModalOpen(true); }}>Order</Button>
            </div>
          </motion.div>
        ))}
      </div>

      {(role === 'Admin' || role === 'Staff') ? (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold">All Food Orders</h3>
          <Table 
            headers={['ID', 'Item', 'Qty', 'Ward', 'Date', 'Status', 'Action']}
            rows={state.foodOrders.map((o: any) => {
              const m = state.foodMenu.find((x: any) => x.id === o.menuItemId);
              return [
                <span className="text-accent font-bold">#{o.id}</span>,
                m?.name || `#${o.menuItemId}`,
                o.qty,
                o.ward || '—',
                o.date,
                <Badge label={o.status} variant={o.status === 'Delivered' ? 'success' : 'warning'} />,
                o.status !== 'Delivered' && <Button size="sm" variant="success" onClick={() => deliverOrder(o.id)}>Deliver</Button>
              ];
            })}
          />
        </div>
      ) : myOrders.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold">My Orders</h3>
          <Table 
            headers={['ID', 'Item', 'Qty', 'Date', 'Status']}
            rows={myOrders.map((o: any) => {
              const m = state.foodMenu.find((x: any) => x.id === o.menuItemId);
              return [
                <span className="text-accent font-bold">#{o.id}</span>,
                m?.name || `#${o.menuItemId}`,
                o.qty,
                o.date,
                <Badge label={o.status} variant={o.status === 'Delivered' ? 'success' : 'warning'} />
              ];
            })}
          />
        </div>
      )}

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Order Food">
        {selectedItem && (
          <form onSubmit={handleOrderFood} className="space-y-4">
            <div className="bg-bg border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">{selectedItem.name}</div>
                <div className="text-xs text-text-muted">{selectedItem.cat}</div>
              </div>
              <div className="text-lg font-black text-accent">₹{selectedItem.price}</div>
            </div>
            <Input label="Quantity" id="f-foodqty" type="number" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} required />
            <Input label="Ward / Room Number" id="f-foodward" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} placeholder="e.g. ICU-01 or Room 302" />
            <Button type="submit" className="w-full" icon={Check}>Place Order</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
function MedicinePage({ role, userId, state, setState }: any) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ medicineId: '', qty: '1' });
  const [addFormData, setAddFormData] = useState({ name: '', cat: 'Analgesic', price: '', stock: '' });

  const requester = role === 'Patient' ? `PATIENT-${userId}` : role === 'Staff' ? `STAFF-${userId}` : role === 'Doctor' ? `DOCTOR-${userId}` : 'ADMIN';
  const myOrders = state.medicineOrders.filter((o: any) => o.requestedBy === requester);

  const handleOrderMed = (e: React.FormEvent) => {
    e.preventDefault();
    const medId = Number(formData.medicineId);
    const qty = Number(formData.qty);
    const med = state.medicines.find((m: any) => m.id === medId);

    if (!med || med.stock < qty) {
      alert('Insufficient stock!');
      return;
    }

    const newOrder = {
      id: state.nextMedOrderId,
      medicineId: medId,
      qty,
      requestedBy: requester,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Pending'
    };

    setState((prev: any) => ({
      ...prev,
      medicineOrders: [...prev.medicineOrders, newOrder],
      nextMedOrderId: prev.nextMedOrderId + 1,
      medicines: prev.medicines.map((m: any) => m.id === medId ? { ...m, stock: m.stock - qty } : m)
    }));

    setIsOrderModalOpen(false);
    setFormData({ medicineId: '', qty: '1' });
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed = {
      id: Date.now(),
      name: addFormData.name,
      cat: addFormData.cat,
      price: Number(addFormData.price),
      stock: Number(addFormData.stock)
    };

    setState((prev: any) => ({
      ...prev,
      medicines: [...prev.medicines, newMed]
    }));

    setIsAddModalOpen(false);
    setAddFormData({ name: '', cat: 'Analgesic', price: '', stock: '' });
  };

  const dispenseOrder = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      medicineOrders: prev.medicineOrders.map((o: any) => o.id === id ? { ...o, status: 'Dispensed' } : o)
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Pharmacy & Medicine" 
        subtitle="Inventory management and prescription fulfillment"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setIsOrderModalOpen(true)} icon={Pill} variant="info">Order Medicine</Button>
            {role === 'Admin' && <Button onClick={() => setIsAddModalOpen(true)} icon={Plus} variant="outline">Add Medicine</Button>}
          </div>
        }
      />

      <Table 
        headers={['ID', 'Name', 'Category', 'Price', 'Stock', 'Action']}
        rows={state.medicines.map((m: any) => [
          <span className="text-accent font-bold">#{m.id}</span>,
          <span className="text-text font-bold">{m.name}</span>,
          <Badge label={m.cat} variant="info" />,
          `₹${m.price}`,
          <span className={cn("font-black", m.stock < 20 ? "text-danger" : "text-success")}>{m.stock}</span>,
          <Button size="sm" variant="ghost" onClick={() => { setFormData({ medicineId: String(m.id), qty: '1' }); setIsOrderModalOpen(true); }}>Order</Button>
        ])}
      />

      {(role === 'Admin' || role === 'Staff') ? (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold">Prescription Orders</h3>
          <Table 
            headers={['ID', 'Medicine', 'Qty', 'Date', 'Status', 'Action']}
            rows={state.medicineOrders.map((o: any) => {
              const m = state.medicines.find((x: any) => x.id === o.medicineId);
              return [
                <span className="text-accent font-bold">#{o.id}</span>,
                m?.name || `#${o.medicineId}`,
                o.qty,
                o.date,
                <Badge label={o.status} variant={o.status === 'Dispensed' ? 'success' : 'warning'} />,
                o.status !== 'Dispensed' && <Button size="sm" variant="success" onClick={() => dispenseOrder(o.id)}>Dispense</Button>
              ];
            })}
          />
        </div>
      ) : myOrders.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold">My Medicine Orders</h3>
          <Table 
            headers={['ID', 'Medicine', 'Qty', 'Date', 'Status']}
            rows={myOrders.map((o: any) => {
              const m = state.medicines.find((x: any) => x.id === o.medicineId);
              return [
                <span className="text-accent font-bold">#{o.id}</span>,
                m?.name || `#${o.medicineId}`,
                o.qty,
                o.date,
                <Badge label={o.status} variant={o.status === 'Dispensed' ? 'success' : 'warning'} />
              ];
            })}
          />
        </div>
      )}

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Order Medicine">
        <form onSubmit={handleOrderMed} className="space-y-4">
          <Input 
            label="Select Medicine" 
            id="f-medid" 
            value={formData.medicineId} 
            onChange={e => setFormData({...formData, medicineId: e.target.value})} 
            options={state.medicines.filter((m: any) => m.stock > 0).map((m: any) => ({ v: m.id, l: `${m.name} — ₹${m.price} (${m.stock} left)` }))}
            required 
          />
          <Input label="Quantity" id="f-medqty" type="number" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} required />
          <Button type="submit" className="w-full" variant="info" icon={Check}>Place Order</Button>
        </form>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Medicine">
        <form onSubmit={handleAddMed} className="space-y-4">
          <Input label="Medicine Name" id="f-mname" value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} required />
          <Input label="Category" id="f-mcat" value={addFormData.cat} onChange={e => setAddFormData({...addFormData, cat: e.target.value})} options={['Analgesic', 'Antibiotic', 'Cardiac', 'Electrolyte', 'Antiallergic', 'Antacid', 'Vitamin', 'Other']} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" id="f-mprice" type="number" value={addFormData.price} onChange={e => setAddFormData({...addFormData, price: e.target.value})} required />
            <Input label="Initial Stock" id="f-mstock" type="number" value={addFormData.stock} onChange={e => setAddFormData({...addFormData, stock: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full" icon={Check}>Add to Inventory</Button>
        </form>
      </Modal>
    </div>
  );
}
function Blood({ role, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bloodFilter, setBloodFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', blood: 'A+', phone: '', address: '', lastDonation: '' });

  const requester = role === 'Patient' ? `PATIENT-${state.patientId}` : 'ADMIN';
  const groups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const filteredDonors = bloodFilter === 'All' ? state.bloodDonors : state.bloodDonors.filter((d: any) => d.blood === bloodFilter);

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonor = {
      ...formData,
      id: state.nextBloodId,
      available: true,
      regBy: requester
    };

    setState((prev: any) => ({
      ...prev,
      bloodDonors: [...prev.bloodDonors, newDonor],
      nextBloodId: prev.nextBloodId + 1
    }));

    setIsAddModalOpen(false);
    setFormData({ name: '', blood: 'A+', phone: '', address: '', lastDonation: '' });
  };

  const toggleAvailability = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      bloodDonors: prev.bloodDonors.map((d: any) => d.id === id ? { ...d, available: !d.available } : d)
    }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Blood Bank" 
        subtitle="Emergency blood donor registry"
        action={<Button onClick={() => setIsAddModalOpen(true)} icon={Heart} variant="danger">Register Donor</Button>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {['O+', 'A+', 'B+', 'AB-'].map(g => (
          <div key={g} className="bg-card border border-danger/20 p-4 rounded-2xl text-center">
            <div className="text-2xl font-black text-danger">{g}</div>
            <div className="text-lg font-bold">{state.bloodDonors.filter((d: any) => d.blood === g).length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">donors</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => setBloodFilter(g)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              bloodFilter === g ? "bg-danger text-white shadow-lg shadow-danger/20" : "bg-card border border-border text-text-muted hover:border-border-light"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <Table 
        headers={['ID', 'Name', 'Blood', 'Phone', 'Address', 'Last Donation', 'Available', 'Action']}
        rows={filteredDonors.map((d: any) => [
          <span className="text-accent font-bold">#{d.id}</span>,
          <span className="text-text font-bold">{d.name}</span>,
          <Badge label={d.blood} variant="danger" />,
          d.phone,
          <span className="max-w-[120px] truncate block">{d.address}</span>,
          d.lastDonation || '—',
          <Badge label={d.available ? 'Yes' : 'No'} variant={d.available ? 'success' : 'danger'} />,
          role === 'Admin' && <Button size="sm" variant="ghost" onClick={() => toggleAvailability(d.id)}>{d.available ? 'Pause' : 'Activate'}</Button>
        ])}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Blood Donor">
        <form onSubmit={handleAddDonor} className="space-y-4">
          <Input label="Full Name" id="f-bdname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Blood Group" id="f-bdblood" value={formData.blood} onChange={e => setFormData({...formData, blood: e.target.value})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
            <Input label="Phone" id="f-bdphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <Input label="Address" id="f-bdaddr" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <Input label="Last Donation Date" id="f-bdlast" type="date" value={formData.lastDonation} onChange={e => setFormData({...formData, lastDonation: e.target.value})} />
          <Button type="submit" className="w-full" variant="danger" icon={Check}>Register Donor</Button>
        </form>
      </Modal>
    </div>
  );
}
function Organ({ role, state, setState }: any) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '', blood: 'A+' });

  const organTypes = ['Kidney', 'Liver', 'Heart', 'Cornea', 'Lungs', 'Pancreas'];
  const requester = role === 'Patient' ? `PATIENT-${state.patientId}` : 'ADMIN';

  const toggleOrgan = (o: string) => {
    setSelectedOrgans(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
  };

  const handleAddOrgan = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrgans.length === 0) {
      alert('Please select at least one organ.');
      return;
    }

    const newDonor = {
      ...formData,
      id: state.nextOrganId,
      organs: selectedOrgans.join(','),
      regDate: new Date().toISOString().slice(0, 10),
      regBy: requester,
      consent: true
    };

    setState((prev: any) => ({
      ...prev,
      organDonors: [...prev.organDonors, newDonor],
      nextOrganId: prev.nextOrganId + 1
    }));

    setIsAddModalOpen(false);
    setSelectedOrgans([]);
    setFormData({ name: '', phone: '', blood: 'A+' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove organ donor?')) {
      setState((prev: any) => ({
        ...prev,
        organDonors: prev.organDonors.filter((d: any) => d.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Organ Registry" 
        subtitle="Life-saving organ donation database"
        action={<Button onClick={() => setIsAddModalOpen(true)} icon={UserCircle} variant="secondary">Register Donor</Button>}
      />

      <div className="bg-card border border-info/20 rounded-3xl p-6 shadow-sm mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Organ Registry Summary</h3>
        <div className="flex flex-wrap gap-8">
          {organTypes.map(o => (
            <div key={o} className="text-center">
              <div className="text-2xl font-black text-info">{state.organDonors.filter((d: any) => d.organs.includes(o)).length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{o}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.organDonors.map((d: any) => (
          <motion.div 
            key={d.id}
            whileHover={{ y: -4 }}
            className="bg-card border border-info/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-black">{d.name}</h4>
              <Badge label={d.consent ? 'Consented' : 'Pending'} variant={d.consent ? 'success' : 'warning'} />
            </div>
            <div className="text-xs text-text-muted font-medium mb-4">
              📞 {d.phone} · {d.blood} · Registered: {d.regDate}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {d.organs.split(',').map((o: string) => (
                <Badge key={o} label={o.trim()} variant="purple" />
              ))}
            </div>
            {role === 'Admin' && (
              <Button size="sm" variant="outline" className="text-danger border-danger/20 hover:bg-danger/10 hover:border-danger" onClick={() => handleDelete(d.id)}>Remove</Button>
            )}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Organ Donor">
        <form onSubmit={handleAddOrgan} className="space-y-6">
          <Input label="Full Name" id="f-odname" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" id="f-odphone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <Input label="Blood Group" id="f-odblood" value={formData.blood} onChange={e => setFormData({...formData, blood: e.target.value})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
          </div>
          
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Organs to Donate</label>
            <div className="flex flex-wrap gap-2">
              {organTypes.map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleOrgan(o)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                    selectedOrgans.includes(o) ? "bg-info/10 border-info text-info" : "bg-input border-input-border text-text-muted hover:border-border-light"
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <p className="text-xs text-success font-semibold leading-relaxed">
              By registering, you provide legal consent for organ donation in the event of brain death, as per hospital policy.
            </p>
          </div>

          <Button type="submit" className="w-full" variant="secondary" icon={Check}>Register as Donor</Button>
        </form>
      </Modal>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-4 text-accent">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-2">{title}</h2>
      <p className="text-text-muted max-w-md">This section is currently being implemented. Check back soon for full functionality.</p>
    </div>
  );
}
