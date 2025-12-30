import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Counting The Cost Retreat",
      date: "January 2nd - 3rd, 2026",
      time: "5:00 PM - 7:00 PM",
      location: "Closed Zoom Link",
      theme: "SAVIOURS (Obadiah 1:21)",
      desc: "The annual gathering where we unveil the agenda of God for the year and strategize on how to position ourselves across the 7 Mountains.",
      link: "https://luma.com/vyhe32qz"
    },
    {
      id: 2,
      title: "Mid-Year Retreat",
      date: "June 2026",
      time: "TBA",
      location: "Hybrid (Physical & Online)",
      theme: "Refiring & Restrategizing",
      desc: "A time to evaluate our progress, recharge our spiritual batteries, and sharpen our focus for the second half of the year.",
      link: "#"
    },
    {
      id: 3,
      title: "I Can Code Africa",
      date: "August 2026",
      time: "Bootcamp",
      location: "Multiple Locations",
      theme: "Tech Outreach",
      desc: "Empowering the next generation with digital skills (Web Dev, Data Science) to dominate the Mountain of Education and Economy.",
      link: "#"
    },
    {
      id: 4,
      title: "Cedars of Lebanon Camp Meeting",
      date: "September 16th - 19th, 2026",
      time: "4:00 PM Daily",
      location: "Camp Ground (Lodging & Feeding Provided)",
      theme: "Lively Stones (1 Peter 2:5)",
      desc: "Our major annual camp meeting. Free buses available. Open to Teens and Youths.",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-white">2026 Kingdom Projects</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500 transition duration-300">
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">{event.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="text-orange-400 font-semibold mb-4 text-sm uppercase tracking-wide">{event.theme}</p>
                <p className="text-gray-400 mb-6 text-sm">{event.desc}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                   <div className="flex items-center gap-2">
                     <Calendar size={16} /> {event.time}
                   </div>
                   <div className="flex items-center gap-2">
                     <MapPin size={16} /> {event.location}
                   </div>
                </div>

                <a href={event.link} target="_blank" rel="noreferrer" className="block w-full text-center bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition">
                  Register / Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;