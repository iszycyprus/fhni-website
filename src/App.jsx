import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { db } from './firebaseConfig'; 
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'; 
import { Globe, BookOpen, Target, Shield, Calendar, MapPin, HeartHandshake, Menu, X, Flame, Lock, Plus, Trash2, ArrowRight, School, CheckCircle, Image as ImageIcon, Briefcase, Building2 } from 'lucide-react';

// --- DATA: THE 7 MOUNTAINS CONTENT ---
const mountainData = {
  religion: {
    title: "Mountain of Religion",
    desc: "Redefining spirituality, doctrine, and kingdom dominance.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=60",
    orgs: ["The Vatican", "Redeemed Christian Church of God (RCCG)", "Compassion International", "Samaritan's Purse", "Bible Society", "Youth With A Mission (YWAM)", "Scripture Union", "Christian Association of Nigeria (CAN)", "Living Faith Church", "Hillsong Global", "Full Gospel Business Men's Fellowship", "Billy Graham Evangelistic Association", "Cru (Campus Crusade)", "World Vision", "Salvation Army"],
    careers: ["Senior Pastor", "Missions Director", "Christian Counselor", "Worship Pastor", "Theology Professor", "Church Administrator", "Youth Pastor", "Christian Author/Apologist", "Chaplain (Military/Hospital)", "Media Director for Ministry", "Bible Translator", "Religious Rights Lawyer", "Non-Profit Director", "Evangelist", "Pastoral Care Specialist"]
  },
  family: {
    title: "Mountain of Family",
    desc: "Restoring the foundations of society through healthy homes.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=60",
    orgs: ["Focus on the Family", "UNICEF", "Marriage Today", "FamilyLife", "Save the Children", "Mothers Against Drunk Driving", "American Family Association", "Institute for Family Studies", "National Fatherhood Initiative", "MOPS International", "Family Research Council", "Adopt a Family", "Child Evangelism Fellowship", "Care.com", "YMCA/YWCA"],
    careers: ["Marriage & Family Therapist", "Child Psychologist", "Social Worker", "Adoption Agency Coordinator", "Pediatrician", "Family Law Attorney", "Early Childhood Educator", "Life Coach", "Parenting Consultant", "Youth Mentor", "Foster Care Case Manager", "Genealogist", "Family Mediator", "Home Economics Teacher", "Child Advocate"]
  },
  education: {
    title: "Mountain of Education",
    desc: "Shaping the minds of the next generation with truth and excellence.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60",
    orgs: ["Harvard University", "Covenant University", "Khan Academy", "Coursera", "UNESCO", "Teach For All", "Association of Christian Schools Int.", "Pearson Education", "British Council", "National Universities Commission", "Udemy", "EdX", "Scholastic", "College Board", "ResearchGate"],
    careers: ["University Chancellor", "Curriculum Developer", "School Principal", "Educational Technologist", "Professor/Lecturer", "Guidance Counselor", "Special Education Teacher", "Education Policy Analyst", "Librarian/Information Scientist", "Academic Researcher", "Online Course Creator", "Dean of Students", "Vocational Trainer", "STEM Coordinator", "Education Consultant"]
  },
  government: {
    title: "Mountain of Government",
    desc: "Establishing righteous laws and justice in the land.",
    image: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&auto=format&fit=crop&q=60",
    orgs: ["United Nations (UN)", "European Union (EU)", "African Union (AU)", "ECOWAS", "Federal Govt of Nigeria", "US Congress", "International Court of Justice", "World Health Organization", "Transparency International", "Human Rights Watch", "Amnesty International", "NATO", "Peace Corps", "USAID", "INEC"],
    careers: ["Senator/Legislator", "Diplomat/Ambassador", "Policy Advisor", "Governor", "Human Rights Lawyer", "Public Administrator", "City Mayor", "Intelligence Officer", "Campaign Manager", "Political Analyst", "Judge/Magistrate", "Civil Servant", "Lobbyist", "Urban Planner", "Legislative Aide"]
  },
  media: {
    title: "Mountain of Media",
    desc: "Controlling the narrative and broadcasting truth.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60",
    orgs: ["CNN", "BBC", "Al Jazeera", "Channels TV", "Netflix", "Disney", "Sony Pictures", "New York Times", "Google/YouTube", "Facebook (Meta)", "Twitter (X)", "Bloomberg", "Reuters", "Associated Press", "DSTV/Multichoice"],
    careers: ["News Anchor", "Investigative Journalist", "Film Director", "Social Media Manager", "Content Creator/Influencer", "Public Relations Specialist", "Video Editor", "Screenwriter", "Broadcast Engineer", "Media Buyer", "Radio Host", "Publisher", "Graphic Designer", "Brand Strategist", "Cinematographer"]
  },
  arts: {
    title: "Mountain of Arts & Ent.",
    desc: "Celebrating creativity and prophetic expression.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60",
    orgs: ["The Grammy Awards", "Universal Music Group", "Nollywood (AGN)", "Hollywood (Oscars)", "Cirque du Soleil", "Museum of Modern Art", "Spotify", "Live Nation", "Gospel Music Association", "National Theatre", "Pixar", "Marvel Studios", "Art Basel", "Sundance Institute", "Opera House"],
    careers: ["Music Producer", "Actor/Actress", "Fine Artist (Painter/Sculptor)", "Fashion Designer", "Choreographer", "Event Planner", "Art Director", "Museum Curator", "Talent Agent", "Game Designer", "Animator", "Sound Engineer", "Costume Designer", "Playwright", "Gallery Owner"]
  },
  business: {
    title: "Mountain of Business",
    desc: "Creating wealth and funding the Kingdom agenda.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    orgs: ["Apple", "Tesla", "Dangote Group", "Amazon", "Microsoft", "Goldman Sachs", "World Bank", "IMF", "Nigerian Stock Exchange", "Access Bank", "Coca-Cola", "Toyota", "McKinsey & Company", "Forbes", "Chamber of Commerce"],
    careers: ["CEO/Entrepreneur", "Investment Banker", "Venture Capitalist", "Financial Analyst", "Marketing Director", "Real Estate Developer", "Human Resources Manager", "Project Manager", "Economist", "Business Consultant", "Sales Executive", "Supply Chain Manager", "Accountant/Auditor", "Stockbroker", "Product Manager"]
  }
};

