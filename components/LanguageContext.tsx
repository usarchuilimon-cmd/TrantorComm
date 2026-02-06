import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

type Translations = {
    [key: string]: {
        es: string;
        en: string;
    };
};

// Simple translation dictionary (expandable)
const dictionary: Translations = {
    'dashboard': { es: 'Panel Principal', en: 'Dashboard' },
    'conversations': { es: 'Conversaciones', en: 'Conversations' },
    'contacts': { es: 'Contactos', en: 'Contacts' },
    'campaigns': { es: 'Campañas', en: 'Campaigns' },
    'settings': { es: 'Configuración', en: 'Settings' },
    'backoffice': { es: 'Panel Super Admin', en: 'Super Admin Panel' },
    'status_online': { es: 'En línea', en: 'Online' },
    'status_busy': { es: 'Ocupado', en: 'Busy' },
    'status_offline': { es: 'Desconectado', en: 'Offline' },
    'welcome': { es: 'Bienvenido', en: 'Welcome' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (key: string): string => {
        return dictionary[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
