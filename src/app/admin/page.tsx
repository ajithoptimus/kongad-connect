"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, AlertCircle, CheckCircle2, Clock, Eye, 
  Leaf, MapPin, Phone, FileText, BarChart3, Users, 
  ChevronDown, ChevronRight, Search, Filter, ArrowLeft,
  Sprout, MessageSquare, TrendingUp, Settings, Bell,
  Calendar, Download, RefreshCw, X, Check, Trash2,
  Globe, Moon, Sun
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';

// ─── Types ───────────────────────────────────────────────────────────────
type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
type LandStatus = 'pending' | 'approved' | 'matched';

interface Complaint {
  id: string;
  category: string;
  description: string;
  location: string;
  panchayat: string;
  date: string;
  status: ComplaintStatus;
  reporterName: string;
  phone: string;
  photoUrl?: string;
}

interface LandRegistration {
  id: string;
  ownerName: string;
  phone: string;
  panchayat: string;
  area: string;
  landType: string;
  date: string;
  status: LandStatus;
  matchedFarmer?: string;
}

interface Project {
  id: string;
  name: string;
  nameEn: string;
  panchayat: string;
  budget: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'upcoming';
}

// ─── Mock Data ───────────────────────────────────────────────────────────
const COMPLAINTS: Complaint[] = [
  { id: 'C001', category: '🛤️ റോഡ്', description: 'കോങ്ങാട് ടൗൺ റോഡിൽ വലിയ കുഴി. ഇരുചക്രവാഹനങ്ങൾക്ക് അപകടകരം.', location: 'Main Road, Near Bus Stand', panchayat: 'Kongad', date: '2026-09-01', status: 'pending', reporterName: 'രാജേഷ് കുമാർ', phone: '9876543210' },
  { id: 'C002', category: '💧 കുടിവെള്ളം', description: 'കഴിഞ്ഞ 3 ദിവസമായി വെള്ളം കിട്ടുന്നില്ല. പൈപ്പ് പൊട്ടിയിരിക്കുന്നു.', location: 'Ward 7, Mankara', panchayat: 'Mankara', date: '2026-08-30', status: 'in-progress', reporterName: 'സുധ മേനോൻ', phone: '9876543211' },
  { id: 'C003', category: '💡 വൈദ്യുതി', description: 'സ്ട്രീറ്റ് ലൈറ്റ് 2 ആഴ്ചയായി പ്രവർത്തിക്കുന്നില്ല.', location: 'Temple Junction, Parali', panchayat: 'Parali', date: '2026-08-28', status: 'resolved', reporterName: 'വിനോദ് ചന്ദ്രൻ', phone: '9876543212' },
  { id: 'C004', category: '🗑️ മാലിന്യം', description: 'റോഡരികിൽ മാലിന്യം കുന്നുകൂടിയിരിക്കുന്നു. ദുർഗന്ധം.', location: 'Market Area, Keralassery', panchayat: 'Keralassery', date: '2026-09-02', status: 'pending', reporterName: 'അനിത ടീച്ചർ', phone: '9876543213' },
  { id: 'C005', category: '🛤️ റോഡ്', description: 'മഴയിൽ റോഡ് പൂർണ്ണമായും തകർന്നു. വാഹനങ്ങൾക്ക് കടന്നുപോകാൻ കഴിയുന്നില്ല.', location: 'School Road, Mannur', panchayat: 'Mannur', date: '2026-09-03', status: 'pending', reporterName: 'മുഹമ്മദ് ഫൈസൽ', phone: '9876543214' },
  { id: 'C006', category: '💧 കുടിവെള്ളം', description: 'ബോർവെൽ ഉപയോഗശൂന്യമായി. 50 കുടുംബങ്ങൾ ബാധിച്ചു.', location: 'Ward 3, Kanjirapuzha', panchayat: 'Kanjirapuzha', date: '2026-08-29', status: 'in-progress', reporterName: 'ലക്ഷ്മി ദേവി', phone: '9876543215' },
];

