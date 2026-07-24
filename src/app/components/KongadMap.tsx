"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface KongadMapProps {
  activePanchayat: string;
  onPanchayatClick: (id: string) => void;
}

const PANCHAYAT_DATA = [
  { id: 'kongad', name: 'Kongad', nameML: 'കോങ്ങാട്', x: 48, y: 45, size: 'lg' },
  { id: 'keralassery', name: 'Keralassery', nameML: 'കേരളശ്ശേരി', x: 30, y: 25, size: 'md' },
  { id: 'mankara', name: 'Mankara', nameML: 'മങ്കര', x: 70, y: 30, size: 'md' },
  { id: 'mannur', name: 'Mannur', nameML: 'മണ്ണൂർ', x: 20, y: 55, size: 'sm' },
  { id: 'parali', name: 'Parali', nameML: 'പറളി', x: 75, y: 60, size: 'md' },
  { id: 'kanjirapuzha', name: 'Kanjirapuzha', nameML: 'കഞ്ഞിരപ്പുഴ', x: 15, y: 75, size: 'md' },
  { id: 'karimba', name: 'Karimba', nameML: 'കരിമ്പ', x: 55, y: 72, size: 'sm' },
  { id: 'karakurussi', name: 'Karakurussi', nameML: 'കരകുറുശ്ശി', x: 85, y: 45, size: 'sm' },
  { id: 'thachampara', name: 'Thachampara', nameML: 'തച്ചമ്പാറ', x: 40, y: 85, size: 'md' },
];

const sizeMap = {
  sm: { w: 52, h: 52, textSize: 'text-[7px]' },
  md: { w: 60, h: 60, textSize: 'text-[8px]' },
  lg: { w: 72, h: 72, textSize: 'text-[9px]' },
};

export default function KongadMap({ activePanchayat, onPanchayatClick }: KongadMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] dark:from-[#0d1f15] dark:to-[#0a1a12] rounded-3xl border border-green-200 dark:border-green-900/50 p-6 md:p-8 overflow-hidden shadow-sm"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%">
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-600" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Connection lines (SVG paths between panchayats) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Main connections */}
        <line x1="48" y1="45" x2="30" y2="25" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="70" y2="30" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="20" y2="55" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="75" y2="60" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="55" y2="72" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="85" y2="45" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="15" y2="75" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
        <line x1="48" y1="45" x2="40" y2="85" stroke="currentColor" strokeWidth="0.15" className="text-green-400/40 dark:text-green-600/30" />
      </svg>

      <div className="relative" style={{ paddingBottom: '55%' }}>
        {PANCHAYAT_DATA.map((p) => {
          const isActive = activePanchayat === p.id;
          const isAll = activePanchayat === 'all';
          const dims = sizeMap[p.size as keyof typeof sizeMap];

          return (
            <motion.button
              key={p.id}
              onClick={() => onPanchayatClick(p.id)}
              className={`absolute flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 cursor-pointer group
                ${isActive
                  ? 'bg-gradient-to-br from-primary to-primary-light border-primary text-white shadow-lg shadow-primary/30 scale-110 z-20'
                  : isAll
                    ? 'bg-white dark:bg-[#1a2b22] border-green-200 dark:border-green-800 text-slate-700 dark:text-green-100 hover:border-primary hover:shadow-md hover:scale-105 z-10'
                    : 'bg-white/60 dark:bg-[#1a2b22]/60 border-gray-200 dark:border-green-900/40 text-slate-400 dark:text-green-200/40 hover:border-primary hover:text-slate-700 dark:hover:text-green-100 hover:bg-white dark:hover:bg-[#1a2b22] hover:scale-105 z-10'
                }`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${dims.w}px`,
                height: `${dims.h}px`,
              }}
              whileHover={{ scale: isActive ? 1.1 : 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" />
              )}
              
              <span className={`font-extrabold ${dims.textSize} leading-tight text-center relative z-10`}>
                {p.nameML}
              </span>
              <span className={`${dims.textSize} opacity-70 leading-tight relative z-10 mt-0.5`}>
                {p.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
