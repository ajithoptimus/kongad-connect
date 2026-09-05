"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Heart, Sprout, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

type Category = 'All' | 'Students' | 'Farmers' | 'Women' | 'Seniors';

interface Scheme {
  id: string;
  title: string;
  titleEn: string;
  category: Category;
  description: string;
  descriptionEn: string;
  amount: string;
  deadline: string;
  icon: React.ReactNode;
  color: string;
}

export default function SchemeFinder() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const schemes: Scheme[] = [
    {
      id: '1',
      title: 'വിദ്യാകിരണം സ്‌കോളർഷിപ്പ്',
      titleEn: 'Vidyakiranam Scholarship',
      category: 'Students',
      description: 'ഭിന്നശേഷിക്കാരായ മാതാപിതാക്കളുടെ മക്കൾക്കുള്ള വിദ്യാഭ്യാസ സഹായം.',
      descriptionEn: 'Educational assistance for children of disabled parents.',
      amount: '₹1,500 - ₹3,000 / month',
      deadline: 'Sep 30, 2026',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: '2',
      title: 'കിസാൻ സമ്മാൻ നിധി (PM-KISAN)',
      titleEn: 'PM-KISAN Yojana',
      category: 'Farmers',
      description: 'കർഷകർക്ക് പ്രതിവർഷം 6000 രൂപയുടെ ധനസഹായം.',
      descriptionEn: 'Financial benefit of ₹6000 per year to eligible farmers.',
      amount: '₹6,000 / year',
      deadline: 'Ongoing',
      icon: <Sprout className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '3',
      title: 'വിധവാ പെൻഷൻ',
      titleEn: 'Widow Pension Scheme',
      category: 'Women',
      description: 'വിധവകൾക്കുള്ള പ്രതിമാസ സാമ്പത്തിക സഹായ പദ്ധതി.',
      descriptionEn: 'Monthly financial assistance scheme for widows.',
      amount: '₹1,600 / month',
      deadline: 'Ongoing',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: '4',
      title: 'വാർദ്ധക്യകാല പെൻഷൻ',
      titleEn: 'Old Age Pension',
      category: 'Seniors',
      description: '60 വയസ്സ് കഴിഞ്ഞവർക്കുള്ള സംസ്ഥാന സർക്കാർ പെൻഷൻ.',
      descriptionEn: 'State government pension for citizens above 60 years.',
      amount: '₹1,600 / month',
      deadline: 'Ongoing',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: '5',
      title: 'ഇ-ഗ്രാൻഡ്സ് (e-Grantz)',
      titleEn: 'e-Grantz Scholarship',
      category: 'Students',
      description: 'പട്ടികജാതി/പട്ടികവർഗ്ഗ, ഒബിസി വിദ്യാർത്ഥികൾക്കുള്ള വിദ്യാഭ്യാസ ആനുകൂല്യം.',
      descriptionEn: 'Educational concession for SC/ST and OBC students.',
      amount: 'Varies by course',
      deadline: 'Oct 15, 2026',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: '6',
      title: 'സുഭിക്ഷ കേരളം പദ്ധതി',
      titleEn: 'Subhiksha Keralam',
      category: 'Farmers',
      description: 'കൃഷി പ്രോത്സാഹിപ്പിക്കുന്നതിനുള്ള സബ്‌സിഡിയും സാങ്കേതിക സഹായവും.',
      descriptionEn: 'Subsidy and technical support for promoting agriculture.',
      amount: 'Project based subsidy',
      deadline: 'Ongoing',
      icon: <Sprout className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
  ];

  const categories: { id: Category; label: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'എല്ലാം', labelEn: 'All', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'Students', label: 'വിദ്യാർത്ഥികൾ', labelEn: 'Students', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'Farmers', label: 'കർഷകർ', labelEn: 'Farmers', icon: <Sprout className="w-4 h-4" /> },
    { id: 'Women', label: 'വനിതകൾ', labelEn: 'Women', icon: <Heart className="w-4 h-4" /> },
    { id: 'Seniors', label: 'വയോജനങ്ങൾ', labelEn: 'Seniors', icon: <Heart className="w-4 h-4" /> },
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = activeCategory === 'All' || scheme.category === activeCategory;
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      scheme.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-[1850px] mx-auto px-4 md:px-8 2xl:px-12 mb-10 mt-12">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-slate-200/50 dark:border-slate-700/30 shadow-lg shadow-emerald-500/5 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">പദ്ധതികളും സ്കോളർഷിപ്പുകളും</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Govt Schemes & Scholarships Finder</p>
            </div>
          </div>
        </div>

        {/* Filters & Search Area */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/50 dark:border-slate-700/30 shadow-sm flex flex-col lg:flex-row gap-4 mb-8">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search schemes... / പദ്ധതികൾ തിരയുക..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-600/30 rounded-2xl py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium backdrop-blur-sm"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar items-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 font-bold text-sm border ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 backdrop-blur-sm'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredSchemes.map((scheme) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={scheme.id}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/30 p-6 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${scheme.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                    {scheme.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-primary transition-colors">{scheme.title}</h3>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{scheme.titleEn}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{scheme.description}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{scheme.descriptionEn}</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 mt-auto border border-slate-200/30 dark:border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Benefit / തുക</span>
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">{scheme.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Deadline / അവസാന തീയതി</span>
                    <span className="text-sm font-bold text-rose-500">{scheme.deadline}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary hover:text-white transition-colors group/btn">
                  അപേക്ഷിക്കുക (Apply)
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSchemes.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/30">
              <div className="w-16 h-16 bg-slate-100/80 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">പദ്ധതികൾ ഒന്നും കണ്ടെത്തിയില്ല</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No schemes found matching your search.</p>
            </div>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  );
}
