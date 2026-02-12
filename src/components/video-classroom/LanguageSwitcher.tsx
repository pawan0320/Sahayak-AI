'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => Promise<void>;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLanguage);

  const currentLangData = languages.find((l) => l.code === selectedLang);

  const handleLanguageSelect = async (langCode: string) => {
    if (langCode === selectedLang) return;

    setIsLoading(true);
    try {
      await onLanguageChange(langCode);
      setSelectedLang(langCode);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/50 hover:border-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
            <Loader className="w-4 h-4" />
          </motion.div>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span className="text-2xl">{currentLangData?.flag}</span>
            <span className="font-medium text-sm max-w-20 truncate">{currentLangData?.nativeName}</span>
          </>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && !isLoading && (
          <motion.div
            className="absolute top-full mt-2 right-0 z-50 bg-background border-2 border-primary/50 rounded-lg shadow-2xl overflow-hidden min-w-56"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
              <p className="text-xs font-semibold text-muted-foreground">Select Language</p>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-2 gap-2 p-3">
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`group relative p-3 rounded-lg border-2 transition-all ${
                    selectedLang === lang.code
                      ? 'bg-primary/30 border-primary/80'
                      : 'bg-secondary/20 border-border/50 hover:border-primary/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Selection Indicator */}
                  {selectedLang === lang.code && (
                    <motion.div className="absolute top-2 right-2" layoutId="selection">
                      <Check className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-bold text-sm text-foreground">{lang.nativeName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{lang.name}</p>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-accent/0 opacity-0 group-hover:opacity-30 rounded-lg transition-opacity pointer-events-none" />
                </motion.button>
              ))}
            </div>

            {/* Info */}
            <div className="px-4 py-3 bg-secondary/10 border-t border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Content will be automatically translated and regenerated in the selected language. This may take a moment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
