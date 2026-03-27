import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Card } from './ui/Card';
import { useTranslations } from '../utils/translations';
import { useTheme } from '../contexts/ThemeContext';

interface RegionSelectorProps {
    onBack?: () => void;
    onSelect: (region: string) => void;
}

const regions = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru",
    "Eldoret", "Thika", "Garissa", "Uasin Gishu",
    "Lamu", "Machakos", "Nyeri", "Kakamega"
];

const RegionSelector: React.FC<RegionSelectorProps> = ({ onBack, onSelect }) => {
    const { language } = useTheme();
    const t = useTranslations(language);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">{t.selectRegion}</h1>
                        <p className="text-sm text-slate-600">Choose your location to see relevant updates</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {regions.map((region) => (
                        <Card
                            key={region}
                            onClick={() => onSelect(region)}
                            className="p-6 cursor-pointer hover:scale-105 transition-transform hover:border-blue-200 hover:ring-2 hover:ring-blue-100 group"
                        >
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-slate-800">{region}</h3>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegionSelector;
