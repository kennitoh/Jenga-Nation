import React, { useState } from 'react';
import {
    Trophy, Star, Target, CheckCircle2, ArrowLeft, Gift,
    Flame, Shield, Zap, Lock
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useTheme } from '../contexts/ThemeContext';

interface MissionsProps {
    onBack?: () => void;
}

const Missions: React.FC<MissionsProps> = ({ onBack }) => {
    const { accentColor } = useTheme();
    const [userXP, setUserXP] = useState(1250);
    const [userLevel, setUserLevel] = useState(5);
    const nextLevelXP = 2000;

    const [missions, setMissions] = useState([
        {
            id: 1,
            title: "Community Watch",
            description: "Report 3 issues in your neighborhood",
            progress: 2,
            total: 3,
            xp: 150,
            status: "active", // active, completed, claimed
            icon: Shield,
            color: "blue"
        },
        {
            id: 2,
            title: "Fact Checker",
            description: "Verify 5 reported issues",
            progress: 5,
            total: 5,
            xp: 300,
            status: "completed",
            icon: CheckCircle2,
            color: "green"
        },
        {
            id: 3,
            title: "Daily Streak",
            description: "Open the app 7 days in a row",
            progress: 4,
            total: 7,
            xp: 100,
            status: "active",
            icon: Flame,
            color: "orange"
        },
        {
            id: 4,
            title: "Project Supporter",
            description: "Upvote or comment on 2 projects",
            progress: 0,
            total: 2,
            xp: 50,
            status: "active",
            icon: Zap,
            color: "purple"
        }
    ]);

    const handleClaim = (id: number) => {
        setMissions(missions.map(m => {
            if (m.id === id) {
                setUserXP(prev => prev + m.xp);
                return { ...m, status: "claimed" };
            }
            return m;
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header with XP Card */}
            <div className="bg-slate-900 text-white p-6 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10" />

                <div className="relative z-10 max-w-md mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold">Missions & Rewards</h1>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Current Level</p>
                            <h2 className="text-4xl font-bold flex items-center gap-2">
                                {userLevel}
                                <span className="text-lg font-normal text-slate-400">Citizen</span>
                            </h2>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform rotate-3">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-300">
                            <span>{userXP} XP</span>
                            <span>{nextLevelXP} XP</span>
                        </div>
                        <Progress value={(userXP / nextLevelXP) * 100} className="h-3 bg-slate-800" />
                        <p className="text-xs text-slate-400 text-right">
                            {nextLevelXP - userXP} XP to Level {userLevel + 1}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-16 relative z-10 space-y-6">
                {/* Daily Rewards Card */}
                <Card className="p-6 bg-white shadow-xl border-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-pink-500" />
                            Daily Login Bonus
                        </h3>
                        <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                            Day 4/7
                        </Badge>
                    </div>
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                            <div key={day} className={`flex-1 aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold ${day <= 4 ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-slate-50 text-slate-300 border border-slate-100'
                                }`}>
                                <span>{day}</span>
                                {day <= 4 ? <CheckCircle2 className="w-3 h-3 mt-1" /> : <Lock className="w-3 h-3 mt-1" />}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Missions List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Active Missions</h3>
                    {missions.map((mission) => {
                        const Icon = mission.icon;
                        const isCompleted = mission.progress >= mission.total;
                        const isClaimed = mission.status === 'claimed';

                        return (
                            <Card key={mission.id} className={`p-4 transition-all ${isClaimed ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mission.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        mission.color === 'green' ? 'bg-green-100 text-green-600' :
                                            mission.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800">{mission.title}</h4>
                                            <Badge className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                {mission.xp} XP
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">{mission.description}</p>

                                        {!isClaimed && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium text-slate-600">
                                                    <span>Progress</span>
                                                    <span>{mission.progress} / {mission.total}</span>
                                                </div>
                                                <Progress value={(mission.progress / mission.total) * 100} className="h-2" />
                                            </div>
                                        )}

                                        {isCompleted && !isClaimed && (
                                            <Button
                                                onClick={() => handleClaim(mission.id)}
                                                className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md shadow-orange-200"
                                            >
                                                Claim Reward
                                            </Button>
                                        )}

                                        {isClaimed && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 p-2 rounded-lg justify-center">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Reward Claimed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Missions;
