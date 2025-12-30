import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { db } from './firebaseConfig'; 
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, query, arrayUnion } from 'firebase/firestore'; 
import { Globe, BookOpen, Target, Shield, Calendar, MapPin, Menu, X, Flame, Lock, Trash2, ArrowRight, School, CheckCircle, Image as ImageIcon, Briefcase, Building2, Copy, Check, Users, Activity, MessageSquare, Send, AlertTriangle, FileText, LogOut } from 'lucide-react';

// --- ANIMATION COMPONENT ---
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

// --- DATA: 7 MOUNTAINS ---
const mountainData = {
  religion: { title: "Mountain of Religion", desc: "Redefining spirituality.", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=60", orgs: ["RCCG", "Living Faith", "Vatican"], careers: ["Pastor", "Missionary", "Theologian"] },
  family: { title: "Mountain of Family", desc: "Restoring foundations.", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=60", orgs: ["Focus on Family", "UNICEF"], careers: ["Therapist", "Social Worker"] },
  education: { title: "Mountain of Education", desc: "Shaping minds.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60", orgs: ["Harvard", "Covenant Univ"], careers: ["Professor", "Principal"] },
  government: { title: "Mountain of Government", desc: "Righteous laws.", image: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&q=60", orgs: ["UN", "Senate"], careers: ["Senator", "Diplomat"] },
  media: { title: "Mountain of Media", desc: "Broadcasting truth.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=60", orgs: ["CNN", "Netflix"], careers: ["Journalist", "Director"] },
  arts: { title: "Mountain of Arts", desc: "Creative expression.", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=60", orgs: ["Grammys", "Nollywood"], careers: ["Artist", "Musician"] },
  business: { title: "Mountain of Business", desc: "Kingdom wealth.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=60", orgs: ["Google", "Dangote"], careers: ["CEO", "Investor"] }
};

// --- STYLES ---
const globeStyles = `
  @keyframes spin { from { background-position: 0% 0%; } to { background-position: 200% 0%; } }
  .earth-spin { background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png'); background-size: 200% 100%; animation: spin 20s linear infinite; box-shadow: inset 20px 0 80px 10px rgba(0,0,0,0.9); }
`;
const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

// --- NEW COMPONENT: THE HIVE PORTAL ---
const PortalPage = () => {
  const [role, setRole] = useState(null); // 'patron', 'cell_lead', 'colony_lead', 'overseer'
  const [inputCode, setInputCode] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [reports, setReports] = useState([]);
  
  // Report Form State
  const [reportData, setReportData] = useState({ title: "", type: "Cell", health: "Green", attendance: "", notes: "", public: false });
  const [commentText, setCommentText] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  // AUTHENTICATION LOGIC
  const handleLogin = (e) => {
    e.preventDefault();
    const codes = {
      'firemember': 'patron',
      'cell2026': 'cell_lead',
      'colony2026': 'colony_lead',
      'overseer7': 'overseer'
    };
    if (codes[inputCode]) {
      setRole(codes[inputCode]);
      if(codes[inputCode] === 'overseer') setActiveTab("reports");
    } else {
      alert("Invalid Access Code");
    }
  };

  // FETCH DATA
  useEffect(() => {
    if (role) {
      const fetchReports = async () => {
        const q = query(collection(db, "reports"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchReports();
    }
  }, [role, activeTab]);

  // SUBMIT REPORT
  const submitReport = async (e) => {
    e.preventDefault();
    if (!reportData.title) return;
    const newReport = {
      ...reportData,
      authorRole: role,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      comments: []
    };
    await addDoc(collection(db, "reports"), newReport);
    alert("Report Filed Successfully!");
    setReportData({ title: "", type: "Cell", health: "Green", attendance: "", notes: "", public: false });
    setActiveTab("reports");
  };

  // ADD COMMENT (Overseer Only)
  const addComment = async (reportId) => {
    if(!commentText) return;
    const reportRef = doc(db, "reports", reportId);
    await updateDoc(reportRef, {
      comments: arrayUnion({ text: commentText, author: "Overseer", date: new Date().toLocaleDateString() })
    });
    setCommentText("");
    alert("Comment Added");
    // Refresh logic omitted for brevity, user can refresh page
  };

  // --- LOGIN SCREEN ---
  if (!role) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-orange-500/30 p-8 rounded-2xl w-full max-w-md">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center"><Lock className="text-orange-500 w-8 h-8" /></div></div>
          <h1 className="text-2xl font-black text-white text-center mb-2">THE HIVE PORTAL</h1>
          <p className="text-gray-400 text-center mb-6 text-sm">Restricted Access. Enter Clearance Code.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Enter Access Code" value={inputCode} onChange={e => setInputCode(e.target.value)} className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white focus:border-orange-500 outline-none text-center tracking-widest text-lg" />
            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl">AUTHENTICATE</button>
          </form>
          <div className="mt-6 text-xs text-center text-gray-600">
            <p>Patron | Leader | Overseer</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div>
            <h1 className="text-xl font-black text-white">THE HIVE</h1>
            <p className="text-orange-500 text-xs uppercase font-bold tracking-widest">{role.replace('_', ' ')}</p>
          </div>
          <button onClick={() => setRole(null)} className="text-gray-500 hover:text-white"><LogOut size={20}/></button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['patron', 'cell_lead', 'colony_lead', 'overseer'].includes(role) && (
            <button onClick={() => setActiveTab("news")} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap ${activeTab === 'news' ? 'bg-white text-black' : 'bg-zinc-900 text-gray-400'}`}>News Feed</button>
          )}
          {['cell_lead', 'colony_lead', 'overseer'].includes(role) && (
            <button onClick={() => setActiveTab("submit")} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap ${activeTab === 'submit' ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-gray-400'}`}>Upload Report</button>
          )}
          <button onClick={() => setActiveTab("reports")} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-gray-400'}`}>
            {role === 'patron' ? 'Testimonies' : 'View Reports'}
          </button>
        </div>

        {/* --- CONTENT: SUBMIT REPORT (Leaders Only) --- */}
        {activeTab === 'submit' && (
          <Reveal>
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FileText className="text-orange-500"/> Operational Report</h2>
              <form onSubmit={submitReport} className="space-y-4">
                <input placeholder="Cell / Colony Name" value={reportData.title} onChange={e => setReportData({...reportData, title: e.target.value})} className="w-full bg-black p-3 rounded border border-zinc-700 text-white" required />
                
                <div className="grid grid-cols-2 gap-4">
                  <select value={reportData.type} onChange={e => setReportData({...reportData, type: e.target.value})} className="w-full bg-black p-3 rounded border border-zinc-700 text-white">
                    <option>Cell Meeting</option>
                    <option>Colony Meeting</option>
                    <option>Outreach</option>
                  </select>
                  <input type="number" placeholder="Attendance" value={reportData.attendance} onChange={e => setReportData({...reportData, attendance: e.target.value})} className="w-full bg-black p-3 rounded border border-zinc-700 text-white" />
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Health Status</label>
                  <div className="flex gap-2">
                    {['Green', 'Yellow', 'Red'].map(color => (
                      <button type="button" key={color} onClick={() => setReportData({...reportData, health: color})} 
                        className={`flex-1 py-2 rounded border ${reportData.health === color ? (color === 'Green' ? 'bg-green-600 border-green-500' : color === 'Yellow' ? 'bg-yellow-600 border-yellow-500' : 'bg-red-600 border-red-500') : 'bg-black border-zinc-700 text-gray-500'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea placeholder="Situation Report / Testimony..." value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})} className="w-full bg-black p-3 rounded border border-zinc-700 text-white h-32"></textarea>
                
                <div className="flex items-center gap-3 bg-black p-3 rounded border border-zinc-800">
                  <input type="checkbox" checked={reportData.public} onChange={e => setReportData({...reportData, public: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                  <div>
                    <p className="text-white text-sm font-bold">Share as Testimony?</p>
                    <p className="text-gray-500 text-xs">If checked, Patrons can see the notes (not numbers).</p>
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl">SUBMIT REPORT</button>
              </form>
            </div>
          </Reveal>
        )}

        {/* --- CONTENT: VIEW REPORTS --- */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.filter(r => role === 'overseer' || role.includes('lead') || (role === 'patron' && r.public)).map((report) => (
              <Reveal key={report.id}>
                <div className={`bg-zinc-900 rounded-xl overflow-hidden border-l-4 ${report.health === 'Green' ? 'border-green-500' : report.health === 'Yellow' ? 'border-yellow-500' : 'border-red-500'} relative`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-400 text-xs font-bold uppercase">{report.type} • {report.date}</span>
                      {role === 'overseer' && <span className={`px-2 py-1 rounded text-xs font-bold text-black ${report.health === 'Green' ? 'bg-green-500' : report.health === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}>{report.health}</span>}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                    
                    {/* Stats only for Leaders/Overseers */}
                    {role !== 'patron' && (
                      <div className="flex gap-4 mb-4 text-sm text-gray-300 bg-black/50 p-3 rounded">
                        <div className="flex items-center gap-2"><Users size={16} className="text-blue-500"/> <span>{report.attendance || 0} Attended</span></div>
                        <div className="flex items-center gap-2"><Activity size={16} className={report.health === 'Green' ? 'text-green-500' : 'text-red-500'}/> <span>Status: {report.health}</span></div>
                      </div>
                    )}

                    <p className="text-gray-400 text-sm whitespace-pre-wrap mb-4">{report.notes}</p>

                    {/* Comments Section */}
                    {role !== 'patron' && (
                       <div className="border-t border-zinc-800 pt-4 mt-4">
                         {report.comments && report.comments.map((c, i) => (
                           <div key={i} className="bg-black p-3 rounded mb-2 text-sm text-gray-300 border border-zinc-800">
                             <span className="text-orange-500 font-bold text-xs block mb-1">{c.author}</span>
                             {c.text}
                           </div>
                         ))}
                         {role === 'overseer' && (
                           <div className="flex gap-2 mt-2">
                             <input placeholder="Add Overseer Comment..." value={commentText} onChange={e => setCommentText(e.target.value)} className="bg-black text-white text-sm flex-1 p-2 rounded border border-zinc-700"/>
                             <button onClick={() => addComment(report.id)} className="bg-blue-600 p-2 rounded text-white"><Send size={16}/></button>
                           </div>
                         )}
                       </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            {reports.length === 0 && <p className="text-center text-gray-500">No reports found.</p>}
          </div>
        )}

        {/* --- CONTENT: NEWS FEED --- */}
        {activeTab === 'news' && <NewsSection />}
        
      </div>
    </div>
  );
};

// --- REUSED NEWS COMPONENT (Simplified for Portal) ---
const NewsSection = () => {
  const [news, setNews] = useState([]);
  useEffect(() => { const fetchNews = async () => { const q = query(collection(db, "news"), orderBy("date", "desc")); const s = await getDocs(q); setNews(s.docs.map(d => ({id:d.id, ...d.data()}))); }; fetchNews(); }, []);
  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Reveal key={item.id}>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
             <div className="flex justify-between mb-2"><span className="text-orange-500 text-xs font-bold">{item.category}</span><span className="text-gray-500 text-xs">{item.date}</span></div>
             <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
             {item.image && <img src={item.image} className="w-full h-40 object-cover rounded-lg mb-4" />}
             <p className="text-gray-400 text-sm">{item.content}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

// --- STANDARD COMPONENTS ---
const RotatingGlobe = () => ( <div className="relative w-64 h-64 mx-auto my-8"><style>{globeStyles}</style><div className="earth-spin w-full h-full rounded-full bg-blue-900/50 relative overflow-hidden border-2 border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.6)]"><div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10"></div></div></div> );
const SevenMountains = () => {
  const mountains = [ { id: "religion", name: "Religion", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=60" }, { id: "family", name: "Family", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=60" }, { id: "education", name: "Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60" }, { id: "government", name: "Government", img: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&q=60" }, { id: "media", name: "Media", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=60" }, { id: "arts", name: "Arts & Ent.", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=60" }, { id: "business", name: "Business", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=60" }, ];
  return ( <div className="py-12"><Reveal><h2 className="text-3xl font-black text-white text-center mb-8">INFILTRATING THE <span className="text-orange-500">7 MOUNTAINS</span></h2></Reveal><div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">{mountains.map((m, i) => ( <Reveal key={i} delay={i * 100}><Link to={`/mountain/${m.id}`} className="group relative h-40 md:h-60 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer bg-zinc-900 block"><div className="absolute inset-0 flex items-center justify-center text-zinc-700"><ImageIcon size={40} /></div><img src={m.img} alt={m.name} className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition duration-700" onError={(e) => e.target.style.opacity = 0} /><div className="absolute inset-0 bg-black/40 group-hover:bg-orange-600/60 transition duration-300 flex items-center justify-center z-20"><h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-wider text-center px-2 drop-shadow-md">{m.name}</h3></div></Link></Reveal> ))}</div></div> );
};
const MountainPage = () => { const { id } = useParams(); const data = mountainData[id]; if (!data) return <div className="min-h-screen bg-black pt-32 text-center text-white">Mountain Not Found</div>; return ( <div className="min-h-screen bg-black pt-28 pb-12 px-4"><Reveal><div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 border-2 border-orange-500/30 container mx-auto max-w-5xl"><img src={data.image} alt={data.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8"><h1 className="text-4xl md:text-6xl font-black text-white mb-2">{data.title}</h1><p className="text-gray-300 text-lg md:text-xl max-w-2xl">{data.desc}</p></div></div></Reveal><div className="text-center mt-12"><Link to="/" className="text-gray-500 hover:text-white transition">← Back to Home</Link></div></div> ); };
const StartChapterPage = () => { const [step, setStep] = useState(1); const form = useRef(); const handleChapterSubmit = (e) => { e.preventDefault(); setStep(2); }; return ( <div className="min-h-screen bg-black pt-28 pb-12 px-4 relative"><div className="container mx-auto max-w-3xl relative z-10"><Reveal><div className="text-center mb-10"><h1 className="text-4xl font-black text-white mb-2">START A CHAPTER</h1></div></Reveal>{step === 1 && (<Reveal delay={200}><div className="bg-zinc-900/80 p-8 rounded-3xl"><form ref={form} onSubmit={handleChapterSubmit} className="space-y-4"><input placeholder="Full Name" className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white" /><button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl">Unlock Training</button></form></div></Reveal>)} {step === 2 && <div className="text-white text-center">Training Unlocked! Check WhatsApp.</div>}</div></div> ); };
const EventsPage = () => (<div className="min-h-screen bg-black pt-28 pb-12 px-4"><h1 className="text-center text-white text-4xl font-black">PROJECTS 2026</h1></div>);
const GivePage = () => { const [copied, setCopied] = useState(false); const handleCopy = () => { navigator.clipboard.writeText("0123456789"); setCopied(true); setTimeout(() => setCopied(false), 2000); }; return ( <div className="min-h-screen bg-black pt-32 pb-12 px-4 text-center"><Reveal><h1 className="text-5xl font-black text-white mb-4">PARTNER WITH US</h1></Reveal><Reveal delay={200}><div className="bg-zinc-900 border border-orange-500/50 rounded-2xl p-8 mb-8 relative overflow-hidden max-w-xl mx-auto"><div className="bg-black p-4 rounded border border-zinc-700 flex justify-between items-center group cursor-pointer" onClick={handleCopy}><div><p className="text-gray-500 text-xs">Account Number</p><p className="text-3xl font-mono text-orange-500 font-bold">0123456789</p></div><button className={`p-3 rounded-full transition ${copied ? 'bg-green-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{copied ? <Check size={20}/> : <Copy size={20}/>}</button></div></div></Reveal></div> ); };
const AboutPage = () => (<div className="min-h-screen bg-black pt-28 pb-12 px-4"><Reveal><h1 className="text-4xl font-black text-white">WHO WE ARE</h1></Reveal></div>);

const HomePage = () => {
  return (
    <>
      <header className="relative pt-24 pb-16 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          <Reveal><div className="w-28 h-28 rounded-full border-4 border-orange-500/50 shadow-[0_0_40px_orange] overflow-hidden mb-6 bg-black mx-auto"><img src="/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="/logo.jpg"; }} /></div></Reveal>
          <Reveal delay={200}><h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-4">RAISING <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">AN ARMY</span></h1></Reveal>
          <Reveal delay={400}><RotatingGlobe /></Reveal>
          <Reveal delay={600}><div className="flex gap-4 mt-8 justify-center"><a href="#join" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">Join Us</a><Link to="/events" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition">Projects</Link></div></Reveal>
        </div>
      </header>
      <section className="py-12 bg-zinc-950"><div className="container mx-auto"><SevenMountains /></div></section>
      <section id="join" className="py-20 px-4 bg-black relative"><div className="container mx-auto max-w-xl relative z-10"><Reveal><div className="bg-black/80 border border-orange-500/50 p-8 rounded-3xl"><h2 className="text-3xl font-black text-center text-white mb-2">JOIN THE NETWORK</h2></div></Reveal></div></section>
    </>
  );
};

// --- MAIN APP ---
const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-white">
        <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-orange-900/50 py-3">
          <div className="container mx-auto flex justify-between items-center px-4">
            <Link to="/" className="flex items-center gap-2"><div className="w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden"><img src="/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="/logo.jpg"; }} /></div><span className="text-xl font-black tracking-wider text-white">FIRE HIVE</span></Link>
            <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300"><Link to="/about" className="hover:text-orange-500">About</Link><Link to="/events" className="hover:text-orange-500">Projects</Link><Link to="/give" className="hover:text-orange-500">Give</Link><Link to="/portal" className="text-orange-500 hover:text-white font-bold flex items-center gap-1"><Lock size={14}/> Portal</Link></div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white bg-zinc-800 p-2 rounded">{isOpen ? <X /> : <Menu />}</button>
          </div>
          {isOpen && ( <div className="absolute top-full left-0 w-full bg-zinc-900 border-b border-orange-500 p-6 flex flex-col gap-4 md:hidden"><Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold">Home</Link><Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold">About</Link><Link to="/events" onClick={() => setIsOpen(false)} className="text-lg font-bold">Projects</Link><Link to="/portal" onClick={() => setIsOpen(false)} className="text-lg font-bold text-orange-500 pt-4 border-t border-zinc-800">🔒 Member Portal</Link></div> )}
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/start-chapter" element={<StartChapterPage />} />
          <Route path="/mountain/:id" element={<MountainPage />} />
          {/* NEW PORTAL ROUTE REPLACES OLD ADMIN */}
          <Route path="/portal" element={<PortalPage />} />
        </Routes>
        <footer className="bg-black py-8 text-center text-zinc-600 text-xs border-t border-zinc-900"><p>&copy; 2025 Fire Hive Network Int'l.</p></footer>
      </div>
    </Router>
  );
};

export default App;