import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'; 
import { MapPin, Menu, X, ArrowRight, Facebook, Instagram, Twitter, Mail, Sword, Calendar, Flame, Shield, Users, LogOut, Check, Copy, Globe, ChevronLeft, Briefcase, Building2, Send, MessageCircle, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- STYLES ---
const globeStyles = `
  @keyframes spin { from { background-position: 0% 0%; } to { background-position: 200% 0%; } }
  .earth-spin { background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png'); background-size: 200% 100%; animation: spin 20s linear infinite; box-shadow: inset 20px 0 80px 10px rgba(0,0,0,0.9); }
`;

// --- DATA ---
const mountainDetails = {
  religion: { title: "Mountain of Religion", desc: "Redefining spirituality.", image: "https://images.unsplash.com/photo-1548625361-7887aa90c36d?q=80&w=800", orgs: ["The Vatican", "RCCG", "Living Faith"], careers: ["Pastor", "Missionary"] },
  family: { title: "Mountain of Family", desc: "Restoring the core unit.", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800", orgs: ["Focus on the Family", "UNICEF"], careers: ["Therapist", "Social Worker"] },
  education: { title: "Mountain of Education", desc: "Shaping future minds.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800", orgs: ["Harvard", "UNESCO"], careers: ["Professor", "Principal"] },
  government: { title: "Mountain of Government", desc: "Righteous leadership.", image: "https://images.unsplash.com/photo-1529104661-4c2d378037bb?q=80&w=800", orgs: ["United Nations", "Senate"], careers: ["Senator", "Diplomat"] },
  media: { title: "Mountain of Media", desc: "Broadcasting truth.", image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800", orgs: ["CNN", "Netflix"], careers: ["Journalist", "Director"] },
  arts: { title: "Mountain of Arts", desc: "Creative glory.", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800", orgs: ["Grammys", "Hollywood"], careers: ["Artist", "Musician"] },
  business: { title: "Mountain of Business", desc: "Kingdom prosperity.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800", orgs: ["Google", "Tesla"], careers: ["CEO", "Investor"] }
};

// --- COMPONENTS ---
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">FIRE HIVE<span className="text-orange-600">.</span></Link>
        <div className="hidden lg:flex gap-6 text-xs font-bold text-gray-300 tracking-widest items-center">
          <Link to="/" className="hover:text-white transition">HOME</Link>
          <Link to="/about" className="hover:text-white transition">WHO WE ARE</Link>
          <Link to="/events" className="hover:text-white transition">PROJECTS</Link>
          <Link to="/start-chapter" className="hover:text-white transition">JOIN NETWORK</Link>
          <Link to="/portal" className="text-orange-500 hover:text-white transition">PORTAL</Link>
          <Link to="/war-room" className="px-4 py-2 bg-red-900/50 border border-red-600 rounded text-red-500 hover:bg-red-600 hover:text-white transition flex items-center gap-2"><Sword size={14}/> WAR ROOM</Link>
        </div>
        <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-zinc-800 p-4 space-y-4 text-center">
          <Link to="/" className="block text-white font-bold" onClick={() => setIsOpen(false)}>HOME</Link>
          <Link to="/start-chapter" className="block text-white font-bold" onClick={() => setIsOpen(false)}>JOIN NETWORK</Link>
          <Link to="/portal" className="block text-orange-500 font-bold" onClick={() => setIsOpen(false)}>PORTAL</Link>
          <Link to="/war-room" className="block text-red-500 font-bold" onClick={() => setIsOpen(false)}>WAR ROOM</Link>
        </div>
      )}
    </nav>
  );
};

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
      <div><h3 className="font-bold mb-4 uppercase tracking-wider text-gray-500">Quick Links</h3><ul className="space-y-2 text-sm text-gray-300"><li><Link to="/about">About Us</Link></li><li><Link to="/events">Projects</Link></li><li><Link to="/start-chapter">Join Network</Link></li><li><Link to="/portal">Member Portal</Link></li></ul></div>
      <div><h3 className="font-bold mb-4 uppercase tracking-wider text-gray-500">Contact</h3><ul className="space-y-4 text-sm text-gray-300"><li className="flex gap-2"><MapPin size={16} className="text-orange-500"/> Nigeria, Africa</li><li className="flex gap-2"><Mail size={16} className="text-orange-500"/> hello@firehive.org</li></ul></div>
    </div>
    <div className="text-center text-zinc-700 text-xs border-t border-zinc-900 pt-8">&copy; 2025 Fire Hive Network Int'l. All Rights Reserved.</div>
  </footer>
);

