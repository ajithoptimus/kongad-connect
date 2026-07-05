'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Send, Phone, MapPin, Clock, ArrowLeft, Paperclip } from 'lucide-react';
import Link from 'next/link';

interface ComplaintFormState {
  fullName: string;
  mobile: string;
  email: string;
  aadhaar: string;
  ward: string;
  category: string;
  subject: string;
  description: string;
  file: File | null;
}

export default function MLAConnectPage() {
  const [trackId, setTrackId] = useState('');
  const [formState, setFormState] = useState<ComplaintFormState>({
    fullName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    ward: '',
    category: '',
    subject: '',
    description: '',
    file: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Telemetry and FastAPI integration will go here
    console.log('Submitting complaint:', formState);
    alert('Complaint submitted successfully! Your tracking ID will be sent via SMS.');
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tracking ID:', trackId);
    alert('Tracking integration coming soon!');
  };

  return (
    <div className="bg-[#F4F7F5] min-h-screen font-sans text-slate-900 pb-24">
      
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#0A5C36] transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A5C36]/10 rounded-full flex items-center justify-center text-[#0A5C36]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0A5C36]">MLA Connect</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Citizen Portal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 pt-8">
        
        {/* Top Bar (Track Complaint) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-transparent shadow-[0_4px_20px_-4px_rgba(10,92,54,0.08)] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">പരാതിയുടെ തൽസ്ഥിതി (Track Your Complaint)</h2>
            <p className="text-sm text-slate-500">നേരത്തെ സമർപ്പിച്ച പരാതിയുടെ വിവരങ്ങൾ അറിയാൻ ഐഡി നൽകുക.</p>
          </div>
          <form onSubmit={handleTrackSubmit} className="flex w-full md:w-auto gap-2">
            <input 
              type="text" 
              placeholder="Enter Complaint ID (e.g., KNG-2026-...)" 
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all"
            />
            <button type="submit" className="bg-[#0A5C36] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#08482a] transition-colors flex items-center shadow-sm">
              <Search className="w-4 h-4 mr-2" /> Search
            </button>
          </form>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (The Form) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-white rounded-2xl border border-transparent shadow-[0_4px_20px_-4px_rgba(10,92,54,0.08)] p-8"
          >
            <div className="border-l-4 border-[#B58500] pl-4 mb-8">
              <h2 className="text-2xl font-extrabold text-[#0A5C36]">പുതിയ പരാതി റജിസ്റ്റർ ചെയ്യുക</h2>
              <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Register New Complaint</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">മുഴുവൻ പേര് (Full Name) *</label>
                  <input required type="text" name="fullName" value={formState.fullName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">മൊബൈൽ നമ്പർ (Mobile Number) *</label>
                  <input required type="tel" name="mobile" value={formState.mobile} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">ഇമെയിൽ (Email Address)</label>
                  <input type="email" name="email" value={formState.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">ആധാർ നമ്പർ (Aadhaar - Last 4 digits)</label>
                  <input type="text" name="aadhaar" maxLength={4} value={formState.aadhaar} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">വാർഡ് / വില്ലേജ് (Ward / Village) *</label>
                  <input required type="text" name="ward" value={formState.ward} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">പരാതിയുടെ വിഭാഗം (Category) *</label>
                  <select required name="category" value={formState.category} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all">
                    <option value="">Select Category...</option>
                    <option value="Roads">റോഡ്/അടിസ്ഥാന സൗകര്യം</option>
                    <option value="Water">കുടിവെള്ളം</option>
                    <option value="Power">വൈദ്യുതി</option>
                    <option value="Health">ആരോഗ്യം</option>
                    <option value="Other">മറ്റുള്ളവ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">പരാതിയുടെ വിഷയം (Complaint Subject) *</label>
                <input required type="text" name="subject" value={formState.subject} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">വിശദാംശങ്ങൾ (Detailed Description) *</label>
                <textarea required name="description" value={formState.description} onChange={handleInputChange} rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all resize-none"></textarea>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">ഫോട്ടോ / രേഖകൾ (Upload Photo/Document)</label>
                <div className="relative">
                  <input type="file" onChange={handleFileChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:border-[#0A5C36] focus:ring-2 focus:ring-[#0A5C36]/20 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#F3F7F4] file:text-[#0A5C36] hover:file:bg-[#E2EBE5]" />
                  <Paperclip className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-[#0A5C36] text-white font-bold py-4 rounded-xl flex items-center justify-center hover:bg-[#08482a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg">
                  <Send className="w-5 h-5 mr-2" /> പരാതി സമർപ്പിക്കുക (Submit Complaint)
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right Column (Sidebars) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Card 1: How It Works */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-transparent shadow-[0_4px_20px_-4px_rgba(10,92,54,0.08)] p-6"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-[#B58500] mr-2 rounded-full" /> എങ്ങനെ പ്രവർത്തിക്കുന്നു?
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                
                {[
                  { step: 1, title: 'സമർപ്പിക്കുക', desc: 'പരാതി ഓൺലൈനായി സമർപ്പിക്കുക' },
                  { step: 2, title: 'ട്രാക്കിംഗ് ഐഡി', desc: 'എസ്.എം.എസ് ആയി ട്രാക്കിംഗ് ഐഡി ലഭിക്കും' },
                  { step: 3, title: 'പരിശോധന', desc: 'എം.എൽ.എ ഓഫീസ് പരിശോധിക്കുന്നു' },
                  { step: 4, title: 'പരിഹാരം', desc: 'ബന്ധപ്പെട്ട വകുപ്പ് വഴി പരിഹാരം' }
                ].map((item, idx) => (
                  <div key={idx} className="relative flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-[#F3F7F4] border-2 border-[#0A5C36] flex items-center justify-center text-[#0A5C36] font-bold text-sm shrink-0 shadow-sm relative z-10 group-hover:bg-[#0A5C36] group-hover:text-white transition-colors">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[15px]">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}

              </div>
            </motion.div>

            {/* Card 2: Direct Contact */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0A5C36] rounded-2xl shadow-[0_4px_20px_-4px_rgba(10,92,54,0.15)] p-6 text-white"
            >
              <h3 className="text-lg font-extrabold mb-1">നേരിട്ട് ബന്ധപ്പെടാൻ</h3>
              <p className="text-xs text-green-100 font-medium mb-6 uppercase tracking-widest">Direct Contact</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#B58500] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-green-200 font-medium">Camp Office</p>
                    <p className="font-bold text-lg">0471-XXXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B58500] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-green-200 font-medium">Office Hours</p>
                    <p className="font-bold">Mon-Fri, 10 AM - 5 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B58500] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-green-200 font-medium">Address</p>
                    <p className="font-bold text-sm leading-relaxed">MLA Office,<br/>Kongad Assembly Constituency,<br/>Palakkad, Kerala</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
