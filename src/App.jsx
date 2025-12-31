import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'; 
import { MapPin, Menu, X, Lock, ArrowRight, Facebook, Instagram, Twitter, Mail, Phone, Sword, Calendar, FileText, Users, LogOut, Send, CheckCircle, Flame, Shield, Globe, Copy, Check } from 'lucide-react';

// --- STYLES FOR GLOBE ---
const globeStyles = `
  @keyframes spin { from { background-position: 0% 0%; } to { background-position: 200% 0%; } }
  .earth-spin { background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png'); background-size: 200% 100%; animation: spin 20s linear infinite; box-shadow: inset 20px 0 80px 10px rgba(0,0,0,0.9); }
`;

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

const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

// --- NAVBAR ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">FIRE HIVE<span className="text-orange-600">.</span></Link>
        <div className="hidden lg:flex gap-5 text-xs font-bold text-gray-300 tracking-widest">
          <Link to="/" className="hover:text-white transition">HOME</Link>
          <Link to="/about" className="hover:text-white transition">WHO WE ARE</Link>
          <Link to="/events" className="hover:text-white transition">PROJECTS</Link>
          <Link to="/give" className="hover:text-white transition">GIVE</Link>
          <Link to="/start-chapter" className="hover:text-white transition">CHAPTERS</Link>
          <Link to="/portal" className="text-orange-500 hover:text-white transition">PORTAL</Link>
          <Link to="/war-room" className="text-red-500 hover:text-red-400 flex items-center gap-1 transition"><Sword size={14}/> WAR ROOM</Link>
        </div>
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-zinc-800 p-4 space-y-4 text-center">
          <Link to="/about" className="block text-white font-bold" onClick={() => setIsOpen(false)}>WHO WE ARE</Link>
          <Link to="/events" className="block text-white font-bold" onClick={() => setIsOpen(false)}>PROJECTS</Link>
          <Link to="/give" className="block text-white font-bold" onClick={() => setIsOpen(false)}>GIVE</Link>
          <Link to="/portal" className="block text-orange-500 font-bold" onClick={() => setIsOpen(false)}>PORTAL</Link>
        </div>
      )}
    </nav>
  );
};

// --- MEGA FOOTER ---
const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 px-4 text-white">
    <div className="container mx-auto grid md:grid-cols-4 gap-12 mb-12">
      <div className="md:col-span-2">
        <h2 className="text-3xl font-black tracking-wider mb-4">FIRE HIVE<span className="text-orange-600">.</span></h2>
        <p className="text-gray-400 max-w-sm mb-6">A movement mandated to raise, mentor, and position a generation of young people to take over systems and sectors.</p>
        <div className="flex gap-4">
           <Facebook className="hover:text-blue-500 cursor-pointer"/>
           <Instagram className="hover:text-pink-500 cursor-pointer"/>
           <Twitter className="hover:text-blue-400 cursor-pointer"/>
        </div>
      </div>
      <div><h3 className="font-bold mb-4 uppercase tracking-wider text-gray-500">Quick Links</h3><ul className="space-y-2 text-sm text-gray-300"><li><Link to="/about">About Us</Link></li><li><Link to="/events">Projects</Link></li><li><Link to="/give">Partner</Link></li><li><Link to="/portal">Member Portal</Link></li></ul></div>
      <div><h3 className="font-bold mb-4 uppercase tracking-wider text-gray-500">Contact</h3><ul className="space-y-4 text-sm text-gray-300"><li className="flex gap-2"><MapPin size={16} className="text-orange-500"/> Nigeria, Africa</li><li className="flex gap-2"><Mail size={16} className="text-orange-500"/> hello@firehive.org</li></ul></div>
    </div>
    <div className="text-center text-zinc-700 text-xs border-t border-zinc-900 pt-8">&copy; 2025 Fire Hive Network Int'l. All Rights Reserved.</div>
  </footer>
);

// --- PAGES ---