// --- HOME PAGE ---
const HomePage = () => (
  <div className="bg-black min-h-screen text-white">
    <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2000')] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 text-center px-4">
        <Reveal><h1 className="text-6xl md:text-9xl font-black mb-4 tracking-tighter">RULE <span className="text-orange-600">YOUR WORLD</span></h1></Reveal>
        <Reveal delay={200}>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">Infiltrate systems. Redefine culture. Dominate the mountains.</p>
          <Link to="/start-chapter" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition">JOIN THE NETWORK <ArrowRight size={20}/></Link>
        </Reveal>
      </div>
    </header>
    <section className="py-24 px-6 bg-zinc-950">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-zinc-200">The 7 Mountains</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(mountainDetails).map(([key, m], i) => (
            <Reveal key={key} delay={i * 100}>
              <Link to={`/mountain/${key}`} className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 block">
                <img src={m.image} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center transition group-hover:bg-black/80">
                  <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-orange-500 font-bold opacity-0 group-hover:opacity-100 transition translate-y-4 group-hover:translate-y-0">EXPLORE SECTOR</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// --- MOUNTAIN PAGE ---
const MountainPage = () => {
  const { id } = useParams();
  const data = mountainDetails[id];
  if (!data) return <div className="min-h-screen bg-black text-white p-20">Sector Not Found</div>;
  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 text-white">
      <div className="container mx-auto max-w-4xl">
         <Link to="/" className="text-gray-500 mb-8 block"><ChevronLeft size={20} className="inline"/> Back</Link>
         <h1 className="text-4xl font-black mb-4">{data.title}</h1>
         <p className="text-xl text-gray-300 mb-8">{data.desc}</p>
         <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-zinc-900 p-8 rounded-xl"><h3 className="text-blue-500 font-bold mb-4">TOP ORGANIZATIONS</h3><ul className="space-y-2">{data.orgs.map(o=><li key={o} className="border-b border-zinc-800 pb-2 text-sm">{o}</li>)}</ul></div>
           <div className="bg-zinc-900 p-8 rounded-xl"><h3 className="text-orange-500 font-bold mb-4">TOP CAREERS</h3><ul className="space-y-2">{data.careers.map(c=><li key={c} className="border-b border-zinc-800 pb-2 text-sm">{c}</li>)}</ul></div>
         </div>
      </div>
    </div>
  );
};

