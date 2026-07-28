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
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-6 md:p-10 shadow-lg relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid md:grid-cols-5 gap-8 items-center relative z-10">
          
          {/* Left Column: Title & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">ജനാഭിപ്രായം</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">പബ്ലിക് പോൾ</h2>
              </div>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 leading-snug">
              നമ്മുടെ മണ്ഡലത്തിൽ ഏറ്റവും വേഗത്തിൽ നടപ്പിലാക്കേണ്ട പദ്ധതി ഏതാണ്?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              What is the most urgent priority for our constituency? Your vote helps shape development.
            </p>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 w-fit px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-black">{totalVotes.toLocaleString()}</span> ആളുകൾ വോട്ട് ചെയ്തു
            </div>
          </div>

          {/* Right Column: Poll Options */}
          <div className="md:col-span-3 space-y-3">
            <AnimatePresence mode="wait">
              {!hasVoted ? (
                /* Voting View */
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="space-y-3"
                >
                  {options.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleVote(opt.id)}
                      className="w-full text-left bg-white dark:bg-[#1a2b22] hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-green-800/50 p-4 rounded-2xl transition-all duration-200 group flex items-center justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{opt.text}</div>
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{opt.textEn}</div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 flex items-center justify-center transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  className="space-y-4 bg-white/60 dark:bg-[#1a2b22]/60 p-5 rounded-3xl border border-white/40 dark:border-green-800/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4 bg-emerald-50 dark:bg-emerald-900/30 w-fit px-3 py-1.5 rounded-full text-sm">
                    <CheckCircle2 className="w-4 h-4" /> വോട്ട് രേഖപ്പെടുത്തി (Vote Recorded)
                  </div>
                  
                  {options.sort((a, b) => b.votes - a.votes).map((opt, i) => {
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    const isSelected = selectedOptionId === opt.id;
                    
                    return (
                      <div key={opt.id} className="relative">
                        <div className="flex justify-between items-end mb-1.5 relative z-10 px-1">
                          <div>
                            <span className={`font-bold text-sm ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                              {opt.text}
                            </span>
                            {isSelected && <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Your Vote</span>}
                          </div>
                          <span className="font-black text-sm text-slate-900 dark:text-slate-100">{percentage}%</span>
                        </div>
                        
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                            className={`h-full rounded-full ${opt.color} ${isSelected ? 'shadow-[0_0_10px_rgba(0,0,0,0.2)]' : ''}`}
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
