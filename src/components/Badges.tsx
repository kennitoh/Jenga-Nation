import React, { useState } from 'react';
import { ArrowLeft, Award, Lock, Star, Shield, Zap, Heart, Globe } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface BadgesProps {
    onBack?: () => void;
}

interface BadgeItem {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    status: "earned" | "in_progress" | "locked";
    progress: number;
    total: number;
    color: string;
    dateEarned?: string;
}

const badgesData: BadgeItem[] = [
    {
        id: "1",
        name: "Community Guardian",
        description: "Report 5 verified issues in your neighborhood",
        icon: Shield,
        status: "earned",
        progress: 5,
        total: 5,
        color: "#3b82f6", // blue
        dateEarned: "Oct 15, 2023"
    },
    {
        id: "2",
        name: "Civic Voter",
        description: "Participate in 10 community polls",
        icon: Star,
        status: "in_progress",
        progress: 7,
        total: 10,
        color: "#eab308", // yellow
    },
    {
        id: "3",
        name: "Project Backer",
        description: "Support or follow 3 development projects",
        icon: Heart,
        status: "in_progress",
        progress: 1,
        total: 3,
        color: "#ef4444", // red
    },
    {
        id: "4",
        name: "Super Reporter",
        description: "Report 20 verified issues",
        icon: Zap,
        status: "locked",
        progress: 5,
        total: 20,
        color: "#8b5cf6", // purple
    },
    {
        id: "5",
        name: "Global Citizen",
        description: "Participate in discussions across 3 different regions",
        icon: Globe,
        status: "locked",
        progress: 0,
        total: 3,
        color: "#10b981", // green
    },
    {
        id: "6",
        name: "Early Adopter",
        description: "Join Jenga Nation during the beta phase",
        icon: Award,
        status: "earned",
        progress: 1,
        total: 1,
        color: "#f97316", // orange
        dateEarned: "Sep 01, 2023"
    }
];

const Badges: React.FC<BadgesProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("all");

    const earnedBadges = badgesData.filter(b => b.status === "earned");
    // Unused filters removed

    const renderBadgeGrid = (badges: BadgeItem[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-slate-50 to-blue-50/30 pb-24">
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 shadow-sm flex items-center justify-center"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-slate-800">Achievements & Badges</h1>
                        <p className="text-small text-slate-600">Track your community impact</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <Card className="p-6 rounded-3xl border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-green-600 mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl">👤</span>
                        </div>
                        <h2 className="text-slate-800 mb-2">Sarah M.</h2>
                        <div className="flex justify-center gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">450</p>
                                <p className="text-small text-slate-600">Points</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{earnedBadges.length}</p>
                                <p className="text-small text-slate-600">Badges</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-slate-800 flex items-center gap-2">
                        🏆 Your Badges
                    </h2>
                    {renderBadgeGrid(badgesData)}
                </div>
            </div>
        </div>
    );
};

const BadgeCard: React.FC<{ badge: BadgeItem }> = ({ badge }) => {
    const Icon = badge.icon;
    const isLocked = badge.status === "locked";
    const isEarned = badge.status === "earned";
    const percent = (badge.progress / badge.total) * 100;

    return (
        <Card className={`p-4 flex items-start gap-4 ${isLocked ? "opacity-60 bg-slate-50" : "bg-white"}`}>
            <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isLocked ? "bg-slate-200" : ""
                    }`}
                style={{ backgroundColor: !isLocked ? `${badge.color}20` : undefined }}
            >
                {isLocked ? (
                    <Lock className="w-6 h-6 text-slate-400" />
                ) : (
                    <Icon className="w-6 h-6" style={{ color: badge.color }} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 truncate pr-2">{badge.name}</h4>
                    {isEarned && (
                        <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 h-5">
                            Earned
                        </Badge>
                    )}
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{badge.description}</p>

                {!isEarned && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                            <span>Progress</span>
                            <span>{badge.progress} / {badge.total}</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                    </div>
                )}

                {isEarned && badge.dateEarned && (
                    <p className="text-[10px] text-slate-400 mt-2">Earned on {badge.dateEarned}</p>
                )}
            </div>
        </Card>
    );
};

export default Badges;
