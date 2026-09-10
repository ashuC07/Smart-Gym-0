import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Dumbbell, CalendarDays, BarChart2, MessageCircle, Bell, User,
  Settings, Menu, X, Activity, Zap, Wifi, WifiOff, Check, AlertTriangle,
  Clock, Timer, Play, Pause, Square, TrendingUp, Target, Award, Flame,
  QrCode, ChevronRight, ChevronLeft, Filter, Search, Plus, Shield, Users,
  Cpu, Radio, Server, FileText, Wrench, LogOut, LogIn, Star, Heart, Send,
  Bot, RefreshCw, Download, ArrowRight, Eye, MapPin, Sparkles, AlertCircle,
  UserPlus, Mail, Lock, ChevronDown, Power, Database, Cloud, Layers, Edit,
  Info, Globe, MoreVertical, TrendingDown, Gauge, Antenna, ToggleLeft,
  ToggleRight, Scan, MonitorCheck, Hash, Bolt, BarChart, LineChart, PieChart
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar,
  LineChart as ReLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, Legend
} from "recharts";

// ==================== DESIGN TOKENS ====================
// Dark charcoal-navy system with electric cyan accent
// bg-[#080b14] main | bg-[#0f1320] card | bg-[#161b2e] elevated
// text-cyan-400 accent | borders cyan-500/15

