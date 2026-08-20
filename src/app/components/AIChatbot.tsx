"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'I am sorry, I did not understand that. You can ask me about Govt Services, Agriculture, Schemes, or Emergency numbers.';
      const lowerInput = userMsg.text.toLowerCase();
      
      for (const item of FAQ_DB) {
        if (item.keywords.some(kw => lowerInput.includes(kw))) {
          botResponse = item.response;
          break;
        }
      }

      const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'bot', text: botResponse };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-primary hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
            >
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-accent text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                AI <Sparkles className="w-3 h-3" />
              </span>
            </motion.button>
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
            className="fixed bottom-24 left-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-white dark:bg-[#1a2b22] rounded-2xl shadow-2xl border border-gray-200 dark:border-green-800/50 flex flex-col overflow-hidden"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-bold flex items-center gap-1">
                    Kongad AI <Sparkles className="w-4 h-4 text-accent" />
                  </h3>
                  <p className="text-xs text-green-100">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                      msg.type === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white dark:bg-[#233a2e] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-green-800/50 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#233a2e] border border-gray-200 dark:border-green-800/50 rounded-2xl rounded-bl-none p-3 shadow-sm flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#1a2b22] border-t border-gray-200 dark:border-green-800/50 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask something..."
                  className="flex-1 bg-gray-100 dark:bg-[#0f1914] text-gray-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-green-600"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary hover:bg-green-700 disabled:opacity-50 text-white p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Powered by Synthara Vision
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
