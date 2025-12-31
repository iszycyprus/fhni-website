import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, updateDoc, doc, orderBy, query, arrayUnion } from 'firebase/firestore'; 
import { Globe, Shield, MapPin, Menu, X, Flame, Lock, ArrowRight, CheckCircle, Copy, Check, Users, Activity, MessageSquare, AlertTriangle, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, Clock, Sword, Calendar, FileText, Send, LogOut } from 'lucide-react';

// --- ANIMATION ---
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (<div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>);
};

// --- DATA ---
const mountainData = [
  { id: "religion", title: "Mountain of Religion", desc: "Redefining spirituality.", image: "https://images.unsplash.com/photo-1548625361-7887aa90c36d?auto=format&fit=crop&q=80", careers: ["Pastor", "Missionary"] },
  { id: "family", title: "Mountain of Family", desc: "Restoring foundations.", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80", careers: ["Therapist", "Parenting Coach"] },
  { id: "education", title: "Mountain of Education", desc: "Shaping minds.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", careers: ["Professor", "Principal"] },
  { id: "government", title: "Mountain of Government", desc: "Righteous laws.", image: "https://images.unsplash.com/photo-1529104661-4c2d378037bb?auto=format&fit=crop&q=80", careers: ["Senator", "Diplomat"] },
  { id: "media", title: "Mountain of Media", desc: "Broadcasting truth.", image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80", careers: ["Journalist", "Director"] },
  { id: "arts", title: "Mountain of Arts", desc: "Creative expression.", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80", careers: ["Artist", "Musician"] },
  { id: "business", title: "Mountain of Business", desc: "Kingdom wealth.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80", careers: ["CEO", "Investor"] }
];

const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

// --- NAVBAR ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">FIRE HIVE<span className="text-orange-600">.</span></Link>
        <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
          <Link to="/" className="hover:text-white">HOME</Link>
          <Link to="/about" className="hover:text-white">ABOUT</Link>
          <Link to="/events" className="hover:text-white">PROJECTS</Link>
          <Link to="/give" className="hover:text-white">GIVE</Link>
          <Link to="/portal" className="text-orange-500 hover:text-white">PORTAL</Link>
          <Link to="/war-room" className="text-red-500 hover:text-red-400 flex items-center gap-1"><Sword size={14}/> WAR ROOM</Link>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black border-t border-zinc-800 p-4 space-y-4 text-center">
          <Link to="/" className="block text-white font-bold" onClick={() => setIsOpen(false)}>HOME</Link>
          <Link to="/portal" className="block text-orange-500 font-bold" onClick={() => setIsOpen(false)}>PORTAL</Link>
          <Link to="/war-room" className="block text-red-500 font-bold" onClick={() => setIsOpen(false)}>WAR ROOM</Link>
        </div>
      )}
    </nav>
  );
};

// --- PAGES ---

