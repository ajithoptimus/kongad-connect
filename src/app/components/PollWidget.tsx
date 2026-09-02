"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, Vote } from 'lucide-react';

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
    { id: 'opt1', text: 'കുടിവെള്ള പദ്ധതികൾ', textEn: 'Drinking Water Projects', votes: 1420, color: 'bg-gradient-to-r from-blue-500 to-cyan-400' },
    { id: 'opt2', text: 'ഗ്രാമീണ റോഡുകൾ', textEn: 'Rural Roads', votes: 850, color: 'bg-gradient-to-r from-slate-500 to-slate-400' },
    { id: 'opt3', text: 'ആരോഗ്യ കേന്ദ്രങ്ങൾ', textEn: 'Healthcare Centers', votes: 620, color: 'bg-gradient-to-r from-rose-500 to-pink-400' },
    { id: 'opt4', text: 'കാർഷിക സഹായങ്ങൾ', textEn: 'Agricultural Support', votes: 1100, color: 'bg-gradient-to-r from-emerald-500 to-teal-400' },
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
        className="bg-gradient-to-br from-[#f0f4ff] via-[#e8efff] to-[#e0ebff] dark:from-[#0b1329] dark:via-[#101c3d] dark:to-[#0b1329] rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden"
      >
        {/* Ambient Decorative Lighting */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Title & Info */}
          <div className="lg:col-span-5 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">ജനാഭിപ്രായം</span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">പബ്ലിക് പോൾ</h2>
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 leading-snug font-malayalam">
                നമ്മുടെ മണ്ഡലത്തിൽ ഏറ്റവും വേഗത്തിൽ നടപ്പിലാക്കേണ്ട പദ്ധതി ഏതാണ്?
              </h3>
              <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-indigo-200/70 mb-6 leading-relaxed">
                What is the most urgent priority for our constituency? Your vote helps shape development.
              </p>
            </div>

            <div className="flex items-center gap-3.5 bg-white/80 dark:bg-[#14223d]/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-500/30 shadow-md w-fit">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                <Vote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300 tracking-tight block leading-none mb-0.5">
                  {totalVotes.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ആളുകൾ വോട്ട് ചെയ്തു
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Poll Options */}
          <div className="lg:col-span-7 space-y-3.5">
            <AnimatePresence mode="wait">
              {!hasVoted ? (
                /* Voting View */
                <motion.div
                  key="voting"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="space-y-3.5"
                >
                  {options.map((opt, i) => (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleVote(opt.id)}
                      className="w-full text-left bg-white dark:bg-[#132035] hover:bg-indigo-50/50 dark:hover:bg-[#1a2b47] border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/60 px-5 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors font-malayalam truncate">
                          {opt.text}
                        </div>
                        <div className="text-xs font-medium text-slate-500 dark:text-indigo-200/60 truncate">
                          {opt.textEn}
                        </div>
                      </div>
                      
                      {/* Fixed Perfect Circle Radio Button */}
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-500 group-hover:border-indigo-500 flex items-center justify-center shrink-0 transition-colors bg-slate-50 dark:bg-slate-800">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  className="space-y-3.5 bg-white/70 dark:bg-[#132035]/90 p-5 md:p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/30 backdrop-blur-md shadow-lg"
                >
                  <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold mb-1 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 rounded-xl text-xs shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>വോട്ട് രേഖപ്പെടുത്തി (Vote Recorded)</span>
                  </div>
                  
                  {options.sort((a, b) => b.votes - a.votes).map((opt, i) => {
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    const isSelected = selectedOptionId === opt.id;
                    
                    return (
                      <div key={opt.id} className={`relative p-4 rounded-xl shadow-sm border transition-all ${isSelected ? 'bg-indigo-50/60 dark:bg-[#1b2b48] border-indigo-300 dark:border-indigo-500/60 ring-2 ring-indigo-500/20' : 'bg-white dark:bg-[#0c1626] border-slate-100 dark:border-slate-800'}`}>
                        <div className="flex justify-between items-center mb-2.5 relative z-10 gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-base leading-tight font-malayalam ${isSelected ? 'text-indigo-800 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-100'}`}>
                              {opt.text}
                            </span>
                            {isSelected && (
                              <span className="inline-block text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider shadow-sm">
                                Your Vote
                              </span>
                            )}
                          </div>
                          <span className={`font-black text-xl shrink-0 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                            {percentage}%
                          </span>
                        </div>
                        
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                            className={`h-full rounded-full ${opt.color} ${isSelected ? 'shadow-md' : 'opacity-85'}`}
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

