"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Camera, 
  Send, 
  ChevronRight,
  User,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { emitTelemetry } from '@/utils/telemetry';
import { 
  Panchayat, 
  EmergencyService, 
  NewsItem, 
  JobListing, 
  ClassifiedListing,
  UserRole
} from '@/types';

// Mock Data
type Hospital = { id: string; name: string; location: string; phone: string; };
const hospitals: Hospital[] = [
  { id: 'chc', name: 'ഗവ. സി.എച്ച്.സി (Govt CHC Kongad)', location: 'Kongad Town', phone: 'tel:+910000000000' },
  { id: 'mercy', name: 'മേഴ്സി ക്ലിനിക് (Mercy Clinic 24/7)', location: 'Near Bus Stand', phone: 'tel:+910000000000' },
  { id: 'pharmacy', name: 'കോങ്ങാട് ഫാർമസി (Kongad Pharmacy)', location: 'Main Road', phone: 'tel:+910000000000' }
];

type Institution = { id: string; name: string; type: string; contact: string; };
const institutions: Institution[] = [
  { id: 'iti-kongad', name: 'ഗവ. ഐ.ടി.ഐ കോങ്ങാട് (Govt ITI)', type: 'Technical', contact: 'tel:+910000000000' },
  { id: 'college-1', name: 'ഗവ. ആർട്സ് & സയൻസ് കോളേജ് (Govt Arts & Science)', type: 'Degree', contact: 'tel:+910000000000' },
  { id: 'polytechnic', name: 'പോളിടെക്നിക് കോളേജ് (Polytechnic)', type: 'Diploma', contact: 'tel:+910000000000' }
];

type ServiceCategory = 'krishi' | 'ration' | 'maveli' | 'bank';
type GovtInstitution = { id: string; category: ServiceCategory; panchayat: string; name: string; phone: string; };
const govtInstitutions: GovtInstitution[] = [
  { id: 'kb-kng', category: 'krishi', panchayat: 'Kongad', name: 'കൃഷിഭവൻ കോങ്ങാട് (Krishi Bhavan)', phone: 'tel:+910000000000' },
  { id: 'kb-prl', category: 'krishi', panchayat: 'Parali', name: 'കൃഷിഭവൻ പറളി (Krishi Bhavan)', phone: 'tel:+910000000000' },
  { id: 'rs-kng', category: 'ration', panchayat: 'Kongad', name: 'റേഷൻ കട - കോങ്ങാട് ടൗൺ', phone: 'tel:+910000000000' }
];

const PANCHAYATS: Panchayat[] = [
  { id: 'all', name: 'All Kongad' },
  { id: 'kongad', name: 'Kongad' },
  { id: 'keralassery', name: 'Keralassery' },
  { id: 'mankara', name: 'Mankara' },
  { id: 'mannur', name: 'Mannur' },
  { id: 'parali', name: 'Parali' },
  { id: 'kanjirapuzha', name: 'Kanjirapuzha' },
  { id: 'karimba', name: 'Karimba' },
  { id: 'karakurussi', name: 'Karakurussi' },
  { id: 'thachampara', name: 'Thachampara' }
];

type MarketItem = { id: string; name: string; price: string; unit: string; trend: 'up' | 'down' | 'neutral'; };
const marketItems: MarketItem[] = [
  { id: 'paddy', name: 'നെല്ല് (മട്ട)', price: '₹28.5', unit: '/ KG', trend: 'up' },
  { id: 'rubber', name: 'റബ്ബർ (RSS4)', price: '₹180', unit: '/ KG', trend: 'down' },
  { id: 'coconut', name: 'നാളികേരം', price: '₹32', unit: '/ KG', trend: 'neutral' },
  { id: 'arecanut', name: 'അടയ്ക്ക', price: '₹320', unit: '/ KG', trend: 'up' },
  { id: 'pepper', name: 'കുരുമുളക്', price: '₹540', unit: '/ KG', trend: 'neutral' },
  { id: 'cardamom', name: 'ഏലം', price: '₹1800', unit: '/ KG', trend: 'up' }
];