const LAND_REGISTRATIONS: LandRegistration[] = [
  { id: 'L001', ownerName: 'ഗോപാലകൃഷ്ണൻ നായർ', phone: '9876543220', panchayat: 'Kongad', area: '2.5 ഏക്കർ', landType: 'നെൽവയൽ', date: '2026-08-20', status: 'matched', matchedFarmer: 'രാമചന്ദ്രൻ (JLG)' },
  { id: 'L002', ownerName: 'ഫാത്തിമ ബീവി', phone: '9876543221', panchayat: 'Mankara', area: '1.8 ഏക്കർ', landType: 'തരിശ് ഭൂമി', date: '2026-08-22', status: 'approved', },
  { id: 'L003', ownerName: 'തോമസ് മാത്യു', phone: '9876543222', panchayat: 'Parali', area: '3.0 ഏക്കർ', landType: 'നെൽവയൽ', date: '2026-08-25', status: 'pending', },
  { id: 'L004', ownerName: 'സരസ്വതി അമ്മ', phone: '9876543223', panchayat: 'Keralassery', area: '1.2 ഏക്കർ', landType: 'പുരയിടം', date: '2026-09-01', status: 'pending', },
  { id: 'L005', ownerName: 'അബ്ദുൾ റഹ്മാൻ', phone: '9876543224', panchayat: 'Mannur', area: '4.0 ഏക്കർ', landType: 'തരിശ് ഭൂമി', date: '2026-08-28', status: 'approved', },
];

const PROJECTS: Project[] = [
  { id: 'P001', name: 'കോങ്ങാട്-മങ്കര റോഡ്', nameEn: 'Kongad-Mankara Road', panchayat: 'Kongad, Mankara', budget: '₹8.2 Cr', progress: 79, status: 'in-progress' },
  { id: 'P002', name: 'കേരളശ്ശേരി GHS', nameEn: 'Keralassery GHS', panchayat: 'Keralassery', budget: '₹3.5 Cr', progress: 100, status: 'completed' },
  { id: 'P003', name: 'കഞ്ഞിരപ്പുഴ കുടിവെള്ളം', nameEn: 'Kanjirapuzha Water', panchayat: 'Kanjirapuzha', budget: '₹12.8 Cr', progress: 62, status: 'in-progress' },
  { id: 'P004', name: 'പറളി PHC', nameEn: 'Parali PHC', panchayat: 'Parali', budget: '₹4.2 Cr', progress: 100, status: 'completed' },
  { id: 'P005', name: 'തച്ചമ്പാറ അഗ്രി മാർക്കറ്റ്', nameEn: 'Thachampara Agri Market', panchayat: 'Thachampara', budget: '₹6.1 Cr', progress: 35, status: 'in-progress' },
  { id: 'P006', name: 'മണ്ണൂർ-അമ്പലപ്പാറ റോഡ്', nameEn: 'Mannur-Ambalappara Road', panchayat: 'Mannur', budget: '₹11.2 Cr', progress: 0, status: 'upcoming' },
];

const POLL_RESULTS = [
  { option: 'കുടിവെള്ള പദ്ധതികൾ', votes: 1420, percentage: 36 },
  { option: 'കാർഷിക സഹായങ്ങൾ', votes: 1100, percentage: 28 },
  { option: 'ഗ്രാമീണ റോഡുകൾ', votes: 850, percentage: 21 },
  { option: 'ആരോഗ്യ കേന്ദ്രങ്ങൾ', votes: 620, percentage: 15 },
];

