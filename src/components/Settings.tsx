import React from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Palette, Globe, Bell, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { useTheme, ThemeMode, AccentColor } from '../contexts/ThemeContext';
import { useTranslations } from '../utils/translations';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';

interface SettingsProps {
    onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const { mode, setMode, accentColor, setAccentColor, language, setLanguage } = useTheme();
    const t = useTranslations(language);

    const modes: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'system', label: 'System', icon: Monitor },
    ];

    const colors: { id: AccentColor; label: string; color: string }[] = [
        { id: 'blue', label: 'Blue', color: '#3b82f6' },
        { id: 'green', label: 'Green', color: '#22c55e' },
        { id: 'purple', label: 'Purple', color: '#a855f7' },
        { id: 'orange', label: 'Orange', color: '#f97316' },
        { id: 'red', label: 'Red', color: '#ef4444' },
    ];

    const languages = [
        { id: 'en', label: 'English', flag: '🇬🇧' },
        { id: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
        { id: 'fr', label: 'Français', flag: '🇫🇷' },
        { id: 'ar', label: 'العربية', flag: '🇸🇦' },
        { id: 'pt', label: 'Português', flag: '🇵🇹' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
                        <p className="text-sm text-slate-600">Customize your experience</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* Appearance Section */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-slate-500" />
                        Appearance
                    </h2>
                    <Card className="p-6 space-y-6">
                        {/* Mode Selection */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-3 block">Theme Mode</label>
                            <div className="grid grid-cols-3 gap-3">
                                {modes.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMode(m.id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${mode === m.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        <m.icon className="w-6 h-6" />
                                        <span className="text-sm font-medium">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accent Color Selection */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-3 block">Accent Color</label>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setAccentColor(c.id)}
                                        className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${accentColor === c.id ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                                            }`}
                                        style={{ backgroundColor: c.color }}
                                    >
                                        {accentColor === c.id && (
                                            <Check className="w-6 h-6 text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Language Section */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-slate-500" />
                        Language
                    </h2>
                    <Card className="p-0 overflow-hidden">
                        {languages.map((lang, index) => (
                            <button
                                key={lang.id}
                                onClick={() => setLanguage(lang.id)}
                                className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${index !== languages.length - 1 ? 'border-b border-slate-100' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-medium text-slate-700">{lang.label}</span>
                                </div>
                                {language === lang.id && (
                                    <Check className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </Card>
                </section>

                {/* Notifications Section (Mock) */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-slate-500" />
                        Notifications
                    </h2>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-slate-800">Push Notifications</h3>
                                <p className="text-sm text-slate-500">Receive updates about your reports</p>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </Card>
                </section>

            </div>
        </div>
    );
};

export default Settings;
