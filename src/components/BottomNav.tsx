import React, { useState } from 'react';
import {
    Home,
    FolderKanban,
    BarChart3,
    User,
    Plus,
    FileText,
    Map,
    Newspaper,
    HelpCircle,
    Shield,
    Banknote
} from 'lucide-react';
import { Screen } from '../types';
import { cn } from '../utils/utils';

interface BottomNavProps {
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
    userRole: string;
    isProfileComplete: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, userRole, isProfileComplete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (screen: Screen) => {
        onNavigate(screen);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Floating Action Menu */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4">
                        <div className="bg-white rounded-3xl shadow-xl p-4 grid grid-cols-3 gap-4 border border-slate-100 w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-200">
                            {['ngo', 'gov', 'aspiring'].includes(userRole) ? (
                                <MenuButton
                                    icon={Plus}
                                    label="Post Project"
                                    color={isProfileComplete ? "text-blue-600 bg-blue-100" : "text-slate-400 bg-slate-100"}
                                    onClick={() => isProfileComplete ? handleNavigate("post-project") : handleNavigate("profile")}
                                />
                            ) : (
                                <MenuButton
                                    icon={FileText}
                                    label="Report"
                                    color={isProfileComplete ? "text-blue-600 bg-blue-100" : "text-slate-400 bg-slate-100"}
                                    onClick={() => isProfileComplete ? handleNavigate("report") : handleNavigate("profile")}
                                />
                            )}
                            <MenuButton
                                icon={Banknote}
                                label="Revenue"
                                color="text-emerald-600 bg-emerald-100"
                                onClick={() => handleNavigate("national-revenue")}
                            />
                            <MenuButton
                                icon={Map}
                                label="Map"
                                color="text-purple-600 bg-purple-100"
                                onClick={() => handleNavigate("map")}
                            />
                            <MenuButton
                                icon={Newspaper}
                                label="News"
                                color="text-indigo-600 bg-indigo-100"
                                onClick={() => handleNavigate("news")}
                            />
                            <MenuButton
                                icon={HelpCircle}
                                label="Support"
                                color="text-orange-600 bg-orange-100"
                                onClick={() => handleNavigate("support")}
                            />
                            {['gov'].includes(userRole) && (
                                <MenuButton
                                    icon={Shield}
                                    label="Admin"
                                    color="text-red-600 bg-red-100"
                                    onClick={() => handleNavigate("admin")}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-50 pb-[env(safe-area-inset-bottom,20px)]">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <NavButton
                        icon={Home}
                        label="Home"
                        isActive={currentScreen === "home"}
                        onClick={() => handleNavigate("home")}
                    />

                    <NavButton
                        icon={FolderKanban}
                        label="Projects"
                        isActive={currentScreen === "projects"}
                        onClick={() => handleNavigate("projects")}
                    />

                    <div className="relative -top-6">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-14 h-14 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
                        >
                            <Plus className={cn("w-8 h-8 transition-transform duration-200", isMenuOpen ? "rotate-45" : "")} />
                        </button>
                    </div>

                    <NavButton
                        icon={BarChart3}
                        label="Analysis"
                        isActive={currentScreen === "analysis"}
                        onClick={() => handleNavigate("analysis")}
                    />

                    <NavButton
                        icon={User}
                        label="Profile"
                        isActive={currentScreen === "profile"}
                        onClick={() => handleNavigate("profile")}
                    />
                </div>
            </div>
        </>
    );
};

const NavButton = ({ icon: Icon, label, isActive, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col items-center gap-1 min-w-[60px] transition-colors",
            isActive ? "text-[#800020]" : "text-slate-400"
        )}
    >
        <Icon className="w-6 h-6" />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
);

const MenuButton = ({ icon: Icon, label, color, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
    >
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", color)}>
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-slate-600">{label}</span>
    </button>
);

export default BottomNav;