// --- START CHAPTER (With Form & WhatsApp Links) ---
const StartChapterPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // You can add emailjs here later if you want to receive the form data
  };

  return (
    <div className="min-h-screen bg-black pt-28 px-4 text-white flex flex-col items-center text-center">
      <style>{globeStyles}</style>
      <div className="earth-spin w-32 h-32 rounded-full bg-blue-900/50 shadow-[0_0_50px_rgba(249,115,22,0.6)] mb-8"></div>
      
      {!submitted ? (
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-black mb-4">JOIN THE NETWORK</h1>
          <p className="text-gray-400 mb-8">Fill the form to access our training portals.</p>
          <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <input type="text" placeholder="Full Name" className="w-full bg-black p-3 rounded text-white border border-zinc-700" required />
            <input type="email" placeholder="Email Address" className="w-full bg-black p-3 rounded text-white border border-zinc-700" required />
            <input type="tel" placeholder="Phone Number (WhatsApp)" className="w-full bg-black p-3 rounded text-white border border-zinc-700" required />
            <input type="text" placeholder="City / Country" className="w-full bg-black p-3 rounded text-white border border-zinc-700" required />
            <button className="w-full bg-orange-600 font-bold py-4 rounded hover:bg-orange-500 transition">SUBMIT APPLICATION</button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-2xl mb-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold text-green-500 mb-2">APPLICATION RECEIVED</h2>
            <p className="text-gray-300 text-sm">Welcome to the Hive. Join the requisite training groups below immediately.</p>
          </div>
          
          <div className="space-y-4">
            <a href="https://chat.whatsapp.com/YOUR_LINK_HERE" className="block w-full bg-zinc-900 border border-zinc-700 hover:border-green-500 p-4 rounded-xl flex items-center justify-between group transition">
              <div className="text-left">
                <h3 className="font-bold text-white group-hover:text-green-500">Basic Kingdom Class</h3>
                <p className="text-xs text-gray-500">For new believers & members.</p>
              </div>
              <MessageCircle className="text-green-500"/>
            </a>

            <a href="https://chat.whatsapp.com/YOUR_LINK_HERE" className="block w-full bg-zinc-900 border border-zinc-700 hover:border-yellow-500 p-4 rounded-xl flex items-center justify-between group transition">
              <div className="text-left">
                <h3 className="font-bold text-white group-hover:text-yellow-500">Advance Kingdom Class</h3>
                <p className="text-xs text-gray-500">Leadership & Doctrine.</p>
              </div>
              <MessageCircle className="text-yellow-500"/>
            </a>

            <a href="https://chat.whatsapp.com/YOUR_LINK_HERE" className="block w-full bg-zinc-900 border border-zinc-700 hover:border-red-500 p-4 rounded-xl flex items-center justify-between group transition">
              <div className="text-left">
                <h3 className="font-bold text-white group-hover:text-red-500">Agents of Change</h3>
                <p className="text-xs text-gray-500">Territorial Domination.</p>
              </div>
              <MessageCircle className="text-red-500"/>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GIVE PAGE (With Name & Number) ---
const GivePage = () => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText("0123456789"); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4 text-center text-white">
      <h1 className="text-5xl font-black mb-4">PARTNER</h1>
      <div className="container mx-auto max-w-2xl bg-zinc-900 border border-orange-500/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">OFFICIAL ACCOUNT</h2>
        
        <div className="bg-black p-6 rounded-xl border border-zinc-700 space-y-6">
           <div className="text-left border-b border-zinc-800 pb-4">
              <p className="text-xs uppercase text-gray-500 mb-1">Account Name</p>
              <p className="text-xl md:text-2xl font-bold text-white tracking-wide">FIRE HIVE NETWORK INT'L</p>
           </div>
           
           <div className="flex justify-between items-center cursor-pointer" onClick={handleCopy}>
             <div className="text-left">
               <p className="text-xs uppercase text-gray-500 mb-1">Account Number</p>
               <p className="text-3xl md:text-4xl font-mono text-orange-500 font-bold tracking-widest">0123456789</p>
               <p className="text-xs text-gray-600 mt-1">Zenith Bank (Example)</p>
             </div>
             <button className={`p-4 rounded-full transition ${copied ? 'bg-green-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>
               {copied ? <Check size={24}/> : <Copy size={24}/>}
             </button>
           </div>
        </div>
        
        <p className="text-gray-500 text-xs mt-6">All donations go towards missions, campus expansion, and welfare.</p>
      </div>
    </div>
  );
};

// --- WAR ROOM & PORTAL (Standard) ---
const WarRoom = () => ( <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 text-center"><Sword size={64} className="text-red-500 mb-6"/><h1 className="text-5xl font-black mb-6">WAR ROOM</h1><div className="bg-black/30 p-8 rounded-xl"><h3 className="font-bold mb-4 text-red-400">PRAYER FOCUS</h3><ul className="text-left space-y-2"><li>• Media Domination</li><li>• Righteous Policy</li></ul></div></div> );

const PortalPage = () => {
  const [role, setRole] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const handleLogin = (e) => { e.preventDefault(); if (inputCode === 'cell2026') setRole('leader'); else alert("Invalid"); };
  if (!role) return (<div className="min-h-screen bg-black flex items-center justify-center p-4"><div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"><h1 className="text-2xl font-black text-white text-center mb-6">PORTAL</h1><form onSubmit={handleLogin} className="space-y-4"><input type="password" placeholder="Code" className="w-full bg-black p-3 rounded text-white" value={inputCode} onChange={(e)=>setInputCode(e.target.value)}/><button className="w-full bg-orange-600 py-3 rounded font-bold text-white">ENTER</button></form></div></div>);
  return <div className="min-h-screen bg-black pt-28 px-4 text-white text-center"><h1 className="text-3xl text-green-500 font-bold">ACCESS GRANTED</h1><button onClick={()=>setRole(null)} className="mt-8 text-red-500">Logout</button></div>;
};

// --- ABOUT & EVENTS ---
const AboutPage = () => (<div className="min-h-screen bg-black pt-28 px-4 text-white"><div className="container mx-auto"><h1 className="text-4xl font-black mb-8">WHO WE ARE</h1><div className="grid md:grid-cols-2 gap-8"><div className="bg-zinc-900 p-6 rounded-xl"><Flame className="text-orange-500 mb-4"/><h3 className="font-bold">VISION</h3><p className="text-gray-400">To raise a generation of young people taking over systems.</p></div><div className="bg-zinc-900 p-6 rounded-xl"><Shield className="text-blue-500 mb-4"/><h3 className="font-bold">MISSION</h3><p className="text-gray-400">Infiltrating the seven mountains of influence.</p></div></div></div></div>);
const EventsPage = () => (<div className="min-h-screen bg-black pt-28 px-4 text-white"><h1 className="text-4xl font-black text-center mb-12">PROJECTS</h1><div className="container mx-auto grid md:grid-cols-3 gap-6">{[{t:"Counting The Cost",d:"Jan 2-3",i:"https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400"},{t:"Mid-Year Retreat",d:"June 2026",i:"https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400"},{t:"Cedars of Lebanon",d:"Sept 16",i:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"}].map(e=><div key={e.t} className="bg-zinc-900 rounded-xl overflow-hidden"><img src={e.i} className="h-40 w-full object-cover"/><div className="p-4"><h3 className="font-bold">{e.t}</h3><p className="text-gray-400 text-sm">{e.d}</p></div></div>)}</div></div>);

// --- MAIN APP ---
function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/mountain/:id" element={<><Navbar /><MountainPage /><Footer /></>} />
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
