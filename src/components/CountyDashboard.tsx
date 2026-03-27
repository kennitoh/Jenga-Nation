import React from 'react';
import {
    MapPin, TrendingUp, Users, AlertCircle, CheckCircle2,
    BarChart3, ArrowUpRight, ArrowDownRight, Award
} from 'lucide-react';
import { Card } from './ui/Card';
import { Progress } from './ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock Data
const countyStats = {
    name: "Nairobi County",
    population: "4.4M",
    budget: "KES 32B",
    governor: "Sakaja Arthur Johnson",
    performanceScore: 78,
    issues: {
        total: 1250,
        resolved: 890,
        pending: 360,
        trend: "+12%"
    },
    projects: {
        active: 45,
        completed: 120,
        delayed: 8
    }
};

const issueCategories = [
    { name: 'Roads', value: 400 },
    { name: 'Water', value: 300 },
    { name: 'Health', value: 200 },
    { name: 'Waste', value: 150 },
    { name: 'Power', value: 100 },
];

const monthlyResolution = [
    { name: 'Jan', resolved: 65, reported: 80 },
    { name: 'Feb', resolved: 70, reported: 85 },
    { name: 'Mar', resolved: 85, reported: 90 },
    { name: 'Apr', resolved: 90, reported: 95 },
    { name: 'May', resolved: 100, reported: 110 },
    { name: 'Jun', resolved: 110, reported: 105 },
];

const topWards = [
    { name: "Westlands", score: 92, status: "Excellent" },
    { name: "Langata", score: 88, status: "Good" },
    { name: "Kibra", score: 85, status: "Good" },
];

const CountyDashboard: React.FC = () => {
    const { accentColor } = useTheme();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Total Issues</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{countyStats.issues.total}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-red-500">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>{countyStats.issues.trend} from last month</span>
                    </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Resolution Rate</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {Math.round((countyStats.issues.resolved / countyStats.issues.total) * 100)}%
                            </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-green-500">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        <span>+5% improvement</span>
                    </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Active Projects</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{countyStats.projects.active}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                    </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-orange-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Citizen Engagement</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">High</h3>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Users className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Top 10% nationwide
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heatmap Placeholder */}
                <Card className="lg:col-span-2 p-6 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-slate-500" />
                            Issue Heatmap
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-red-500" /> High
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-green-500" /> Low
                            </span>
                        </div>
                    </div>

                    {/* Simulated Map Visual */}
                    <div className="relative w-full h-[300px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                        <p className="text-slate-400 font-medium">Interactive Map Integration Required</p>

                        {/* Mock Hotspots */}
                        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl" />
                        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                    </div>
                </Card>

                {/* Top Wards Leaderboard */}
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Top Performing Wards
                    </h3>
                    <div className="space-y-6">
                        {topWards.map((ward, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-slate-100 text-slate-700' :
                                            'bg-orange-100 text-orange-700'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-slate-800">{ward.name}</span>
                                        <span className="text-sm font-bold text-slate-600">{ward.score}/100</span>
                                    </div>
                                    <Progress value={ward.score} className="h-2" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-medium text-slate-500 mb-4">Issue Categories</h4>
                        <div className="h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={issueCategories}>
                                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Resolution Trend */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-500" />
                        Resolution Efficiency Trend
                    </h3>
                    <select className="text-sm border-slate-200 rounded-lg text-slate-600">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                    </select>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyResolution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="reported" stroke="#94a3b8" strokeWidth={2} dot={false} name="Issues Reported" />
                            <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} name="Issues Resolved" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default CountyDashboard;
