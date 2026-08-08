"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Camera, 
  Send, 
  ChevronRight,
  User,
  ChevronDown,
  CloudRain,
  CloudLightning,
  ThermometerSun,
  Bus,
  Calendar,
  Droplet,
  Home as HomeIcon,
  Briefcase,
  Grid,
  UserCircle,
  Menu,
  X,
  Shield,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './components/ThemeProvider';
import { useLanguage } from './components/LanguageProvider';
import KongadMap from './components/KongadMap';
import PollWidget from './components/PollWidget';
import SchemeFinder from './components/SchemeFinder';
import { TharisuNilamRegister, TharisuNilamSeeker } from './components/TharisuNilam';
import { Moon, Sun, Globe, Plus, MessageCircle, AlertTriangle } from 'lucide-react';
import { emitTelemetry } from '@/utils/telemetry';
import { 
  Panchayat, 
  EmergencyService, 
  NewsItem, 
  JobListing, 
  ClassifiedListing,
  UserRole,
  BusTiming,
  LocalEvent,
  BloodDonor
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
  { id: '1', name: 'Government CHC Kongad', type: 'chc', location: 'Kongad Town', phone: '104', panchayatId: 'kongad' },
  { id: '2', name: 'Mercy Clinic 24/7', type: 'clinic', location: 'Near Bus Stand', phone: '9876543210', panchayatId: 'kongad' },
  { id: '3', name: 'Kongad Pharmacy', type: 'pharmacy', location: 'Main Road', phone: '9876543211', panchayatId: 'kongad' },
  { id: '4', name: 'Parali Police Station', type: 'police', location: 'Parali', phone: '100', panchayatId: 'parali' },
  { id: '5', name: 'Kongad Fire Station', type: 'fire', location: 'Kongad', phone: '101', panchayatId: 'kongad' },
  { id: '6', name: 'Mankara Ambulance', type: 'ambulance', location: 'Mankara', phone: '108', panchayatId: 'mankara' },
  { id: '7', name: 'KSEB Mannur', type: 'kseb', location: 'Mannur', phone: '1912', panchayatId: 'mannur' }
];

