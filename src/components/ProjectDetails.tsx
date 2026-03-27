import React, { useState } from 'react';
import {
    ArrowLeft, MapPin, Calendar, DollarSign, User, Building2,
    CheckCircle2, Clock, AlertCircle, Share2, ThumbsUp, MessageSquare, Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useTheme } from '../contexts/ThemeContext';

interface ProjectDetailsProps {
    projectId: number;
    onBack: () => void;
    onSettings?: () => void;
}

// Mock Data (In a real app, fetch based on projectId)
const projectData = {
    id: 1,
    name: "Clean Water Initiative",
    status: "In Progress",
    location: "Nairobi County, Westlands",
    description: "This project aims to install 10 new water wells in rural communities to provide clean drinking water to over 5,000 residents. The initiative addresses the critical shortage of potable water in the region.",
    budget: {
        total: 50000,
        spent: 35000,
        currency: "USD"
    },
    dates: {
        start: "Jan 15, 2024",
        end: "Dec 20, 2024"
    },
    manager: "Water Services Trust Fund",
    contractor: "AquaTech Solutions Ltd",
    progress: 75,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200",
    timeline: [
        { title: "Project Initiation", date: "Jan 2024", status: "completed" },
        { title: "Site Survey", date: "Feb 2024", status: "completed" },
        { title: "Drilling Phase 1", date: "Apr 2024", status: "completed" },
        { title: "Pump Installation", date: "Aug 2024", status: "in-progress" },
        { title: "Final Testing", date: "Nov 2024", status: "pending" },
        { title: "Handover", date: "Dec 2024", status: "pending" }
    ],
    gallery: [
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
        "https://images.unsplash.com/photo-1574689049597-7e6c8e750369?w=400",
        "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=400"
    ]
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack, onSettings }) => {
    const { accentColor } = useTheme();
    const [activeTab, setActiveTab] = useState("overview");

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-slate-100 text-slate-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80">
                <img
                    src={projectData.image}
                    alt={projectData.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute top-4 left-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>

                {onSettings && (
                    <div className="absolute top-4 right-4 z-20">
                        <button
                            onClick={onSettings}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors text-white"
                        >
                            <Settings className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="max-w-5xl mx-auto">
                        <Badge className="bg-blue-500 text-white border-none mb-3">
                            {projectData.status}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{projectData.name}</h1>
                        <div className="flex items-center gap-4 text-sm md:text-base text-slate-200">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {projectData.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due: {projectData.dates.end}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 -mt-8 relative z-10">
                <Card className="p-1 mb-6 shadow-lg border-none bg-white/95 backdrop-blur">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full grid grid-cols-4 h-12 bg-transparent">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">Overview</TabsTrigger>
                            <TabsTrigger value="timeline" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">Timeline</TabsTrigger>
                            <TabsTrigger value="financials" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">Financials</TabsTrigger>
                            <TabsTrigger value="gallery" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">Gallery</TabsTrigger>
                        </TabsList>

                        <div className="p-6 bg-white rounded-b-xl">
                            <TabsContent value="overview" className="space-y-6 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">About this Project</h3>
                                            <p className="text-slate-600 leading-relaxed">{projectData.description}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="text-xs font-medium uppercase">Managed By</span>
                                                </div>
                                                <p className="font-semibold text-slate-800">{projectData.manager}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-xs font-medium uppercase">Contractor</span>
                                                </div>
                                                <p className="font-semibold text-slate-800">{projectData.contractor}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <Card className="p-5 bg-blue-50 border-blue-100">
                                            <h4 className="font-semibold text-blue-900 mb-4">Overall Progress</h4>
                                            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-200" />
                                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * projectData.progress) / 100} className="text-blue-600 transition-all duration-1000 ease-out" />
                                                </svg>
                                                <span className="absolute text-2xl font-bold text-blue-700">{projectData.progress}%</span>
                                            </div>
                                            <div className="text-center text-sm text-blue-700">
                                                On track for completion
                                            </div>
                                        </Card>

                                        <div className="flex gap-2">
                                            <Button className="flex-1 gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                                <ThumbsUp className="w-4 h-4" /> Support
                                            </Button>
                                            <Button variant="outline" className="flex-1 gap-2">
                                                <Share2 className="w-4 h-4" /> Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="mt-0">
                                <div className="space-y-8 relative pl-4">
                                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />
                                    {projectData.timeline.map((item, index) => (
                                        <div key={index} className="relative flex items-start gap-6 group">
                                            <div className={`w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.status === 'completed' ? 'bg-green-500 text-white' :
                                                item.status === 'in-progress' ? 'bg-blue-500 text-white' :
                                                    'bg-slate-200 text-slate-400'
                                                }`}>
                                                {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                                    item.status === 'in-progress' ? <Clock className="w-5 h-5 animate-pulse" /> :
                                                        <div className="w-3 h-3 rounded-full bg-slate-400" />}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`font-semibold ${item.status === 'pending' ? 'text-slate-500' : 'text-slate-800'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                                        {item.date}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 capitalize">{item.status.replace('-', ' ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="financials" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h3 className="text-sm font-medium text-slate-500 uppercase mb-4">Budget Utilization</h3>
                                            <div className="flex items-end gap-2 mb-2">
                                                <span className="text-4xl font-bold text-slate-800">
                                                    {projectData.budget.currency} {projectData.budget.spent.toLocaleString()}
                                                </span>
                                                <span className="text-lg text-slate-500 mb-1">
                                                    / {projectData.budget.total.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress value={(projectData.budget.spent / projectData.budget.total) * 100} className="h-3 mb-2" />
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>{Math.round((projectData.budget.spent / projectData.budget.total) * 100)}% Spent</span>
                                                <span>{projectData.budget.currency} {(projectData.budget.total - projectData.budget.spent).toLocaleString()} Remaining</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="p-4 border-l-4 border-l-green-500">
                                                <p className="text-xs text-slate-500 uppercase">Funds Released</p>
                                                <p className="text-xl font-bold text-slate-800 mt-1">$40,000</p>
                                            </Card>
                                            <Card className="p-4 border-l-4 border-l-orange-500">
                                                <p className="text-xs text-slate-500 uppercase">Pending Release</p>
                                                <p className="text-xl font-bold text-slate-800 mt-1">$10,000</p>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="text-center text-slate-400">
                                            <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Detailed expenditure report available for download</p>
                                            <Button variant="outline" className="mt-4">Download Report (PDF)</Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="gallery" className="mt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {projectData.gallery.map((img, idx) => (
                                        <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 group relative cursor-pointer">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
};

export default ProjectDetails;
