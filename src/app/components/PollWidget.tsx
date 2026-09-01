"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2 } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  textEn: string;
  votes: number;
  color: string;
}

export default function PollWidget() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Simulated poll data
  const [options, setOptions] = useState<PollOption[]>([
    { id: 'opt1', text: 'കുടിവെള്ള പദ്ധതികൾ', textEn: 'Drinking Water Projects', votes: 1420, color: 'bg-blue-500' },
    { id: 'opt2', text: 'ഗ്രാമീണ റോഡുകൾ', textEn: 'Rural Roads', votes: 850, color: 'bg-slate-600' },
    { id: 'opt3', text: 'ആരോഗ്യ കേന്ദ്രങ്ങൾ', textEn: 'Healthcare Centers', votes: 620, color: 'bg-rose-500' },
    { id: 'opt4', text: 'കാർഷിക സഹായങ്ങൾ', textEn: 'Agricultural Support', votes: 1100, color: 'bg-green-500' },
  ]);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0) + (hasVoted ? 1 : 0);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    
    setSelectedOptionId(id);
    setHasVoted(true);
    
    // Optimistically update votes
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
    ));
  };

  return (
    <div className="w-full mt-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#eff3ff] to-[#e4edff] dark:from-indigo-950/40 dark:to-blue-900/20 rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-white dark:border-indigo-900/50 relative overflow-hidden"
      >
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center relative z-10">
          
          {/* Left Column: Title & Info */}
          <div className="md:col-span-2 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">ജനാഭിപ്രായം</span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">പബ്ലിക് പോൾ</h2>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-200 mb-4 leading-[1.4]">
                നമ്മുടെ മണ്ഡലത്തിൽ ഏറ്റവും വേഗത്തിൽ നടപ്പിലാക്കേണ്ട പദ്ധതി ഏതാണ്?
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                What is the most urgent priority for our constituency? Your vote helps shape development.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/50 w-fit px-6 py-4 rounded-[2rem] border border-white dark:border-indigo-800 shadow-sm">
              <span className="text-indigo-700 dark:text-indigo-400 font-black text-xl">{totalVotes.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-tight">
                ആളുകൾ<br/>വോട്ട്<br/>ചെയ്തു
              </span>
            </div>
          </div>

          {/* Right Column: Poll Options */}
          <div className="md:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              {!hasVoted ? (
                /* Voting View */
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="space-y-4"
                >
                  {options.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleVote(opt.id)}
                      className="w-full text-left bg-white dark:bg-[#1a2b22] hover:bg-white dark:hover:bg-[#223a2d] border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-700 px-6 py-5 rounded-[2rem] shadow-sm transition-all duration-300 group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-lg font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors mb-1">{opt.text}</div>
                        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{opt.textEn}</div>
                      </div>
                      <div className="w-6 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
                        <div className="w-3 h-4 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                /* Results View */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4 bg-white/50 dark:bg-[#1a2b22]/50 p-6 md:p-8 rounded-[2rem] border border-white/50 dark:border-green-800/30 backdrop-blur-sm"
                >
                  <div className="inline-flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold mb-3 bg-emerald-100/80 dark:bg-emerald-900/40 px-5 py-3 rounded-full text-sm shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap">വോട്ട് രേഖപ്പെടുത്തി (Vote Recorded)</span>
                  </div>
                  
                  {options.sort((a, b) => b.votes - a.votes).map((opt, i) => {
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    const isSelected = selectedOptionId === opt.id;
                    
                    return (
                      <div key={opt.id} className={`relative p-5 rounded-2xl shadow-sm border transition-all ${isSelected ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700 ring-4 ring-indigo-50/50 dark:ring-indigo-900/20' : 'bg-white/80 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700/50'}`}>
                        <div className="flex justify-between items-center mb-4 relative z-10 gap-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <span className={`font-black text-lg leading-tight ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                              {opt.text}
                            </span>
                            {isSelected && <span className="inline-block text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded-md font-black uppercase tracking-widest shadow-sm">Your Vote</span>}
                          </div>
                          <span className={`font-black text-2xl shrink-0 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>{percentage}%</span>
                        </div>
                        
                        <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden relative shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                            className={`h-full rounded-full ${opt.color} ${isSelected ? 'shadow-[0_0_10px_rgba(0,0,0,0.15)]' : 'opacity-80'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