const NEWS_FEED: NewsItem[] = [
  { id: '1', title: 'രോ​ഗങ്ങളും കീടങ്ങളും നിരവധി: മഴക്കാലത്ത് പയറിൽ ശ്രദ്ധിക്കാൻ', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80', summary: 'ഏതു കാലാവസ്ഥയിലും നല്ല വിളവ് നൽകുമെങ്കിലും കീടങ്ങളും രോഗങ്ങളും...', panchayatId: 'kongad' },
  { id: '2', title: 'തോരൻ വയ്ക്കാൻ ഉത്തമം; പരിചരണം കുറച്ചു മതി', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&w=600&q=80', summary: 'പേരിൽ മാത്രം വഴുതനയോട് സാമ്യമുള്ള വള്ളിച്ചെടിയാണ്...', panchayatId: 'mankara' },
  { id: '3', title: 'കൂർക്ക നടാം: ഗ്രോബാഗിലും നിലത്തും', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop', summary: 'ചൈനീസ് പൊട്ടറ്റോ എന്നറിയപ്പെടുന്ന കൂർക്ക കേരളീയർക്ക്...', panchayatId: 'mannur' },
  { id: '4', title: 'ഓണത്തിന് ജൈവ പച്ചക്കറി; കോങ്ങാട് പഞ്ചായത്തിൽ വിതരണം തുടങ്ങി', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80', summary: 'ഓണത്തിന് വിഷരഹിത പച്ചക്കറി എന്ന ലക്ഷ്യത്തോടെ...', panchayatId: 'kongad' },
  { id: '5', title: 'തക്കാളി കൃഷിയിൽ നൂറുമേനി വിളവ്; കർഷകർക്ക് ആശ്വാസം', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?auto=format&fit=crop&w=600&q=80', summary: 'കാലാവസ്ഥ അനുകൂലമായതോടെ തക്കാളി കൃഷിയിൽ വൻ മുന്നേറ്റം...', panchayatId: 'keralassery' },
  { id: '6', title: 'കീടനാശിനി പ്രയോഗം കുറയ്ക്കാം; ജൈവവളം ഉപയോഗിക്കാം', category: 'കാർഷിക അറിവുകൾ', thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop', summary: 'രാസകീടനാശിനികൾക്ക് പകരം ജൈവവളങ്ങൾ ഉപയോഗിക്കുന്നതിന്റെ ഗുണങ്ങൾ...', panchayatId: 'parali' }
];

const JOBS: JobListing[] = [
  { id: '1', title: 'Farm Supervisor', employer: 'Green Valley Farms', location: 'Keralassery', isBoosted: true, panchayatId: 'keralassery' },
  { id: '2', title: 'Retail Assistant', employer: 'Kongad Supermarket', location: 'Kongad Town', isBoosted: false, panchayatId: 'kongad' },
  { id: '3', title: 'Delivery Executive', employer: 'Nelmani Fresh', location: 'Parali', isBoosted: false, panchayatId: 'parali' }
];

const CLASSIFIEDS: ClassifiedListing[] = [
  { id: '1', item: 'Used Tractor', price: '₹2.5 Lakhs', seller: 'Ramanan', location: 'Parali', isBoosted: true, panchayatId: 'parali' },
  { id: '2', item: 'Organic Compost', price: '₹500', seller: 'Haritha Sangam', location: 'Mannur', isBoosted: false, panchayatId: 'mannur' },
  { id: '3', item: 'Milking Cow', price: '₹45,000', seller: 'Suresh', location: 'Mankara', isBoosted: false, panchayatId: 'mankara' }
];

const BUS_TIMINGS: BusTiming[] = [
  { id: '1', route: 'Palakkad - Cherpulassery', time: '08:30 AM', type: 'ksrtc', status: 'on-time', panchayatId: 'kongad' },
  { id: '2', route: 'Kongad - Ottapalam', time: '09:15 AM', type: 'private', status: 'delayed', panchayatId: 'kongad' },
  { id: '3', route: 'Palakkad - Kozhikode', time: '10:00 AM', type: 'ksrtc', status: 'on-time', panchayatId: 'mannur' },
];

const LOCAL_EVENTS: LocalEvent[] = [
  { id: '1', title: 'കോങ്ങാട് പൂരം 2026', date: 'March 15, 2026', location: 'Thirumandhamkunnu Temple', category: 'festival', thumbnailUrl: 'https://images.unsplash.com/photo-1601004812833-28f44d18faee?auto=format&fit=crop&w=600&q=80', panchayatId: 'kongad' },
  { id: '2', title: 'പഞ്ചായത്ത് ഗ്രാമസഭ', date: 'April 02, 2026', location: 'Kongad Panchayat Hall', category: 'meeting', panchayatId: 'kongad' },
  { id: '3', title: 'സെവൻസ് ഫുട്ബോൾ ടൂർണമെന്റ്', date: 'April 10, 2026', location: 'Keralassery Ground', category: 'sports', panchayatId: 'keralassery' },
  { id: '4', title: 'കാർഷിക സെമിനാർ', date: 'April 15, 2026', location: 'Mannur Krishi Bhavan', category: 'culture', panchayatId: 'mannur' },
  { id: '5', title: 'സൗജന്യ നേത്ര പരിശോധന', date: 'May 01, 2026', location: 'Mankara PHC', category: 'meeting', panchayatId: 'mankara' }
];

const BLOOD_DONORS: BloodDonor[] = [
  { id: '1', name: 'Rahul K', bloodGroup: 'O+', panchayat: 'Kongad', phone: '9876543210', panchayatId: 'kongad' },
  { id: '2', name: 'Sajith P', bloodGroup: 'A-', panchayat: 'Parali', phone: '9876543211', panchayatId: 'parali' },
  { id: '3', name: 'Akhil Das', bloodGroup: 'B+', panchayat: 'Mankara', phone: '9876543212', panchayatId: 'mankara' }
];

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0f1a14] dark:border-green-900/50 border-y border-gray-200 px-4 py-3 mb-6">
    <div className="flex items-center">
      <div className="w-1.5 h-6 bg-primary mr-3" />
      <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">{title}</h2>
    </div>
    <a href="#" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">View All</a>
  </div>
);

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [activePanchayat, setActivePanchayat] = useState<string>('all');
  const [krishiRole, setKrishiRole] = useState<UserRole>('farmer');
  const [isKrishiExpanded, setIsKrishiExpanded] = useState(true);
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
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  const [isEmergencyExpanded, setIsEmergencyExpanded] = useState(false);
  const [isBusExpanded, setIsBusExpanded] = useState(true);
  const [isEventsExpanded, setIsEventsExpanded] = useState(false);
  const [isBloodExpanded, setIsBloodExpanded] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('O+');
  const [busFrom, setBusFrom] = useState<string>('Kongad');
  const [busTo, setBusTo] = useState<string>('Palakkad');
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Filtering Logic
  const filteredNews = React.useMemo(() => {
    return activePanchayat === 'all' ? NEWS_FEED : NEWS_FEED.filter(item => item.panchayatId === activePanchayat);
  }, [activePanchayat]);

  const filteredEvents = React.useMemo(() => {
    return activePanchayat === 'all' ? LOCAL_EVENTS : LOCAL_EVENTS.filter(item => item.panchayatId === activePanchayat);
  }, [activePanchayat]);

  const filteredJobs = React.useMemo(() => {
    return activePanchayat === 'all' ? JOBS : JOBS.filter(item => item.panchayatId === activePanchayat);
  }, [activePanchayat]);

  const filteredClassifieds = React.useMemo(() => {
    return activePanchayat === 'all' ? CLASSIFIEDS : CLASSIFIEDS.filter(item => item.panchayatId === activePanchayat);
  }, [activePanchayat]);

  const filteredBloodDonors = React.useMemo(() => {
    return activePanchayat === 'all' ? BLOOD_DONORS : BLOOD_DONORS.filter(item => item.panchayatId === activePanchayat);
  }, [activePanchayat]);

  const filteredEmergencyServices = React.useMemo(() => {
    return activePanchayat === 'all' ? EMERGENCY_SERVICES : EMERGENCY_SERVICES.filter(item => item.panchayatId === activePanchayat || !item.panchayatId);
  }, [activePanchayat]);

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
    <div className="relative min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-24">



      {/* Ambient Fixed Background Layer with State Emblem Watermark */}
      <div className="fixed inset-0 z-[-1] bg-[#F4F7F5] dark:bg-[#0a1510] overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        {/* Government of Kerala Emblem Watermark */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Seal_of_Kerala.svg" 
          alt="Government of Kerala Watermark" 
          className="w-[80vw] md:w-[50vw] max-w-[600px] opacity-[0.03] pointer-events-none grayscale"
        />
      </div>
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-[#1a7a3a] via-[#15663a] to-[#0d4a28]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/dam.png"
            alt="Kanjirapuzha Dam in Kongad"
            className="w-full h-full object-cover opacity-20"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a7a3a]/90 via-[#15663a]/70 to-transparent" />
        </div>

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Text Content */}
            <div className="text-white">
              {/* Theme & Language Controls */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-full transition-all text-xs font-bold"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light' : 'Dark'}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-full transition-all text-xs font-bold"
                  aria-label="Toggle language"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'ml' ? 'EN' : 'മല'}
                </button>
              </div>

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
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {t('heroTitle')}
              </motion.h1>
              
              <motion.p
                className="text-sm lg:text-base text-green-200/90 font-bold tracking-widest uppercase mb-5 max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {t('heroSubtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="mt-3 text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed mb-8">{t('heroDescription')}</p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a 
                  href="#mla-contact" 
                  className="bg-accent text-white px-7 py-3 rounded-full font-bold hover:bg-accent-light transition-all flex items-center gap-2 w-fit shadow-lg shadow-accent/30 hover:shadow-xl hover:-translate-y-0.5 text-base"
                >
                  {t('heroButton1')}
                </a>
                <a 
                  href="#krishi-hub" 
                  className="border-2 border-white/30 text-white px-7 py-3 rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm text-base"
                >
                  {t('heroButton2')}
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

            {/* Hero Visual - Tech Scanner Element */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative mx-auto w-[280px] h-[340px]">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-green-400/20 rounded-3xl blur-3xl scale-110" />

                {/* Main image container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/50 group">
                  <img
                    src="/mla-thulasi.jpg"
                    alt="K. Santhakumari - MLA Kongad"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle dark gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-transparent" />

                  {/* Corner Brackets */}
                  <div className="absolute top-5 left-5 w-6 h-6 border-t-[3px] border-l-[3px] border-white/60" />
                  <div className="absolute top-5 right-5 w-6 h-6 border-t-[3px] border-r-[3px] border-white/60" />
                  <div className="absolute bottom-5 left-5 w-6 h-6 border-b-[3px] border-l-[3px] border-white/60" />
                  <div className="absolute bottom-5 right-5 w-6 h-6 border-b-[3px] border-r-[3px] border-white/60" />

                  {/* Scanning Line Animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] z-10"
                    animate={{ top: ["15%", "85%", "15%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Bottom Info */}
                  <div className="absolute bottom-8 left-0 w-full text-center px-4 drop-shadow-lg">
                     <p className="text-white text-[10px] opacity-90 uppercase tracking-widest font-bold mb-1">MLA Kongad, Hon. Minister</p>
                     <p className="text-white text-sm font-extrabold tracking-wide uppercase">K A Thulasi Teacher</p>
                  </div>
                </div>
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
          <span className="text-xs tracking-widest uppercase">{t('scroll')}</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* 2. ASYMMETRICAL 12-COLUMN STICKY DESKTOP GRID */}
      <main className="w-full min-h-screen py-12">

        {/* Interactive Constituency Map */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mb-6">
          <KongadMap activePanchayat={activePanchayat} onPanchayatClick={handlePanchayatClick} />
        </div>


        {/* Master 12-Column Grid */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-140px)]">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: Information Feed (Scrollable) — 8 columns       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col gap-10 lg:h-full lg:overflow-y-auto lg:pr-4 pb-20 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Nelmani Fresh Ad - will be added back when image asset is ready */}

            {/* Section 1: കാർഷിക ഇടം (Krishi Hub — Market Rates) */}
            <section id="krishi-hub" className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 shadow-sm border border-slate-200 flex flex-col">
              <div className="bg-gradient-to-r from-primary to-primary-light p-5 md:p-6 rounded-t-2xl">
                <button 
                  onClick={() => setIsKrishiExpanded(!isKrishiExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">🌾 കാർഷിക ഇടം</h2>
                  <ChevronDown className={`w-5 h-5 text-white/70 transform ${isKrishiExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-5">

                {isKrishiExpanded && (
                  <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg text-sm leading-relaxed border border-[#E2EBE5] mb-2">
                    കോങ്ങാടിന്റെ കാർഷിക ഹൃദയത്തിലേക്ക് സ്വാഗതം. കർഷകർക്ക് ആവശ്യമായ ദൈനംദിന വിപണി വിലകൾ, കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ, മറ്റ് കാർഷിക വിവരങ്ങൾ എന്നിവ ഇവിടെ ഒറ്റനോട്ടത്തിൽ ലഭ്യമാണ്. ഇടനിലക്കാരില്ലാതെ കർഷകർക്കും വ്യാപാരികൾക്കും നേരിട്ട് വിനിമയം നടത്താനുള്ള സുതാര്യമായ വേദി കൂടിയാണിത്.
                  </div>
                )}
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {marketItems.map((item) => (
                  <motion.div variants={staggerItem} key={item.id} className={`bg-slate-50 rounded-xl p-5 border-l-4 ${item.trend === 'up' ? 'border-green-500' : item.trend === 'down' ? 'border-red-400' : 'border-slate-300'} shadow-sm flex flex-col justify-center min-h-[90px] hover:shadow-md transition-shadow`}>
                    <span className="text-base font-bold text-gray-800">{item.name}</span>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-accent">{item.price}</span>
                        <span className="text-sm text-gray-500">{item.unit}</span>
                      </div>
                      {item.trend === 'up' && <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">▲ ഉയർച്ച</span>}
                      {item.trend === 'down' && <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">▼ ഇറക്കം</span>}
                      {item.trend === 'neutral' && <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">— സ്ഥിരം</span>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              </div>
            </section>

            {/* Section 2: കാർഷിക അറിവുകൾ (Agri-Tips) */}
            <section className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 shadow-sm border border-slate-200 flex flex-col">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-5 md:p-6 rounded-t-2xl">
                <button 
                  onClick={() => setIsTipsExpanded(!isTipsExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">🌱 കാർഷിക അറിവുകൾ</h2>
                  <ChevronDown className={`w-5 h-5 text-white/70 transform ${isTipsExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-5">

                {isTipsExpanded && (
                  <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg text-sm leading-relaxed border border-[#E2EBE5] mb-2">
                    പുതിയ കാർഷിക രീതികൾ, വിളപരിപാലനം, ജൈവവള പ്രയോഗം എന്നിവയെക്കുറിച്ചുള്ള വിദഗ്ധ ലേഖനങ്ങൾ. മികച്ച വിളവിനും ലാഭത്തിനും ഈ അറിവുകൾ പ്രയോജനപ്പെടുത്താം.
                  </div>
                )}
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col"
              >
                {filteredNews.slice(0, 3).map((news, idx) => (
                  <article key={news.id} className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center md:items-start py-6 border-b border-slate-100 last:border-0">
                    <div className="w-full md:w-[60%] flex flex-col gap-3">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">{news.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed line-clamp-2">{news.summary}</p>
                    </div>
                    <div className="w-full md:w-[40%] shrink-0">
                      <img src={news.thumbnailUrl} className="w-full h-48 md:h-32 object-cover rounded-xl shadow-sm" alt="" />
                    </div>
                  </article>
                ))}
              </motion.div>
              </div>
            </section>

            {/* Section: ഉത്സവങ്ങൾ (Local Events Timeline) */}
            <section className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 shadow-sm border border-slate-200 flex flex-col">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-5 md:p-6 rounded-t-2xl">
                <button onClick={() => setIsEventsExpanded(!isEventsExpanded)} className="w-full flex items-center justify-between focus:outline-none">
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">🎪 ഉത്സവങ്ങൾ & പരിപാടികൾ</h2>
                  <ChevronDown className={`w-5 h-5 text-white/70 transform ${isEventsExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-5">
                {isEventsExpanded && (
                  <div className="bg-[#F8F5FF] text-purple-900 p-4 rounded-lg text-sm leading-relaxed border border-purple-100 mb-2">
                    നാട്ടിലെ പ്രധാന ഉത്സവങ്ങൾ, കായിക മത്സരങ്ങൾ, പൊതുയോഗങ്ങൾ എന്നിവയുടെ വിവരങ്ങൾ. 
                  </div>
                )}
              
              <div className="relative pl-6 md:pl-8 border-l-2 border-purple-100 py-4 space-y-8">
                {filteredEvents.map((event, idx) => (
                  <div key={event.id} className="relative">
                    {/* Glowing Node */}
                    <div className="absolute -left-[33px] md:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                    
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-4 p-4 md:p-5">
                      {event.thumbnailUrl && (
                        <div className="w-full md:w-32 h-32 md:h-24 shrink-0 rounded-xl overflow-hidden">
                           <img src={event.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={event.title} />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${event.category === 'festival' ? 'bg-orange-100 text-orange-700' : event.category === 'sports' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {event.category}
                          </span>
                          <span className="text-xs font-bold text-slate-400 flex items-center"><Calendar className="w-3 h-3 mr-1" /> {event.date}</span>
                        </div>
                        <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-slate-100 leading-tight mb-2">{event.title}</h3>
                        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                          <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                   <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No upcoming events found for this location.</p>
                )}
              </div>
              </div>
            </section>

            {/* Section 3: കോങ്ങാട് വാർത്തകൾ (Kongad Vartha / News) */}
            <section className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 shadow-sm border border-slate-200 flex flex-col">
              <div className="bg-gradient-to-r from-accent to-amber-500 p-5 md:p-6 rounded-t-2xl">
                <button 
                  onClick={() => setIsNewsExpanded(!isNewsExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">📰 കോങ്ങാട് വാർത്തകൾ</h2>
                  <ChevronDown className={`w-5 h-5 text-white/70 transform ${isNewsExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-5">

                {isNewsExpanded && (
                  <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg text-sm leading-relaxed border border-[#E2EBE5] mb-2">
                    നമ്മുടെ നാട്ടിലെ പ്രധാന വാർത്തകൾ, പഞ്ചായത്ത് അറിയിപ്പുകൾ, ഉത്സവ വിശേഷങ്ങൾ എന്നിവ അറിയാൻ ഈ ഇടം ഉപയോഗിക്കുക. കോങ്ങാടിന്റെ സ്പന്ദനങ്ങൾ ഇനി നിങ്ങളുടെ വിരൽത്തുമ്പിൽ.
                  </div>
                )}
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col"
              >
                {/* Local Jobs as news-style list */}
                {filteredJobs.map((job) => (
                  <article key={`job-${job.id}`} className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center md:items-start py-6 border-b border-slate-100 last:border-0">
                    <div className="w-full flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">{job.title}</h3>
                        {job.isBoosted && <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider shrink-0 mt-1">Urgent</span>}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">{job.employer}</p>
                      <div className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin className="w-4 h-4 mr-1" /> {job.location}
                      </div>
                    </div>
                  </article>
                ))}
                {/* Classifieds as news-style list */}
                {filteredClassifieds.map((item) => (
                  <article key={`class-${item.id}`} className="flex flex-col-reverse md:flex-row gap-6 md:gap-8 items-center md:items-start py-6 border-b border-slate-100 last:border-0">
                    <div className="w-full flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight">{item.item}</h3>
                        <span className="text-primary font-bold text-lg shrink-0 mt-1">{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <span>By {item.seller}</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {item.location}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
              </div>
            </section>

            {/* Civic Reporter */}
            <section id="civic-reporter" className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 shadow-sm border border-slate-200 flex flex-col">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-5 md:p-6 rounded-t-2xl">
                <button 
                  onClick={() => setIsCivicExpanded(!isCivicExpanded)}
                  className="w-full flex items-center justify-between focus:outline-none"
                >
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-wide flex items-center gap-2">📢 ജനകീയ റിപ്പോർട്ടർ</h2>
                  <ChevronDown className={`w-5 h-5 text-white/70 transform ${isCivicExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
                </button>
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-5">

                {isCivicExpanded && (
                  <div className="bg-[#F3F7F4] text-[#2D4A36] p-4 rounded-lg text-sm leading-relaxed border border-[#E2EBE5] mb-2">
                    നമ്മുടെ നാടിന്റെ അടിസ്ഥാന സൗകര്യങ്ങളിലെ പ്രശ്നങ്ങൾ, റോഡ് അറ്റകുറ്റപ്പണികൾ, കുടിവെള്ള പ്രശ്നങ്ങൾ എന്നിവ നേരിട്ട് ജനപ്രതിനിധികളെ അറിയിക്കാനുള്ള ജനകീയ വേദി. ഒരു ഫോട്ടോയിലൂടെ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യാം.
                  </div>
                )}
              <motion.div {...scrollMotionProps} whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 border border-transparent shadow-[0_4px_20px_-4px_rgba(10,92,54,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(10,92,54,0.15)] hover:-translate-y-1 transition-all duration-300 p-6">
                <form onSubmit={handleCivicSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2">Category</label>
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
                    <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2">Landmark</label>
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
                      <Camera className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" /> Photo
                    </button>
                    <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors text-sm shadow-sm">
                      <Send className="w-4 h-4 mr-2" /> Submit
                    </button>
                  </div>
                </form>
              </motion.div>
              </div>
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
              className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-6 border border-slate-200 shadow-sm"
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
                            className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
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
                            className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
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
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-6 border border-slate-200 shadow-sm"
            >
              <button 
                onClick={() => setIsMarketExpanded(!isMarketExpanded)}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-1 group"
              >
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0A5C36] transition-colors">കാർഷിക വിപണന ശൃംഖല</h3>
                <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transform ${isMarketExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">നേരിട്ട് വാങ്ങാനും വിൽക്കാനും</p>

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
              <div className="flex bg-slate-100 p-1.5 rounded-xl w-full mb-5">
                <button
                  type="button"
                  onClick={() => handleKrishiToggle('farmer')}
                  className={`flex-1 font-bold py-2 rounded-lg text-sm transition-all ${
                    krishiRole === 'farmer'
                      ? 'bg-white text-[#0A5C36] shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700'
                  }`}
                >
                  ഞാൻ ഒരു കർഷകൻ
                </button>
                <button
                  type="button"
                  onClick={() => handleKrishiToggle('merchant')}
                  className={`flex-1 font-bold py-2 rounded-lg text-sm transition-all ${
                    krishiRole === 'merchant'
                      ? 'bg-white text-[#0A5C36] shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700'
                  }`}
                >
                  ഞാൻ ഒരു വ്യാപാരി
                </button>
              </div>

              {/* Marketplace Form */}
              <form onSubmit={handleKrishiSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2">
                    {krishiRole === 'farmer' ? 'നിങ്ങൾ എന്താണ് വിൽക്കുന്നത്?' : 'നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്?'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={krishiRole === 'farmer' ? 'ഉദാ: 50kg മട്ട നെല്ല്' : 'ഉദാ: 100kg റബ്ബർ ഷീറ്റ്'} 
                    className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#0A5C36] to-[#0d7a48] text-white font-bold rounded-xl px-5 py-3.5 mt-4 hover:shadow-lg hover:shadow-[#0A5C36]/20 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {krishiRole === 'farmer' ? 'വിൽപനയ്ക്കായി ചേർക്കുക' : 'ആവശ്യം ചേർക്കുക'}
                </button>
              </form>
            </motion.div>

            {/* Widget: യാത്രാ വിവരങ്ങൾ (Bus Timings) */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-6 border border-slate-200 shadow-sm">
              <button onClick={() => setIsBusExpanded(!isBusExpanded)} className="w-full flex items-center justify-between focus:outline-none mb-4 group">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Bus className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">യാത്രാ വിവരങ്ങൾ</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transform ${isBusExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>
              
              <AnimatePresence>
                {isBusExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 pl-1 mb-1 block">From</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-sm font-semibold text-slate-700 outline-none focus:border-orange-300" value={busFrom} onChange={(e)=>setBusFrom(e.target.value)}>
                          <option value="Kongad">Kongad</option>
                          <option value="Palakkad">Palakkad</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 pl-1 mb-1 block">To</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-sm font-semibold text-slate-700 outline-none focus:border-orange-300" value={busTo} onChange={(e)=>setBusTo(e.target.value)}>
                          <option value="Palakkad">Palakkad</option>
                          <option value="Ottapalam">Ottapalam</option>
                          <option value="Cherpulassery">Cherpulassery</option>
                          <option value="Kozhikode">Kozhikode</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-3">
                {BUS_TIMINGS.map(bus => (
                  <div key={bus.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors bg-white">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{bus.time}</span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{bus.route}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${bus.type === 'ksrtc' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {bus.type}
                      </span>
                      <span className={`text-[10px] font-bold mt-1 ${bus.status === 'on-time' ? 'text-green-600' : 'text-amber-500'}`}>
                        {bus.status === 'on-time' ? 'On Time' : 'Delayed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Widget: രക്തദാന സേന (Blood Donor Network) */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.45 }} className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-6 border border-slate-200 shadow-sm">
              <button onClick={() => setIsBloodExpanded(!isBloodExpanded)} className="w-full flex items-center justify-between focus:outline-none mb-4 group">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Droplet className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">രക്തദാന സേന</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transform ${isBloodExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
              </button>

              <AnimatePresence>
                {isBloodExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">അടിയന്തര സാഹചര്യങ്ങളിൽ രക്തം ആവശ്യമുള്ളവർക്ക് ഈ ലിസ്റ്റ് ഉപയോഗിക്കാവുന്നതാണ്.</p>
                    <div className="flex gap-2 mb-4">
                      <select className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-100" value={selectedBloodGroup} onChange={(e)=>setSelectedBloodGroup(e.target.value)}>
                        <option value="O+">O+ Positive</option>
                        <option value="A+">A+ Positive</option>
                        <option value="B+">B+ Positive</option>
                        <option value="AB+">AB+ Positive</option>
                        <option value="O-">O- Negative</option>
                        <option value="A-">A- Negative</option>
                      </select>
                      <select className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 outline-none focus:border-red-200 focus:ring-2 focus:ring-red-100">
                        <option value="All">All Areas</option>
                        <option value="Kongad">Kongad</option>
                        <option value="Parali">Parali</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                {filteredBloodDonors.map(donor => (
                  <div key={donor.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-red-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-black text-red-600 text-sm">
                        {donor.bloodGroup}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{donor.name}</span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center mt-0.5"><MapPin className="w-3 h-3 mr-0.5" /> {donor.panchayat}</span>
                      </div>
                    </div>
                    <a href={`tel:${donor.phone}`} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors text-slate-400">
                      <Phone className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Widget 3: വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ (Educational Institutions) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-6 border border-slate-200 shadow-sm"
            >
              <button 
                onClick={() => setIsEduExpanded(!isEduExpanded)}
                className="w-full flex items-center justify-between text-left focus:outline-none mb-1 group"
              >
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0A5C36] transition-colors">വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ</h3>
                <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transform ${isEduExpanded ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`} />
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

              {!isEduExpanded && <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">വിദ്യാഭ്യാസ വിവരങ്ങൾ</p>}

              <div className="space-y-3">
                <div className="bg-white rounded-2xl dark:bg-[#1a2b22] dark:border-green-800/50 p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                  <div className="relative">
                    <select 
                      value={selectedEdu}
                      onChange={(e) => setSelectedEdu(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-slate-200 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-[#0A5C36]/20 focus:border-[#0A5C36]/50 block p-3.5 appearance-none transition-all"
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

            {/* ─── THARISU NILAM REGISTRATION ─── */}
            <TharisuNilamRegister />

            {/* ─── THARISU NILAM AAVASYAMUNDU ─── */}
            <TharisuNilamSeeker />

          </aside>

        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DEVELOPMENT DASHBOARD — വികസന ഡാഷ്‌ബോർഡ് */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">വികസന ഡാഷ്‌ബോർഡ്</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Constituency Development Tracker</p>
                </div>
              </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'മൊത്തം പദ്ധതികൾ', labelEn: 'Total Projects', value: '24', icon: '📋', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-950/40' },
                { label: 'പൂർത്തിയായവ', labelEn: 'Completed', value: '14', icon: '✅', color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                { label: 'നടന്നുകൊണ്ടിരിക്കുന്നവ', labelEn: 'In Progress', value: '8', icon: '🔄', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-950/40' },
                { label: 'മൊത്തം ബജറ്റ്', labelEn: 'Total Budget', value: '₹48.5 Cr', icon: '💰', color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-950/40' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.labelEn}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-4 md:p-5 border border-slate-200/60 dark:border-green-900/30`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-sm shadow-sm`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">{stat.value}</div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500">{stat.labelEn}</div>
                </motion.div>
              ))}
            </div>

            {/* Project Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Project 1 — Road */}
              {[
                {
                  name: 'കോങ്ങാട്-മങ്കര റോഡ് വികസനം',
                  nameEn: 'Kongad-Mankara Road Development',
                  category: '🛤️ Road',
                  categoryColor: 'bg-slate-600',
                  panchayat: 'Kongad, Mankara',
                  budget: '₹8.2 Cr',
                  spent: '₹6.5 Cr',
                  progress: 79,
                  status: 'progress' as const,
                  statusLabel: 'നിർമ്മാണം നടക്കുന്നു',
                  startDate: 'Jan 2025',
                  expectedEnd: 'Dec 2026',
                  description: '12 km റോഡ് വീതി കൂട്ടലും ടാറിംഗും. ഡ്രെയിനേജ് നിർമ്മാണം ഉൾപ്പെടെ.',
                },
                {
                  name: 'കേരളശ്ശേരി ജി.എച്ച്.എസ് നവീകരണം',
                  nameEn: 'Keralassery GHS Renovation',
                  category: '🏫 School',
                  categoryColor: 'bg-blue-600',
                  panchayat: 'Keralassery',
                  budget: '₹3.5 Cr',
                  spent: '₹3.5 Cr',
                  progress: 100,
                  status: 'completed' as const,
                  statusLabel: 'പൂർത്തിയായി',
                  startDate: 'Mar 2024',
                  expectedEnd: 'Feb 2025',
                  description: 'പുതിയ കെട്ടിടം, സ്‌മാർട്ട് ക്ലാസ് റൂം, ലാബ്, ലൈബ്രറി നവീകരണം.',
                },
                {
                  name: 'കഞ്ഞിരപ്പുഴ കുടിവെള്ള പദ്ധതി',
                  nameEn: 'Kanjirapuzha Drinking Water Project',
                  category: '💧 Water',
                  categoryColor: 'bg-cyan-600',
                  panchayat: 'Kanjirapuzha, Karimba',
                  budget: '₹12.8 Cr',
                  spent: '₹8.9 Cr',
                  progress: 62,
                  status: 'progress' as const,
                  statusLabel: 'പൈപ്പ്‌ലൈൻ നിർമ്മാണം',
                  startDate: 'Jun 2025',
                  expectedEnd: 'Mar 2027',
                  description: '2 പഞ്ചായത്തുകളിലെ 15,000 കുടുംബങ്ങൾക്ക് ശുദ്ധജലം. 45 km പൈപ്പ്‌ലൈൻ.',
                },
                {
                  name: 'പറളി PHC ആശുപത്രി നവീകരണം',
                  nameEn: 'Parali PHC Hospital Upgrade',
                  category: '🏥 Health',
                  categoryColor: 'bg-red-500',
                  panchayat: 'Parali',
                  budget: '₹4.2 Cr',
                  spent: '₹4.2 Cr',
                  progress: 100,
                  status: 'completed' as const,
                  statusLabel: 'പൂർത്തിയായി',
                  startDate: 'Aug 2024',
                  expectedEnd: 'Jul 2025',
                  description: 'പുതിയ OP ബ്ലോക്ക്, ലാബ്, ഫാർമസി, 20 കിടക്ക ICU.',
                },
                {
                  name: 'തച്ചമ്പാറ കാർഷിക മാർക്കറ്റ്',
                  nameEn: 'Thachampara Agri Market Complex',
                  category: '🌾 Agriculture',
                  categoryColor: 'bg-green-600',
                  panchayat: 'Thachampara',
                  budget: '₹6.1 Cr',
                  spent: '₹2.4 Cr',
                  progress: 35,
                  status: 'progress' as const,
                  statusLabel: 'അടിസ്ഥാന നിർമ്മാണം',
                  startDate: 'Nov 2025',
                  expectedEnd: 'Jun 2027',
                  description: 'ആധുനിക കാർഷിക വിപണന കേന്ദ്രം. കോൾഡ് സ്റ്റോറേജ്, ഗ്രേഡിങ് യൂണിറ്റ്.',
                },
                {
                  name: 'മണ്ണൂർ-അമ്പലപ്പാറ റോഡ്',
                  nameEn: 'Mannur-Ambalappara Road',
                  category: '🛤️ Road',
                  categoryColor: 'bg-indigo-600',
                  panchayat: 'Mannur, Ambalappara',
                  budget: '₹11.2 Cr',
                  spent: '₹0',
                  progress: 0,
                  status: 'upcoming' as const,
                  statusLabel: 'ടെൻഡർ പ്രക്രിയ',
                  startDate: 'Jan 2027',
                  expectedEnd: 'Dec 2028',
                  description: 'മണ്ണൂർ മുതൽ അമ്പലപ്പാറ വരെയുള്ള പ്രധാന റോഡ് വികസനം. 8.5 km നീളം.',
                },
              ].map((project, i) => {
                const statusConfig = {
                  completed: { color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700', barColor: 'bg-gradient-to-r from-emerald-500 to-green-400', dot: '🟢' },
                  progress: { color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700', barColor: 'bg-gradient-to-r from-amber-500 to-orange-400', dot: '🟡' },
                  upcoming: { color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700', barColor: 'bg-gradient-to-r from-blue-500 to-indigo-400', dot: '🔵' },
                };
                const sc = statusConfig[project.status];

                return (
                  <motion.div
                    key={project.nameEn}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5 hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${project.categoryColor}`}>{project.category}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.dot} {project.statusLabel}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{project.name}</h3>
                        <p className="text-[10px] text-primary font-semibold mt-0.5">{project.nameEn}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{project.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${sc.barColor} shadow-sm`}
                        />
                      </div>
                    </div>

                    {/* Budget Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Budget</div>
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100">{project.budget}</div>
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Spent</div>
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100">{project.spent}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-green-900/30">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                        <MapPin className="w-3 h-3" /> {project.panchayat}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {project.startDate} → {project.expectedEnd}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SCHEME & SCHOLARSHIP FINDER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SchemeFinder />


        {/* TOURIST PLACES — EXPLORE KONGAD */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-xl">🏞️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">കോങ്ങാട് ടൂറിസം</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Explore the beauty of Kongad Constituency</p>
                </div>
              </div>
            </div>

            {/* Tourist Place Cards - Horizontal Scroll */}
            <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-4 -mx-2 px-2 snap-x snap-mandatory">
              
              {/* Card 1: Meenvallam */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden border border-slate-200 dark:border-green-800/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1a2b22] group snap-start"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/meenvallam.jpg" alt="Meenvallam Waterfall" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🌊 Waterfall</span>
                    <span className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🥾 Trekking</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">📍 ~30km from Palakkad</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">മീൻവല്ലം വെള്ളച്ചാട്ടം</h3>
                  <p className="text-xs font-semibold text-primary mb-3">Meenvallam Waterfalls</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">തുപ്പനാട് നദിയിൽ നിന്ന് രൂപം കൊണ്ട അഞ്ച് പടികളുള്ള മനോഹരമായ വെള്ളച്ചാട്ടം. പശ്ചിമഘട്ടത്തിന്റെ ഹൃദയഭാഗത്ത് 1.5 km ട്രെക്കിങ്ങിലൂടെ എത്തിച്ചേരാം.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">🌧️ Best: Oct - Mar</span>
                    <a href="https://maps.google.com/?q=Meenvallam+Waterfalls+Palakkad" target="_blank" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                      Navigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Kanjirapuzha Dam */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden border border-slate-200 dark:border-green-800/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1a2b22] group snap-start"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/kanjirapuzha.jpg" alt="Kanjirapuzha Dam" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🏞️ Dam</span>
                    <span className="bg-purple-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">👨‍👩‍👧 Family</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">📍 Kanjirapuzha</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">കഞ്ഞിരപ്പുഴ ഡാം</h3>
                  <p className="text-xs font-semibold text-primary mb-3">Kanjirapuzha Dam & Garden</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">വെട്ടിലാചോല നിത്യഹരിത വനത്തിനാൽ ചുറ്റപ്പെട്ട മനോഹരമായ ഡാം. ഡിയർ പാർക്ക്, ബോട്ടിങ്, മ്യൂസിക്കൽ ഫൗണ്ടൻ, കുട്ടികളുടെ പാർക്ക്.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">☀️ All Year</span>
                    <a href="https://maps.google.com/?q=Kanjirapuzha+Dam+Palakkad" target="_blank" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                      Navigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Pamperian Para Temple */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden border border-slate-200 dark:border-green-800/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1a2b22] group snap-start"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/pamperian.jpg" alt="Pamperian Para Temple" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🛕 Temple</span>
                    <span className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🌿 Nature</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">📍 Keralassery</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">പാമ്പേരിയൻ പാറ ക്ഷേത്രം</h3>
                  <p className="text-xs font-semibold text-primary mb-3">Pamperian Para Temple</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">സുബ്രഹ്മണ്യ ഭഗവാനെ പ്രതിഷ്ഠിച്ച പാറമുകളിലെ ക്ഷേത്രം. താഴ്വരയുടെ മനോഹരമായ കാഴ്ച. 10 മിനിറ്റ് ട്രെക്കിങ്.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">🛕 Festival Season</span>
                    <a href="https://maps.google.com/?q=Pamperian+Para+Temple+Keralassery" target="_blank" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                      Navigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Dhoni Hills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden border border-slate-200 dark:border-green-800/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1a2b22] group snap-start"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/dhoni.jpg" alt="Dhoni Hills" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🏔️ Trekking</span>
                    <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🔥 Adventure</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">📍 ~20km from Palakkad</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">ധോണി ഹിൽസ്</h3>
                  <p className="text-xs font-semibold text-primary mb-3">Dhoni Hills & Waterfalls</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">പശ്ചിമഘട്ടത്തിലെ ആവേശകരമായ ട്രെക്കിങ് സ്ഥലം. വെള്ളച്ചാട്ടവും മലനിരകളും. സാഹസികതയെ ഇഷ്ടപ്പെടുന്നവർക്ക് അനുയോജ്യം.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">🌧️ Best: Oct - Feb</span>
                    <a href="https://maps.google.com/?q=Dhoni+Hills+Palakkad" target="_blank" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                      Navigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 5: Palakkad Fort */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden border border-slate-200 dark:border-green-800/50 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1a2b22] group snap-start"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/palakkad-fort.jpg" alt="Palakkad Fort" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">🏛️ Heritage</span>
                    <span className="bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">📸 Sightseeing</span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">📍 Palakkad Town</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1">പാലക്കാട് കോട്ട</h3>
                  <p className="text-xs font-semibold text-primary mb-3">Palakkad Fort (Tipu Sultan Fort)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">ടിപ്പു സുൽത്താന്റെ ചരിത്രപ്രസിദ്ധമായ ഗ്രാനൈറ്റ് കോട്ട. കിടങ്ങും കൊട്ടാരവും. പാലക്കാട് നഗരത്തിന്റെ ഹൃദയഭാഗത്ത്.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">☀️ All Year</span>
                    <a href="https://maps.google.com/?q=Palakkad+Fort" target="_blank" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                      Navigate <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EVENT CALENDAR — ഇവന്റ് കലണ്ടർ */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">വരാനിരിക്കുന്ന ഇവന്റുകൾ</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming Events & Programs</p>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: 'കാർഷിക സെമിനാർ',
                  titleEn: 'Agriculture Seminar',
                  date: '2026 ആഗസ്റ്റ് 5',
                  dateEn: 'Aug 5, 2026',
                  day: '5',
                  month: 'AUG',
                  time: '10:00 AM - 4:00 PM',
                  venue: 'കോങ്ങാട് ടൗൺ ഹാൾ',
                  venueEn: 'Kongad Town Hall',
                  category: '🌾 Agriculture',
                  categoryColor: 'bg-green-500',
                  highlight: true,
                },
                {
                  title: 'സ്‌കൂൾ കലോത്സവം',
                  titleEn: 'School Arts Festival',
                  date: '2026 ആഗസ്റ്റ് 12-14',
                  dateEn: 'Aug 12-14, 2026',
                  day: '12',
                  month: 'AUG',
                  time: '9:00 AM - 6:00 PM',
                  venue: 'കേരളശ്ശേരി GHS',
                  venueEn: 'Keralassery GHS',
                  category: '🎭 Cultural',
                  categoryColor: 'bg-purple-500',
                  highlight: false,
                },
                {
                  title: 'സൗജന്യ ആരോഗ്യ ക്യാമ്പ്',
                  titleEn: 'Free Health Camp',
                  date: '2026 ആഗസ്റ്റ് 18',
                  dateEn: 'Aug 18, 2026',
                  day: '18',
                  month: 'AUG',
                  time: '8:00 AM - 2:00 PM',
                  venue: 'പറളി PHC',
                  venueEn: 'Parali PHC',
                  category: '🏥 Health',
                  categoryColor: 'bg-red-500',
                  highlight: false,
                },
                {
                  title: 'ഓണാഘോഷം',
                  titleEn: 'Onam Celebration',
                  date: '2026 സെപ്റ്റംബർ 5',
                  dateEn: 'Sep 5, 2026',
                  day: '5',
                  month: 'SEP',
                  time: '10:00 AM onwards',
                  venue: 'മണ്ഡല തല ആഘോഷം',
                  venueEn: 'Constituency Level',
                  category: '🎉 Festival',
                  categoryColor: 'bg-amber-500',
                  highlight: true,
                },
                {
                  title: 'തൊഴിൽ മേള',
                  titleEn: 'Job Fair 2026',
                  date: '2026 സെപ്റ്റംബർ 15',
                  dateEn: 'Sep 15, 2026',
                  day: '15',
                  month: 'SEP',
                  time: '9:00 AM - 5:00 PM',
                  venue: 'കോങ്ങാട് ടൗൺ ഹാൾ',
                  venueEn: 'Kongad Town Hall',
                  category: '💼 Career',
                  categoryColor: 'bg-blue-500',
                  highlight: false,
                },
                {
                  title: 'രക്തദാന ക്യാമ്പ്',
                  titleEn: 'Blood Donation Camp',
                  date: '2026 സെപ്റ്റംബർ 22',
                  dateEn: 'Sep 22, 2026',
                  day: '22',
                  month: 'SEP',
                  time: '9:00 AM - 3:00 PM',
                  venue: 'കഞ്ഞിരപ്പുഴ ഗ്രാമ പഞ്ചായത്ത്',
                  venueEn: 'Kanjirapuzha Grama Panchayat',
                  category: '❤️ Social',
                  categoryColor: 'bg-rose-500',
                  highlight: false,
                },
                {
                  title: 'ക്ഷേത്രോത്സവം',
                  titleEn: 'Temple Festival',
                  date: '2026 ഒക്ടോബർ 8-10',
                  dateEn: 'Oct 8-10, 2026',
                  day: '8',
                  month: 'OCT',
                  time: 'All Day',
                  venue: 'പാമ്പേരിയൻ പാറ ക്ഷേത്രം',
                  venueEn: 'Pamperian Para Temple',
                  category: '🛕 Temple',
                  categoryColor: 'bg-orange-500',
                  highlight: true,
                },
                {
                  title: 'വനിതാ ശാക്തീകരണ ക്യാമ്പ്',
                  titleEn: "Women's Empowerment Camp",
                  date: '2026 ഒക്ടോബർ 20',
                  dateEn: 'Oct 20, 2026',
                  day: '20',
                  month: 'OCT',
                  time: '10:00 AM - 4:00 PM',
                  venue: 'തച്ചമ്പാറ കമ്മ്യൂണിറ്റി ഹാൾ',
                  venueEn: 'Thachampara Community Hall',
                  category: '👩 Women',
                  categoryColor: 'bg-pink-500',
                  highlight: false,
                },
              ].map((event, i) => (
                <motion.div
                  key={event.titleEn}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`bg-white dark:bg-[#1a2b22] rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                    event.highlight
                      ? 'border-primary/40 dark:border-primary/30 ring-1 ring-primary/10'
                      : 'border-slate-200 dark:border-green-800/50'
                  }`}
                >
                  {/* Date Strip */}
                  <div className={`${event.highlight ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-slate-100 dark:bg-slate-800/70'} px-5 py-3 flex items-center gap-4`}>
                    <div className="text-center">
                      <div className={`text-2xl font-black leading-none ${event.highlight ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{event.day}</div>
                      <div className={`text-[10px] font-extrabold tracking-widest ${event.highlight ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>{event.month}</div>
                    </div>
                    <div className="h-8 w-px bg-white/20 dark:bg-slate-600" />
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-extrabold leading-snug truncate ${event.highlight ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{event.title}</h3>
                      <p className={`text-[10px] font-medium truncate ${event.highlight ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{event.titleEn}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2.5">
                    <span className={`text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full ${event.categoryColor}`}>{event.category}</span>
                    
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-sm">🕐</span>
                      <span className="font-semibold">{event.time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{event.venue}</span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500">{event.venueEn}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PHOTO GALLERY — ഫോട്ടോ ഗാലറി */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">ഫോട്ടോ ഗാലറി</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Moments from Kongad Constituency</p>
                </div>
              </div>
            </div>

            {/* 
              PHOTO GALLERY - PLACEHOLDER IMAGES
              ====================================
              Replace the src paths below with your real images.
              Just drop images into /public/gallery/ folder and update the paths.
              
              Recommended image sizes:
              - Landscape: 800x450px or 1200x675px
              - Portrait: 450x600px or 675x900px
              - Square: 600x600px
            */}

            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[
                { src: '/gallery/event-1.jpg', caption: 'ഓണാഘോഷം 2025', captionEn: 'Onam Celebration 2025', category: '🎉 Festival', aspect: 'aspect-[4/3]' },
                { src: '/gallery/nature-1.jpg', caption: 'കോങ്ങാട് നെൽപ്പാടങ്ങൾ', captionEn: 'Kongad Paddy Fields', category: '🌿 Nature', aspect: 'aspect-[3/4]' },
                { src: '/gallery/event-2.jpg', caption: 'സ്‌കൂൾ ഉദ്ഘാടനം', captionEn: 'School Inauguration', category: '🏫 Development', aspect: 'aspect-[16/9]' },
                { src: '/gallery/festival-1.jpg', caption: 'ക്ഷേത്രോത്സവം', captionEn: 'Temple Festival', category: '🛕 Temple', aspect: 'aspect-[3/4]' },
                { src: '/gallery/nature-2.jpg', caption: 'മീൻവല്ലം ട്രെക്കിങ്', captionEn: 'Meenvallam Trekking', category: '🏞️ Tourism', aspect: 'aspect-[4/3]' },
                { src: '/gallery/event-3.jpg', caption: 'റോഡ് ഉദ്ഘാടനം', captionEn: 'Road Inauguration', category: '🛤️ Development', aspect: 'aspect-[16/9]' },
                { src: '/gallery/mla-1.jpg', caption: 'ജനസമ്പർക്ക പരിപാടി', captionEn: 'Public Outreach Program', category: '👥 Program', aspect: 'aspect-[4/3]' },
                { src: '/gallery/nature-3.jpg', caption: 'കഞ്ഞിരപ്പുഴ സൂര്യാസ്തമയം', captionEn: 'Kanjirapuzha Sunset', category: '🌅 Nature', aspect: 'aspect-[16/9]' },
                { src: '/gallery/event-4.jpg', caption: 'ആരോഗ്യ ക്യാമ്പ്', captionEn: 'Health Camp', category: '🏥 Health', aspect: 'aspect-[4/3]' },
                { src: '/gallery/event-5.jpg', caption: 'കാർഷിക സെമിനാർ', captionEn: 'Agri Seminar', category: '🌾 Agriculture', aspect: 'aspect-[3/4]' },
                { src: '/gallery/sports-1.jpg', caption: 'കോങ്ങാട് സ്‌പോർട്‌സ് മീറ്റ്', captionEn: 'Kongad Sports Meet', category: '⚽ Sports', aspect: 'aspect-[16/9]' },
                { src: '/gallery/event-6.jpg', caption: 'രക്തദാന ക്യാമ്പ്', captionEn: 'Blood Donation Camp', category: '❤️ Social', aspect: 'aspect-[4/3]' },
              ].map((photo, i) => (
                <motion.div
                  key={photo.captionEn}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden border border-slate-200 dark:border-green-800/50 bg-white dark:bg-[#1a2b22] group cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className={`relative ${photo.aspect} overflow-hidden bg-slate-100 dark:bg-slate-800`}>
                    {/* Replace with real images — placeholder shows gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Upload Image</span>
                      </div>
                    </div>
                    {/* Uncomment below and remove the placeholder div above once you add real images: */}
                    {/* <img src={photo.src} alt={photo.captionEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className={`text-[9px] font-bold text-white/90 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm`}>{photo.category}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{photo.caption}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{photo.captionEn}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upload Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                📸 ഫോട്ടോകൾ ചേർക്കാൻ: <span className="font-semibold text-primary">/public/gallery/</span> ഫോൾഡറിൽ ഇമേജുകൾ ചേർക്കുക
              </p>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PUBLIC POLL WIDGET */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <PollWidget />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TESTIMONIALS — ജനങ്ങളുടെ അഭിപ്രായങ്ങൾ */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-12 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">ജനങ്ങളുടെ അഭിപ്രായങ്ങൾ</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">What Citizens Say About Kongad Connect</p>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: 'രാജേഷ് കുമാർ',
                  nameEn: 'Rajesh Kumar',
                  panchayat: 'Kongad',
                  role: 'കർഷകൻ',
                  roleEn: 'Farmer',
                  avatar: '👨‍🌾',
                  avatarBg: 'from-green-500 to-emerald-600',
                  stars: 5,
                  quote: 'കാർഷിക വിപണന ശൃംഖല വഴി ഞങ്ങളുടെ ഉൽപ്പന്നങ്ങൾക്ക് നല്ല വില ലഭിക്കുന്നു. ഇടനിലക്കാരെ ഒഴിവാക്കി നേരിട്ട് വിൽക്കാൻ കഴിയുന്നത് വലിയ മാറ്റമാണ്.',
                  quoteEn: 'The agricultural market chain helps us get fair prices. Cutting out middlemen has been a game changer.',
                  date: 'Jul 2026',
                },
                {
                  name: 'ലക്ഷ്മി ദേവി',
                  nameEn: 'Lakshmi Devi',
                  panchayat: 'Keralassery',
                  role: 'വിദ്യാർത്ഥി രക്ഷകർത്താവ്',
                  roleEn: 'Parent',
                  avatar: '👩',
                  avatarBg: 'from-pink-500 to-rose-600',
                  stars: 5,
                  quote: 'കേരളശ്ശേരി സ്‌കൂൾ നവീകരണം എന്റെ മക്കളുടെ പഠനാന്തരീക്ഷം പൂർണ്ണമായും മാറ്റി. സ്‌മാർട്ട് ക്ലാസ് റൂമുകൾ അവർക്ക് ഏറെ ഇഷ്ടമാണ്.',
                  quoteEn: 'The school renovation completely transformed my children\'s learning environment. They love the smart classrooms.',
                  date: 'Jun 2026',
                },
                {
                  name: 'മുഹമ്മദ് ഫൈസൽ',
                  nameEn: 'Muhammad Faisal',
                  panchayat: 'Mankara',
                  role: 'ചെറുകിട വ്യാപാരി',
                  roleEn: 'Small Business Owner',
                  avatar: '👨‍💼',
                  avatarBg: 'from-blue-500 to-indigo-600',
                  stars: 4,
                  quote: 'റോഡ് വികസന പദ്ധതി ഞങ്ങളുടെ പ്രദേശത്തിന്റെ ഗതാഗതം വളരെ മെച്ചപ്പെടുത്തി. ഇപ്പോൾ ഉപഭോക്താക്കൾ എളുപ്പത്തിൽ ഞങ്ങളുടെ കടയിൽ എത്തുന്നു.',
                  quoteEn: 'The road development project greatly improved transportation. Customers now reach our shop easily.',
                  date: 'May 2026',
                },
                {
                  name: 'സരിത എസ്. നായർ',
                  nameEn: 'Saritha S. Nair',
                  panchayat: 'Parali',
                  role: 'ആരോഗ്യ പ്രവർത്തക',
                  roleEn: 'Health Worker',
                  avatar: '👩‍⚕️',
                  avatarBg: 'from-red-500 to-rose-600',
                  stars: 5,
                  quote: 'പറളി PHC നവീകരണം ഗ്രാമീണ ആരോഗ്യ സേവനങ്ങൾ പൂർണ്ണമായും ഉയർത്തി. ICU സൗകര്യം ഇപ്പോൾ ഇവിടെ തന്നെ ലഭ്യമാണ്. ജീവൻ രക്ഷിക്കുന്ന മാറ്റം!',
                  quoteEn: 'The PHC renovation elevated rural healthcare completely. ICU facility is now available locally. A life-saving change!',
                  date: 'Apr 2026',
                },
                {
                  name: 'വിനോദ് ചന്ദ്രൻ',
                  nameEn: 'Vinod Chandran',
                  panchayat: 'Kanjirapuzha',
                  role: 'യുവജന പ്രവർത്തകൻ',
                  roleEn: 'Youth Activist',
                  avatar: '👨',
                  avatarBg: 'from-violet-500 to-purple-600',
                  stars: 5,
                  quote: 'ഈ പോർട്ടൽ മണ്ഡലത്തിലെ എല്ലാ വിവരങ്ങളും ഒരു സ്ഥലത്ത് ലഭ്യമാക്കുന്നു. എമർജൻസി നമ്പറുകൾ മുതൽ ബസ് ടൈമിംഗ് വരെ — ഒറ്റ ക്ലിക്കിൽ!',
                  quoteEn: 'This portal makes all constituency info available in one place. From emergency numbers to bus timings — one click!',
                  date: 'Jul 2026',
                },
                {
                  name: 'മീന ടീച്ചർ',
                  nameEn: 'Meena Teacher',
                  panchayat: 'Thachampara',
                  role: 'അധ്യാപിക',
                  roleEn: 'Teacher',
                  avatar: '👩‍🏫',
                  avatarBg: 'from-teal-500 to-cyan-600',
                  stars: 5,
                  quote: 'വികസന ഡാഷ്‌ബോർഡ് ഞങ്ങളുടെ മണ്ഡലത്തിൽ നടക്കുന്ന പദ്ധതികൾ സുതാര്യമായി കാണിക്കുന്നു. ഇത് ജനാധിപത്യത്തിന്റെ ഭംഗിയാണ്.',
                  quoteEn: 'The development dashboard shows projects transparently. This is the beauty of democracy.',
                  date: 'Jun 2026',
                },
              ].map((t, i) => (
                <motion.div
                  key={t.nameEn}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Quote Mark Background */}
                  <div className="absolute -top-2 -right-2 text-8xl font-serif text-slate-100 dark:text-slate-800/50 leading-none select-none pointer-events-none group-hover:text-primary/10 transition-colors">"</div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className={`text-sm ${s < t.stars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}>★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-5 relative z-10 min-h-[80px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mb-4 relative z-10">
                    &ldquo;{t.quoteEn}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-green-900/30 relative z-10">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-lg shadow-sm`}>
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.role} • {t.roleEn}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.panchayat}</span>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">{t.date}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </main>
      {/* PREMIUM FOOTER */}
      <footer id="mla-contact" className="bg-slate-900 text-white py-12 mt-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-extrabold">കോങ്ങാട്</span>
                  <span className="text-lg font-extrabold text-green-400"> Connect</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">കോങ്ങാട് നിയമസഭാ മണ്ഡലത്തിന്റെ ഔദ്യോഗിക ഡിജിറ്റൽ പ്ലാറ്റ്ഫോം. കൃഷി, വിനോദസഞ്ചാരം, പൊതുസേവനങ്ങൾ എന്നിവ ഒറ്റ വേദിയിൽ.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">പ്രധാന ലിങ്കുകൾ</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#krishi-hub" className="hover:text-green-400 transition-colors">കാർഷിക ഇടം</a></li>
                <li><a href="#mla-contact" className="hover:text-green-400 transition-colors">MLA Connect</a></li>
                <li><a href="#civic-reporter" className="hover:text-green-400 transition-colors">ജനകീയ റിപ്പോർട്ടർ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-4">ബന്ധപ്പെടുക</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>MLA Office, Kongad</li>
                <li>Palakkad District, Kerala</li>
                <li className="text-green-400 font-semibold">അടിയന്തരം: 108</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">© 2026 Kongad Connect. Built with ❤️ for കോങ്ങാട്</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Powered by Nelmani Digital</p>
          </div>
        </div>
      </footer>

      {/* Quick Action FAB Menu */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[60] flex flex-col items-end">
        {/* Backdrop */}
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[59]"
              onClick={() => setIsFabOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Expanded Actions */}
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col gap-3 mb-4 items-end"
            >
              {/* Emergency */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                onClick={() => { setIsEmergencyExpanded(!isEmergencyExpanded); setIsFabOpen(false); }}
                className="flex items-center gap-3 bg-red-50 dark:bg-red-950/80 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-full pl-4 pr-5 py-2.5 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-red-700 dark:text-red-300 whitespace-nowrap">{t('fabEmergency')}</span>
              </motion.button>

              {/* Climate */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => { setIsWeatherExpanded(!isWeatherExpanded); setIsFabOpen(false); }}
                className="flex items-center gap-3 bg-green-50 dark:bg-green-950/80 hover:bg-green-100 dark:hover:bg-green-900/60 border border-green-200 dark:border-green-800 rounded-full pl-4 pr-5 py-2.5 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#126b3a] flex items-center justify-center text-white">
                  <ThermometerSun className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-green-700 dark:text-green-300 whitespace-nowrap">{t('fabClimate')}</span>
              </motion.button>

              {/* MLA Office Call */}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                href="tel:+910000000000"
                className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-full pl-4 pr-5 py-2.5 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">{t('fabMlaCall')}</span>
              </motion.a>

              {/* Report Issue */}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                href="#civic-reporter"
                onClick={() => setIsFabOpen(false)}
                className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-full pl-4 pr-5 py-2.5 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300 whitespace-nowrap">{t('fabReport')}</span>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                href="https://wa.me/910000000000"
                target="_blank"
                className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-full pl-4 pr-5 py-2.5 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">{t('fabWhatsapp')}</span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Expanded Panel (shown when triggered from FAB) */}
        <AnimatePresence>
          {isEmergencyExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-red-50 dark:bg-red-950/90 rounded-[2rem] shadow-2xl border border-red-100 dark:border-red-800 mb-3 p-4"
            >
              <div className="grid grid-cols-2 gap-3 w-64 md:w-72">
                {filteredEmergencyServices.map(service => {
                  let icon = '🏥';
                  let colorClass = 'bg-red-500 text-white';
                  let labelClass = 'text-red-900 dark:text-red-200';
                  if (service.type === 'police') { icon = '🚔'; colorClass = 'bg-blue-600 text-white'; labelClass = 'text-blue-900 dark:text-blue-200'; }
                  else if (service.type === 'fire') { icon = '🚒'; colorClass = 'bg-orange-500 text-white'; labelClass = 'text-orange-900 dark:text-orange-200'; }
                  else if (service.type === 'ambulance') { icon = '🚑'; colorClass = 'bg-red-500 text-white'; labelClass = 'text-red-900 dark:text-red-200'; }
                  else if (service.type === 'kseb') { icon = '⚡'; colorClass = 'bg-amber-400 text-amber-900'; labelClass = 'text-amber-900 dark:text-amber-200'; }
                  return (
                    <a key={service.id} href={`tel:${service.phone}`} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#1a2b22] rounded-2xl border border-red-50 dark:border-red-900/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 ${colorClass} group-hover:scale-110 transition-transform`}>
                        {icon}
                      </div>
                      <span className={`text-[10px] font-bold ${labelClass} leading-tight`}>{service.name}</span>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Climate Expanded Panel (shown when triggered from FAB) */}
        <AnimatePresence>
          {isWeatherExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-[#0d522a] rounded-[2rem] shadow-2xl text-white mb-3 p-5"
            >
              <div className="flex items-center justify-between w-64 md:w-72">
                <div>
                  <div className="text-3xl font-black">28°C</div>
                  <div className="text-xs font-medium text-green-100 mt-1">{t('weatherPartlyCloudy')}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs font-bold text-green-50 mb-1 justify-end">
                    <Droplet className="w-3 h-3 mr-1" /> 78% {t('weatherRain')}
                  </div>
                  <div className="text-[10px] text-green-200">Kongad, Palakkad</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mt-4 border border-white/20">
                <div className="flex items-start gap-3">
                  <CloudLightning className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{t('weatherAlert')}</h4>
                    <p className="text-[11px] text-green-50 mt-1 leading-relaxed">{t('weatherAlertDesc')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => { setIsFabOpen(!isFabOpen); if (isEmergencyExpanded) setIsEmergencyExpanded(false); if (isWeatherExpanded) setIsWeatherExpanded(false); }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:shadow-2xl hover:scale-105 transition-all border-2 border-white/20 relative z-[61]"
          animate={{ rotate: isFabOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-7 h-7" />
        </motion.button>
      </div>
      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0f1a14]/95 dark:border-slate-700 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center p-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <button className="flex flex-col items-center gap-1 text-primary">
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('navHome')}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('navMarket')}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('navServices')}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('navProfile')}</span>
        </button>
      </nav>
    </div>
  );
}
