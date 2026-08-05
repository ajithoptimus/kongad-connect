"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  location: string;
  area: string;
  panchayat: string;
  phone: string;
  details: string;
  farmingType?: string;
}

const initialFormData: FormData = {
  name: '',
  location: '',
  area: '',
  panchayat: '',
  phone: '',
  details: '',
  farmingType: '',
};

const panchayats = [
  { value: 'kongad', label: 'കോങ്ങാട്' },
  { value: 'keralassery', label: 'കേരളശ്ശേരി' },
  { value: 'mankara', label: 'മങ്കര' },
  { value: 'parali', label: 'പറളി' },
  { value: 'kanjirapuzha', label: 'കഞ്ഞിരപ്പുഴ' },
  { value: 'thachampara', label: 'തച്ചമ്പാറ' },
];

const farmingTypes = [
  { value: 'rice', label: 'നെൽകൃഷി (Paddy)' },
  { value: 'vegetable', label: 'പച്ചക്കറി (Vegetable)' },
  { value: 'banana', label: 'വാഴ (Banana)' },
  { value: 'coconut', label: 'തെങ്ങ് (Coconut)' },
  { value: 'mixed', label: 'മിശ്ര കൃഷി (Mixed Farming)' },
  { value: 'other', label: 'മറ്റുള്ളവ (Other)' },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ValidationErrors {
  name?: string;
  panchayat?: string;
  phone?: string;
  area?: string;
}

function validateForm(data: FormData, type: 'register' | 'seek'): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.name.trim()) errors.name = 'പേര് ആവശ്യമാണ്';
  if (!data.panchayat) errors.panchayat = 'പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക';
  if (!data.phone.trim()) {
    errors.phone = 'ഫോൺ നമ്പർ ആവശ്യമാണ്';
  } else if (!/^[0-9]{10}$/.test(data.phone.trim())) {
    errors.phone = '10 അക്ക ഫോൺ നമ്പർ നൽകുക';
  }
  if (type === 'register' && !data.area.trim()) {
    errors.area = 'വിസ്തീർണ്ണം ആവശ്യമാണ്';
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5"
    >
      <AlertCircle className="w-3 h-3" /> {message}
    </motion.p>
  );
}