// ==================== CONSTANTS ====================
const STATUS = {
  available:   { label: "AVAILABLE",   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/25", dot: "bg-emerald-400" },
  "in-use":    { label: "IN USE",      color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/25",     dot: "bg-red-400"     },
  reserved:    { label: "RESERVED",    color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/25",   dot: "bg-amber-400"   },
  maintenance: { label: "MAINTENANCE", color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/25",  dot: "bg-orange-400"  },
};

const CATEGORIES = ["All", "Cardio", "Strength", "Legs", "Upper Body"];

// ==================== MOCK DATA ====================
const mkEquipment = () => [
  { id:"T-001", name:"Treadmill",      model:"Pro X2000",   cat:"cardio",      zone:"Zone A", status:"available",    user:null,       sessionStart:null, health:92, sessions:423, avgMin:22, todayMin:272, lastMaint:"2026-08-12", nextMaint:"2026-10-12" },
  { id:"T-002", name:"Treadmill",      model:"Pro X2000",   cat:"cardio",      zone:"Zone A", status:"in-use",       user:"Alex M.",  sessionStart:Date.now()-762000, health:88, sessions:387, avgMin:19, todayMin:228, lastMaint:"2026-07-20", nextMaint:"2026-09-20" },
  { id:"B-001", name:"Bench Press",    model:"PowerLift 5", cat:"strength",    zone:"Zone B", status:"reserved",     user:"Priya S.", sessionStart:null, health:96, sessions:512, avgMin:25, todayMin:300, lastMaint:"2026-08-01", nextMaint:"2026-10-01" },
  { id:"B-002", name:"Bench Press",    model:"PowerLift 5", cat:"strength",    zone:"Zone B", status:"available",    user:null,       sessionStart:null, health:94, sessions:498, avgMin:24, todayMin:180, lastMaint:"2026-08-05", nextMaint:"2026-10-05" },
  { id:"L-001", name:"Leg Press",      model:"LegForce 900",cat:"legs",        zone:"Zone C", status:"in-use",       user:"Rohit K.", sessionStart:Date.now()-482000, health:79, sessions:623, avgMin:28, todayMin:336, lastMaint:"2026-06-15", nextMaint:"2026-08-15" },
  { id:"LP-001",name:"Lat Pulldown",   model:"CablePro V3", cat:"upper-body",  zone:"Zone B", status:"available",    user:null,       sessionStart:null, health:98, sessions:298, avgMin:20, todayMin:120, lastMaint:"2026-08-20", nextMaint:"2026-10-20" },
  { id:"C-001", name:"Cable Machine",  model:"FunctionalX", cat:"strength",    zone:"Zone B", status:"maintenance",  user:null,       sessionStart:null, health:43, sessions:876, avgMin:30, todayMin:0,   lastMaint:"2026-07-01", nextMaint:"2026-07-30" },
  { id:"S-001", name:"Squat Rack",     model:"PowerCage 7", cat:"strength",    zone:"Zone B", status:"available",    user:null,       sessionStart:null, health:91, sessions:445, avgMin:32, todayMin:192, lastMaint:"2026-08-10", nextMaint:"2026-10-10" },
  { id:"R-001", name:"Rowing Machine", model:"WaterRow 3",  cat:"cardio",      zone:"Zone A", status:"available",    user:null,       sessionStart:null, health:95, sessions:234, avgMin:25, todayMin:150, lastMaint:"2026-08-15", nextMaint:"2026-10-15" },
  { id:"E-001", name:"Elliptical",     model:"GlideMax",    cat:"cardio",      zone:"Zone A", status:"reserved",     user:"Sam T.",   sessionStart:null, health:87, sessions:312, avgMin:30, todayMin:210, lastMaint:"2026-07-25", nextMaint:"2026-09-25" },
];

const IOT_DEVICES = [
  { id:"ESP-001", name:"ESP8266-GYM-01", type:"ESP8266",    zone:"Zone A", status:"connected", signal:-58, lastSec:2  },
  { id:"ESP-002", name:"ESP8266-GYM-02", type:"ESP8266",    zone:"Zone B", status:"connected", signal:-62, lastSec:1  },
  { id:"ARD-001", name:"Arduino-UNO-01", type:"Arduino UNO",zone:"Zone A", status:"connected", signal:null,lastSec:2  },
  { id:"IR-001",  name:"IR-Sensor-T001", type:"IR Sensor",  zone:"T-001",  status:"active",    signal:null,lastSec:1, battery:87 },
  { id:"IR-002",  name:"IR-Sensor-T002", type:"IR Sensor",  zone:"T-002",  status:"active",    signal:null,lastSec:2, battery:92 },
  { id:"MPU-001", name:"MPU6050-01",     type:"MPU6050",    zone:"Zone A", status:"active",    signal:null,lastSec:1, battery:78 },
  { id:"LCD-001", name:"LCD-Display-01", type:"16x2 LCD",   zone:"Entrance",status:"active",   signal:null,lastSec:5  },
  { id:"LED-001", name:"LED-Module-01",  type:"LED Status", zone:"Zone A", status:"active",    signal:null,lastSec:1  },
];

const MEMBERS = [
  { id:"M001", name:"Alex Martinez",  email:"alex@smartgym.io",   workouts:47, lastVisit:"Sep 8",  streak:7,  status:"active",   joined:"Jan 2026" },
  { id:"M002", name:"Priya Sharma",   email:"priya@smartgym.io",  workouts:32, lastVisit:"Sep 9",  streak:3,  status:"active",   joined:"Mar 2026" },
  { id:"M003", name:"Rohit Kumar",    email:"rohit@smartgym.io",  workouts:18, lastVisit:"Sep 7",  streak:1,  status:"active",   joined:"May 2026" },
  { id:"M004", name:"Sam Taylor",     email:"sam@smartgym.io",    workouts:65, lastVisit:"Sep 9",  streak:14, status:"active",   joined:"Nov 2025" },
  { id:"M005", name:"Rahul Singh",    email:"rahul@smartgym.io",  workouts:8,  lastVisit:"Aug 28", streak:0,  status:"inactive", joined:"Jul 2026" },
  { id:"M006", name:"Neha Joshi",     email:"neha@smartgym.io",   workouts:21, lastVisit:"Sep 9",  streak:5,  status:"active",   joined:"Feb 2026" },
];

const mkBookings = () => [
  { id:"BK001", eqId:"T-001", eqName:"Treadmill",     date:"Sep 9",  time:"10:00", dur:30, status:"upcoming", qr:"QR-BK001" },
  { id:"BK002", eqId:"B-001", eqName:"Bench Press",   date:"Sep 9",  time:"14:00", dur:45, status:"completed",qr:"QR-BK002" },
  { id:"BK003", eqId:"L-001", eqName:"Leg Press",     date:"Sep 10", time:"09:00", dur:30, status:"upcoming", qr:"QR-BK003" },
  { id:"BK004", eqId:"R-001", eqName:"Rowing Machine",date:"Sep 8",  time:"07:00", dur:20, status:"completed",qr:"QR-BK004" },
];

const mkNotifs = () => [
  { id:1, type:"booking",     title:"Booking Confirmed",  msg:"Treadmill T-001 at 10:00 AM confirmed.",              time:"2m ago",  read:false },
  { id:2, type:"alert",       title:"Equipment Available",msg:"Bench Press B-002 is now available.",                  time:"15m ago", read:false },
  { id:3, type:"maintenance", title:"Maintenance Alert",  msg:"Cable Machine C-001 requires maintenance.",            time:"1h ago",  read:true  },
  { id:4, type:"workout",     title:"Workout Complete",   msg:"Great session! 45 min on Leg Press. Est. 280 kcal.",   time:"3h ago",  read:true  },
  { id:5, type:"system",      title:"Gym Opens in 30 min",msg:"Your 6:00 AM booking starts soon.",                   time:"Yesterday",read:true },
];

const HOURLY_DATA = [
  {t:"6AM",u:12},{t:"7AM",u:28},{t:"8AM",u:42},{t:"9AM",u:35},{t:"10AM",u:25},
  {t:"11AM",u:20},{t:"12PM",u:32},{t:"1PM",u:28},{t:"2PM",u:18},{t:"3PM",u:15},
  {t:"4PM",u:22},{t:"5PM",u:38},{t:"6PM",u:55},{t:"7PM",u:62},{t:"8PM",u:48},
  {t:"9PM",u:30},{t:"10PM",u:15},
];
const WEEKLY_DATA = [
  {d:"Mon",s:142,c:8420},{d:"Tue",s:128,c:7680},{d:"Wed",s:156,c:9360},
  {d:"Thu",s:134,c:8040},{d:"Fri",s:168,c:10080},{d:"Sat",s:195,c:11700},{d:"Sun",s:87,c:5220},
];
const EQUIP_UTIL = [
  {name:"Treadmill",  util:84},{name:"Bench Press",util:71},{name:"Leg Press",  util:78},
  {name:"Squat Rack", util:61},{name:"Elliptical",  util:55},{name:"Rowing",    util:42},
];
const USER_WEEKLY = [
  {d:"Mon",min:45},{d:"Tue",min:0},{d:"Wed",min:32},{d:"Thu",min:50},{d:"Fri",min:0},{d:"Sat",min:60},{d:"Sun",min:20},
];
const IOT_LOGS_INIT = [
  { time:"09:32:04", msg:"Treadmill T-001 sensor → AVAILABLE" },
  { time:"09:31:47", msg:"ESP8266-GYM-01 → DATA SENT" },
  { time:"09:31:42", msg:"Dashboard → STATUS UPDATED" },
  { time:"09:30:18", msg:"Leg Press L-001 sensor → OCCUPIED" },
  { time:"09:30:05", msg:"ESP8266-GYM-02 → DATA SENT" },
];
const ACHIEVEMENTS = [
  { id:1, icon:"🏅", title:"First Workout",     desc:"Completed your first session",   unlocked:true  },
  { id:2, icon:"🔥", title:"7-Day Streak",      desc:"Worked out 7 days straight",    unlocked:true  },
  { id:3, icon:"💪", title:"10 Workouts",        desc:"Logged 10 sessions",             unlocked:false },
  { id:4, icon:"🌅", title:"Early Bird",         desc:"Started session before 7 AM",   unlocked:true  },
  { id:5, icon:"⚡", title:"Consistency Master", desc:"25 workouts in a month",        unlocked:false },
  { id:6, icon:"🏆", title:"Iron Regular",       desc:"50 total sessions",             unlocked:false },
];

// ==================== UTILITY ====================
const fmtSecs = (s) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const fmtMin  = (m) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
const elapsedMin = (start) => start ? Math.floor((Date.now()-start)/60000) : 0;

// ==================== QR CODE (SVG) ====================
const QRDisplay = ({ value="SMARTGYM", size=120 }) => {
  const G = 21; const cs = size/G;
  let h = 0;
  for (let i=0;i<value.length;i++){h=((h<<5)-h)+value.charCodeAt(i);h|=0;}
  const cells = [];
  for(let y=0;y<G;y++) for(let x=0;x<G;x++){
    const tl=x<7&&y<7, tr=x>=G-7&&y<7, bl=x<7&&y>=G-7;
    if(tl||tr||bl){
      let lx=tl?x:tr?x-(G-7):x, ly=tl||tr?y:y-(G-7);
      const border=lx===0||lx===6||ly===0||ly===6;
      const inner=lx>=2&&lx<=4&&ly>=2&&ly<=4;
      cells.push({x:x*cs,y:y*cs,on:border||inner});
    } else {
      const bit=(h^(x*31+y*17)^(y*x+value.charCodeAt(x%value.length)))&1;
      cells.push({x:x*cs,y:y*cs,on:bit===1});
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:6}}>
      <rect width={size} height={size} fill="white"/>
      {cells.map((c,i)=>c.on&&<rect key={i} x={c.x} y={c.y} width={cs-.5} height={cs-.5} fill="#0a0a18"/>)}
    </svg>
  );
};

// ==================== UI PRIMITIVES ====================
const StatusBadge = ({ status, size="sm" }) => {
  const s = STATUS[status]||STATUS.available;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${s.color} ${s.bg} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`}/>
      {s.label}
    </span>
  );
};

const PulseDot = ({ status }) => {
  const s = STATUS[status]||STATUS.available;
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${s.dot} animate-pulse shadow-lg`} style={{boxShadow:`0 0 8px currentColor`}}/>;
};

const Card = ({ children, className="", glow=false }) => (
  <div className={`rounded-xl border ${glow?"border-cyan-500/30 shadow-lg shadow-cyan-500/5":"border-white/5"} bg-[#0f1320] ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color="text-cyan-400" }) => (
  <Card className="p-5 flex items-start gap-4">
    <div className={`p-2.5 rounded-lg bg-white/5 ${color}`}><Icon size={20}/></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </Card>
);

const Btn = ({ children, variant="primary", onClick, disabled, className="", size="md" }) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40";
  const sz = size==="sm"?"px-3 py-1.5 text-xs":size==="lg"?"px-6 py-3 text-base":"px-4 py-2 text-sm";
  const v = {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20",
    ghost:   "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10",
    danger:  "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
    success: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30",
  }[variant]||"";
  return <button className={`${base} ${sz} ${v} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs text-slate-400 uppercase tracking-widest">{label}</label>}
    <input {...props} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"/>
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs text-slate-400 uppercase tracking-widest">{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      className="w-full bg-[#0f1320] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50">
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const HealthBar = ({ pct }) => {
  const color = pct>80?"bg-emerald-400":pct>50?"bg-amber-400":"bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Health</span><span className="text-white font-semibold">{pct}%</span></div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
};

// ==================== BOOKING MODAL ====================
const BookingModal = ({ eq, onClose, onConfirm }) => {
  const [date, setDate] = useState("2026-09-10");
  const [time, setTime] = useState("10:00");
  const [dur, setDur] = useState("30");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId] = useState(`BK${Date.now().toString().slice(-6)}`);

  if(confirmed) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,.85)"}}>
      <Card className="p-8 max-w-sm w-full mx-4 text-center" glow>
        <div className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
          <Check className="text-emerald-400" size={28}/>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Booking Confirmed!</h3>
        <p className="text-slate-400 text-sm mb-6">{eq.name} · {date} · {time} · {dur} min</p>
        <div className="flex justify-center mb-4"><QRDisplay value={bookingId} size={140}/></div>
        <p className="text-xs text-slate-500 mb-6">Show this QR code at the equipment to start your session</p>
        <div className="flex gap-3">
          <Btn variant="ghost" onClick={onClose} className="flex-1">Close</Btn>
          <Btn onClick={onClose} className="flex-1">Done</Btn>
        </div>
      </Card>
    </div>
  );

  const slots = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","17:00","17:30","18:00"];
  const taken = ["09:30","11:00","14:30"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,.85)"}}>
      <Card className="p-6 max-w-md w-full mx-4" glow>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Book {eq.name}</h3>
            <p className="text-xs text-slate-400">{eq.id} · {eq.zone}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18}/></button>
        </div>

        <div className="space-y-4 mb-5">
          <Input label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Time Slot</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map(s=>{
                const isTaken=taken.includes(s), isSel=s===time;
                return <button key={s} onClick={()=>!isTaken&&setTime(s)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${isTaken?"border-red-500/20 bg-red-400/5 text-red-400/40 cursor-not-allowed":isSel?"border-cyan-500 bg-cyan-500/20 text-cyan-400":"border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40"}`}>
                  {isTaken?"🔒":""}{s}
                </button>;
              })}
            </div>
          </div>
          <Select label="Duration" options={["15 min","30 min","45 min","60 min"]} value={`${dur} min`} onChange={v=>setDur(v.replace(" min",""))}/>
        </div>

        <div className="flex gap-3">
          <Btn variant="ghost" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={()=>{onConfirm&&onConfirm();setConfirmed(true)}} className="flex-1">Confirm Booking</Btn>
        </div>
      </Card>
    </div>
  );
};

// ==================== EQUIPMENT CARD ====================
const EqCard = ({ eq, onBook, onDetail }) => {
  const s = STATUS[eq.status]||STATUS.available;
  const icons = { cardio:"🏃", strength:"🏋️", legs:"🦵", "upper-body":"💪" };
  return (
    <Card className="p-5 hover:border-white/15 transition-all duration-200 cursor-pointer group" onClick={()=>onDetail(eq)}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icons[eq.cat]||"⚙️"}</div>
        <StatusBadge status={eq.status}/>
      </div>
      <h3 className="text-white font-bold mb-0.5">{eq.name}</h3>
      <p className="text-xs text-slate-500 mb-3">{eq.id} · {eq.zone}</p>
      <HealthBar pct={eq.health}/>
      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
        <div><p className="text-slate-500">Sessions today</p><p className="text-white font-semibold">{Math.floor(eq.todayMin/eq.avgMin)}</p></div>
        <div><p className="text-slate-500">Avg session</p><p className="text-white font-semibold">{eq.avgMin} min</p></div>
      </div>
      {eq.user && <p className="mt-2 text-xs text-slate-400">User: {eq.user}{eq.status==="in-use"?` · ${elapsedMin(eq.sessionStart)} min`:""}</p>}
      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {eq.status==="available" && <Btn size="sm" onClick={e=>{e.stopPropagation();onBook(eq)}}>Book Now</Btn>}
        <Btn size="sm" variant="ghost" onClick={e=>{e.stopPropagation();onDetail(eq)}}>Details</Btn>
      </div>
    </Card>
  );
};

// ==================== EQUIPMENT DETAIL ====================
const EqDetailPage = ({ eq, onBack, onBook }) => {
  const usageData = [
    {d:"Mon",h:3.2},{d:"Tue",h:4.1},{d:"Wed",h:2.8},{d:"Thu",h:5.0},{d:"Fri",h:4.7},{d:"Sat",h:6.2},{d:"Sun",h:2.1}
  ];
  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm"><ChevronLeft size={16}/>Back to Equipment</button>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 p-6 flex flex-col items-center text-center" glow>
            <div className="text-6xl mb-4">{eq.cat==="cardio"?"🏃":eq.cat==="legs"?"🦵":"🏋️"}</div>
            <h2 className="text-xl font-bold text-white mb-1">{eq.name}</h2>
            <p className="text-slate-400 text-sm mb-3">{eq.id} · {eq.model}</p>
            <StatusBadge status={eq.status}/>
            <div className="mt-4 w-full space-y-2">
              <HealthBar pct={eq.health}/>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 w-full space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Location</span><span className="text-white">{eq.zone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Last maintenance</span><span className="text-white">{eq.lastMaint}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Next maintenance</span><span className="text-white">{eq.nextMaint}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total sessions</span><span className="text-white">{eq.sessions}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Avg session</span><span className="text-white">{eq.avgMin} min</span></div>
            </div>
            {eq.status==="available" && <Btn className="mt-4 w-full justify-center" onClick={()=>onBook(eq)}>Book Now</Btn>}
          </Card>
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={Timer} label="Today" value={fmtMin(eq.todayMin)} color="text-cyan-400"/>
              <StatCard icon={Activity} label="Sessions today" value={Math.floor(eq.todayMin/eq.avgMin)} color="text-purple-400"/>
              <StatCard icon={TrendingUp} label="Utilization" value={`${Math.round(eq.todayMin/840*100)}%`} color="text-emerald-400"/>
            </div>
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-4">Weekly Usage (hours)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <ReBarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08"/>
                  <XAxis dataKey="d" tick={{fill:"#64748b",fontSize:11}}/>
                  <YAxis tick={{fill:"#64748b",fontSize:11}}/>
                  <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
                  <Bar dataKey="h" fill="#06b6d4" radius={[4,4,0,0]}/>
                </ReBarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-3">Maintenance History</h3>
              <div className="space-y-3">
                {[{d:"Aug 12, 2026",a:"Routine check · Belt adjusted · Health restored to 92%"},
                  {d:"Jun 10, 2026",a:"Deep service · Motor inspection · Lubrication"},
                  {d:"Apr 05, 2026",a:"Sensor calibration · ESP8266 firmware update"}
                ].map((r,i)=>(
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-1 rounded-full bg-cyan-500/40 flex-shrink-0"/>
                    <div><p className="text-white">{r.d}</p><p className="text-slate-400 text-xs">{r.a}</p></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== EQUIPMENT PAGE ====================
const EquipmentPage = ({ equipment, onBook, onDetail }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const cats = ["All","Cardio","Strength","Legs","Upper Body"];
  const statuses = ["All","Available","In Use","Reserved","Maintenance"];
  const filtered = equipment.filter(e=>{
    const matchSearch=e.name.toLowerCase().includes(search.toLowerCase())||e.id.toLowerCase().includes(search.toLowerCase());
    const matchCat=cat==="All"||e.cat===cat.toLowerCase().replace(" ","-");
    const matchStatus=statusF==="All"||e.status===statusF.toLowerCase().replace(" ","-");
    return matchSearch&&matchCat&&matchStatus;
  });
  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Equipment</h1>
          <p className="text-slate-400 text-sm">Real-time IoT-monitored gym equipment</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search equipment..." className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40"/>
          </div>
          <div className="flex gap-2">
            {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${cat===c?"border-cyan-500 bg-cyan-500/20 text-cyan-400":"border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>{c}</button>)}
          </div>
          <div className="flex gap-2">
            {statuses.map(s=>{
              const skey=s.toLowerCase().replace(" ","-");
              const sc=STATUS[skey];
              return <button key={s} onClick={()=>setStatusF(s)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${statusF===s?`${sc?.border||"border-cyan-500"} ${sc?.bg||"bg-cyan-500/20"} ${sc?.color||"text-cyan-400"}`:"border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>{s}</button>;
            })}
          </div>
        </div>
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[["Available",equipment.filter(e=>e.status==="available").length,"text-emerald-400"],
            ["In Use",equipment.filter(e=>e.status==="in-use").length,"text-red-400"],
            ["Reserved",equipment.filter(e=>e.status==="reserved").length,"text-amber-400"],
            ["Maintenance",equipment.filter(e=>e.status==="maintenance").length,"text-orange-400"]
          ].map(([l,v,c])=>(
            <Card key={l} className="px-4 py-3 flex items-center gap-3">
              <PulseDot status={l.toLowerCase().replace(" ","-")}/>
              <div><p className="text-xs text-slate-500">{l}</p><p className={`text-lg font-bold ${c}`}>{v}</p></div>
            </Card>
          ))}
        </div>
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(e=><EqCard key={e.id} eq={e} onBook={onBook} onDetail={onDetail}/>)}
        </div>
        {filtered.length===0&&<div className="text-center py-16 text-slate-400"><Dumbbell className="mx-auto mb-3 opacity-30" size={40}/><p>No equipment matches your filters</p></div>}
      </div>
    </div>
  );
};

// ==================== WORKOUT TIMER ====================
const WorkoutTimerPage = ({ equipment }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedEq, setSelectedEq] = useState(equipment[0]?.id||"");
  const [finished, setFinished] = useState(false);
  const [savedSessions, setSavedSessions] = useState([
    {id:1,eq:"Treadmill",date:"Sep 8",dur:45,kcal:320},
    {id:2,eq:"Bench Press",date:"Sep 6",dur:32,kcal:210},
    {id:3,eq:"Leg Press",date:"Sep 4",dur:28,kcal:185},
  ]);
  const intv = useRef(null);

  useEffect(()=>{
    if(running) intv.current=setInterval(()=>setElapsed(e=>e+1),1000);
    else clearInterval(intv.current);
    return ()=>clearInterval(intv.current);
  },[running]);

  const kcal = Math.round(elapsed/60*6.5);
  const eq = equipment.find(e=>e.id===selectedEq);

  const endSession = () => {
    setRunning(false); clearInterval(intv.current);
    setSavedSessions(s=>[{id:Date.now(),eq:eq?.name||"Equipment",date:"Sep 9",dur:Math.floor(elapsed/60),kcal},,...s]);
    setFinished(true);
  };

  if(finished) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#080b14"}}>
      <Card className="p-8 max-w-sm w-full mx-4 text-center" glow>
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-white mb-1">Session Complete!</h2>
        <p className="text-slate-400 text-sm mb-6">{eq?.name||"Equipment"} · Sep 9, 2026</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4"><p className="text-2xl font-bold text-white">{fmtSecs(elapsed).slice(0,5)}</p><p className="text-xs text-slate-400 mt-1">Duration</p></div>
          <div className="bg-white/5 rounded-xl p-4"><p className="text-2xl font-bold text-cyan-400">~{kcal}</p><p className="text-xs text-slate-400 mt-1">Est. kcal</p></div>
        </div>
        <p className="text-xs text-slate-500 mb-5">Calorie estimates are approximate and for reference only</p>
        <Btn className="w-full justify-center" onClick={()=>{setElapsed(0);setFinished(false)}}>New Session</Btn>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Workout Tracker</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`p-8 text-center ${running?"border-cyan-500/40":""}`} glow={running}>
            <div className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{running?"Live Session":"Ready"}</p>
              <p className="text-6xl font-mono font-bold text-white mb-1">{fmtSecs(elapsed)}</p>
              <p className="text-sm text-slate-400">{eq?.name||"Select equipment"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xl font-bold text-cyan-400">~{kcal}</p>
                <p className="text-xs text-slate-400">Est. kcal</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xl font-bold text-white">{Math.floor(elapsed/60)}</p>
                <p className="text-xs text-slate-400">Minutes</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              {!running
                ? <Btn size="lg" onClick={()=>setRunning(true)} className="gap-3"><Play size={18}/>Start Session</Btn>
                : <>
                    <Btn size="lg" variant="ghost" onClick={()=>setRunning(false)}><Pause size={18}/>Pause</Btn>
                    <Btn size="lg" variant="danger" onClick={endSession}><Square size={18}/>End</Btn>
                  </>}
            </div>
            <p className="text-xs text-slate-600 mt-4">Calorie values are estimated, not medically accurate</p>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-3">Select Equipment</h3>
              <div className="space-y-2">
                {equipment.filter(e=>e.status==="available"||e.id===selectedEq).map(e=>(
                  <button key={e.id} onClick={()=>setSelectedEq(e.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedEq===e.id?"border-cyan-500/40 bg-cyan-500/10":"border-white/5 hover:border-white/15"}`}>
                    <PulseDot status={e.status}/>
                    <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium">{e.name}</p><p className="text-xs text-slate-400">{e.id}</p></div>
                    <StatusBadge status={e.status}/>
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-3">Recent Sessions</h3>
              <div className="space-y-2">
                {savedSessions.slice(0,4).map(s=>(
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div><p className="text-white text-sm">{s.eq}</p><p className="text-xs text-slate-400">{s.date}</p></div>
                    <div className="text-right"><p className="text-white text-sm font-semibold">{s.dur} min</p><p className="text-xs text-cyan-400">~{s.kcal} kcal</p></div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-3">This Week</h3>
              <ResponsiveContainer width="100%" height={120}>
                <ReBarChart data={USER_WEEKLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
                  <XAxis dataKey="d" tick={{fill:"#64748b",fontSize:10}}/>
                  <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}} formatter={v=>[`${v} min`,"Duration"]}/>
                  <Bar dataKey="min" fill="#06b6d4" radius={[3,3,0,0]}/>
                </ReBarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== AI COACH ====================
const AICoachPage = ({ equipment }) => {
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:"Hello! I'm SmartGym AI. I can help with workout suggestions, equipment availability, and fitness planning. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const quickPrompts = [
    "What should I train today?",
    "Which equipment is available now?",
    "Create a 30-minute workout plan",
    "Show me my progress tips",
  ];

  const eqStatus = equipment.map(e=>`${e.name} (${e.id}): ${STATUS[e.status]?.label||e.status}`).join(", ");

  const send = async (text) => {
    const msg = text||input.trim();
    if(!msg) return;
    setInput("");
    const newMsgs = [...msgs,{role:"user",content:msg}];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:400,
          system:`You are SmartGym AI, an assistant for a smart gym management platform. Be concise and helpful. Current equipment status: ${eqStatus}. Help with workouts, equipment recommendations, and gym planning. Do not give medical advice. Keep responses under 150 words.`,
          messages:newMsgs.slice(-6).map(m=>({role:m.role,content:m.content}))
        })
      });
      const data = await resp.json();
      setMsgs(m=>[...m,{role:"assistant",content:data.content?.[0]?.text||"I'm here to help with your gym needs!"}]);
    } catch(e) {
      setMsgs(m=>[...m,{role:"assistant",content:"I'm having trouble connecting. Please check your internet connection and try again."}]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col" style={{height:"calc(100vh - 80px)"}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="text-cyan-400" size={20}/>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">SmartGym AI <Sparkles className="text-cyan-400" size={14}/></h1>
            <p className="text-xs text-slate-400">Powered by Claude · Fitness guidance only</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {msgs.map((m,i)=>(
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role==="user"?"bg-cyan-500/20 text-cyan-50 border border-cyan-500/20":"bg-[#0f1320] text-slate-200 border border-white/5"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0f1320] border border-white/5 rounded-2xl px-4 py-3">
                <div className="flex gap-1">{[0,1,2].map(i=><span key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay:`${i*150}ms`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {quickPrompts.map(p=><button key={p} onClick={()=>send(p)} className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-all">{p}</button>)}
        </div>
        <div className="flex gap-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask SmartGym AI anything..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40"/>
          <Btn onClick={()=>send()} disabled={!input.trim()||loading}><Send size={16}/>Send</Btn>
        </div>
      </div>
    </div>
  );
};

// ==================== USER ANALYTICS ====================
const UserAnalyticsPage = () => (
  <div className="min-h-screen" style={{background:"#080b14"}}>
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">My Analytics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {icon:Timer,  label:"Total Time",    value:"48h 20m",color:"text-cyan-400"},
          {icon:Flame,  label:"Est. Calories", value:"~12,400",color:"text-orange-400"},
          {icon:Activity,label:"Sessions",     value:"27",     color:"text-purple-400"},
          {icon:TrendingUp,label:"Streak",     value:"7 days", color:"text-emerald-400"},
        ].map(p=><StatCard key={p.label} {...p}/>)}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-4">Weekly Workout Time (min)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={USER_WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
              <XAxis dataKey="d" tick={{fill:"#64748b",fontSize:11}}/>
              <YAxis tick={{fill:"#64748b",fontSize:11}}/>
              <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
              <Area type="monotone" dataKey="min" stroke="#06b6d4" fill="#06b6d420"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-4">Equipment Usage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={[{n:"Treadmill",v:35},{n:"Bench Press",v:25},{n:"Leg Press",v:20},{n:"Other",v:20}]}
                dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={70}>
                {["#06b6d4","#8b5cf6","#10b981","#f59e0b"].map((c,i)=><Cell key={i} fill={c}/>)}
              </Pie>
              <Legend formatter={v=><span style={{color:"#94a3b8",fontSize:11}}>{v}</span>}/>
              <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
            </RePieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="text-white font-semibold mb-1">Achievements</h3>
        <p className="text-xs text-slate-400 mb-4">3 of 6 unlocked</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(a=>(
            <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${a.unlocked?"border-cyan-500/20 bg-cyan-500/5":"border-white/5 opacity-40"}`}>
              <span className="text-2xl">{a.icon}</span>
              <div><p className={`text-sm font-semibold ${a.unlocked?"text-white":"text-slate-500"}`}>{a.title}</p><p className="text-xs text-slate-500">{a.desc}</p></div>
              {a.unlocked&&<Check className="text-cyan-400 ml-auto flex-shrink-0" size={14}/>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ==================== NOTIFICATIONS PAGE ====================
const NotificationsPage = ({ notifications, setNotifications }) => {
  const icons = { booking:CalendarDays, alert:Bell, maintenance:Wrench, workout:Activity, system:Info };
  const colors = { booking:"text-cyan-400", alert:"text-amber-400", maintenance:"text-orange-400", workout:"text-emerald-400", system:"text-slate-400" };
  const [tab, setTab] = useState("All");
  const markAll = () => setNotifications(n=>n.map(x=>({...x,read:true})));
  const filtered = tab==="Unread" ? notifications.filter(n=>!n.read) : notifications;
  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <Btn variant="ghost" size="sm" onClick={markAll}>Mark all read</Btn>
        </div>
        <div className="flex gap-2 mb-5">
          {["All","Unread","Read"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${tab===t?"border-cyan-500/40 bg-cyan-500/20 text-cyan-400":"border-white/10 text-slate-400 hover:text-white"}`}>{t}{t==="Unread"&&notifications.filter(n=>!n.read).length>0&&<span className="ml-1.5 text-xs bg-red-400 text-black rounded-full px-1.5">{notifications.filter(n=>!n.read).length}</span>}</button>)}
        </div>
        <div className="space-y-2">
          {filtered.map(n=>{
            const Icon=icons[n.type]||Bell;
            const c=colors[n.type]||"text-slate-400";
            return (
              <Card key={n.id} className={`p-4 flex gap-4 items-start ${!n.read?"border-white/10":""}`}>
                <div className={`p-2 rounded-lg bg-white/5 ${c} flex-shrink-0`}><Icon size={16}/></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read?"text-slate-300":"text-white"}`}>{n.title}</p>
                    <span className="text-xs text-slate-500 flex-shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                </div>
                {!n.read&&<div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1"/>}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==================== PROFILE PAGE ====================
const ProfilePage = ({ user }) => (
  <div className="min-h-screen" style={{background:"#080b14"}}>
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <Card className="p-6 text-center" glow>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-4">{user.name[0]}</div>
          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <div className="mt-3 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 inline-block">{user.memberId}</div>
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-left">
            <div className="flex justify-between"><span className="text-slate-400">Member since</span><span className="text-white">Jan 2026</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Membership</span><span className="text-emerald-400">Active</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Goal</span><span className="text-white">Strength & Fitness</span></div>
          </div>
        </Card>
        <div className="md:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="text-white font-semibold mb-4">Stats Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              {[{l:"Total Workouts",v:"27"},{l:"Total Time",v:"48h 20m"},{l:"Current Streak",v:"7 days"},{l:"Favorite Equipment",v:"Treadmill"}].map(s=>(
                <div key={s.l} className="bg-white/5 rounded-xl p-4">
                  <p className="text-xl font-bold text-white">{s.v}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-white font-semibold mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <Input label="Full Name" defaultValue={user.name}/>
              <Input label="Email" defaultValue={user.email}/>
              <Input label="Fitness Goal" defaultValue="Strength & Fitness"/>
              <Btn className="w-full justify-center">Save Changes</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

// ==================== USER DASHBOARD ====================
const UserDashboard = ({ user, equipment, bookings, notifications, setNotifications, onLogout, onNavigate }) => {
  const [tab, setTab] = useState("overview");
  const [bookingEq, setBookingEq] = useState(null);

  const unread = notifications.filter(n=>!n.read).length;
  const navItems = [
    {id:"overview",   icon:Home,         label:"Overview"},
    {id:"equipment",  icon:Dumbbell,     label:"Equipment"},
    {id:"bookings",   icon:CalendarDays, label:"My Bookings"},
    {id:"workout",    icon:Timer,        label:"Workout"},
    {id:"analytics",  icon:BarChart2,    label:"Analytics"},
    {id:"ai",         icon:Bot,          label:"AI Coach"},
    {id:"notifications",icon:Bell,       label:"Alerts",    badge:unread},
    {id:"profile",    icon:User,         label:"Profile"},
  ];

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Timer}   label="Today's Workout" value="48 min"   sub="vs 42 min yesterday" color="text-cyan-400"/>
        <StatCard icon={Flame}   label="Est. Calories"   value="~320 kcal" sub="Estimated only"       color="text-orange-400"/>
        <StatCard icon={Activity}label="Sessions"        value="3"         sub="This week"            color="text-purple-400"/>
        <StatCard icon={Award}   label="Streak"          value="7 days"    sub="Keep it up!"          color="text-emerald-400"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-white font-semibold mb-1">Live Equipment Status</h3>
          <p className="text-xs text-slate-500 mb-4">IoT-monitored · Updates every 5s</p>
          <div className="space-y-2">
            {equipment.slice(0,6).map(e=>(
              <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <PulseDot status={e.status}/>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{e.name} <span className="text-slate-500 text-xs">{e.id}</span></p>
                  {e.user&&<p className="text-xs text-slate-400">{e.user}{e.status==="in-use"&&` · ${elapsedMin(e.sessionStart)} min`}</p>}
                </div>
                <StatusBadge status={e.status}/>
                {e.status==="available"&&<Btn size="sm" onClick={()=>setBookingEq(e)}>Book</Btn>}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-white font-semibold mb-3">Upcoming Bookings</h3>
            {bookings.filter(b=>b.status==="upcoming").map(b=>(
              <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <div className="p-2 bg-cyan-500/10 rounded-lg"><CalendarDays className="text-cyan-400" size={14}/></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{b.eqName}</p>
                  <p className="text-xs text-slate-400">{b.date} · {b.time} · {b.dur}min</p>
                </div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <h3 className="text-white font-semibold mb-3">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={130}>
              <ReBarChart data={USER_WEEKLY}>
                <XAxis dataKey="d" tick={{fill:"#64748b",fontSize:10}}/>
                <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}} formatter={v=>[`${v}m`]}/>
                <Bar dataKey="min" fill="#06b6d4" radius={[3,3,0,0]}/>
              </ReBarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );

  const MyBookings = () => {
    const [myBookings, setMyBookings] = useState(bookings);
    return (
      <div className="space-y-4">
        {["upcoming","completed"].map(status=>(
          <div key={status}>
            <h3 className="text-white font-semibold mb-3 capitalize">{status}</h3>
            <div className="space-y-2">
              {myBookings.filter(b=>b.status===status).map(b=>(
                <Card key={b.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/5 rounded-xl text-lg">🏋️</div>
                      <div>
                        <p className="text-white font-semibold">{b.eqName}</p>
                        <p className="text-slate-400 text-xs">{b.date} · {b.time} · {b.dur} min · {b.eqId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status==="upcoming"?"text-cyan-400 bg-cyan-400/10":"text-slate-400 bg-white/5"}`}>{status}</span>
                  </div>
                  {status==="upcoming"&&(
                    <div className="mt-3 flex gap-2 items-center">
                      <div className="flex-shrink-0"><QRDisplay value={b.qr} size={60}/></div>
                      <div className="text-xs text-slate-400">Scan at equipment to begin session</div>
                      <Btn size="sm" variant="danger" className="ml-auto" onClick={()=>setMyBookings(bks=>bks.map(x=>x.id===b.id?{...x,status:"cancelled"}:x))}>Cancel</Btn>
                    </div>
                  )}
                </Card>
              ))}
              {myBookings.filter(b=>b.status===status).length===0&&<p className="text-slate-500 text-sm py-4">No {status} bookings</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabContent = {
    overview: <Overview/>,
    equipment: <EquipmentPage equipment={equipment} onBook={setBookingEq} onDetail={()=>{}}/>,
    bookings: <MyBookings/>,
    workout: <WorkoutTimerPage equipment={equipment}/>,
    analytics: <UserAnalyticsPage/>,
    ai: <AICoachPage equipment={equipment}/>,
    notifications: <NotificationsPage notifications={notifications} setNotifications={setNotifications}/>,
    profile: <ProfilePage user={user}/>,
  };

  return (
    <div className="min-h-screen flex" style={{background:"#080b14"}}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col hidden md:flex" style={{background:"#0a0d18"}}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-bold text-sm">S</div>
            <span className="text-white font-bold tracking-wide">SMARTGYM</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item=>{
            const Icon=item.icon;
            return (
              <button key={item.id} onClick={()=>setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${tab===item.id?"bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/20":"text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={16}/>
                <span>{item.label}</span>
                {item.badge>0&&<span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-5 flex-shrink-0" style={{background:"#0a0d18"}}>
          <div>
            <p className="text-white font-semibold text-sm">Welcome back, {user.name.split(" ")[0]} 👋</p>
            <p className="text-xs text-slate-500">Sep 9, 2026 · SmartGym</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white" onClick={()=>setTab("notifications")}>
              <Bell size={18}/>
              {unread>0&&<span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"/>}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-black">{user.name[0]}</div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          {tab!=="equipment"&&tab!=="workout"&&tab!=="ai"&&tab!=="notifications"&&tab!=="profile"&&(
            <h2 className="text-xl font-bold text-white mb-5 capitalize">{tab==="overview"?"Dashboard":tab}</h2>
          )}
          {tabContent[tab]}
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-white/5 flex" style={{background:"#0a0d18"}}>
          {navItems.slice(0,5).map(item=>{
            const Icon=item.icon;
            return <button key={item.id} onClick={()=>setTab(item.id)} className={`flex-1 flex flex-col items-center py-2 text-xs gap-1 ${tab===item.id?"text-cyan-400":"text-slate-500"}`}><Icon size={18}/>{item.label}</button>;
          })}
        </nav>
      </main>

      {bookingEq&&<BookingModal eq={bookingEq} onClose={()=>setBookingEq(null)} onConfirm={()=>{}}/>}
    </div>
  );
};

// ==================== ADMIN: IOT SIMULATOR ====================
const IoTPage = ({ equipment, setEquipment }) => {
  const [simMode, setSimMode] = useState(true);
  const [logs, setLogs] = useState(IOT_LOGS_INIT);

  const pushLog = (msg) => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setLogs(l=>[{time:t,msg},...l.slice(0,19)]);
  };

  const changeStatus = (eqId, newStatus) => {
    setEquipment(eq=>eq.map(e=>e.id===eqId?{...e,status:newStatus,sessionStart:newStatus==="in-use"?Date.now():null}:e));
    const e = equipment.find(x=>x.id===eqId);
    pushLog(`${e?.name} ${eqId} sensor → ${STATUS[newStatus]?.label||newStatus}`);
    setTimeout(()=>pushLog(`ESP8266-GYM-01 → DATA SENT`),200);
    setTimeout(()=>pushLog(`Dashboard → STATUS UPDATED`),500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">IoT Device Dashboard</h2>
          <p className="text-slate-400 text-sm">Arduino + ESP8266 Sensor Network</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${simMode?"text-amber-400":"text-emerald-400"}`}>{simMode?"SIMULATION":"LIVE HARDWARE"}</span>
          <button onClick={()=>setSimMode(m=>!m)} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${simMode?"bg-amber-500/30":"bg-emerald-500/30"}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full transition-transform ${simMode?"translate-x-1 bg-amber-400":"translate-x-8 bg-emerald-400"}`}/>
          </button>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {IOT_DEVICES.map(d=>(
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${d.type.includes("ESP")?"bg-cyan-500/10":d.type.includes("Arduino")?"bg-purple-500/10":"bg-slate-500/10"}`}>
                {d.type.includes("ESP")?<Wifi className="text-cyan-400" size={14}/>:d.type.includes("Arduino")?<Cpu className="text-purple-400" size={14}/>:<Radio className="text-slate-400" size={14}/>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${d.status==="connected"||d.status==="active"?"bg-emerald-400/10 text-emerald-400":"bg-red-400/10 text-red-400"}`}>{d.status}</span>
            </div>
            <p className="text-white text-xs font-semibold mb-0.5">{d.name}</p>
            <p className="text-slate-500 text-xs mb-2">{d.type} · {d.zone}</p>
            {d.signal&&<p className="text-xs text-slate-400">Signal: {d.signal} dBm</p>}
            {d.battery&&<p className="text-xs text-slate-400">Battery: {d.battery}%</p>}
            <p className="text-xs text-slate-500 mt-1">Updated {d.lastSec}s ago</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Simulator Controls */}
        {simMode&&(
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
              <h3 className="text-white font-semibold">Simulation Controls</h3>
            </div>
            <p className="text-slate-400 text-xs mb-4">Manually simulate sensor input for demo presentation</p>
            <div className="space-y-3">
              {equipment.filter(e=>e.status!=="maintenance").slice(0,5).map(e=>(
                <div key={e.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{e.name} <span className="text-slate-500">{e.id}</span></p>
                    <StatusBadge status={e.status}/>
                  </div>
                  <div className="flex gap-1">
                    {["available","in-use","reserved"].map(s=>(
                      <button key={s} onClick={()=>changeStatus(e.id,s)}
                        className={`px-2 py-1 rounded text-xs border transition-all ${e.status===s?`${STATUS[s].border} ${STATUS[s].bg} ${STATUS[s].color}`:"border-white/10 text-slate-400 hover:border-white/25"}`}>
                        {STATUS[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* IoT Event Log */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>
            <h3 className="text-white font-semibold">Live Event Log</h3>
          </div>
          <div className="font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
            {logs.map((l,i)=>(
              <div key={i} className="flex gap-3">
                <span className="text-cyan-500/60 flex-shrink-0">{l.time}</span>
                <span className={i===0?"text-white":"text-slate-400"}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ==================== ADMIN: ANALYTICS ====================
const AdminAnalyticsPage = () => (
  <div className="space-y-5">
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-5 col-span-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-cyan-400" size={16}/>
          <h3 className="text-white font-semibold">AI Predictive Insights</h3>
          <span className="px-2 py-0.5 text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full">Experimental</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">Machine learning predictions based on historical patterns. Not scientifically validated.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            "Peak demand expected for Treadmill 6:00 PM – 7:30 PM today.",
            "Bench Press may require maintenance within ~12 sessions based on usage patterns.",
            "Expected gym crowd 85% on Friday evening. Recommend encouraging off-peak bookings.",
          ].map((t,i)=>(
            <div key={i} className="p-3 bg-cyan-500/5 border border-cyan-500/15 rounded-xl">
              <Sparkles className="text-cyan-400 mb-1" size={12}/>
              <p className="text-slate-300 text-xs">{t}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5">
        <h3 className="text-white font-semibold mb-4">Hourly Gym Traffic</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={HOURLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
            <XAxis dataKey="t" tick={{fill:"#64748b",fontSize:10}}/>
            <YAxis tick={{fill:"#64748b",fontSize:10}}/>
            <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
            <Area type="monotone" dataKey="u" stroke="#06b6d4" fill="#06b6d415" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 mt-2">Peak: 7:00 PM · 62 members active</p>
      </Card>
      <Card className="p-5">
        <h3 className="text-white font-semibold mb-4">Weekly Sessions</h3>
        <ResponsiveContainer width="100%" height={200}>
          <ReBarChart data={WEEKLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
            <XAxis dataKey="d" tick={{fill:"#64748b",fontSize:11}}/>
            <YAxis tick={{fill:"#64748b",fontSize:11}}/>
            <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
            <Bar dataKey="s" fill="#8b5cf6" radius={[4,4,0,0]}/>
          </ReBarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <Card className="p-5">
      <h3 className="text-white font-semibold mb-4">Equipment Utilization</h3>
      <div className="space-y-3">
        {EQUIP_UTIL.map(e=>(
          <div key={e.name} className="flex items-center gap-3">
            <span className="text-slate-300 text-sm w-32 flex-shrink-0">{e.name}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{width:`${e.util}%`}}/>
            </div>
            <span className="text-white text-sm font-semibold w-10 text-right">{e.util}%</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ==================== ADMIN: MAINTENANCE ====================
const MaintenancePage = ({ equipment, setEquipment }) => {
  const getStatus = (h) => h>80?"GOOD":h>50?"DUE SOON":"OVERDUE";
  const getStatusColor = (h) => h>80?"text-emerald-400":h>50?"text-amber-400":"text-red-400";

  const markMaintenance = (id) => {
    setEquipment(eq=>eq.map(e=>e.id===id?{...e,status:"maintenance",health:e.health}:e));
  };

  return (
    <div className="space-y-4">
      {equipment.map(e=>(
        <Card key={e.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold">{e.name}</h3>
                <span className="text-slate-500 text-xs">{e.id}</span>
                <span className={`text-xs font-semibold ${getStatusColor(e.health)}`}>{getStatus(e.health)}</span>
              </div>
              <HealthBar pct={e.health}/>
              <div className="mt-2 flex gap-4 text-xs text-slate-400">
                <span>Last: {e.lastMaint}</span>
                <span>Next: {e.nextMaint}</span>
                <span>Sessions: {e.sessions}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {e.status!=="maintenance"&&<Btn size="sm" variant="ghost" onClick={()=>markMaintenance(e.id)}><Wrench size={12}/>Mark Maintenance</Btn>}
              {e.status==="maintenance"&&<Btn size="sm" variant="success" onClick={()=>setEquipment(eq=>eq.map(x=>x.id===e.id?{...x,status:"available",health:Math.min(100,x.health+15),lastMaint:"Sep 9"}:x))}><Check size={12}/>Complete</Btn>}
            </div>
          </div>
          {e.health<=50&&<div className="mt-3 p-2 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center gap-2"><AlertTriangle className="text-red-400 flex-shrink-0" size={14}/><p className="text-red-300 text-xs">Maintenance overdue — equipment performance may be degraded</p></div>}
        </Card>
      ))}
    </div>
  );
};

// ==================== ADMIN: MEMBERS ====================
const MembersPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = MEMBERS.filter(m=>{
    const ms = m.name.toLowerCase().includes(search.toLowerCase())||m.email.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="All"||(filter==="Active"&&m.status==="active")||(filter==="Inactive"&&m.status==="inactive");
    return ms&&mf;
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members..." className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40"/></div>
        <div className="flex gap-2">{["All","Active","Inactive"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${filter===f?"border-cyan-500/40 bg-cyan-500/20 text-cyan-400":"border-white/10 text-slate-400"}`}>{f}</button>)}</div>
      </div>
      <div className="space-y-2">
        {filtered.map(m=>(
          <Card key={m.id} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{m.name}</p>
              <p className="text-slate-400 text-xs">{m.email} · Joined {m.joined}</p>
            </div>
            <div className="hidden sm:flex gap-6 text-center">
              <div><p className="text-white font-bold text-sm">{m.workouts}</p><p className="text-xs text-slate-500">Workouts</p></div>
              <div><p className="text-white font-bold text-sm">{m.streak}d</p><p className="text-xs text-slate-500">Streak</p></div>
              <div><p className="text-slate-300 text-sm">{m.lastVisit}</p><p className="text-xs text-slate-500">Last Visit</p></div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status==="active"?"bg-emerald-400/10 text-emerald-400":"bg-slate-400/10 text-slate-400"}`}>{m.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = ({ equipment, setEquipment, onLogout }) => {
  const [tab, setTab] = useState("overview");

  const navItems = [
    {id:"overview",  icon:Home,        label:"Overview"},
    {id:"equipment", icon:Dumbbell,    label:"Equipment"},
    {id:"members",   icon:Users,       label:"Members"},
    {id:"analytics", icon:BarChart2,   label:"Analytics"},
    {id:"maintenance",icon:Wrench,     label:"Maintenance"},
    {id:"iot",       icon:Cpu,         label:"IoT Devices"},
    {id:"settings",  icon:Settings,    label:"Settings"},
  ];

  const avail = equipment.filter(e=>e.status==="available").length;
  const inUse = equipment.filter(e=>e.status==="in-use").length;
  const reserved = equipment.filter(e=>e.status==="reserved").length;
  const maint = equipment.filter(e=>e.status==="maintenance").length;

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Dumbbell}   label="Total Equipment"  value={equipment.length} color="text-cyan-400"/>
        <StatCard icon={Activity}   label="Currently In Use" value={inUse}             color="text-red-400"/>
        <StatCard icon={Users}      label="Active Members"   value="186"               color="text-purple-400"/>
        <StatCard icon={TrendingUp} label="Today's Sessions" value="142"               color="text-emerald-400"/>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[["Available",avail,"emerald"],["In Use",inUse,"red"],["Reserved",reserved,"amber"],["Maintenance",maint,"orange"]].map(([l,v,c])=>(
          <Card key={l} className="px-5 py-4 flex items-center gap-4">
            <PulseDot status={l.toLowerCase().replace(" ","-")}/>
            <div><p className="text-slate-400 text-xs">{l}</p><p className={`text-2xl font-bold text-${c}-400`}>{v}</p></div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>
          <h3 className="text-white font-semibold">Live Equipment Map</h3>
          <span className="text-xs text-slate-500">Real-time IoT monitoring</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {equipment.map(e=>(
            <div key={e.id} className={`p-3 rounded-xl border ${STATUS[e.status]?.border||"border-white/10"} ${STATUS[e.status]?.bg||""}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{e.id}</span>
                <PulseDot status={e.status}/>
              </div>
              <p className="text-white text-sm font-semibold">{e.name}</p>
              <p className={`text-xs font-semibold mt-0.5 ${STATUS[e.status]?.color}`}>{STATUS[e.status]?.label}</p>
              {e.user&&<p className="text-xs text-slate-400 mt-0.5">{e.user}</p>}
              {e.status==="in-use"&&e.sessionStart&&<p className="text-xs text-slate-500">{elapsedMin(e.sessionStart)} min</p>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-3">Hourly Traffic</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={HOURLY_DATA.slice(0,10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06"/>
              <XAxis dataKey="t" tick={{fill:"#64748b",fontSize:10}}/>
              <Tooltip contentStyle={{background:"#0f1320",border:"1px solid #ffffff10",borderRadius:8,color:"#fff"}}/>
              <Area type="monotone" dataKey="u" stroke="#06b6d4" fill="#06b6d415"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-3">Recent Members Activity</h3>
          <div className="space-y-3">
            {MEMBERS.slice(0,4).map(m=>(
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0"><p className="text-white text-sm">{m.name}</p><p className="text-xs text-slate-400">Last: {m.lastVisit} · {m.workouts} workouts</p></div>
                <span className={`text-xs ${m.streak>5?"text-emerald-400":"text-slate-400"}`}>{m.streak}d 🔥</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const tabContent = {
    overview: <Overview/>,
    equipment: <EquipmentPage equipment={equipment} onBook={()=>{}} onDetail={()=>{}}/>,
    members: <MembersPage/>,
    analytics: <AdminAnalyticsPage/>,
    maintenance: <MaintenancePage equipment={equipment} setEquipment={setEquipment}/>,
    iot: <IoTPage equipment={equipment} setEquipment={setEquipment}/>,
    settings: (
      <Card className="p-6 max-w-lg">
        <h3 className="text-white font-semibold mb-4">Admin Settings</h3>
        <div className="space-y-3">
          <Input label="Gym Name" defaultValue="SmartGym Campus A"/>
          <Input label="Admin Email" defaultValue="admin@smartgym.io"/>
          <Input label="IoT API Endpoint" defaultValue="http://esp8266.local/api/status"/>
          <div className="flex items-center justify-between py-2">
            <div><p className="text-white text-sm">Demo Mode</p><p className="text-slate-400 text-xs">Show demo data and guided flows</p></div>
            <div className="w-10 h-6 bg-cyan-500/30 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-cyan-400 rounded-full ml-auto"/></div>
          </div>
          <Btn className="w-full justify-center">Save Settings</Btn>
        </div>
      </Card>
    ),
  };

  return (
    <div className="min-h-screen flex" style={{background:"#080b14"}}>
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col hidden md:flex" style={{background:"#0a0d18"}}>
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold text-sm">A</div>
          <div><p className="text-white font-bold text-sm">SMARTGYM</p><p className="text-purple-400 text-xs font-semibold">ADMIN</p></div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item=>{
            const Icon=item.icon;
            return <button key={item.id} onClick={()=>setTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${tab===item.id?"bg-purple-500/15 text-purple-400 font-semibold border border-purple-500/20":"text-slate-400 hover:text-white hover:bg-white/5"}`}><Icon size={16}/>{item.label}</button>;
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"><LogOut size={16}/>Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-5 flex-shrink-0" style={{background:"#0a0d18"}}>
          <div>
            <p className="text-white font-semibold text-sm">Admin Dashboard</p>
            <p className="text-xs text-slate-500">Sep 9, 2026 · SmartGym Control</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-xs text-emerald-400 font-semibold">● LIVE</div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <h2 className="text-xl font-bold text-white mb-5">{navItems.find(n=>n.id===tab)?.label||"Overview"}</h2>
          {tabContent[tab]}
        </div>
      </main>
    </div>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if(!email||!pass){setErr("Please fill all fields.");return;}
    if(role==="admin"&&(email!=="admin@smartgym.io"||pass!=="admin123")){setErr("Invalid admin credentials. Try admin@smartgym.io / admin123");return;}
    setErr("");
    onLogin({name:role==="admin"?"Admin User":"Alex Martinez",email,role,memberId:role==="admin"?"ADM-001":"M001"});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#080b14",backgroundImage:"radial-gradient(circle at 50% 30%,rgba(6,182,212,.06) 0%,transparent 70%)"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black font-black text-2xl mx-auto mb-4 shadow-lg shadow-cyan-500/30">S</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to SmartGym</p>
        </div>
        <Card className="p-6" glow>
          <div className="flex gap-2 mb-5 p-1 bg-white/5 rounded-xl">
            {["user","admin"].map(r=><button key={r} onClick={()=>setRole(r)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${role===r?"bg-cyan-500 text-black shadow-lg":"text-slate-400 hover:text-white"}`}>{r}</button>)}
          </div>
          <div className="space-y-3 mb-4">
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==="admin"?"admin@smartgym.io":"you@example.com"}/>
            <Input label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder={role==="admin"?"admin123":"••••••••"}/>
          </div>
          {err&&<p className="text-red-400 text-xs mb-3 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{err}</p>}
          <Btn className="w-full justify-center" onClick={handleLogin}>Sign In</Btn>
          <div className="mt-3 p-2.5 bg-white/5 rounded-lg text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Quick Demo Access:</p>
            <p>User: any email + any password</p>
            <p>Admin: admin@smartgym.io / admin123</p>
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">No account? <button onClick={()=>onNavigate("signup")} className="text-cyan-400 hover:underline">Sign up</button></p>
        </Card>
      </div>
    </div>
  );
};

// ==================== LANDING PAGE ====================
const LandingPage = ({ onNavigate, equipment }) => {
  const [crowdPct] = useState(78);
  const [tick, setTick] = useState(0);
  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),3000);return()=>clearInterval(i);},[]);

  const liveEq = equipment.slice(0,4);

  return (
    <div className="min-h-screen" style={{background:"#080b14"}}>
      {/* Navbar */}
      <nav className="border-b border-white/5 sticky top-0 z-40" style={{background:"rgba(8,11,20,.95)",backdropFilter:"blur(12px)"}}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-cyan-500/30">S</div>
            <span className="text-white font-bold tracking-wider text-sm">SMARTGYM</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            {["How It Works","Equipment","Features","AI"].map(l=><button key={l} className="hover:text-white transition-colors">{l}</button>)}
          </div>
          <div className="flex gap-2">
            <Btn variant="ghost" size="sm" onClick={()=>onNavigate("login")}><LogIn size={14}/>Login</Btn>
            <Btn size="sm" onClick={()=>onNavigate("login")}>Get Started</Btn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24" style={{backgroundImage:"radial-gradient(circle at 50% 20%,rgba(6,182,212,.08) 0%,transparent 60%), linear-gradient(to bottom,#080b14,#08101f)"}}>
        {/* Grid bg */}
        <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(6,182,212,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,.04) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-400 font-semibold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/>
              IoT-Powered · Real-time · AI-Enhanced
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-none tracking-tight">
              THE GYM,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">NOW INTELLIGENT.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Real-time equipment availability, smart booking, workout tracking and IoT-powered gym management — all in one platform.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Btn size="lg" onClick={()=>onNavigate("login")}><Zap size={18}/>Open Dashboard</Btn>
              <Btn size="lg" variant="ghost" onClick={()=>onNavigate("login")}><Eye size={18}/>Explore Equipment</Btn>
            </div>
          </div>

          {/* Live Equipment Cards */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {liveEq.map(e=>(
              <div key={e.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${STATUS[e.status]?.border} ${STATUS[e.status]?.bg} backdrop-blur-sm`}>
                <PulseDot status={e.status}/>
                <div>
                  <p className="text-white text-sm font-semibold">{e.name}</p>
                  <p className={`text-xs font-semibold ${STATUS[e.status]?.color}`}>{STATUS[e.status]?.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[["98%","Equipment Availability Accuracy"],["42%","Less Waiting Time"],["24/7","Smart Monitoring"]].map(([v,l])=>(
              <div key={l} className="text-center p-5 rounded-2xl border border-white/5 bg-white/2">
                <p className="text-3xl font-black text-cyan-400 mb-1">{v}</p>
                <p className="text-slate-400 text-xs leading-snug">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">How It Works</h2>
            <p className="text-slate-400">From physical sensor to your dashboard in milliseconds</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {n:"01", title:"SENSE",    icon:Antenna,   desc:"IoT sensors detect equipment occupancy in real-time"},
              {n:"02", title:"CONNECT",  icon:Wifi,      desc:"Arduino + ESP8266 transmits data via Wi-Fi to the cloud"},
              {n:"03", title:"ANALYZE",  icon:BarChart2, desc:"Platform processes equipment and workout data"},
              {n:"04", title:"ACT",      icon:Zap,       desc:"Users book equipment and admins manage the gym"},
            ].map(s=>{
              const Icon=s.icon;
              return (
                <div key={s.n} className="text-center p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-cyan-500/20 transition-all">
                  <div className="text-xs text-cyan-400 font-semibold mb-3">{s.n}</div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4"><Icon className="text-cyan-400" size={22}/></div>
                  <h3 className="text-white font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
          {/* Architecture */}
          <Card className="p-8 max-w-2xl mx-auto" glow>
            <h3 className="text-center text-white font-semibold mb-6 text-sm">System Architecture</h3>
            <div className="flex flex-col items-center gap-1 text-sm">
              {[
                {label:"GYM EQUIPMENT", icon:Dumbbell, color:"text-slate-300"},
                {label:"IR / Limit Switch Sensors", icon:Radio, color:"text-slate-400"},
                {label:"Arduino UNO", icon:Cpu, color:"text-amber-400"},
                {label:"ESP8266 ESP-01 (Wi-Fi)", icon:Wifi, color:"text-cyan-400"},
                {label:"Supabase / PostgreSQL", icon:Database, color:"text-blue-400"},
                {label:"SMARTGYM Platform", icon:Globe, color:"text-purple-400"},
                {label:"User + Admin Dashboard", icon:Monitor, color:"text-emerald-400"},
              ].map((item,i,arr)=>{
                const Icon=item.icon;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 ${item.color} font-medium text-xs`}><Icon size={14}/>{item.label}</div>
                    {i<arr.length-1&&<div className="w-px h-4 bg-gradient-to-b from-white/10 to-transparent"/>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 border-t border-white/5" style={{background:"#08101f"}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-3xl font-black text-white mb-2">Everything Your Gym Needs</h2><p className="text-slate-400">Professional-grade tools for modern gym management</p></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {icon:Cpu,         title:"IoT Monitoring",      desc:"Arduino + ESP8266 sensors track equipment occupancy in real-time"},
              {icon:QrCode,      title:"QR Booking",          desc:"Scan-to-book system with unique QR codes per session"},
              {icon:Bot,         title:"AI Fitness Coach",    desc:"Claude-powered assistant for workout planning and recommendations"},
              {icon:BarChart2,   title:"Smart Analytics",     desc:"Peak hour prediction, utilization heatmaps, and member insights"},
              {icon:Wrench,      title:"Maintenance Tracking",desc:"Automated health scoring and preventive maintenance alerts"},
              {icon:Shield,      title:"Role-Based Access",   desc:"Separate user and admin dashboards with proper authentication"},
            ].map(f=>{
              const Icon=f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all"><Icon className="text-cyan-400" size={20}/></div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Crowd Meter */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-6">Live Gym Status</h2>
          <Card className="p-8" glow>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Current Crowd Level</p>
            <div className="text-4xl font-black text-amber-400 mb-2">{crowdPct}%</div>
            <p className="text-amber-400 font-semibold mb-4">HIGH</p>
            <div className="w-full bg-white/5 rounded-full h-3 mb-4 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 transition-all" style={{width:`${crowdPct}%`}}/>
            </div>
            <p className="text-slate-400 text-sm">Best time to visit: <span className="text-white font-semibold">2:00 PM – 4:00 PM</span></p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 border-t border-white/5 text-center" style={{background:"#08101f"}}>
        <h2 className="text-4xl font-black text-white mb-3">MAKE YOUR GYM SMARTER.</h2>
        <p className="text-slate-400 mb-8">Connect equipment. Reduce waiting. Track workouts. Manage smarter.</p>
        <div className="flex gap-3 justify-center">
          <Btn size="lg" onClick={()=>onNavigate("login")}><Play size={18}/>Start Demo</Btn>
          <Btn size="lg" variant="ghost" onClick={()=>onNavigate("login")}>Explore Dashboard</Btn>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-black font-black text-xs">S</div>
              <span className="text-white font-bold text-sm">SMARTGYM</span>
            </div>
            <p className="text-slate-500 text-xs">IoT-Powered Gym Management System</p>
            <p className="text-slate-600 text-xs mt-1">Makerspace-II · CEP-201 Engineering Project</p>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            {["Platform","Equipment","Dashboard","AI","About"].map(l=><button key={l} className="hover:text-white transition-colors">{l}</button>)}
          </div>
        </div>
      </footer>
    </div>
  );
};

// ==================== SIGNUP PAGE ====================
const SignupPage = ({ onNavigate }) => {
  const [form, setForm] = useState({name:"",email:"",pass:""});
  const [done, setDone] = useState(false);
  if(done) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#080b14"}}>
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
        <p className="text-slate-400 mb-6">Welcome to SmartGym, {form.name}.</p>
        <Btn onClick={()=>onNavigate("login")}>Go to Login</Btn>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"#080b14"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black font-black text-2xl mx-auto mb-4">S</div>
          <h1 className="text-2xl font-bold text-white">Join SmartGym</h1>
          <p className="text-slate-400 text-sm mt-1">Create your account</p>
        </div>
        <Card className="p-6" glow>
          <div className="space-y-3 mb-4">
            <Input label="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Alex Martinez"/>
            <Input label="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com"/>
            <Input label="Password" type="password" value={form.pass} onChange={e=>setForm(f=>({...f,pass:e.target.value}))} placeholder="Min 8 characters"/>
          </div>
          <Btn className="w-full justify-center" onClick={()=>form.name&&form.email&&form.pass&&setDone(true)}>Create Account</Btn>
          <p className="text-center text-slate-400 text-xs mt-4">Already have an account? <button onClick={()=>onNavigate("login")} className="text-cyan-400 hover:underline">Sign in</button></p>
        </Card>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const Monitor = ({size,className}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>;

export default function SmartGym() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState(mkEquipment());
  const [bookings] = useState(mkBookings());
  const [notifications, setNotifications] = useState(mkNotifs());
  const [bookingEq, setBookingEq] = useState(null);
  const [detailEq, setDetailEq] = useState(null);

  // Simulate IoT updates
  useEffect(()=>{
    const interval = setInterval(()=>{
      setEquipment(eq=>eq.map(e=>{
        if(e.status==="in-use"&&e.sessionStart){
          const duration = Date.now()-e.sessionStart;
          if(duration > 30*60*1000) return {...e,status:"available",user:null,sessionStart:null};
        }
        return e;
      }));
    }, 10000);
    return ()=>clearInterval(interval);
  },[]);

  const handleLogin = (userData) => { setUser(userData); setPage(userData.role==="admin"?"admin":"dashboard"); };
  const handleLogout = () => { setUser(null); setPage("landing"); };

  if(detailEq) return <EqDetailPage eq={detailEq} onBack={()=>setDetailEq(null)} onBook={setBookingEq}/>;

  let content;
  if(page==="landing")   content = <LandingPage onNavigate={setPage} equipment={equipment}/>;
  else if(page==="login")   content = <LoginPage onLogin={handleLogin} onNavigate={setPage}/>;
  else if(page==="signup")  content = <SignupPage onNavigate={setPage}/>;
  else if(page==="dashboard"&&user) content = (
    <UserDashboard user={user} equipment={equipment} bookings={bookings}
      notifications={notifications} setNotifications={setNotifications}
      onLogout={handleLogout} onNavigate={setPage}/>
  );
  else if(page==="admin"&&user?.role==="admin") content = (
    <AdminDashboard equipment={equipment} setEquipment={setEquipment} onLogout={handleLogout}/>
  );
  else content = <LandingPage onNavigate={setPage} equipment={equipment}/>;

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",color:"#f1f5f9"}}>
      {content}
      {bookingEq&&<BookingModal eq={bookingEq} onClose={()=>setBookingEq(null)} onConfirm={()=>{}}/>}
    </div>
  );
}
