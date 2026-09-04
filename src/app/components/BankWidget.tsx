"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2 } from 'lucide-react';

const BANKS = [
  { id: '1', panchayat: 'Kongad', name: 'State Bank of India, Kongad', phone: '+914922224444' },
  { id: '2', panchayat: 'Kongad', name: 'Canara Bank, Kongad', phone: '+914922224445' },
  { id: '3', panchayat: 'Mankara', name: 'Federal Bank, Mankara', phone: '+914922224446' },
  { id: '4', panchayat: 'Parali', name: 'Kerala Gramin Bank, Parali', phone: '+914922224447' },
];

const PANCHAYATS = ['Kongad', 'Mankara', 'Parali', 'Keralassery', 'Mannur', 'Kanjirappuzha', 'Karimba', 'Karakurissi', 'Tachampara'];

export default function BankWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPanchayat, setSelectedPanchayat] = useState('Kongad');

  const filteredBanks = BANKS.filter(b => b.panchayat === selectedPanchayat);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl dark:border-slate-700/30 p-6 border border-white/20 shadow-xl shadow-emerald-500/10"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between focus:outline-none"
      >
        <div className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-900/30 px-3 py-2 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
          <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-400">ബാങ്കുകൾ (Banks)</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-slate-400 transform ${isExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-3 mb-4 leading-relaxed">
              പഞ്ചായത്ത് അടിസ്ഥാനത്തിലുള്ള ബാങ്കുകളുടെ വിവരങ്ങൾ
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-1">Panchayat</label>
                <div className="relative">
                  <select 
                    value={selectedPanchayat} 
                    onChange={(e) => setSelectedPanchayat(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-800/50 border border-emerald-200/50 dark:border-emerald-800/50 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 block p-3.5 appearance-none transition-all backdrop-blur-sm outline-none"
                  >
                    {PANCHAYATS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600/70 dark:text-emerald-400/70 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map(bank => (
                    <div key={bank.id} className="p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <p className="font-bold text-slate-900 dark:text-emerald-50 text-sm">{bank.name}</p>
                        </div>
                        <a href={`tel:${bank.phone}`} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold p-2.5 rounded-lg hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 transition-all text-sm">
                        📞 വിളിക്കുക (Call)
                        </a>
                    </div>
                  ))
                ) : (
                  <button disabled className="w-full bg-white/30 dark:bg-slate-800/30 text-gray-400 dark:text-slate-500 font-bold p-3 rounded-lg border border-gray-200/50 dark:border-slate-700/50 cursor-not-allowed mt-3 text-sm backdrop-blur-sm">
                    വിവരങ്ങൾ ലഭ്യമല്ല (Not Available)
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
