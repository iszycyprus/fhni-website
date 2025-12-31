import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { MapPin, Mail, ArrowRight, Facebook, Linkedin, Instagram } from 'lucide-react'

// --- ANIMATION COMPONENT ---
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- DATA: 7 MOUNTAINS ---
const mountainData = {
  religion: { title: "Mountain of Religion", desc: "Redefining spirituality and faith.", color: "bg-purple-600" },
  family: { title: "Mountain of Family", desc: "Restoring the core unit of society.", color: "bg-pink-600" },
  education: { title: "Mountain of Education", desc: "Shaping the minds of the future.", color: "bg-blue-600" },
  government: { title: "Mountain of Government", desc: "Righteousness in leadership.", color: "bg-red-600" },
  media: { title: "Mountain of Media", desc: "Broadcasting truth and hope.", color: "bg-orange-600" },
  arts: { title: "Mountain of Arts", desc: "Creative expression for glory.", color: "bg-cyan-600" },
  business: { title: "Mountain of Business", desc: "Kingdom prosperity and ethics.", color: "bg-green-600" }
};

// --- COMPONENTS ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const Navbar = () => (
  <nav className="p-4 bg-zinc-900 text-white flex justify-between items-center sticky top-0 z-50 shadow-lg">
    <Link to="/" className="text-xl font-bold tracking-tighter">FHNI<span className="text-yellow-500">.</span></Link>
    <div className="flex gap-4 text-sm font-medium">
      <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
      <Link to="/about" className="hover:text-yellow-500 transition">About</Link>
      <Link to="/contact" className="hover:text-yellow-500 transition">Contact</Link>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">FHNI<span className="text-yellow-500">.</span></h2>
        <p className="text-zinc-400 max-w-sm mb-6">Raising a generation of leaders to dominate the Seven Mountains of Influence.</p>
        <div className="flex gap-4">
           <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-600 transition"><Facebook size={18}/></a>
           <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-600 transition"><Linkedin size={18}/></a>
           <a href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-600 transition"><Instagram size={18}/></a>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-4 text-zinc-100">Quick Links</h3>
        <ul className="space-y-2 text-zinc-400 text-sm">
          <li><Link to="/" className="hover:text-yellow-500">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-500">Who We Are</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-500">Contact Us</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-4 text-zinc-100">Contact</h3>
        <div className="space-y-3 text-zinc-400 text-sm">
          <p className="flex items-center gap-2"><MapPin size={16} className="text-yellow-600"/> Nigeria, Africa</p>
          <p className="flex items-center gap-2"><Mail size={16} className="text-yellow-600"/> info@fhni.org</p>
        </div>
      </div>
    </div>
    <div className="text-center text-zinc-700 text-xs pt-8 border-t border-zinc-900">
      &copy; {new Date().getFullYear()} FHNI. All rights reserved.
    </div>
  </footer>
);

const HomePage = () => (
  <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
    {/* HERO SECTION */}
    <header className="h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-zinc-900 to-black">
      <Reveal>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          DOMINATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">THE MOUNTAINS</span>
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Empowering a new generation to take their place in Religion, Family, Education, Government, Media, Arts, and Business.
        </p>
      </Reveal>
      <Reveal delay={400}>
        <button className="bg-yellow-600 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition flex items-center gap-2 mx-auto">
          Join the Movement <ArrowRight size={20}/>
        </button>
      </Reveal>
    </header>

    {/* MOUNTAINS GRID */}
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <Reveal>
          <h2 className="text-3xl font-bold mb-12 text-center">The Seven Mountains</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(mountainData).map(([key, data], index) => (
            <Reveal key={key} delay={index * 100}>
              <div className="group p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-600/50 transition hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-full mb-6 ${data.color} flex items-center justify-center text-white font-bold opacity-80 group-hover:opacity-100`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{data.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-black text-zinc-500">
    <h1 className="text-9xl font-black text-zinc-800">404</h1>
    <p>Page not found</p>
    <Link to="/" className="mt-4 text-yellow-600 hover:underline">Go Home</Link>
  </div>
);

// --- MAIN APP ---
function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App