const HomePage = () => {
  const mountains = [
    { title: "Religion", img: "https://images.unsplash.com/photo-1548625361-7887aa90c36d?q=80&w=400" },
    { title: "Family", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400" },
    { title: "Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400" },
    { title: "Government", img: "https://images.unsplash.com/photo-1529104661-4c2d378037bb?q=80&w=400" },
    { title: "Media", img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=400" },
    { title: "Arts", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400" },
    { title: "Business", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" }
  ];
  return (
    <div className="bg-black min-h-screen text-white">
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <Reveal><h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">RULE <span className="text-orange-600">YOUR WORLD</span></h1></Reveal>
          <Reveal delay={200}><Link to="/war-room" className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-500 transition">ENTER THE WAR ROOM <ArrowRight size={20}/></Link></Reveal>
        </div>
      </header>
      <section className="py-24 px-6 bg-zinc-950">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-zinc-200">The 7 Mountains</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {mountains.map((m, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-zinc-800">
                  <img src={m.img} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><h3 className="text-xl font-bold text-white">{m.title}</h3></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- ABOUT PAGE (LEADERSHIP) ---
const AboutPage = () => (
  <div className="min-h-screen bg-black pt-28 pb-12 px-4 text-white">
    <div className="container mx-auto max-w-5xl">
      <Reveal><h1 className="text-5xl font-black mb-8 border-l-8 border-orange-500 pl-6">WHO WE ARE</h1></Reveal>
      <div className="bg-zinc-900/80 p-8 rounded-2xl border border-zinc-700 mb-16">
        <p className="text-xl leading-relaxed text-gray-300"><span className="text-orange-500 font-bold">Fire Hive Network Int'l</span> is a spiritual ecosystem designed to raise, mentor, and position a generation of young people to take over systems and sectors.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-zinc-900 p-6 rounded-xl border-t-4 border-red-500"><Flame className="text-red-500 mb-4"/><h3 className="font-bold">Dominance</h3></div>
        <div className="bg-zinc-900 p-6 rounded-xl border-t-4 border-orange-500"><Shield className="text-orange-500 mb-4"/><h3 className="font-bold">Excellence</h3></div>
        <div className="bg-zinc-900 p-6 rounded-xl border-t-4 border-blue-500"><Users className="text-blue-500 mb-4"/><h3 className="font-bold">Family</h3></div>
      </div>
      <h2 className="text-3xl font-black text-center mb-8">LEADERSHIP</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {[{name: "Israel Kizito", role: "The Visionary"}, {name: "Emmanuel Odunnaya", role: "Director of Ops"}, {name: "Uche Faith", role: "Media Head"}].map((l, i) => (
          <div key={i} className="group">
            <div className="w-40 h-40 mx-auto rounded-full bg-zinc-800 mb-4 overflow-hidden border-2 border-zinc-700 group-hover:border-orange-500 transition">
              <img src={`/images/${l.name.split(' ')[0].toLowerCase()}.jpg`} className="w-full h-full object-cover" onError={(e) => e.target.src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} />
            </div>
            <h3 className="font-bold text-lg">{l.name}</h3>
            <p className="text-orange-500 text-xs uppercase font-bold">{l.role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- EVENTS / PROJECTS PAGE ---
const EventsPage = () => {
  const events = [
    { title: "Counting The Cost", date: "Jan 2-3, 2026", theme: "SAVIOURS", color: "border-blue-500", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800" },
    { title: "Mid-Year Retreat", date: "June 2026", theme: "REFIRING", color: "border-orange-500", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800" },
    { title: "Cedars of Lebanon", date: "Sept 16-19, 2026", theme: "LIVELY STONES", color: "border-yellow-500", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" }
  ];
  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 text-white">
      <h1 className="text-4xl font-black text-center mb-12">PROJECTS 2026</h1>
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className={`bg-zinc-900 rounded-xl overflow-hidden border-t-4 ${e.color}`}>
              <div className="h-48 bg-zinc-800"><img src={e.img} className="w-full h-full object-cover"/></div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{e.title}</h3>
                <p className="text-orange-500 font-bold text-sm mb-4">{e.theme}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400"><Calendar size={16}/> {e.date}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

// --- GIVE PAGE ---
const GivePage = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText("0123456789"); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4 text-center text-white">
      <h1 className="text-5xl font-black mb-4">PARTNER</h1>
      <div className="container mx-auto max-w-2xl bg-zinc-900 border border-orange-500/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Bank Transfer</h2>
        <div className="bg-black p-4 rounded border border-zinc-700 flex justify-between items-center cursor-pointer" onClick={handleCopy}>
          <div className="text-left"><p className="text-xs uppercase text-gray-500">Acct Number</p><p className="text-3xl font-mono text-orange-500 font-bold">0123456789</p></div>
          <button className={`p-3 rounded-full transition ${copied ? 'bg-green-600' : 'bg-zinc-800'}`}>{copied ? <Check size={20}/> : <Copy size={20}/>}</button>
        </div>
      </div>
    </div>
  );
};

// --- START CHAPTER (GLOBE) ---
const StartChapterPage = () => (
  <div className="min-h-screen bg-black pt-28 px-4 text-white flex flex-col items-center text-center">
    <style>{globeStyles}</style>
    <div className="relative w-64 h-64 mb-12">
      <div className="earth-spin w-full h-full rounded-full bg-blue-900/50 shadow-[0_0_50px_rgba(249,115,22,0.6)] relative overflow-hidden border-2 border-orange-500/30">
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10"></div>
      </div>
    </div>
    <h1 className="text-4xl font-black mb-4">START A CHAPTER</h1>
    <p className="text-gray-400 max-w-md mb-8">We are expanding to campuses and cities across Africa.</p>
    <a href="mailto:expansion@firehivenetwork.com" className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-orange-500 hover:text-white transition">APPLY TO LEAD</a>
  </div>
);

// --- WAR ROOM & PORTAL (Previous Code) ---
const WarRoom = () => (
  <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 text-center pt-20">
    <Sword size={64} className="text-red-500 mb-6 animate-pulse" />
    <h1 className="text-5xl font-black mb-6 uppercase">The War Room</h1>
    <div className="bg-black/30 p-8 rounded-xl border border-red-500/30 backdrop-blur-sm max-w-md w-full">
      <h3 className="font-bold mb-4 text-red-400">PRAYER FOCUS</h3>
      <ul className="text-left space-y-3 text-sm">
        <li className="flex gap-2"><div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full"></div> Dominion over Media & Arts</li>
        <li className="flex gap-2"><div className="w-2 h-2 mt-1.5 bg-red-500 rounded-full"></div> Righteous Government Policy</li>
      </ul>
    </div>
  </div>
);

const PortalPage = () => {
  const [role, setRole] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState("submit");
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState({ title: "", type: "Cell", notes: "" });

  const handleLogin = (e) => { e.preventDefault(); const codes = { 'cell2026': 'cell_lead', 'overseer7': 'overseer' }; if (codes[inputCode]) setRole(codes[inputCode]); else alert("Invalid Code"); };

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

  const submitReport = async (e) => {
    e.preventDefault();
    if (!reportData.title) return;
    try {
      await addDoc(collection(db, "reports"), { ...reportData, authorRole: role, date: new Date().toLocaleDateString(), timestamp: Date.now() });
      alert("Report Submitted!"); setReportData({ title: "", type: "Cell", notes: "" }); setActiveTab("reports");
    } catch (err) { alert("Error submitting"); }
  };

  if (!role) return (<div className="min-h-screen bg-black flex flex-col items-center justify-center p-4"><div className="bg-zinc-900 border border-orange-500/30 p-8 rounded-2xl w-full max-w-md"><h1 className="text-2xl font-black text-white text-center mb-6">LEADERSHIP PORTAL</h1><form onSubmit={handleLogin} className="space-y-4"><input type="password" placeholder="Access Code" className="w-full bg-black border border-zinc-700 p-3 rounded text-white" value={inputCode} onChange={(e) => setInputCode(e.target.value)} /><button className="w-full bg-orange-600 text-white font-bold py-3 rounded">ENTER</button></form></div></div>);

  return (
    <div className="min-h-screen bg-black pt-24 px-4 text-white">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-black text-green-500">HIVE COMMAND</h1><button onClick={() => setRole(null)} className="flex gap-2 text-red-500"><LogOut size={16}/> Logout</button></div>
        <div className="flex gap-4 border-b border-zinc-800 mb-8"><button onClick={() => setActiveTab("reports")} className={`pb-4 px-4 font-bold ${activeTab === "reports" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>REPORTS</button><button onClick={() => setActiveTab("submit")} className={`pb-4 px-4 font-bold ${activeTab === "submit" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"}`}>+ NEW REPORT</button></div>
        {activeTab === "submit" && (<form onSubmit={submitReport} className="bg-zinc-900 p-8 rounded-xl space-y-4"><input type="text" placeholder="Title" className="w-full bg-black p-3 rounded text-white" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} /><textarea placeholder="Notes" className="w-full bg-black p-3 rounded text-white h-32" value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})}></textarea><button className="w-full bg-green-600 py-4 rounded font-bold">SUBMIT REPORT</button></form>)}
        {activeTab === "reports" && <div className="space-y-4">{reports.map(r => <div key={r.id} className="bg-zinc-900 p-6 rounded-xl"><h3>{r.title}</h3><p className="text-gray-400">{r.notes}</p></div>)}</div>}
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
      <Route path="/events" element={<><Navbar /><EventsPage /><Footer /></>} />
      <Route path="/give" element={<><Navbar /><GivePage /><Footer /></>} />
      <Route path="/start-chapter" element={<><Navbar /><StartChapterPage /><Footer /></>} />
      <Route path="/war-room" element={<><Navbar /><WarRoom /></>} />
      <Route path="/portal" element={<><Navbar /><PortalPage /></>} />
    </Routes>
  )
}

export default App

