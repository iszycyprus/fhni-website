import React from 'react';
import { HeartHandshake, CreditCard } from 'lucide-react';

const Give = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <HeartHandshake className="w-20 h-20 text-orange-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-6">Partner With Us</h1>
        <p className="text-xl text-gray-300 mb-12">
          Your giving fuels the mandate. Help us raise the army, host the camps, and build the systems of advantage.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Bank Transfer Details</h2>
          
          <div className="space-y-4 text-left md:text-center">
            <div className="bg-black p-4 rounded border border-zinc-800">
              <p className="text-gray-500 text-sm">Account Name</p>
              <p className="text-xl font-bold font-mono">FIRE HIVE NETWORK INT'L</p>
            </div>
            <div className="bg-black p-4 rounded border border-zinc-800">
              <p className="text-gray-500 text-sm">Account Number</p>
              <p className="text-3xl font-bold text-yellow-500 font-mono tracking-widest">0123456789</p>
            </div>
            <div className="bg-black p-4 rounded border border-zinc-800">
              <p className="text-gray-500 text-sm">Bank Name</p>
              <p className="text-xl font-bold font-mono">GTBank / Zenith (Example)</p>
            </div>
          </div>
        </div>

        <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-10 py-4 rounded-full hover:scale-105 transition transform flex items-center justify-center gap-2 mx-auto">
          <CreditCard size={20} />
          Give Online (Paystack/Flutterwave)
        </button>
      </div>
    </div>
  );
};

export default Give;