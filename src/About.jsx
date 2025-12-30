import React from 'react';
import { Shield, Target, Flame } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
          Who We Are
        </h1>

        {/* Introduction */}
        <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 mb-12">
          <p className="text-xl text-gray-300 leading-relaxed">
            Fire Hive Network Int'l (FHNI) is a kingdom-driven organization mandated to raise, mentor, and position a generation of young people who are spiritually grounded and societally relevant. We utilize the <strong>"Noah's Strategy"</strong>—building alternative systems of advantage for the Christian community in the end times.
          </p>
        </div>

        {/* The Core Pillars */}
        <div className="space-y-8">
          
          <div className="flex gap-6 items-start p-6 bg-zinc-900 rounded-xl border-l-4 border-orange-600">
            <Target className="w-12 h-12 text-orange-500 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Our Vision</h2>
              <p className="text-gray-400 italic">"The kingdoms of this world have become the kingdoms of our Lord and of His Christ." (Rev 11:15)</p>
              <p className="mt-2 text-gray-300">To see Kingdom influence permeate every sector of society.</p>
            </div>
          </div>

          <div className="flex gap-6 items-start p-6 bg-zinc-900 rounded-xl border-l-4 border-yellow-500">
            <Shield className="w-12 h-12 text-yellow-500 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
              <p className="text-gray-400 italic">"Gird up your loins like a man..." (Joel 2:11)</p>
              <p className="mt-2 text-gray-300">To raise, mentor, and position an army for Christ across the Seven Mountains of Influence (Education, Government, Media, Arts, Religion, Family, Business).</p>
            </div>
          </div>

          <div className="flex gap-6 items-start p-6 bg-zinc-900 rounded-xl border-l-4 border-red-600">
            <Flame className="w-12 h-12 text-red-600 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Our Mandate</h2>
              <p className="text-gray-400 italic">"It is like leaven, which a woman took and hid in three measures of meal..." (Luke 13:21)</p>
              <p className="mt-2 text-gray-300">Raising men and women of uncommon value who rise to the top of their fields to strategically influence the sphere for Jesus.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;