// ─── Status Helpers ──────────────────────────────────────────────────────
const statusConfig = {
  pending:       { label: 'Pending',     labelMl: 'പരിഗണിക്കുന്നു', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500' },
  'in-progress': { label: 'In Progress', labelMl: 'നടപ്പാക്കുന്നു', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  resolved:      { label: 'Resolved',    labelMl: 'പരിഹരിച്ചു',     color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  approved:      { label: 'Approved',    labelMl: 'അംഗീകരിച്ചു',    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  matched:       { label: 'Matched',     labelMl: 'ബന്ധിപ്പിച്ചു',  color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300', dot: 'bg-violet-500' },
  completed:     { label: 'Completed',   labelMl: 'പൂർത്തിയായി',   color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  upcoming:      { label: 'Upcoming',    labelMl: 'വരാനിരിക്കുന്നു', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', dot: 'bg-slate-400' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.labelMl}
    </span>
  );
};

// ─── Tab Types ───────────────────────────────────────────────────────────
type Tab = 'overview' | 'complaints' | 'land' | 'projects' | 'polls';

// ─── Main Component ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [complaintFilter, setComplaintFilter] = useState<ComplaintStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const filteredComplaints = COMPLAINTS.filter(c => {
    const matchesStatus = complaintFilter === 'all' || c.status === complaintFilter;
    const matchesSearch = searchQuery === '' || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.panchayat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reporterName.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'complaints', label: 'Complaints', icon: <AlertCircle className="w-4 h-4" />, count: COMPLAINTS.filter(c => c.status === 'pending').length },
    { id: 'land', label: 'Tharisu Nilam', icon: <Sprout className="w-4 h-4" />, count: LAND_REGISTRATIONS.filter(l => l.status === 'pending').length },
    { id: 'projects', label: 'Projects', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'polls', label: 'Poll Analytics', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] dark:bg-[#0a1510] text-slate-900 dark:text-slate-100 font-sans">
      
      {/* ── Top Header ─────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-[#1a7a3a] via-[#15663a] to-[#0d4a28] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-bold hidden sm:inline">Back to Portal</span>
            </Link>
            <div className="w-px h-6 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-extrabold leading-tight">MLA Office Dashboard</h1>
                <p className="text-[10px] text-green-200 font-medium">എം.എൽ.എ ഓഫീസ് • Kongad Constituency</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center border border-white">
                {COMPLAINTS.filter(c => c.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">

        {/* ── Tab Navigation ─────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/30' 
                  : 'bg-white dark:bg-[#1a2b22] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#223a2d] border border-slate-200 dark:border-green-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB                                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Complaints', value: COMPLAINTS.length.toString(), sub: `${COMPLAINTS.filter(c=>c.status==='pending').length} Pending`, icon: <AlertCircle className="w-5 h-5" />, color: 'from-red-500 to-rose-500', bg: 'bg-red-50 dark:bg-red-950/30' },
                { label: 'Land Registrations', value: LAND_REGISTRATIONS.length.toString(), sub: `${LAND_REGISTRATIONS.filter(l=>l.status==='matched').length} Matched`, icon: <Sprout className="w-5 h-5" />, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                { label: 'Active Projects', value: PROJECTS.filter(p=>p.status==='in-progress').length.toString(), sub: `${PROJECTS.filter(p=>p.status==='completed').length} Completed`, icon: <BarChart3 className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                { label: 'Total Poll Votes', value: POLL_RESULTS.reduce((s,p) => s+p.votes, 0).toLocaleString(), sub: 'Active Poll', icon: <Users className="w-5 h-5" />, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-950/30' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`${stat.bg} rounded-2xl p-4 md:p-5 border border-slate-200/60 dark:border-green-900/30`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{stat.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Complaints */}
              <div className="lg:col-span-2 bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-base flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> Recent Complaints</h3>
                  <button onClick={() => setActiveTab('complaints')} className="text-xs font-bold text-primary hover:underline">View All →</button>
                </div>
                <div className="space-y-3">
                  {COMPLAINTS.filter(c => c.status === 'pending').slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0f1a14] border border-slate-100 dark:border-green-900/30">
                      <span className="text-lg">{c.category.split(' ')[0]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{c.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3" /> {c.panchayat} • {c.date}
                        </div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5">
                <h3 className="font-extrabold text-base mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-slate-500" /> Quick Actions</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Update Project Progress', icon: <RefreshCw className="w-4 h-4" />, action: () => setActiveTab('projects') },
                    { label: 'Review Pending Complaints', icon: <Eye className="w-4 h-4" />, action: () => { setActiveTab('complaints'); setComplaintFilter('pending'); } },
                    { label: 'Approve Land Applications', icon: <Check className="w-4 h-4" />, action: () => setActiveTab('land') },
                    { label: 'Download Poll Report', icon: <Download className="w-4 h-4" />, action: () => setActiveTab('polls') },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0f1a14] hover:bg-primary/5 dark:hover:bg-primary/10 border border-slate-100 dark:border-green-900/30 text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">{item.icon}</div>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* COMPLAINTS TAB                                         */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'complaints' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search complaints..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1a2b22] border border-slate-200 dark:border-green-800/50 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'in-progress', 'resolved'] as const).map(f => (
                  <button key={f} onClick={() => setComplaintFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${complaintFilter === f ? 'bg-primary text-white shadow-sm' : 'bg-white dark:bg-[#1a2b22] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-green-800/50'}`}
                  >{f === 'all' ? 'All' : f}</button>
                ))}
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-3">
              {filteredComplaints.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{c.category.split(' ')[0]}</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{c.id}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm font-semibold mb-2 leading-relaxed">{c.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</span>
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {c.panchayat}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.date}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.reporterName}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {c.status === 'pending' && (
                        <button className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Mark In-Progress
                        </button>
                      )}
                      {c.status === 'in-progress' && (
                        <button className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                        </button>
                      )}
                      <a href={`tel:${c.phone}`} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* THARISU NILAM TAB                                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'land' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: 'Total Registrations', value: LAND_REGISTRATIONS.length, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Approved', value: LAND_REGISTRATIONS.filter(l=>l.status==='approved').length, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Farmer Matched', value: LAND_REGISTRATIONS.filter(l=>l.status==='matched').length, color: 'text-violet-600 dark:text-violet-400' },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-[#1a2b22] rounded-xl border border-slate-200 dark:border-green-800/50 p-4 text-center">
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {LAND_REGISTRATIONS.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-extrabold">{l.ownerName}</span>
                        <StatusBadge status={l.status} />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {l.panchayat}</span>
                        <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> {l.area} — {l.landType}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {l.date}</span>
                      </div>
                      {l.matchedFarmer && (
                        <div className="mt-2 text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-800/50">
                          <Users className="w-3 h-3" /> Matched: {l.matchedFarmer}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {l.status === 'pending' && (
                        <button className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      {l.status === 'approved' && (
                        <button className="px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-800/50 hover:bg-violet-100 transition-colors flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Find Farmer
                        </button>
                      )}
                      <a href={`tel:${l.phone}`} className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* PROJECTS TAB                                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {PROJECTS.map((p, i) => {
              const barColor = p.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-400' : p.status === 'in-progress' ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-slate-400 to-slate-300';
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-extrabold truncate">{p.name}</h4>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{p.nameEn} • {p.panchayat} • {p.budget}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>
                        <span className="text-sm font-black shrink-0 w-10 text-right">{p.progress}%</span>
                      </div>
                    </div>
                    {p.status === 'in-progress' && (
                      <button className="px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1 shrink-0">
                        <RefreshCw className="w-3.5 h-3.5" /> Update Progress
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* POLL ANALYTICS TAB                                     */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'polls' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white dark:bg-[#1a2b22] rounded-2xl border border-slate-200 dark:border-green-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold">Active Poll Results</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">നമ്മുടെ മണ്ഡലത്തിൽ ഏറ്റവും വേഗത്തിൽ നടപ്പിലാക്കേണ്ട പദ്ധതി ഏതാണ്?</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-primary">{POLL_RESULTS.reduce((s,p)=>s+p.votes,0).toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Votes</div>
                </div>
              </div>
              <div className="space-y-4">
                {POLL_RESULTS.map((p, i) => (
                  <div key={p.option}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold">{p.option}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{p.votes.toLocaleString()} votes</span>
                        <span className="text-sm font-black text-primary">{p.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.percentage}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : i === 1 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : i === 2 ? 'bg-gradient-to-r from-slate-500 to-slate-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/50 p-5">
                <h4 className="text-sm font-extrabold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Top Priority</h4>
                <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                  <strong>കുടിവെള്ള പദ്ധതികൾ (Drinking Water)</strong> dominates with 36% of votes. This aligns with the ongoing Kanjirapuzha Drinking Water Project (₹12.8 Cr). Consider accelerating pipeline work in Kanjirapuzha & Karimba panchayats.
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-5">
                <h4 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2"><Sprout className="w-4 h-4" /> Agricultural Interest</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-200 leading-relaxed">
                  <strong>കാർഷിക സഹായങ്ങൾ (Agricultural Support)</strong> at 28% shows strong farmer engagement. The Tharisu Nilam initiative and Nelmani-Fresh supply chain directly address this demand.
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
