"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  amount: string;
  eligibility: string;
  matchScore: number;
}

const SCHEMES_DB = [
  { id: 'pmkisan', name: 'PM-KISAN', tags: ['Farmer'], amount: '₹6,000 / year', eligibility: 'Landholding farmers' },
  { id: 'vidyakiranam', name: 'Vidyakiranam', tags: ['Student'], amount: 'Varies', eligibility: 'Children of differently-abled parents' },
  { id: 'egrantz', name: 'e-Grantz', tags: ['Student', 'SC-ST'], amount: 'Tuition + Stipend', eligibility: 'SC/ST/OBC students' },
  { id: 'widow', name: 'Widow Pension', tags: ['Woman'], amount: '₹1,600 / month', eligibility: 'Widows below poverty line' },
  { id: 'oldage', name: 'Old Age Pension', tags: ['Senior'], amount: '₹1,600 / month', eligibility: 'Citizens above 60 years' },
  { id: 'subhiksha', name: 'Subhiksha Keralam', tags: ['Farmer', 'General'], amount: 'Subsidies', eligibility: 'Interested in agriculture' },
  { id: 'kanyashree', name: 'Kanyashree', tags: ['Student', 'Woman'], amount: 'Annual Scholarship', eligibility: 'Female students' },
  { id: 'pmegp', name: 'PMEGP', tags: ['Business', 'Unemployed'], amount: 'Up to 35% subsidy', eligibility: 'New entrepreneurs' }
];

export function SchemeRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Scheme[]>([]);

  const questions = [
    { id: 'category', q: 'നിങ്ങൾ ആരാണ്? (Who are you?)', options: ['Student', 'Farmer', 'Woman', 'Senior', 'SC-ST', 'General'] },
    { id: 'age', q: 'പ്രായം? (Age?)', options: ['Under 18', '18-35', '35-60', '60+'] },
    { id: 'income', q: 'വാർഷിക വരുമാനം? (Annual Income?)', options: ['Below 1L', '1-3L', '3-5L', 'Above 5L'] },
    { id: 'job', q: 'ജോലി? (Occupation?)', options: ['Farming', 'Govt', 'Private', 'Business', 'Unemployed', 'Student'] },
    { id: 'panchayat', q: 'പഞ്ചായത്ത്? (Panchayat?)', options: ['Kongad', 'Keralassery', 'Mankara', 'Mannur', 'Parli', 'Mundur', 'Kanjirapuzha', 'Karakkurussi', 'Thachampara'] }
  ];

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [questions[step].id]: option }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      analyzeResults();
    }
  };

  const analyzeResults = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Dummy logic to match schemes based on answers
      const matched = SCHEMES_DB.map(s => {
        let score = 50 + Math.floor(Math.random() * 30);
        if (s.tags.includes(answers.category)) score += 15;
        if (s.tags.includes(answers.job)) score += 10;
        return { ...s, matchScore: Math.min(score, 99) };
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
      
      setResults(matched);
      setIsAnalyzing(false);
      setStep(step + 1);
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/30 shadow-lg shadow-emerald-500/5 overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/30">
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Scheme Recommender</h2>
      </div>

      {step < questions.length && !isAnalyzing && (
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="mb-4 flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{questions[step].q}</h3>
          <div className="grid grid-cols-2 gap-3">
            {questions[step].options.map(opt => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className="p-3 text-left rounded-xl border border-emerald-200/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm hover:border-primary hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-all hover:shadow-md hover:-translate-y-0.5 flex justify-between items-center"
              >
                {opt}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Brain className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">AI Analyzing your profile...</p>
          <div className="w-48 h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>
      )}

      {step > questions.length - 1 && !isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="text-accent" /> Recommended Schemes for You
            </h3>
          </div>
          <div className="space-y-4">
            {results.map((scheme, i) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{scheme.name}</h4>
                  <span className="bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-700/30 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    {scheme.matchScore}% Match <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-3 space-y-1">
                  <p><span className="font-semibold">Benefit:</span> {scheme.amount}</p>
                  <p><span className="font-semibold">Eligibility:</span> {scheme.eligibility}</p>
                </div>
                <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
             <button onClick={() => { setStep(0); setAnswers({}); }} className="text-sm text-primary hover:underline">
               Take quiz again
             </button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/30 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
        Powered by Synthara Vision AI <Sparkles className="w-3 h-3 text-accent" />
      </div>
    </div>
  );
}