/* ─────────────────────────────────── */
/*  REGISTER FALLOW LAND              */
/* ─────────────────────────────────── */
export function TharisuNilamRegister() {
  const [form, setForm] = useState<FormData>({ ...initialFormData });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form, 'register');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      // Reset after showing success
      setTimeout(() => {
        setForm({ ...initialFormData });
        setErrors({});
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-xl">🌾</span>
        </div>
        <div>
          <h3 className="font-extrabold text-white text-sm">തരിശു നിലം രജിസ്‌ട്രേഷൻ</h3>
          <p className="text-[10px] text-white/80 font-medium">Register Your Fallow Land</p>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </motion.div>
              <h4 className="text-lg font-extrabold text-green-600 dark:text-green-400 mb-1">
                രജിസ്‌ട്രേഷൻ വിജയകരം!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registration Successful! We&apos;ll connect you with interested farmers soon.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                കൃഷി ചെയ്യാത്ത ഭൂമി ഉണ്ടോ? ഇവിടെ രജിസ്റ്റർ ചെയ്യുക. ആവശ്യക്കാരായ കർഷകരെ ഞങ്ങൾ ബന്ധിപ്പിക്കാം.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                Have idle farming land? Register here and we&apos;ll connect you with interested farmers.
              </p>
              <div className="space-y-2">
                <div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="ഉടമയുടെ പേര് (Owner Name) *"
                    className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.name ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium transition-colors`}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="സ്ഥലം (Location)"
                    className="w-full bg-slate-50 dark:bg-[#0f1a14] border border-slate-200 dark:border-green-900/50 rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium"
                  />
                  <div>
                    <input
                      type="text"
                      value={form.area}
                      onChange={(e) => updateField('area', e.target.value)}
                      placeholder="വിസ്തീർണ്ണം (Area) *"
                      className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.area ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium transition-colors`}
                    />
                    <FieldError message={errors.area} />
                  </div>
                </div>
                <div>
                  <select
                    value={form.panchayat}
                    onChange={(e) => updateField('panchayat', e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.panchayat ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium transition-colors`}
                  >
                    <option value="">പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക (Select Panchayat) *</option>
                    {panchayats.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <FieldError message={errors.panchayat} />
                </div>
                <div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="ഫോൺ നമ്പർ (Phone) *"
                    className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.phone ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium transition-colors`}
                  />
                  <FieldError message={errors.phone} />
                </div>
                <textarea
                  rows={2}
                  value={form.details}
                  onChange={(e) => updateField('details', e.target.value)}
                  placeholder="അധിക വിവരങ്ങൾ (Soil type, water availability etc.)"
                  className="w-full bg-slate-50 dark:bg-[#0f1a14] border border-slate-200 dark:border-green-900/50 rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-medium resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> സമർപ്പിക്കുന്നു...
                  </>
                ) : (
                  <>🌾 നിലം രജിസ്റ്റർ ചെയ്യുക (Register Land)</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


/* ─────────────────────────────────── */
/*  SEEK FARMING LAND                 */
/* ─────────────────────────────────── */
export function TharisuNilamSeeker() {
  const [form, setForm] = useState<FormData>({ ...initialFormData });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form, 'seek');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setForm({ ...initialFormData });
        setErrors({});
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-green-200 dark:border-green-800/50 shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-xl">👨‍🌾</span>
        </div>
        <div>
          <h3 className="font-extrabold text-white text-sm">തരിശു നിലം ആവശ്യമുണ്ട്</h3>
          <p className="text-[10px] text-white/80 font-medium">Looking for Farming Land</p>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </motion.div>
              <h4 className="text-lg font-extrabold text-green-600 dark:text-green-400 mb-1">
                അപേക്ഷ സ്വീകരിച്ചു!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Request Received! We&apos;ll match you with available land owners soon.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                കൃഷി ചെയ്യാൻ ഭൂമി ആവശ്യമുണ്ടോ? ഇവിടെ രജിസ്റ്റർ ചെയ്യുക. തരിശു നിലം ഉടമകളെ ഞങ്ങൾ ബന്ധിപ്പിക്കാം.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                Need land for farming? Register here and we&apos;ll connect you with landowners.
              </p>
              <div className="space-y-2">
                <div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="പേര് (Your Name) *"
                    className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.name ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium transition-colors`}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      value={form.panchayat}
                      onChange={(e) => updateField('panchayat', e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.panchayat ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium transition-colors`}
                    >
                      <option value="">പഞ്ചായത്ത് *</option>
                      {panchayats.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <FieldError message={errors.panchayat} />
                  </div>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => updateField('area', e.target.value)}
                    placeholder="ആവശ്യമുള്ള വിസ്തീർണ്ണം (Area)"
                    className="w-full bg-slate-50 dark:bg-[#0f1a14] border border-slate-200 dark:border-green-900/50 rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium"
                  />
                </div>
                <select
                  value={form.farmingType}
                  onChange={(e) => updateField('farmingType', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f1a14] border border-slate-200 dark:border-green-900/50 rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium"
                >
                  <option value="">കൃഷി തരം (Farming Type)</option>
                  {farmingTypes.map(ft => (
                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                  ))}
                </select>
                <div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="ഫോൺ നമ്പർ (Phone) *"
                    className={`w-full bg-slate-50 dark:bg-[#0f1a14] border ${errors.phone ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-green-900/50'} rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium transition-colors`}
                  />
                  <FieldError message={errors.phone} />
                </div>
                <textarea
                  rows={2}
                  value={form.details}
                  onChange={(e) => updateField('details', e.target.value)}
                  placeholder="അധിക വിവരങ്ങൾ (Experience, preferences etc.)"
                  className="w-full bg-slate-50 dark:bg-[#0f1a14] border border-slate-200 dark:border-green-900/50 rounded-lg py-2.5 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-green-500/20 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> സമർപ്പിക്കുന്നു...
                  </>
                ) : (
                  <>👨‍🌾 അപേക്ഷ സമർപ്പിക്കുക (Submit Request)</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
