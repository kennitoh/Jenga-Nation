import React, { useState } from 'react';
import { ArrowLeft, User, Settings, History, LogOut, Bell, Globe, Shield, Briefcase, Gavel, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select } from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslations } from '../utils/translations';
import { supabase } from '../lib/supabase';
import ProfileSetup from './ProfileSetup';

interface ProfileProps {
    onBack?: () => void;
    userRole?: string;
    isProfileComplete: boolean;
    onProfileComplete: (data: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack, userRole = "citizen", isProfileComplete, onProfileComplete }) => {
    const { theme, setTheme, language, setLanguage } = useTheme();
    const t = useTranslations(language);

    // Initial mock state (simulating data fetched from DB)
    const [profileData, setProfileData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "Passionate about making my community better, one report at a time.",
        role: userRole,
        govPosition: "MCA", // Mock data if user was gov
        ngoFocus: "Environment", // Mock data if user was NGO
        ngoType: "Operational", // Mock data if user was NGO
        aspiringTarget: "Governor", // Mock data if user was aspiring
        county: "Nairobi",
        constituency: "Westlands",
        ward: "Parklands",
        verification_status: "unverified"
    });

    React.useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (data) {
                    setProfileData(prev => ({
                        ...prev,
                        ...data
                    }));
                }
            }
        };
        fetchUserData();
    }, []);

    const [isEditingRole, setIsEditingRole] = useState(false);
    const [activeTab, setActiveTab] = useState("activity");

    // Mock Data
    const contributionScore = 1250;
    const currentStreak = 5;
    const maxStreak = 12;

    const activities = [
        { id: 1, action: "Reported Issue", detail: "Pothole on Main St", date: "2 hours ago", status: "Pending", icon: Shield },
        { id: 2, action: "Voted in Poll", detail: "Community Library Project", date: "1 day ago", status: "Completed", icon: Globe },
        { id: 3, action: "Earned Badge", detail: "Community Guardian", date: "2 days ago", status: "Earned", icon: User },
        { id: 4, action: "Commented", detail: "On 'Water Supply' update", date: "3 days ago", status: "Posted", icon: History },
    ];

    const badges = [
        { id: 1, name: "First Report", icon: "📝", color: "bg-blue-100 text-blue-600" },
        { id: 2, name: "Week Streak", icon: "🔥", color: "bg-orange-100 text-orange-600" },
        { id: 3, name: "Top Voter", icon: "🗳️", color: "bg-purple-100 text-purple-600" },
        { id: 4, name: "Helper", icon: "🤝", color: "bg-green-100 text-green-600" },
    ];

    if (!isProfileComplete) {
        return (
            <div className="min-h-screen bg-slate-50 relative">
                <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-700" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Complete Profile</h1>
                            <p className="text-sm text-slate-600">Finish setting up your account</p>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <ProfileSetup onComplete={onProfileComplete} />
                </div>
            </div>
        )
    }

    if (isEditingRole) {
        return (
            <div className="min-h-screen bg-slate-50 relative">
                <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <button
                            onClick={() => setIsEditingRole(false)}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Update Community Role</h1>
                            <p className="text-sm text-slate-600">Upgrade or change your account type</p>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <ProfileSetup
                        initialData={{ ...profileData, fullName: profileData.name }} // Map name to fullName
                        startStep={4}
                        onComplete={(data) => {
                            setProfileData(prev => ({ ...prev, ...data, name: data.fullName }));
                            onProfileComplete(data); // Notify parent if needed
                            setIsEditingRole(false);
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
                        <p className="text-sm text-slate-600">Manage your account and settings</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                {/* User Card */}
                <Card className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white border-none">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 shrink-0">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{profileData.name}</h2>
                            <p className="text-slate-300 text-sm mb-2">{profileData.email}</p>
                            <p className="text-slate-200 text-sm italic mb-4">"{profileData.bio}"</p>

                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-blue-500/20 text-blue-100 border border-blue-500/30">{profileData.county} Resident</Badge>
                                <Badge className="bg-green-500/20 text-green-100 border border-green-500/30">Level 3 Contributor</Badge>

                                {profileData.verification_status === 'verified' && (
                                    <Badge className="bg-emerald-500 text-white border-emerald-600 shadow-sm flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Verified Publisher
                                    </Badge>
                                )}

                                {profileData.role === 'gov' && (
                                    <Badge className="bg-purple-500/20 text-purple-100 border border-purple-500/30 flex items-center gap-1">
                                        <Gavel className="w-3 h-3" /> {profileData.govPosition}
                                    </Badge>
                                )}
                                {profileData.role === 'ngo' && (
                                    <Badge className="bg-yellow-500/20 text-yellow-100 border border-yellow-500/30 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {profileData.ngoType || 'NGO'} - {profileData.ngoFocus}
                                    </Badge>
                                )}
                                {profileData.role === 'aspiring' && (
                                    <Badge className="bg-pink-500/20 text-pink-100 border border-pink-500/30 flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" /> Aspiring {profileData.aspiringTarget}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{contributionScore}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Score</div>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <div className="text-2xl font-bold text-orange-400">{currentStreak} <span className="text-sm">days</span></div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Streak</div>
                        </div>
                        {!['ngo', 'gov', 'aspiring'].includes(profileData.role || '') && (
                            <div className="text-center border-l border-white/10">
                                <div className="text-2xl font-bold text-purple-400">{badges.length}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider">Badges</div>
                            </div>
                        )}
                    </div>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        {!['ngo', 'gov', 'aspiring'].includes(profileData.role || '') && (
                            <TabsTrigger value="badges">Badges</TabsTrigger>
                        )}
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity" className="space-y-4">
                        {activities.map((activity) => (
                            <Card key={activity.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <activity.icon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{activity.action}</h4>
                                        <p className="text-sm text-slate-600">{activity.detail}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 block mb-1">{activity.date}</span>
                                    <Badge className="bg-slate-100 text-slate-600 text-[10px]">{activity.status}</Badge>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="badges" className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {badges.map((badge) => (
                                <Card key={badge.id} className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${badge.color}`}>
                                        {badge.icon}
                                    </div>
                                    <h4 className="font-semibold text-slate-800">{badge.name}</h4>
                                </Card>
                            ))}
                            {/* Locked Badge Placeholder */}
                            <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 border-dashed border-2 bg-slate-50 opacity-60">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h4 className="font-medium text-slate-500">Locked</h4>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        {/* Account Settings */}
                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <User className="w-5 h-5" /> Account Information
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Bio</label>
                                <Input value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                            </div>
                        </Card>

                        {/* Community Role Settings */}
                        <Card className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Community Role
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Current Role</p>
                                    <p className="font-semibold text-slate-800 capitalize">
                                        {profileData.role === 'gov' ? 'Government Official' :
                                            profileData.role === 'ngo' ? 'NGO / Institution' :
                                                profileData.role === 'aspiring' ? 'Aspiring Leader' : 'Citizen'}
                                    </p>
                                    {profileData.role === 'gov' && <p className="text-xs text-blue-600">{profileData.govPosition}</p>}
                                    {profileData.role === 'ngo' && <p className="text-xs text-blue-600">{profileData.ngoType} - {profileData.ngoFocus}</p>}
                                    {profileData.role === 'aspiring' && <p className="text-xs text-blue-600">Running for {profileData.aspiringTarget}</p>}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditingRole(true)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                    Change Role
                                </Button>
                            </div>
                        </Card>

                        <Button
                            variant="destructive"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.reload();
                            }}
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
