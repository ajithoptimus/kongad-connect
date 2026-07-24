"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ml' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ml',
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Hero Section
  heroWelcome: { ml: 'Welcome to Kongad Connect', en: 'Welcome to Kongad Connect' },
  heroTitle: { ml: 'നമ്മുടെ കോങ്ങാട്', en: 'Our Kongad' },
  heroSubtitle: { ml: 'Kongad Assembly Constituency', en: 'Kongad Assembly Constituency' },
  heroDescription: { ml: 'കോങ്ങാടിന്റെ വികസനത്തിനും ജനങ്ങളുടെ ക്ഷേമത്തിനുമായി ഒരു ഡിജിറ്റൽ ജനകീയ വേദി. നിങ്ങളുടെ പരാതികളും ആവശ്യങ്ങളും നേരിട്ട് എം.എൽ.എ യെ അറിയിക്കാം.', en: 'A digital public platform for the development and welfare of Kongad. Submit your complaints and needs directly to the MLA.' },
  heroButton1: { ml: '📝 എം.എൽ.എ യെ അറിയിക്കാൻ', en: '📝 Report to MLA' },
  heroButton2: { ml: '🌾 കാർഷിക ഇടം', en: '🌾 Agri Hub' },
  
  // Trust Badges
  badgeKrishi: { ml: 'കാർഷിക ഇടം', en: 'Agri Hub' },
  badgeReporter: { ml: 'ജനകീയ റിപ്പോർട്ടർ', en: "People's Reporter" },
  badgeNews: { ml: 'കോങ്ങാട് വാർത്തകൾ', en: 'Kongad News' },
  badgeJobs: { ml: 'തൊഴിൽ & നാട്ടുചന്ത', en: 'Jobs & Market' },

  // Section Headers  
  sectionNews: { ml: 'കോങ്ങാട് വാർത്തകൾ', en: 'Kongad News' },
  sectionKrishi: { ml: 'കൃഷി അറിവ്', en: 'Farming Tips' },
  sectionCivic: { ml: 'ജനകീയ റിപ്പോർട്ടർ', en: "People's Reporter" },
  sectionGovtServices: { ml: 'സർക്കാർ സേവനങ്ങൾ', en: 'Government Services' },
  sectionMarketplace: { ml: 'കാർഷിക വിപണന ശൃംഖല', en: 'Agricultural Marketplace' },
  sectionMarketplaceDesc: { ml: 'നേരിട്ട് വാങ്ങാനും വിൽക്കാനും', en: 'Buy and sell directly' },
  sectionBus: { ml: 'യാത്രാ വിവരങ്ങൾ', en: 'Travel Info' },
  sectionBlood: { ml: 'രക്തദാന സേന', en: 'Blood Donor Network' },
  sectionEdu: { ml: 'വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ', en: 'Educational Institutions' },
  sectionEvents: { ml: 'പരിപാടികൾ', en: 'Events' },
  sectionJobs: { ml: 'തൊഴിൽ അവസരങ്ങൾ', en: 'Job Opportunities' },
  sectionClassifieds: { ml: 'നാട്ടു ചന്ത', en: 'Local Market' },
  sectionMarketPrices: { ml: 'വിപണി വില', en: 'Market Prices' },
  
  // Emergency
  emergency: { ml: 'അടിയന്തര സേവനങ്ങൾ', en: 'Emergency Services' },
  
  // Weather / Climate
  climate: { ml: 'കാലാവസ്ഥ', en: 'Climate' },
  weatherPartlyCloudy: { ml: 'ഭാഗികമായി മേഘാവൃതം', en: 'Partly Cloudy' },
  weatherRain: { ml: 'മഴ', en: 'Rain' },
  weatherAlert: { ml: 'മുന്നറിയിപ്പ് (Alert)', en: 'Weather Alert' },
  weatherAlertDesc: { ml: 'വരും മണിക്കൂറുകളിൽ ശക്തമായ മഴയ്ക്ക് സാധ്യത. റബ്ബർ ടാപ്പിംഗ് മാറ്റിവെക്കുന്നത് ഉചിതമായിരിക്കും.', en: 'Heavy rain likely in coming hours. Consider postponing rubber tapping.' },

  // Marketplace form
  iAmFarmer: { ml: 'ഞാൻ ഒരു കർഷകൻ', en: 'I am a Farmer' },
  iAmMerchant: { ml: 'ഞാൻ ഒരു വ്യാപാരി', en: 'I am a Merchant' },
  whatSelling: { ml: 'നിങ്ങൾ എന്താണ് വിൽക്കുന്നത്?', en: 'What are you selling?' },
  whatBuying: { ml: 'നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്?', en: 'What do you need?' },
  addForSale: { ml: 'വിൽപനയ്ക്കായി ചേർക്കുക', en: 'Add for Sale' },
  addNeed: { ml: 'ആവശ്യം ചേർക്കുക', en: 'Add Need' },
  
  // Civic Reporter
  civicCategory: { ml: 'വിഭാഗം', en: 'Category' },
  civicLandmark: { ml: 'ലാൻഡ്മാർക്ക് / സ്ഥലം', en: 'Landmark / Location' },
  civicPhoto: { ml: 'ഫോട്ടോ ചേർക്കുക', en: 'Add Photo' },
  civicSubmit: { ml: 'Submit', en: 'Submit' },
  
  // Bottom Nav
  navHome: { ml: 'ഹോം', en: 'Home' },
  navMarket: { ml: 'വിപണി', en: 'Market' },
  navServices: { ml: 'സേവനങ്ങൾ', en: 'Services' },
  navProfile: { ml: 'പ്രൊഫൈൽ', en: 'Profile' },
  
  // Footer
  footerCopyright: { ml: '© 2026 Kongad Connect. Built with ❤️ for കോങ്ങാട്', en: '© 2026 Kongad Connect. Built with ❤️ for Kongad' },
  footerPowered: { ml: 'Powered by Nelmani Digital', en: 'Powered by Nelmani Digital' },
  
  // General
  viewAll: { ml: 'View All', en: 'View All' },
  scroll: { ml: 'Scroll', en: 'Scroll' },
  from: { ml: 'From', en: 'From' },
  to: { ml: 'To', en: 'To' },
  onTime: { ml: 'On Time', en: 'On Time' },
  delayed: { ml: 'Delayed', en: 'Delayed' },
  contact: { ml: 'ബന്ധപ്പെടുക (Contact)', en: 'Contact' },

  // FAB Menu
  fabMlaCall: { ml: 'MLA ഓഫീസ്', en: 'MLA Office' },
  fabEmergency: { ml: 'അടിയന്തരം', en: 'Emergency' },
  fabClimate: { ml: 'കാലാവസ്ഥ', en: 'Climate' },
  fabReport: { ml: 'പരാതി', en: 'Report' },
  fabWhatsapp: { ml: 'WhatsApp', en: 'WhatsApp' },

  // Map
  mapTitle: { ml: 'നിങ്ങളുടെ പഞ്ചായത്ത് തിരഞ്ഞെടുക്കൂ', en: 'Select Your Panchayat' },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ml');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('kongad-lang') as Language | null;
    if (stored) setLanguage(stored);
  }, []);

  const toggleLanguage = () => {
    const next = language === 'ml' ? 'en' : 'ml';
    setLanguage(next);
    localStorage.setItem('kongad-lang', next);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['ml'] || key;
  };

  if (!mounted) return <>{children}</>;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
