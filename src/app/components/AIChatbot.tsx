"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

const FAQ_DB = [
  { keywords: ['ration card', 'ration', 'റേഷൻ'], response: 'For Ration Card services, visit the Civil Supplies website or your local Akshaya center. Required docs: Aadhar, Income certificate.' },
  { keywords: ['kseb', 'electricity', 'കറന്റ്', 'വൈദ്യുതി'], response: 'KSEB services including bill payment and new connections can be accessed via wss.kseb.in or KSEB app. For emergencies dial 1912.' },
  { keywords: ['certificate', 'village', 'income', 'caste'], response: 'Certificates (Income, Caste, Nativity) can be applied through e-District portal via Akshaya centers.' },
  { keywords: ['police', 'emergency', 'പോലീസ്'], response: 'Emergency Numbers:\nPolice: 100 or 112\nFire: 101\nAmbulance: 108\nWomen Helpline: 1091' },
  { keywords: ['fire', 'ambulance', 'hospital'], response: 'Emergency Numbers:\nAmbulance: 108\nFire & Rescue: 101\nPolice: 112' },
  { keywords: ['kisan', 'agriculture', 'farmer', 'pm kisan'], response: 'PM-KISAN scheme provides ₹6000/year to farmers. Register via pmkisan.gov.in or Krishi Bhavan with Aadhar, Land tax receipt.' },
  { keywords: ['vidyakiranam', 'student', 'scholarship'], response: 'Vidyakiranam scheme provides educational assistance to children of differently-abled parents. Apply through Social Justice Department.' },
  { keywords: ['pension', 'old age', 'widow'], response: 'Social Security Pensions (Old Age, Widow, Disability) are ₹1600/month. Apply at your local Grama Panchayat with Aadhar and Income certificate.' },
  { keywords: ['bus', 'timing', 'ksrtc', 'transport'], response: 'Buses to Palakkad are available every 15 mins from Kongad. KSRTC Swift services run in morning and evening. Use Ente KSRTC app for live tracking.' },
  { keywords: ['tourist', 'tourism', 'visit', 'places'], response: 'Top places to visit around Kongad: Kanjirapuzha Dam, Siruvani, Meenvallam Waterfalls, and local heritage temples.' },
  { keywords: ['tharisu', 'nilam', 'krishi'], response: 'Tharisu Nilam registration: Register your barren land at Krishi Bhavan for collective farming initiatives and get subsidies.' },
  { keywords: ['hi', 'hello', 'നമസ്കാരം', 'greetings'], response: 'Hello! I am Kongad Connect AI. How can I help you today? I can answer queries about govt services, schemes, agriculture, and local info.' }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', text: 'നമസ്കാരം! Hello! I am Kongad Connect AI ✨. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'ml-IN'; // Defaulting to Malayalam, also picks up English

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          // Auto send after hearing
          setTimeout(() => {
            const btn = document.getElementById('ai-send-btn');
            if(btn) btn.click();
          }, 300);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Voice recognition is not supported in this browser.");
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey && apiKey.length > 10) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const systemPrompt = `You are Kongad Connect AI (also known as Ente Kongad AI), a helpful digital assistant for Kongad Constituency in Kerala. Answer the user's query politely. You can answer in Malayalam or English based on the user's language. Keep answers concise, max 2-3 sentences.`;
        const result = await model.generateContent(`${systemPrompt}\nUser query: ${userText}`);
        const responseText = result.response.text();
        
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: responseText }]);
      } else {
        // Fallback to FAQ if no API key
        setTimeout(() => {
          let botResponse = 'I am sorry, I did not understand that. (Please configure NEXT_PUBLIC_GEMINI_API_KEY in .env.local for dynamic AI responses). You can ask me about Govt Services, Agriculture, Schemes, or Emergency numbers.';
          const lowerInput = userText.toLowerCase();
          
          for (const item of FAQ_DB) {
            if (item.keywords.some(kw => lowerInput.includes(kw))) {
              botResponse = item.response;
              break;
            }
          }
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: botResponse }]);
          setIsTyping(false);
        }, 1000);
        return; // Early return to avoid setting isTyping again
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'bot', text: 'Sorry, I am having trouble connecting to my brain right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 md:bottom-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {!isOpen && (
            <>
              <motion.a
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                href="https://t.me/kongadconnect_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#229ED9] hover:bg-[#1C82B3] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 ring-4 ring-[#229ED9]/30"
                title="Chat on Telegram"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.21 3.47-.49.33-.94.5-1.35.49-.45-.01-1.31-.25-1.95-.46-.78-.26-1.4-.4-1.34-.84.03-.22.34-.45.92-.69 3.6-1.56 6.01-2.61 7.23-3.11 3.43-1.43 4.15-1.68 4.63-1.69.11 0 .34.02.48.13.11.08.14.19.16.27.02.06.03.18.01.27z"/></svg>
              </motion.a>
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setIsOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 ring-4 ring-emerald-500/30 group relative"
              >
                <Bot className="w-7 h-7 group-hover:animate-bounce" />
                <span className="absolute -top-2 -right-3 bg-teal-500 text-white text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg border-2 border-white dark:border-slate-900">
                  AI <Sparkles className="w-3 h-3" />
                </span>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 md:bottom-24 md:right-6 z-50 w-[340px] max-w-[calc(100vw-3rem)] max-h-[min(500px,70vh)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-1">
                    Ente Kongad AI <Sparkles className="w-5 h-5 text-accent" />
                  </h3>
                  <p className="text-sm text-green-100 font-medium">Voice enabled Digital Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-[15px] whitespace-pre-wrap leading-relaxed shadow-sm ${
                      msg.type === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-100 border border-white/40 dark:border-slate-700/50 rounded-bl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Quick Suggestion Chips */}
              {messages.length === 1 && !isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 pt-2"
                >
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 ml-2 uppercase tracking-wider">Quick Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "🌾 കൃഷി വിവരങ്ങൾ (Agri)",
                      "📄 റേഷൻ കാർഡ് (Ration)",
                      "🚌 ബസ് സമയം (Bus Time)",
                      "🚨 അടിയന്തര സേവനങ്ങൾ"
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setInput(chip);
                          setTimeout(() => {
                            const btn = document.getElementById('ai-send-btn');
                            if(btn) btn.click();
                          }, 100);
                        }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/40 dark:border-slate-700/50 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={toggleListen}
                  className={`p-2 rounded-full transition-colors flex items-center justify-center shrink-0 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400'
                  }`}
                  title={isListening ? "Stop listening" : "Speak to AI"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Ask something..."}
                  className="flex-1 bg-emerald-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-emerald-100 dark:border-slate-700"
                />
                <button
                  id="ai-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Powered by SyntharaSight
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
