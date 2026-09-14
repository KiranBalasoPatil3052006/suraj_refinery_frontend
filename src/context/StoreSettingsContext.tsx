import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StoreSettings {
  tamilTitle: string;
  englishTitle: string;
  subtitle: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  tagline: string;
  bottomSlogan: string;
  proprietorLabel: string;
  nameLabel: string;
  markLabel: string;
  serialNoLabel: string;
  dateLabel: string;
  finenessLabel: string;
  // Font size & overall scaling controls
  overallFontScale: number; // percentage: 90 - 130%
  tamilTitleFontSize: number; // px: default 28
  englishTitleFontSize: number; // px: default 26
  subtitleFontSize: number; // px: default 15
  contactFontSize: number; // px: default 17
  fieldValuesFontSize: number; // px: default 18
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  tamilTitle: 'சூராஜ் புல்லியன் அசெசரீஸ்',
  englishTitle: 'SURAJ BULLION ACCESSORIES',
  subtitle: 'SILVER SAMPLE CERTIFICATE',
  phone: '+91 98765 43210',
  addressLine1: 'WAT, Ranganai Road,',
  addressLine2: 'Singanallur, Coimbatore - 2',
  tagline: 'A TRUSTED QUALITY IN SILVER',
  bottomSlogan: 'PURITY BUILDS TRUST',
  proprietorLabel: 'PROPRIETOR',
  nameLabel: 'Name',
  markLabel: 'Mark',
  serialNoLabel: 'S.No.',
  dateLabel: 'Date',
  finenessLabel: 'Fineness',
  overallFontScale: 100,
  tamilTitleFontSize: 28,
  englishTitleFontSize: 26,
  subtitleFontSize: 15,
  contactFontSize: 17,
  fieldValuesFontSize: 18,
};

const STORAGE_KEY = 'sba_store_static_settings_v1';

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load store settings from localStorage', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist store settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to reset store settings', e);
    }
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
