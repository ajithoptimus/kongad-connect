"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface KongadMapProps {
  activePanchayat: string;
  onPanchayatClick: (id: string) => void;
}

const PANCHAYAT_DATA = [
  { id: 'kongad', name: 'Kongad', nameML: 'കോങ്ങാട്', col: 2, row: 1, size: 'lg' },
  { id: 'keralassery', name: 'Keralassery', nameML: 'കേരളശ്ശേരി', col: 0, row: 0, size: 'md' },
  { id: 'mankara', name: 'Mankara', nameML: 'മങ്കര', col: 3, row: 0, size: 'md' },
  { id: 'mannur', name: 'Mannur', nameML: 'മണ്ണൂർ', col: 1, row: 0, size: 'md' },
  { id: 'parali', name: 'Parali', nameML: 'പറളി', col: 4, row: 0, size: 'md' },
  { id: 'kanjirapuzha', name: 'Kanjirapuzha', nameML: 'കഞ്ഞിരപ്പുഴ', col: 0, row: 2, size: 'md' },
  { id: 'karimba', name: 'Karimba', nameML: 'കരിമ്പ', col: 1, row: 2, size: 'md' },
  { id: 'karakurussi', name: 'Karakurussi', nameML: 'കരകുറുശ്ശി', col: 4, row: 1, size: 'md' },
  { id: 'thachampara', name: 'Thachampara', nameML: 'തച്ചമ്പാറ', col: 3, row: 2, size: 'md' },
];

export default function KongadMap({ activePanchayat, onPanchayatClick }: KongadMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/30 p-6 md:p-8 shadow-xl shadow-emerald-500/10 overflow-hidden"
    >

      {/* Section Title */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Explore Kongad</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">നിങ്ങളുടെ പഞ്ചായത്ത് തിരഞ്ഞെടുക്കൂ</p>
        </div>
        {activePanchayat !== 'all' && (
          <button
            onClick={() => onPanchayatClick('all')}
            className="ml-auto text-xs font-bold text-primary hover:text-primary-dark bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
          >
            Clear Filter ✕
          </button>
        )}
      </div>

      {/* Panchayat Single Row (Scrollable on mobile) */}
      <div className="relative z-10 flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PANCHAYAT_DATA.map((p, index) => {
          const isActive = activePanchayat === p.id;
          const isAll = activePanchayat === 'all';

          return (
            <motion.button
              key={p.id}
              onClick={() => onPanchayatClick(isActive ? 'all' : p.id)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`relative flex-shrink-0 snap-start w-auto flex flex-col items-center justify-center rounded-2xl border-2 px-6 py-4 cursor-pointer group transition-all duration-300 backdrop-blur-sm
                ${isActive
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.03]'
                  : isAll
                    ? 'bg-white/50 dark:bg-slate-800/50 border-emerald-200/50 dark:border-emerald-800/50 text-slate-700 dark:text-emerald-100 hover:border-emerald-500 hover:shadow-md hover:scale-[1.02]'
                    : 'bg-white/30 dark:bg-slate-800/30 border-gray-200/50 dark:border-emerald-900/40 text-slate-500 dark:text-emerald-200/60 hover:border-emerald-500 hover:text-slate-700 dark:hover:text-emerald-100 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-[1.02]'
                }
              `}
              whileHover={{ scale: isActive ? 1.03 : 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl animate-ping bg-emerald-500/20" style={{ animationDuration: '2s' }} />
              )}

              {/* Location dot */}
              <div className={`w-3 h-3 rounded-full mb-2 transition-colors ${
                isActive ? 'bg-white shadow-sm' : 'bg-emerald-500/30 dark:bg-emerald-500/50 group-hover:bg-emerald-500'
              }`} />
              
              <span className={`font-extrabold text-sm md:text-base leading-tight text-center relative z-10 whitespace-nowrap ${
                isActive ? 'text-white' : ''
              }`}>
                {p.nameML}
              </span>
              <span className={`text-[10px] md:text-xs leading-tight relative z-10 mt-0.5 whitespace-nowrap ${
                isActive ? 'text-white/80' : 'opacity-60'
              }`}>
                {p.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