// --- STYLES ---
const globeStyles = `
  @keyframes spin { from { background-position: 0% 0%; } to { background-position: 200% 0%; } }
  .earth-spin {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png');
    background-size: 200% 100%;
    animation: spin 20s linear infinite;
    box-shadow: inset 20px 0 80px 10px rgba(0,0,0,0.9);
  }
`;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- COMPONENTS ---
const RotatingGlobe = () => (
  <div className="relative w-64 h-64 mx-auto my-8">
    <style>{globeStyles}</style>
    <div className="earth-spin w-full h-full rounded-full bg-blue-900/50 relative overflow-hidden border-2 border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.6)]">
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10"></div>
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full h-full flex items-center justify-center pointer-events-none">
       <div className="relative w-24 h-24 opacity-80">
          <span className="absolute top-8 left-8 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
          <span className="absolute top-8 left-8 w-3 h-3 bg-red-600 rounded-full border border-white"></span>
          <div className="absolute -bottom-6 left-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white border border-red-500">7 Chapters (NG)</div>
       </div>
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-zinc-900 to-black border border-orange-500/30 p-8 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:border-orange-400 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

// --- NEW COMPONENT: MOUNTAIN DETAIL PAGE ---
const MountainPage = () => {
  const { id } = useParams();
  const data = mountainData[id];

  if (!data) return <div className="min-h-screen bg-black pt-32 text-center text-white">Mountain Not Found</div>;

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4">
      {/* Header Visual */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 border-2 border-orange-500/30 container mx-auto max-w-5xl">
        <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{data.title}</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl">{data.desc}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
        {/* Organizations List */}
        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-full"><Building2 className="text-blue-500 w-8 h-8" /></div>
            <h2 className="text-2xl font-bold text-white">Top Organizations</h2>
          </div>
          <ul className="space-y-3">
            {data.orgs.map((org, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 border-b border-zinc-800 pb-2 hover:text-white hover:pl-2 transition-all">
                <span className="text-blue-500 font-bold text-xs">0{i+1}</span> {org}
              </li>
            ))}
          </ul>
        </div>

        {/* Careers List */}
        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-600/20 p-3 rounded-full"><Briefcase className="text-orange-500 w-8 h-8" /></div>
            <h2 className="text-2xl font-bold text-white">Top Careers</h2>
          </div>
          <ul className="space-y-3">
            {data.careers.map((career, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 border-b border-zinc-800 pb-2 hover:text-white hover:pl-2 transition-all">
                <span className="text-orange-500 font-bold text-xs">0{i+1}</span> {career}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <Link to="/" className="text-gray-500 hover:text-white transition">← Back to Home</Link>
      </div>
    </div>
  );
};

// --- UPDATED 7 MOUNTAINS COMPONENT (Now Clickable) ---
const SevenMountains = () => {
  const mountains = [
    { id: "religion", name: "Religion", img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=60" },
    { id: "family", name: "Family", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=60" },
    { id: "education", name: "Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60" },
    { id: "government", name: "Government", img: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&auto=format&fit=crop&q=60" },
    { id: "media", name: "Media", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60" },
    { id: "arts", name: "Arts & Ent.", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60" },
    { id: "business", name: "Business", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60" },
  ];
  return (
    <div className="py-12">
      <h2 className="text-3xl font-black text-white text-center mb-8">INFILTRATING THE <span className="text-orange-500">7 MOUNTAINS</span></h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {mountains.map((m, i) => (
          <Link to={`/mountain/${m.id}`} key={i} className="group relative h-40 md:h-60 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer bg-zinc-900 block">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700"><ImageIcon size={40} /></div>
            <img src={m.img} alt={m.name} className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition duration-700" onError={(e) => e.target.style.opacity = 0} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-orange-600/60 transition duration-300 flex items-center justify-center z-20">
              <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-wider text-center px-2 drop-shadow-md">{m.name}</h3>
            </div>
            {/* Click Hint */}
            <div className="absolute bottom-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition text-white text-xs bg-black/50 px-2 py-1 rounded">View List &rarr;</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- START A CHAPTER PAGE (With WhatsApp Links) ---
const StartChapterPage = () => {
  const [step, setStep] = useState(1);
  const form = useRef();

  const handleChapterSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_aiag0y3', 'template_2zdojhl', form.current, 'JHMbo2ofXyt0Hnar2')
      .then(() => {
        alert("Application Received! Unlock your training now.");
        setStep(2); 
        window.scrollTo(0, 0);
      }, () => {
        alert("Connection Failed. Check internet.");
      });
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 relative">
       <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-red-600/20 mb-4 border border-red-500/50">
             <School className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">START A CHAPTER</h1>
          <p className="text-gray-400">Raise a Fire Hive Colony in your Secondary School.</p>
        </div>

        {step === 1 && (
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 p-8 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.1)]">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-700 pb-4">Step 1: School Details</h2>
            <form ref={form} onSubmit={handleChapterSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input name="user_name" placeholder="Your Full Name" required className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-red-500" />
                <input name="user_phone" placeholder="WhatsApp Number" required className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-red-500" />
              </div>
              <input name="user_school" placeholder="Name of Secondary School" required className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-red-500" />
              <div className="grid md:grid-cols-2 gap-4">
                <input name="user_lga" placeholder="Local Govt Area" required className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-red-500" />
                <input name="user_state" placeholder="State" required className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-red-500" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition shadow-lg text-lg flex items-center justify-center gap-2">
                Submit & Unlock Training <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-2xl mb-8 flex items-center gap-4">
              <CheckCircle className="text-green-500 w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg">Application Successful!</h3>
                <p className="text-green-400 text-sm">You are now ready to begin your leadership training. Join the groups below.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-orange-500 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold text-black text-xl">1</div>
                  <div><h3 className="text-white font-bold text-xl">Basic Kingdom Class</h3><p className="text-gray-400 text-sm">Foundational spiritual training.</p></div>
                </div>
                <a href="https://chat.whatsapp.com/EjNGXsRsVhlANipgR77k0b" target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-500 transition w-full md:w-auto text-center">Join WhatsApp Group</a>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-orange-500 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold text-black text-xl">2</div>
                  <div><h3 className="text-white font-bold text-xl">Adv. Kingdom Ambassador</h3><p className="text-gray-400 text-sm">Leadership & Influence systems.</p></div>
                </div>
                <a href="https://chat.whatsapp.com/I7QY5EmNgY7CbCCmNtucrN" target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-500 transition w-full md:w-auto text-center">Join WhatsApp Group</a>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-orange-500 transition shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold text-black text-xl">3</div>
                  <div><h3 className="text-white font-bold text-xl">Agents of Change</h3><p className="text-gray-400 text-sm">The final deployment phase.</p></div>
                </div>
                <a href="https://chat.whatsapp.com/EamAUUtVe7106pxqB2rfgm" target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-500 transition w-full md:w-auto text-center">Join WhatsApp Group</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- EVENTS PAGE ---
const EventsPage = () => {
  const events = [
    { id: 1, title: "Counting The Cost", date: "Jan 2-3, 2026", time: "5 PM", location: "Zoom", theme: "SAVIOURS", color: "border-blue-500", link: "https://luma.com/vyhe32qz", img: "/cost.png" },
    { id: 2, title: "Mid-Year Retreat", date: "June 2026", time: "TBA", location: "Hybrid", theme: "REFIRING", color: "border-orange-500", link: "#", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=60" },
    { id: 3, title: "I Can Code Africa", date: "Aug 2026", time: "Bootcamp", location: "Multiple", theme: "TECH OUTREACH", color: "border-green-500", link: "#", img: "/code.png" },
    { id: 4, title: "Cedars of Lebanon", date: "Sept 16-19, 2026", time: "4 PM", location: "Camp Ground", theme: "LIVELY STONES", color: "border-yellow-500", link: "#", img: "/cedars.png" }
  ];
  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-black text-center text-white mb-2">PROJECTS 2026</h1>
        <p className="text-center text-orange-500 mb-12 font-bold uppercase tracking-widest">The Strategic Roadmap</p>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div key={event.id} className={`bg-zinc-900 rounded-xl overflow-hidden border-t-4 ${event.color} shadow-lg relative group hover:bg-zinc-800 transition`}>
              <div className="h-64 bg-zinc-800 relative overflow-hidden">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                     onError={(e) => {
                        if (!event.img.startsWith('http')) e.target.style.display='none'; 
                     }} />
                
                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-md">{event.date}</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
                <p className="text-orange-500 text-sm font-bold uppercase mb-6 tracking-wide">{event.theme}</p>
                <div className="space-y-2 text-sm text-gray-400 mb-6"><div className="flex items-center gap-2"><Calendar size={16} className="text-white"/> {event.time}</div><div className="flex items-center gap-2"><MapPin size={16} className="text-white"/> {event.location}</div></div>
                <a href={event.link} className="block w-full text-center bg-white text-black font-bold py-3 rounded hover:bg-orange-500 hover:text-white transition">Register / Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- NEWS & ADMIN ---
const NewsPage = () => { const [news, setNews] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchNews = async () => { try { const q = query(collection(db, "news"), orderBy("date", "desc")); const querySnapshot = await getDocs(q); setNews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (err) {} finally { setLoading(false); } }; fetchNews(); }, []); return (<div className="min-h-screen bg-black pt-28 pb-12 px-4"><div className="container mx-auto max-w-4xl"><h1 className="text-4xl font-black text-white mb-2 text-center">FIELD REPORTS</h1>{loading ? <p className="text-center text-orange-500 animate-pulse">Loading...</p> : <div className="space-y-6">{news.map((item) => (<div key={item.id} className="bg-zinc-900 border-l-4 border-orange-500 p-6 rounded-r-xl"><div className="flex justify-between items-start mb-2"><span className="text-orange-400 font-bold text-xs uppercase">{item.category}</span><span className="text-gray-500 text-xs">{item.date}</span></div><h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3><p className="text-gray-400 whitespace-pre-wrap">{item.content}</p></div>))}</div>}</div></div>); };

const AdminPage = () => { const [isAuthenticated, setIsAuthenticated] = useState(false); const [password, setPassword] = useState(""); const [formData, setFormData] = useState({ title: "", date: "", category: "General", content: "" }); const handleLogin = (e) => { e.preventDefault(); if (password === "fire2026") setIsAuthenticated(true); else alert("Access Denied."); }; const handleAddNews = async (e) => { e.preventDefault(); if(!formData.title) return; await addDoc(collection(db, "news"), formData); alert("Uploaded!"); setFormData({ title: "", date: "", category: "General", content: "" }); }; if (!isAuthenticated) return (<div className="min-h-screen bg-black flex items-center justify-center"><form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded border border-red-900"><h2 className="text-white font-bold mb-4">WAR ROOM</h2><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="bg-black text-white p-2 border border-zinc-700 w-full mb-4" placeholder="Code"/><button className="bg-red-600 text-white w-full py-2">ENTER</button></form></div>); return (<div className="min-h-screen bg-black pt-28 pb-12 px-4"><div className="container mx-auto max-w-4xl"><h1 className="text-3xl font-bold text-white mb-8">ADMIN WAR ROOM</h1><form onSubmit={handleAddNews} className="bg-zinc-900 p-6 rounded mb-8 space-y-4"><input placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-black text-white p-3 border border-zinc-700"/><textarea placeholder="Content" value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} className="w-full bg-black text-white p-3 border border-zinc-700 h-32"/><button className="bg-green-700 text-white font-bold py-3 w-full">PUBLISH</button></form></div></div>); };

// --- STANDARD PAGES ---
const AboutPage = () => (<div className="min-h-screen bg-black pt-28 pb-12 px-4 relative"><div className="container mx-auto max-w-5xl relative z-10"><h1 className="text-4xl font-black text-white mb-8 border-l-8 border-orange-500 pl-6">WHO WE ARE</h1><div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-700 mb-12"><p className="text-xl text-gray-200"><span className="text-orange-500 font-bold">Fire Hive Network Int'l</span> is a movement mandated to raise, mentor, and position a generation of young people.</p></div><SevenMountains /></div></div>);
const GivePage = () => (<div className="min-h-screen bg-black pt-32 pb-12 px-4 text-center"><div className="container mx-auto max-w-2xl"><h1 className="text-5xl font-black text-white mb-4">PARTNER WITH US</h1><div className="bg-zinc-900 border border-orange-500/50 rounded-2xl p-8 mb-8"><h2 className="text-2xl font-bold mb-6 text-white">Bank Transfer</h2><div className="space-y-4 text-left"><div className="bg-black p-4 rounded border border-zinc-700"><p className="text-gray-500 text-xs">Account Name</p><p className="font-bold text-white">FIRE HIVE NETWORK INT'L</p></div><div className="bg-black p-4 rounded border border-zinc-700"><p className="text-gray-500 text-xs">Account Number</p><p className="text-3xl font-mono text-orange-500 font-bold">0123456789</p></div></div></div><button className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-10 py-4 rounded-full w-full">Give Online</button></div></div>);

// --- HOME PAGE ---
const HomePage = () => {
  const form = useRef();
  const sendEmail = (e) => { e.preventDefault(); emailjs.sendForm('service_aiag0y3', 'template_2zdojhl', form.current, 'JHMbo2ofXyt0Hnar2').then(() => { alert("Application Sent!"); form.current.reset(); }); };
  return (
    <>
      <header className="relative pt-24 pb-16 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="w-28 h-28 rounded-full border-4 border-orange-500/50 shadow-[0_0_40px_orange] overflow-hidden mb-6 bg-black">
             <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="/logo.jpg";
                  }} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-4">RAISING <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600">AN ARMY</span></h1>
          <RotatingGlobe />
          
          <div className="flex gap-4 mt-8">
            <a href="#join" className="bg-white text-black px-8 py-3 rounded-full font-bold">Join Us</a>
            <Link to="/events" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold">Projects</Link>
          </div>
        </div>
      </header>
      <section className="py-12 bg-zinc-950"><div className="container mx-auto"><SevenMountains /></div></section>

      <section className="py-16 px-4 bg-zinc-950">
        <div className="container mx-auto grid md:grid-cols-3 gap-6">
          <Card className="text-center group"><div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition duration-500"><Globe className="text-orange-500 w-8 h-8 group-hover:text-white" /></div><h3 className="text-xl font-bold text-white">Global Vision</h3><Link to="/about" className="text-orange-400 text-sm font-bold mt-2 block">Read More &rarr;</Link></Card>
          <Card className="text-center group"><div className="bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 transition duration-500"><BookOpen className="text-amber-500 w-8 h-8 group-hover:text-white" /></div><h3 className="text-xl font-bold text-white">Field Reports</h3><Link to="/news" className="text-amber-400 text-sm font-bold mt-2 block">View Updates &rarr;</Link></Card>
          
          <Card className="text-center group">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500 transition duration-500"><Flame className="text-red-500 w-8 h-8 group-hover:text-white" /></div>
            <h3 className="text-xl font-bold text-white">Start a Chapter</h3>
            <Link to="/start-chapter" className="text-red-400 text-sm font-bold mt-2 block">Apply Now &rarr;</Link>
          </Card>
        </div>
      </section>

      <section id="join" className="py-20 px-4 bg-black relative">
         <div className="container mx-auto max-w-xl relative z-10"><div className="bg-black/80 border border-orange-500/50 p-8 rounded-3xl"><h2 className="text-3xl font-black text-center text-white mb-2">JOIN THE NETWORK</h2><form ref={form} onSubmit={sendEmail} className="space-y-4 mt-6"><input name="user_name" placeholder="Full Name" required className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-white" /><input name="user_email" placeholder="Email" required className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-white" /><input name="user_phone" placeholder="Phone" className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-white" /><select name="interest" className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-gray-300"><option>Mountain of Interest</option><option>Education</option><option>Business</option><option>Government</option><option>Media</option><option>Arts</option><option>Family</option><option>Religion</option></select><button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl">Submit Application</button></form></div></div>
      </section>
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
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover"
                     onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="/logo.jpg";
                     }} />
              </div>
              <span className="text-xl font-black tracking-wider text-white">FIRE HIVE</span>
            </Link>

            <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300"><Link to="/about" className="hover:text-orange-500">About</Link><Link to="/events" className="hover:text-orange-500">Projects</Link><Link to="/news" className="hover:text-orange-500">News</Link><Link to="/give" className="hover:text-orange-500">Give</Link><Link to="/start-chapter" className="text-red-500 hover:text-white transition">Start Chapter</Link><Link to="/admin" className="text-zinc-600 hover:text-red-500"><Lock size={16}/></Link></div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white bg-zinc-800 p-2 rounded">{isOpen ? <X /> : <Menu />}</button>
          </div>
          {isOpen && (<div className="absolute top-full left-0 w-full bg-zinc-900 border-b border-orange-500 p-6 flex flex-col gap-4 md:hidden"><Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold">Home</Link><Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold">About</Link><Link to="/events" onClick={() => setIsOpen(false)} className="text-lg font-bold">Projects</Link><Link to="/news" onClick={() => setIsOpen(false)} className="text-lg font-bold">News</Link><Link to="/start-chapter" onClick={() => setIsOpen(false)} className="text-lg font-bold text-red-500">Start Chapter</Link></div>)}
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/start-chapter" element={<StartChapterPage />} />
          {/* NEW DYNAMIC ROUTE FOR MOUNTAINS */}
          <Route path="/mountain/:id" element={<MountainPage />} />
        </Routes>
        <footer className="bg-black py-8 text-center text-zinc-600 text-xs border-t border-zinc-900"><p>&copy; 2025 Fire Hive Network Int'l.</p></footer>
      </div>
    </Router>
  );
};

export default App;