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
      className="relative w-full bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] dark:from-[#0d1f15] dark:to-[#0a1a12] rounded-3xl border border-green-200 dark:border-green-900/50 p-6 md:p-8 overflow-hidden shadow-sm"
    >
      {/* Background grid decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%">
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-600" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

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

      {/* Panchayat Grid */}
      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-5 gap-3">
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
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 md:p-4 cursor-pointer group transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-br from-primary to-primary-light border-primary text-white shadow-lg shadow-primary/30 scale-[1.03]'
                  : isAll
                    ? 'bg-white dark:bg-[#1a2b22] border-green-200 dark:border-green-800 text-slate-700 dark:text-green-100 hover:border-primary hover:shadow-md hover:scale-[1.02]'
                    : 'bg-white/50 dark:bg-[#1a2b22]/50 border-gray-200 dark:border-green-900/40 text-slate-400 dark:text-green-200/40 hover:border-primary hover:text-slate-700 dark:hover:text-green-100 hover:bg-white dark:hover:bg-[#1a2b22] hover:scale-[1.02]'
                }
                ${p.size === 'lg' ? 'sm:col-span-1' : ''}
              `}
              whileHover={{ scale: isActive ? 1.03 : 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/15" style={{ animationDuration: '2s' }} />
              )}

              {/* Location dot */}
              <div className={`w-3 h-3 rounded-full mb-2 transition-colors ${
                isActive ? 'bg-white shadow-sm' : 'bg-primary/30 dark:bg-primary/50 group-hover:bg-primary'
              }`} />
              
              <span className={`font-extrabold text-[10px] md:text-xs leading-tight text-center relative z-10 ${
                isActive ? 'text-white' : ''
              }`}>
                {p.nameML}
              </span>
              <span className={`text-[8px] md:text-[10px] leading-tight relative z-10 mt-0.5 ${
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
