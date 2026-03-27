import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { ArrowLeft, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/Card';
import { Select } from './ui/select';
import { categories } from '../config/categories';
import { useTranslations } from '../utils/translations';
import { useTheme } from '../contexts/ThemeContext';

interface AnalysisProps {
    onBack?: () => void;
}

import CountyDashboard from './CountyDashboard';

import LeaderAnalysis from './LeaderAnalysis';

const Analysis: React.FC<AnalysisProps> = ({ onBack }) => {
    const { language } = useTheme();
    const t = useTranslations(language);
    const [activeTab, setActiveTab] = React.useState<'projects' | 'county' | 'leaders'>('projects');

    const categoryData = [
        { name: "Infrastructure", value: 320, color: categories[0].color },
        { name: "Water", value: 280, color: categories[1].color },
        { name: "Healthcare", value: 200, color: categories[3].color },
        { name: "Education", value: 180, color: categories[4].color },
        { name: "Electricity", value: 160, color: categories[2].color },
        { name: "Waste", value: 150, color: categories[6].color },
        { name: "Transportation", value: 140, color: categories[7].color },
        { name: "Digital Services", value: 130, color: categories[9].color },
        { name: "Agriculture", value: 120, color: categories[10].color },
        { name: "Youth & Sports", value: 110, color: categories[12].color },
        { name: "Other", value: 104, color: "#6b7280" },
    ];

    const statusData = [
        { name: "Jan", resolved: 65, unresolved: 45 },
        { name: "Feb", resolved: 75, unresolved: 38 },
        { name: "Mar", resolved: 85, unresolved: 30 },
        { name: "Apr", resolved: 90, unresolved: 25 },
        { name: "May", resolved: 110, unresolved: 20 },
        { name: "Jun", resolved: 125, unresolved: 18 },
    ];

    const regionData = [
        { region: "Nairobi", projects: 45, issues: 120 },
        { region: "Mombasa", projects: 32, issues: 85 },
        { region: "Kisumu", projects: 28, issues: 70 },
        { region: "Nakuru", projects: 25, issues: 65 },
        { region: "Eldoret", projects: 20, issues: 55 },
    ];

    const summaryCards = [
        { title: "Total Reports", value: "1,234", change: "+12%", trend: "up", icon: Activity },
        { title: "Resolution Rate", value: "72%", change: "+5%", trend: "up", icon: TrendingUp },
        { title: "Active Projects", value: "150", change: "+8", trend: "up", icon: TrendingUp },
        { title: "Avg Response Time", value: "3.2 days", change: "-0.5", trend: "down", icon: TrendingDown },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                    )}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800">Analytics Dashboard</h1>
                        <p className="text-sm text-slate-600">Insights and trends across regions</p>
                    </div>

                    {/* Toggle */}
                    {/* Mobile Dropdown */}
                    <div className="md:hidden w-40">
                        <Select
                            value={activeTab}
                            onChange={(val) => setActiveTab(val as 'projects' | 'county' | 'leaders')}
                            options={[
                                { value: 'projects', label: 'Projects' },
                                { value: 'county', label: 'County' },
                                { value: 'leaders', label: 'Leaders' }
                            ]}
                        />
                    </div>

                    {/* Desktop Toggle */}
                    <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('county')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'county' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            County
                        </button>
                        <button
                            onClick={() => setActiveTab('leaders')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'leaders' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Leaders
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {activeTab === 'leaders' ? (
                    <LeaderAnalysis />
                ) : activeTab === 'county' ? (
                    <CountyDashboard />
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {summaryCards.map((card, index) => {
                                const Icon = card.icon;
                                const isPositive = card.trend === "up";
                                return (
                                    <Card key={index} className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-xl ${isPositive ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {card.change}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                                        <p className="text-sm text-slate-500">{card.title}</p>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Issues by Category */}
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Issues by Category</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry: any) => entry.percent > 0.05 ? `${entry.name} ${(entry.percent * 100).toFixed(0)}%` : ''}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Monthly Trends */}
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Resolution Trends</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statusData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                            <YAxis stroke="#64748b" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                                                cursor={{ fill: '#f1f5f9' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="unresolved" name="Unresolved" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* Regional Data */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Regional Performance</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regionData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                                        <XAxis type="number" stroke="#64748b" fontSize={12} />
                                        <YAxis dataKey="region" type="category" stroke="#64748b" fontSize={12} width={80} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                                            cursor={{ fill: '#f1f5f9' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="projects" name="Active Projects" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="issues" name="Reported Issues" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default Analysis;