const EMERGENCY_SERVICES: EmergencyService[] = [
  { id: '1', name: 'Government CHC Kongad', type: 'chc', location: 'Kongad Town', phone: '104' },
  { id: '2', name: 'Mercy Clinic 24/7', type: 'clinic', location: 'Near Bus Stand', phone: '9876543210' },
  { id: '3', name: 'Kongad Pharmacy', type: 'pharmacy', location: 'Main Road', phone: '9876543211' }
];

const NEWS_FEED: NewsItem[] = [
  { id: '1', title: 'രോ​ഗങ്ങളും കീടങ്ങളും നിരവധി: മഴക്കാലത്ത് പയറിൽ ശ്രദ്ധിക്കാൻ', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80', summary: 'ഏതു കാലാവസ്ഥയിലും നല്ല വിളവ് നൽകുമെങ്കിലും കീടങ്ങളും രോഗങ്ങളും...' },
  { id: '2', title: 'തോരൻ വയ്ക്കാൻ ഉത്തമം; പരിചരണം കുറച്ചു മതി', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&w=600&q=80', summary: 'പേരിൽ മാത്രം വഴുതനയോട് സാമ്യമുള്ള വള്ളിച്ചെടിയാണ്...' },
  { id: '3', title: 'കൂർക്ക നടാം: ഗ്രോബാഗിലും നിലത്തും', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop', summary: 'ചൈനീസ് പൊട്ടറ്റോ എന്നറിയപ്പെടുന്ന കൂർക്ക കേരളീയർക്ക്...' },
  { id: '4', title: 'ഓണത്തിന് ജൈവ പച്ചക്കറി; കോങ്ങാട് പഞ്ചായത്തിൽ വിതരണം തുടങ്ങി', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80', summary: 'ഓണത്തിന് വിഷരഹിത പച്ചക്കറി എന്ന ലക്ഷ്യത്തോടെ...' },
  { id: '5', title: 'തക്കാളി കൃഷിയിൽ നൂറുമേനി വിളവ്; കർഷകർക്ക് ആശ്വാസം', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&w=600&q=80', summary: 'കാലാവസ്ഥ അനുകൂലമായതോടെ തക്കാളി കൃഷിയിൽ വൻ മുന്നേറ്റം...' },
  { id: '6', title: 'കീടനാശിനി പ്രയോഗം കുറയ്ക്കാം; ജൈവവളം ഉപയോഗിക്കാം', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop', summary: 'രാസകീടനാശിനികൾക്ക് പകരം ജൈവവളങ്ങൾ ഉപയോഗിക്കുന്നതിന്റെ ഗുണങ്ങൾ...' }
];

const JOBS: JobListing[] = [
  { id: '1', title: 'Farm Supervisor', employer: 'Green Valley Farms', location: 'Keralassery', isBoosted: true },
  { id: '2', title: 'Retail Assistant', employer: 'Kongad Supermarket', location: 'Kongad Town', isBoosted: false },
  { id: '3', title: 'Delivery Executive', employer: 'Nelmani Fresh', location: 'Parali', isBoosted: false }
];

const CLASSIFIEDS: ClassifiedListing[] = [
  { id: '1', item: 'Used Tractor', price: '₹2.5 Lakhs', seller: 'Ramanan', location: 'Parali', isBoosted: true },
  { id: '2', item: 'Organic Compost', price: '₹500', seller: 'Haritha Sangam', location: 'Mannur', isBoosted: false },
  { id: '3', item: 'Milking Cow', price: '₹45,000', seller: 'Suresh', location: 'Mankara', isBoosted: false }
];

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between bg-slate-50 border-y border-gray-200 px-4 py-3 mb-6">
    <div className="flex items-center">
      <div className="w-1.5 h-6 bg-primary mr-3" />
      <h2 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
    </div>
    <a href="#" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">View All</a>
  </div>
);

export default function Home() {
  const [activePanchayat, setActivePanchayat] = useState<string>('all');
  const [krishiRole, setKrishiRole] = useState<UserRole>('farmer');
  const [isKrishiExpanded, setIsKrishiExpanded] = useState(false);
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);
  const [isCivicExpanded, setIsCivicExpanded] = useState(false);
  const [isMarketExpanded, setIsMarketExpanded] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<string>(hospitals[0].phone);
  const [isEduExpanded, setIsEduExpanded] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<string>(institutions[0].contact);
  
  const [isGovtExpanded, setIsGovtExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('krishi');
  const [selectedPanchayat, setSelectedPanchayat] = useState<string>('Kongad');
  
  const [reportCategory, setReportCategory] = useState<string>('');
  const [reportLandmark, setReportLandmark] = useState<string>('');

  const handlePanchayatClick = (id: string) => {
    setActivePanchayat(id);
    emitTelemetry('filter_panchayat', { panchayatId: id });
  };

  const handleKrishiToggle = (role: UserRole) => {
    setKrishiRole(role);
    emitTelemetry('toggle_krishi_role', { role });
  };

  const handleKrishiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emitTelemetry('submit_krishi_form', { role: krishiRole });
    alert('Request submitted successfully to Nelmani-Fresh!');
  };

  const handleCivicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emitTelemetry('submit_civic_report', { category: reportCategory, landmark: reportLandmark });
    alert('Report submitted to HydroLeaf Sentinel Layer!');
    setReportCategory('');
    setReportLandmark('');
  };

  const handleEmergencyCall = (serviceId: string) => {
    emitTelemetry('click_emergency_call', { serviceId });
  };

  const scrollMotionProps = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  const cardClass = "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col";

  return (
    <div className="bg-[#F4F7F5] min-h-screen font-sans text-slate-900 pb-24">
      
      {/* 1. COMPACT HERO SECTION */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-green-950">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/dam.png"
            alt="Kanjirapuzha Dam in Kongad"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/60 to-green-900/40" />
        </div>

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Kongad Assembly Watermark (Inline SVG) */}
        <div className="absolute right-[2%] lg:right-[10%] top-1/2 -translate-y-1/2 opacity-30 mix-blend-overlay pointer-events-none z-0">
          <svg width="400" height="550" viewBox="0 0 400 550" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M150,20 L250,20 L240,60 L280,70 L350,120 L300,160 L280,220 L330,280 L250,300 L260,350 L200,400 L220,460 L250,520 L180,550 L100,520 L60,480 L120,440 L80,380 L100,320 L60,250 L120,200 L150,100 Z" fill="white" />
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-6 pb-8">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            
            {/* Text Content */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  Welcome to Kongad Connect
                </span>
              </motion.div>

              <motion.h1
                className="text-xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-1 whitespace-nowrap"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                നമ്മുടെ കോങ്ങാട്
              </motion.h1>
              
              <motion.p
                className="text-xs lg:text-sm text-amber-400 font-bold tracking-widest uppercase mb-4 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Kongad Assembly Constituency
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="mt-3 text-sm lg:text-base text-[#FDFCF8]/90 max-w-2xl leading-relaxed mb-6">കോങ്ങാടിന്റെ വികസനത്തിനും ജനങ്ങളുടെ ക്ഷേമത്തിനുമായി ഒരു ഡിജിറ്റൽ ജനകീയ വേദി. നിങ്ങളുടെ പരാതികളും ആവശ്യങ്ങളും നേരിട്ട് എം.എൽ.എ യെ അറിയിക്കാം.</p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link 
                  href="/mla-connect" 
                  className="bg-[#B58500] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#966e00] transition-colors flex items-center gap-2 w-fit shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                >
                  📝 എം.എൽ.എ യെ അറിയിക്കാൻ
                </Link>
                <a 
                  href="#krishi-hub" 
                  className="border-2 border-[#FDFCF8]/30 text-[#FDFCF8] px-6 py-2.5 rounded-full font-bold hover:bg-[#FDFCF8]/10 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm text-sm"
                >
                  🌾 കാർഷിക ഇടം
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  { icon: "🌾", label: "കാർഷിക ഇടം" },
                  { icon: "🏛️", label: "ജനകീയ റിപ്പോർട്ടർ" },
                  { icon: "📰", label: "കോങ്ങാട് വാർത്തകൾ" },
                  { icon: "💼", label: "തൊഴിൽ & നാട്ടുചന്ത" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-green-200">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-xs font-medium">{badge.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Visual - Glowing Interactive Element */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl scale-110" />

                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 aspect-square max-w-[256px] mx-auto group">
                  <div className="w-full h-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                      alt="MLA Kongad"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-transparent" />
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  className="absolute -left-12 top-1/4 backdrop-blur-md bg-white/10 text-white border border-white/20 rounded-2xl p-4 shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/30">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70 font-bold uppercase tracking-wider">എം.എൽ.എ:</p>
                      <p className="font-extrabold text-white text-[15px]">ശ്രീമതി കെ. എ. തുളസി ടീച്ചർ</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-4 shadow-xl border border-amber-100"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">
                      ⭐
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Kongad Portal</p>
                      <p className="font-extrabold text-amber-700 text-[15px]">Live Services</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* 2. ASYMMETRICAL 12-COLUMN STICKY DESKTOP GRID */}
      <main className="w-full bg-[#FDFCF8] min-h-screen py-12">

        {/* Horizontal Filter Chips — Full width above the grid */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-8">
          <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-2 border-b border-gray-200">
            {PANCHAYATS.map((p) => (
              <button 
                key={p.id}
                onClick={() => handlePanchayatClick(p.id)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${
                  activePanchayat === p.id 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white text-slate-600 border-gray-200 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Master 12-Column Grid */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-140px)] overflow-hidden">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: Information Feed (Scrollable) — 8 columns       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-8 lg:h-full lg:overflow-y-auto lg:pr-4 pb-20 scrollbar-hide bg-gradient-to-br from-[#F4F7F5] via-[#FAFCFB] to-[#F0F5F2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Nelmani Fresh Ad Banner */}
            <a 
              href="https://nelmani-fresh-web.onrender.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(10,92,54,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(10,92,54,0.25)] transition-all duration-300 border-4 border-white"
            >
              <img 
                src="/nelmani-ad.jpg" 
                alt="Nelmani Fresh - Mill on Demand" 
                className="w-full h-auto object-contain" 
              />
            </a>

            {/* Section 1: കാർഷിക ഇടം (Krishi Hub — Market Rates) */}
            <section id="krishi-hub" className="bg-white/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-[#0A5C36]/10 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.03)] flex flex-col gap-6 relative overflow-hidden">
              <div>
                <button 
                  onClick={() => setIsKrishiExpanded(!isKrishiExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center border-l-4 border-[#B58500] pl-3">
                    <h2 className="text-[17px] font-bold text-[#0A5C36] tracking-wide">🌾 കാർഷിക ഇടം</h2>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-slate-600">
                    <ChevronDown className={`w-5 h-5 transform ${isKrishiExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isKrishiExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed border border-[#E2EBE5]">
                        കോങ്ങാടിന്റെ കാർഷിക ഹൃദയത്തിലേക്ക് സ്വാഗതം. കർഷകർക്ക് ആവശ്യമായ ദൈനംദിന വിപണി വിലകൾ, കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ, മറ്റ് കാർഷിക വിവരങ്ങൾ എന്നിവ ഇവിടെ ഒറ്റനോട്ടത്തിൽ ലഭ്യമാണ്. ഇടനിലക്കാരില്ലാതെ കർഷകർക്കും വ്യാപാരികൾക്കും നേരിട്ട് വിനിമയം നടത്താനുള്ള സുതാര്യമായ വേദി കൂടിയാണിത്.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {marketItems.map((item) => (
                  <motion.div variants={staggerItem} key={item.id} className="bg-white rounded-xl p-4 flex flex-col justify-center border-l-4 border-[#0A5C36] shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                    <div className="flex items-end justify-between mt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#B58500]">{item.price}</span>
                        <span className="text-xs text-gray-500">{item.unit}</span>
                      </div>
                      {item.trend === 'up' && <span className="text-xs text-green-600">▲</span>}
                      {item.trend === 'down' && <span className="text-xs text-red-600">▼</span>}
                      {item.trend === 'neutral' && <span className="text-xs text-gray-400">-</span>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Section 2: കാർഷിക അറിവുകൾ (Agri-Tips) */}
            <section className="bg-white/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-[#0A5C36]/10 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.03)] flex flex-col gap-6 relative overflow-hidden">
              <div>
                <button 
                  onClick={() => setIsTipsExpanded(!isTipsExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center border-l-4 border-[#B58500] pl-3">
                    <h2 className="text-[17px] font-bold text-[#0A5C36] tracking-wide">🌱 കാർഷിക അറിവുകൾ</h2>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-slate-600">
                    <ChevronDown className={`w-5 h-5 transform ${isTipsExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isTipsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed border border-[#E2EBE5]">
                        പുതിയ കാർഷിക രീതികൾ, വിളപരിപാലനം, ജൈവവള പ്രയോഗം എന്നിവയെക്കുറിച്ചുള്ള വിദഗ്ധ ലേഖനങ്ങൾ. മികച്ച വിളവിനും ലാഭത്തിനും ഈ അറിവുകൾ പ്രയോജനപ്പെടുത്താം.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col"
              >
                {NEWS_FEED.slice(0, 3).map((news, idx) => (
                  <article key={news.id} className="flex flex-col-reverse md:flex-row gap-6 items-start py-6 border-b border-[#0A5C36]/10 last:border-0 bg-transparent shadow-none">
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight">{news.title}</h3>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-2">{news.summary}</p>
                    </div>
                    <img src={news.thumbnailUrl} className="w-full md:w-56 h-40 md:h-32 object-cover rounded-xl shrink-0" alt="" />
                  </article>
                ))}
              </motion.div>
            </section>

            {/* Section 3: കോങ്ങാട് വാർത്തകൾ (Kongad Vartha / News) */}
            <section className="bg-white/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-[#0A5C36]/10 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.03)] flex flex-col gap-6 relative overflow-hidden">
              <div>
                <button 
                  onClick={() => setIsNewsExpanded(!isNewsExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center border-l-4 border-[#B58500] pl-3">
                    <h2 className="text-[17px] font-bold text-[#0A5C36] tracking-wide">📰 കോങ്ങാട് വാർത്തകൾ</h2>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-slate-600">
                    <ChevronDown className={`w-5 h-5 transform ${isNewsExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isNewsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed border border-[#E2EBE5]">
                        നമ്മുടെ നാട്ടിലെ പ്രധാന വാർത്തകൾ, പഞ്ചായത്ത് അറിയിപ്പുകൾ, ഉത്സവ വിശേഷങ്ങൾ എന്നിവ അറിയാൻ ഈ ഇടം ഉപയോഗിക്കുക. കോങ്ങാടിന്റെ സ്പന്ദനങ്ങൾ ഇനി നിങ്ങളുടെ വിരൽത്തുമ്പിൽ.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col"
              >
                {/* Local Jobs as news-style list */}
                {JOBS.map((job) => (
                  <article key={`job-${job.id}`} className="flex flex-col-reverse md:flex-row gap-6 items-start py-6 border-b border-[#0A5C36]/10 last:border-0 bg-transparent shadow-none">
                    <div className="flex-1 flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight">{job.title}</h3>
                        {job.isBoosted && <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider shrink-0 mt-1">Urgent</span>}
                      </div>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">{job.employer}</p>
                      <div className="flex items-center text-sm font-semibold text-slate-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" /> {job.location}
                      </div>
                    </div>
                  </article>
                ))}
                {/* Classifieds as news-style list */}
                {CLASSIFIEDS.map((item) => (
                  <article key={`class-${item.id}`} className="flex flex-col-reverse md:flex-row gap-6 items-start py-6 border-b border-[#0A5C36]/10 last:border-0 bg-transparent shadow-none">
                    <div className="flex-1 flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight">{item.item}</h3>
                        <span className="text-primary font-bold text-lg shrink-0 mt-1">{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500 mt-1">
                        <span>By {item.seller}</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {item.location}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </section>

            {/* Civic Reporter */}
            <section id="civic-reporter" className="bg-white/60 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-[#0A5C36]/10 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.03)] flex flex-col gap-6 relative overflow-hidden">
              <div>
                <button 
                  onClick={() => setIsCivicExpanded(!isCivicExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center border-l-4 border-[#B58500] pl-3">
                    <h2 className="text-[17px] font-bold text-[#0A5C36] tracking-wide">📢 ജനകീയ റിപ്പോർട്ടർ</h2>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-slate-600">
                    <ChevronDown className={`w-5 h-5 transform ${isCivicExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isCivicExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed border border-[#E2EBE5]">
                        നമ്മുടെ നാടിന്റെ അടിസ്ഥാന സൗകര്യങ്ങളിലെ പ്രശ്നങ്ങൾ, റോഡ് അറ്റകുറ്റപ്പണികൾ, കുടിവെള്ള പ്രശ്നങ്ങൾ എന്നിവ നേരിട്ട് ജനപ്രതിനിധികളെ അറിയിക്കാനുള്ള ജനകീയ വേദി. ഒരു ഫോട്ടോയിലൂടെ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യാം.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div {...scrollMotionProps} whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl border border-transparent shadow-[0_4px_20px_-4px_rgba(10,92,54,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(10,92,54,0.15)] hover:-translate-y-1 transition-all duration-300 p-6">
                <form onSubmit={handleCivicSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-2">Category</label>
                    <select 
                      required 
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      className="w-full bg-[#FDFCF8] border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="">Select Category...</option>
                      <option value="Roads">Potholes / Road Damage</option>
                      <option value="Water Leakage">Pipe Burst / Water Leakage</option>
                      <option value="Power Grid">Fallen Tree / Power Line</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-2">Landmark</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Nearest Landmark" 
                      value={reportLandmark}
                      onChange={(e) => setReportLandmark(e.target.value)}
                      className="w-full bg-[#FDFCF8] border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="button" className="flex-1 bg-[#FDFCF8] border border-gray-200 text-slate-700 rounded-xl py-3 flex items-center justify-center font-bold text-sm hover:bg-white hover:shadow-sm transition-all">
                      <Camera className="w-4 h-4 mr-2 text-slate-500" /> Photo
                    </button>
                    <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors text-sm shadow-sm">
                      <Send className="w-4 h-4 mr-2" /> Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </section>

          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: Immediate Services (Independent Scroll) — 4 columns */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pl-2 pb-20 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Widget 0: Panchayat-wise Govt Services */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-6 border border-[#0A5C36]/5 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.04)] mb-6"
            >
              <button 
                onClick={() => setIsGovtExpanded(!isGovtExpanded)}
                className="w-full flex items-center justify-between focus:outline-none"
              >
                <div className="flex items-center border-l-4 border-[#0A5C36] pl-3">
                  <h3 className="text-lg font-extrabold text-[#0A5C36]">സർക്കാർ സേവനങ്ങൾ</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transform ${isGovtExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>

              <AnimatePresence>
                {isGovtExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-gray-500 mt-3 mb-4 leading-relaxed">
                      പഞ്ചായത്ത് അടിസ്ഥാനത്തിലുള്ള റേഷൻ കടകൾ, ബാങ്കുകൾ, മാവേലി സ്റ്റോറുകൾ, കൃഷിഭവനുകൾ എന്നിവയുടെ വിവരങ്ങൾ.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Service Category</label>
                        <div className="relative">
                          <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
                            className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                          >
                            <option value="krishi">Krishi Bhavan</option>
                            <option value="ration">Ration Shop</option>
                            <option value="maveli">Maveli Store</option>
                            <option value="bank">Bank</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Panchayat</label>
                        <div className="relative">
                          <select 
                            value={selectedPanchayat} 
                            onChange={(e) => setSelectedPanchayat(e.target.value)}
                            className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                          >
                            {PANCHAYATS.filter(p => p.id !== 'all').map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="pt-2">
                        {(() => {
                          const result = govtInstitutions.find(i => i.category === selectedCategory && i.panchayat === selectedPanchayat);
                          if (result) {
                            return (
                              <div className="mt-1">
                                <p className="font-bold text-[#0A5C36] text-sm mb-1">{result.name}</p>
                                <a href={result.phone} className="w-full flex items-center justify-center gap-2 bg-[#F3F7F4] text-[#0A5C36] font-bold p-3 rounded-lg hover:bg-[#E2EBE5] border border-[#0A5C36]/20 transition-colors mt-3">
                                  📞 വിളിക്കുക (Call)
                                </a>
                              </div>
                            );
                          }
                          return (
                            <button disabled className="w-full bg-gray-100 text-gray-400 font-bold p-3 rounded-lg border border-gray-200 cursor-not-allowed mt-3">
                              വിവരങ്ങൾ ലഭ്യമല്ല (Not Available)
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Widget 1: കാർഷിക വിപണന ശൃംഖല (Marketplace) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[2rem] p-6 border border-[#0A5C36]/5 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.04)] mb-6"
            >
              <button 
                onClick={() => setIsMarketExpanded(!isMarketExpanded)}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-1 group"
              >
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0A5C36] transition-colors">കാർഷിക വിപണന ശൃംഖല</h3>
                <ChevronDown className={`w-5 h-5 text-slate-500 transform ${isMarketExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>
              <p className="text-xs text-slate-500 mb-5">നേരിട്ട് വാങ്ങാനും വിൽക്കാനും</p>

              <AnimatePresence>
                {isMarketExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed mb-6 border border-[#E2EBE5]">
                      കർഷകർക്കും വ്യാപാരികൾക്കും ഇടനിലക്കാരില്ലാതെ നേരിട്ട് വിനിമയം നടത്താനുള്ള സുതാര്യമായ വേദി. നിങ്ങളുടെ വിളകൾ മികച്ച വിലയ്ക്ക് വിൽക്കാനും, ഗുണനിലവാരമുള്ള കാർഷികോൽപ്പന്നങ്ങൾ വാങ്ങാനും ഈ സംവിധാനം ഉപയോഗപ്പെടുത്താം.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Farmer / Merchant Toggle */}
              <div className="flex bg-[#F4F7F5] p-1 rounded-xl w-full mb-5">
                <button
                  type="button"
                  onClick={() => handleKrishiToggle('farmer')}
                  className={`flex-1 font-bold py-2 rounded-lg text-sm transition-all ${
                    krishiRole === 'farmer'
                      ? 'bg-white text-[#0A5C36] shadow-sm'
                      : 'text-slate-500 font-medium hover:text-slate-700'
                  }`}
                >
                  🧑🌾 ഞാൻ ഒരു കർഷകൻ
                </button>
                <button
                  type="button"
                  onClick={() => handleKrishiToggle('merchant')}
                  className={`flex-1 font-bold py-2 rounded-lg text-sm transition-all ${
                    krishiRole === 'merchant'
                      ? 'bg-white text-[#0A5C36] shadow-sm'
                      : 'text-slate-500 font-medium hover:text-slate-700'
                  }`}
                >
                  🧑💼 ഞാൻ ഒരു വ്യാപാരി
                </button>
              </div>

              {/* Marketplace Form */}
              <form onSubmit={handleKrishiSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-2">
                    {krishiRole === 'farmer' ? 'നിങ്ങൾ എന്താണ് വിൽക്കുന്നത്?' : 'നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്?'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={krishiRole === 'farmer' ? 'ഉദാ: 50kg മട്ട നെല്ല്' : 'ഉദാ: 100kg റബ്ബർ ഷീറ്റ്'} 
                    className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#0A5C36] to-[#0d7a48] text-white font-bold rounded-xl px-5 py-3.5 mt-4 hover:shadow-lg hover:shadow-[#0A5C36]/20 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {krishiRole === 'farmer' ? 'വിൽപനയ്ക്കായി ചേർക്കുക' : 'ആവശ്യം ചേർക്കുക'}
                </button>
              </form>
            </motion.div>

            {/* Widget 2: അടിയന്തര സേവനങ്ങൾ (Emergency Services) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[2rem] p-6 border border-[#0A5C36]/5 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.04)] mb-6"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">അടിയന്തര സേവനങ്ങൾ</h3>
              <p className="text-xs text-slate-500 mb-5">അടിയന്തര സഹായത്തിന്</p>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="relative">
                    <select 
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                    >
                      {hospitals.map(h => (
                        <option key={h.id} value={h.phone}>{h.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <a 
                    href={selectedHospital} 
                    className="w-full bg-red-50 text-red-600 font-bold rounded-xl px-5 py-3.5 mt-2 hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"
                  >
                    📞 വിളിക്കുക (Call)
                  </a>
                </div>

                {/* ജീവദായനി (Blood Bank) */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">ജീവദായനി Blood Bank</h4>
                    <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                      District Hospital
                    </div>
                  </div>
                  <a 
                    href="tel:1910" 
                    onClick={() => handleEmergencyCall('blood-bank')}
                    className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 hover:shadow-sm transition-all flex items-center"
                  >
                    <Phone className="w-3 h-3 mr-1.5 fill-current" /> Call
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Widget 3: വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ (Educational Institutions) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[2rem] p-6 border border-[#0A5C36]/5 shadow-[0_8px_30px_-4px_rgba(10,92,54,0.04)] mb-6"
            >
              <button 
                onClick={() => setIsEduExpanded(!isEduExpanded)}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-1 group"
              >
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0A5C36] transition-colors">വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ</h3>
                <ChevronDown className={`w-5 h-5 text-slate-500 transform ${isEduExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>

              <AnimatePresence>
                {isEduExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg mt-3 text-sm leading-relaxed mb-6 border border-[#E2EBE5]">
                      കോങ്ങാട് മണ്ഡലത്തിലെയും സമീപ പ്രദേശങ്ങളിലെയും പ്രധാന കോളേജുകൾ, ഐ.ടി.ഐ, മറ്റ് വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ എന്നിവയുടെ വിവരങ്ങൾ. വിദ്യാർത്ഥികൾക്കും രക്ഷിതാക്കൾക്കും നേരിട്ട് ബന്ധപ്പെടാം.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isEduExpanded && <p className="text-xs text-slate-500 mb-5">വിദ്യാഭ്യാസ വിവരങ്ങൾ</p>}

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="relative">
                    <select 
                      value={selectedEdu}
                      onChange={(e) => setSelectedEdu(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                    >
                      {institutions.map(inst => (
                        <option key={inst.id} value={inst.contact}>{inst.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <a 
                    href={selectedEdu} 
                    className="w-full flex items-center justify-center gap-2 bg-[#F3F7F4] text-[#0A5C36] font-bold p-3 rounded-lg hover:bg-[#E2EBE5] border border-[#0A5C36]/20 transition-colors"
                  >
                    📞 ബന്ധപ്പെടുക (Contact)
                  </a>
                </div>
              </div>
            </motion.div>

          </aside>

        </div>
      </main>
    </div>
  );
}
