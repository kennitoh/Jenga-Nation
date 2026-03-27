import React from 'react';
import { ArrowLeft, BarChart3, Users, AlertTriangle, CheckCircle2, DollarSign, PieChart, Activity } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface PartnerPortalProps {
    onBack: () => void;
}

const PartnerPortal: React.FC<PartnerPortalProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Partner Portal</h1>
                            <p className="text-sm text-slate-600">Nairobi County Government Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Activity className="w-4 h-4" />
                            Live Feed
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <DollarSign className="w-4 h-4" />
                            Allocate Funds
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-white border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Total Issues</span>
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">1,248</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <span>+12%</span>
                            <span className="text-slate-400">vs last month</span>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Resolved</span>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">856</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <span>68%</span>
                            <span className="text-slate-400">resolution rate</span>
                        </div>
                    </Card>
                    <Card className="p-4 bg-white border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Active Projects</span>
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">24</div>
                        <div className="text-xs text-slate-400 mt-1">
                            8 nearing completion
                        </div>
                    </Card>
                    <Card className="p-4 bg-white border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Citizen Engagement</span>
                            <Users className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">45.2k</div>
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <span>+5.4%</span>
                            <span className="text-slate-400">active users</span>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Priority Issues */}
                    <Card className="lg:col-span-2 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800">Priority Issues</h3>
                            <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: 1, title: "Flooding in South C", category: "Disaster", urgency: "Critical", time: "2h ago" },
                                { id: 2, title: "Power Outage - Westlands", category: "Energy", urgency: "High", time: "4h ago" },
                                { id: 3, title: "Blocked Drainage - CBD", category: "Infrastructure", urgency: "Medium", time: "6h ago" },
                            ].map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full ${issue.urgency === 'Critical' ? 'bg-red-500' :
                                                issue.urgency === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                                            }`} />
                                        <div>
                                            <h4 className="font-medium text-slate-800">{issue.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <span>{issue.category}</span>
                                                <span>•</span>
                                                <span>{issue.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`${issue.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                                                issue.urgency === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {issue.urgency}
                                        </Badge>
                                        <Button size="sm" variant="outline">Assign</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Resource Allocation */}
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-6">Budget Allocation</h3>
                        <div className="space-y-6">
                            {[
                                { category: "Infrastructure", amount: "KES 45M", percent: 75, color: "bg-blue-500" },
                                { category: "Health", amount: "KES 28M", percent: 60, color: "bg-green-500" },
                                { category: "Education", amount: "KES 15M", percent: 45, color: "bg-yellow-500" },
                                { category: "Environment", amount: "KES 12M", percent: 30, color: "bg-purple-500" },
                            ].map((item) => (
                                <div key={item.category}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700">{item.category}</span>
                                        <span className="text-slate-500">{item.amount}</span>
                                    </div>
                                    <Progress value={item.percent} className="h-2" indicatorClassName={item.color} />
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-6" variant="outline">Download Report</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PartnerPortal;
