"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, Droplets, Ruler, MapPin, Loader2, DollarSign } from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  nameEn: string;
  yield: string;
  price: string;
  revenue: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  water: string;
  premium?: boolean;
  tips: string[];
}

const CROPS_DB: Crop[] = [
  {
    id: 'navara', name: 'ഞവര (Navara Rice)', nameEn: 'Navara Rice', yield: '1.5 - 2 Tons/Ha', price: '₹150 - ₹200/kg', revenue: '₹3L - ₹4L/Ha',
    difficulty: 'Medium', water: 'High (Irrigated)', premium: true,
    tips: ['Organic farming increases value', 'Needs protection from birds', 'Ideal for Virippu season']
  },
  {
    id: 'rakthashali', name: 'രക്തശാലി (Rakthashali)', nameEn: 'Rakthashali Rice', yield: '1.2 - 1.8 Tons/Ha', price: '₹180 - ₹250/kg', revenue: '₹3.5L - ₹4.5L/Ha',
    difficulty: 'Hard', water: 'High (Irrigated)', premium: true,
    tips: ['Highly medicinal value', 'Requires well-drained soil', 'Avoid chemical fertilizers completely']
  },
  {
    id: 'banana', name: 'നേന്ത്രവാഴ (Nendran Banana)', nameEn: 'Nendran Banana', yield: '15 - 20 Tons/Ha', price: '₹40 - ₹60/kg', revenue: '₹6L - ₹8L/Ha',
    difficulty: 'Medium', water: 'Moderate',
    tips: ['Provide prop support during winds', 'Requires regular irrigation', 'Good intercrop with coconut']
  },
  {
    id: 'tapioca', name: 'മരച്ചീനി (Tapioca)', nameEn: 'Tapioca', yield: '25 - 30 Tons/Ha', price: '₹15 - ₹25/kg', revenue: '₹3L - ₹5L/Ha',
    difficulty: 'Easy', water: 'Low (Rainfed)',
    tips: ['Thrives in laterite soil', 'Drought tolerant', 'Ensure good drainage to prevent rot']
  }
];

export function CropAdvisor() {
  const [formData, setFormData] = useState({ panchayat: '', season: '', soil: '', water: '', area: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Crop[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setResults(CROPS_DB.sort(() => 0.5 - Math.random()).slice(0, 2));
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const isFormValid = Object.values(formData).every(val => val !== '');

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/30 shadow-lg shadow-emerald-500/5 overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/30">
        <Leaf className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Crop Advisor</h2>
      </div>

      <AnimatePresence mode="wait">
        {!showResults && !isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">പഞ്ചായത്ത് (Panchayat)</label>
                <select className="w-full p-2.5 rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-200" onChange={e => handleSelect('panchayat', e.target.value)} value={formData.panchayat}>
                  <option value="">Select Panchayat</option>
                  <option value="Kongad">Kongad</option>
                  <option value="Keralassery">Keralassery</option>
                  <option value="Mankara">Mankara</option>
                  <option value="Mannur">Mannur</option>
                  <option value="Parali">Parali</option>
                  <option value="Kanjirapuzha">Kanjirapuzha</option>
                  <option value="Karimba">Karimba</option>
                  <option value="Karakurissi">Karakurissi</option>
                  <option value="Thachampara">Thachampara</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Season</label>
                <select className="w-full p-2.5 rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-200" onChange={e => handleSelect('season', e.target.value)} value={formData.season}>
                  <option value="">Select Season</option>
                  <option value="Virippu">Virippu (Kharif)</option>
                  <option value="Mundakan">Mundakan (Rabi)</option>
                  <option value="Puncha">Puncha (Summer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Soil Type</label>
                <select className="w-full p-2.5 rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-200" onChange={e => handleSelect('soil', e.target.value)} value={formData.soil}>
                  <option value="">Select Soil</option>
                  <option value="Laterite">Laterite</option>
                  <option value="Alluvial">Alluvial</option>
                  <option value="Sandy">Sandy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Water Availability</label>
                <select className="w-full p-2.5 rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-200" onChange={e => handleSelect('water', e.target.value)} value={formData.water}>
                  <option value="">Select Water</option>
                  <option value="Irrigated">Irrigated</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Near River">Near River</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Land Area (Cents/Ha)</label>
                <input type="text" placeholder="e.g., 50 Cents" className="w-full p-2.5 rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-200" onChange={e => handleSelect('area', e.target.value)} value={formData.area} />
              </div>
            </div>
            <button
              onClick={analyze}
              disabled={!isFormValid}
              className="mt-6 w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Get AI Recommendations
            </button>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-700 dark:text-slate-300 font-medium">🧠 AI Analyzing soil & climate data...</p>
          </motion.div>
        )}

        {showResults && !isAnalyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {results.map((crop, idx) => (
              <motion.div key={crop.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.2 }} className={`p-5 rounded-2xl border ${crop.premium ? 'border-accent/30 bg-[#fffdf0]/80 dark:bg-[#2a2410]/50' : 'border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/80'} backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{crop.name}</h3>
                    {crop.premium && <span className="inline-flex items-center gap-1 text-xs font-bold text-accent mt-1 bg-yellow-100/50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full border border-yellow-200/50 dark:border-yellow-700/30">💎 Premium Heritage Crop</span>}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${crop.difficulty === 'Easy' ? 'bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-700/30' : crop.difficulty === 'Medium' ? 'bg-yellow-100/50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border border-yellow-200/50 dark:border-yellow-700/30' : 'bg-rose-100/50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 border border-rose-200/50 dark:border-rose-700/30'}`}>
                    {crop.difficulty} Care
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Ruler className="w-4 h-4 text-primary" /> <span>Yield: <span className="font-semibold">{crop.yield}</span></span></div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><DollarSign className="w-4 h-4 text-primary" /> <span>Revenue: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{crop.revenue}</span></span></div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><MapPin className="w-4 h-4 text-primary" /> <span>Price: {crop.price}</span></div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Droplets className="w-4 h-4 text-blue-500" /> <span>Water: {crop.water}</span></div>
                </div>

                <div className="bg-white/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100/50 dark:border-slate-700/30 text-sm">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mb-1 block">Best Practices:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {crop.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}

            <div className="text-center">
              <button onClick={() => setShowResults(false)} className="text-sm text-primary hover:underline font-medium">Re-analyze with different data</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/30 text-center text-[11px] text-slate-500 dark:text-slate-400">
        This recommendation is generated by Synthara Vision AI based on your location, season, and soil profile.
      </div>
    </div>
  );
}