const HomePage = () => (
  <div className="bg-black min-h-screen text-white">
    <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2000')] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 text-center px-4">
        <Reveal><h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter">RULE <span className="text-orange-600">YOUR WORLD</span></h1></Reveal>
        <Reveal delay={200}><Link to="/war-room" className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-500 transition">ENTER THE WAR ROOM <ArrowRight size={20}/></Link></Reveal>
      </div>
    </header>
    <section className="py-24 px-6 bg-zinc-950">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-zinc-200">The 7 Mountains</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mountainData.map((m, i) => (
            <Reveal key={m.id} delay={i * 100}>
              <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-orange-500 transition">
                <img src={m.image} alt={m.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-1">{m.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">{m.careers.map(c => <span key={c} className="text-[10px] bg-orange-600 text-white px-2 py-1 rounded">{c}</span>)}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const WarRoom = () => (
  <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 text-center pt-20">
    <Sword size={64} className="text-red-500 mb-6 animate-pulse" />
    <h1 className="text-5xl font-black mb-6 uppercase">The War Room</h1>
    <p className="text-xl max-w-2xl text-red-200 mb-8">"Strategies are birthed here. Battles are won here."</p>
    <div className="bg-black/30 p-8 rounded-xl border border-red-500/30 backdrop-blur-sm max-w-md w-full">
      <h3 className="font-bold mb-4 text-red-400">PRAYER FOCUS</h3>
      <ul className="text-left space-y-3 text-sm">
        <li className="flex gap-2"><div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full"></div> Dominion over Media & Arts</li>
        <li className="flex gap-2"><div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full"></div> Righteous Government Policy</li>
      </ul>
    </div>
  </div>
);

// --- FULL REPORT PORTAL (RESTORED) ---
const PortalPage = () => {
  const [role, setRole] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState("vision");
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState({ title: "", type: "Cell", health: "Green", attendance: "", notes: "" });

  // 1. LOGIN LOGIC
  const handleLogin = (e) => { 
    e.preventDefault(); 
    const codes = { 'cell2026': 'cell_lead', 'overseer7': 'overseer' }; 
    if (codes[inputCode]) setRole(codes[inputCode]); 
    else alert("Invalid Code"); 
  };

  // 2. FETCH REPORTS
  useEffect(() => {
    if (role) {
      const fetchReports = async () => {
        try {
          const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
          const snapshot = await getDocs(q);
          setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) { console.error(err); }
      };
      fetchReports();
    }
  }, [role, activeTab]);

  // 3. SUBMIT REPORT
  const submitReport = async (e) => {
    e.preventDefault();
    if (!reportData.title) return;
    try {
      await addDoc(collection(db, "reports"), {
        ...reportData,
        authorRole: role,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        comments: []
      });
      alert("Report Submitted Successfully!");
      setReportData({ title: "", type: "Cell", health: "Green", attendance: "", notes: "" });
      setActiveTab("reports");
    } catch (err) { alert("Error submitting report"); }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-orange-500/30 p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center"><Lock className="text-orange-500 w-8 h-8" /></div></div>
          <h1 className="text-2xl font-black text-white text-center mb-2">LEADERSHIP PORTAL</h1>
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <input type="password" placeholder="Access Code (Try: cell2026)" className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-orange-500 outline-none" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
            <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded transition">ENTER DASHBOARD</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-green-500">HIVE COMMAND</h1>
          <button onClick={() => setRole(null)} className="flex items-center gap-2 text-red-500 hover:text-white"><LogOut size={16}/> Logout</button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b border-zinc-800 mb-8">
          <button onClick={() => setActiveTab("vision")} className={`pb-4 px-4 font-bold ${activeTab === "vision" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>VISION</button>
          <button onClick={() => setActiveTab("reports")} className={`pb-4 px-4 font-bold ${activeTab === "reports" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>REPORTS</button>
          <button onClick={() => setActiveTab("submit")} className={`pb-4 px-4 font-bold ${activeTab === "submit" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>+ NEW REPORT</button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "vision" && (
          <div className="bg-zinc-900 p-8 rounded-xl border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold mb-4">Mandate 2026</h2>
            <p className="text-gray-400">Our goal is to plant 50 new cells and infiltrate the Education Mountain by Q3. Stay focused.</p>
          </div>
        )}

        {activeTab === "submit" && (
          <div className="bg-zinc-900 p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="text-orange-500"/> Submit Weekly Report</h2>
            <form onSubmit={submitReport} className="space-y-4">
              <div><label className="text-xs text-gray-500 uppercase">Report Title</label><input type="text" className="w-full bg-black p-3 rounded border border-zinc-700 text-white" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 uppercase">Type</label><select className="w-full bg-black p-3 rounded border border-zinc-700 text-white" value={reportData.type} onChange={e => setReportData({...reportData, type: e.target.value})}><option>Cell Meeting</option><option>Outreach</option><option>Prayer Chain</option></select></div>
                <div><label className="text-xs text-gray-500 uppercase">Health Status</label><select className="w-full bg-black p-3 rounded border border-zinc-700 text-white" value={reportData.health} onChange={e => setReportData({...reportData, health: e.target.value})}><option>Green (Healthy)</option><option>Yellow (Needs Help)</option><option>Red (Critical)</option></select></div>
              </div>
              <div><label className="text-xs text-gray-500 uppercase">Attendance Count</label><input type="number" className="w-full bg-black p-3 rounded border border-zinc-700 text-white" value={reportData.attendance} onChange={e => setReportData({...reportData, attendance: e.target.value})} /></div>
              <div><label className="text-xs text-gray-500 uppercase">Notes / Testimonies</label><textarea className="w-full bg-black p-3 rounded border border-zinc-700 text-white h-32" value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})}></textarea></div>
              <button className="w-full bg-green-600 hover:bg-green-500 py-4 rounded font-bold">SUBMIT REPORT</button>
            </form>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-4">
                  <div><h3 className="font-bold text-lg">{r.title}</h3><p className="text-xs text-orange-500">{r.type} • {r.date}</p></div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${r.health === "Green" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>{r.health}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{r.notes}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Users size={14}/> Attendance: {r.attendance}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 404 & MAIN
const NotFoundPage = () => <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold text-2xl">404 - Lost?</div>;

function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/war-room" element={<WarRoom />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App

