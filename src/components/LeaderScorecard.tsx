import React, { useState } from 'react';
import {
    ArrowLeft, CheckCircle2, TrendingUp, TrendingDown, Activity,
    Building2, Users, FileText, AlertCircle, ThumbsUp, ThumbsDown,
    Shield, Award, PieChart as PieIcon
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Leader } from '../data/mockLeaders';

interface LeaderScorecardProps {
    leader: Leader;
    onBack: () => void;
}

const LeaderScorecard: React.FC<LeaderScorecardProps> = ({ leader, onBack }) => {
    const [activeTab, setActiveTab] = useState<'performance' | 'projects' | 'sentiment' | 'transparency'>('performance');

    const contributionData = [
        { name: 'Infrastructure', value: leader.contribution.infrastructure, color: '#3b82f6' },
        { name: 'Education', value: leader.contribution.education, color: '#8b5cf6' },
        { name: 'Healthcare', value: leader.contribution.healthcare, color: '#10b981' },
        { name: 'Youth', value: leader.contribution.youth, color: '#f59e0b' },
        { name: 'Agriculture', value: leader.contribution.agriculture, color: '#ef4444' },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Leader Scorecard</h2>
            </div>

            {/* Profile Card */}
            <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img
                            src={leader.photo}
                            alt={leader.name}
                            className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-slate-900">
                            {leader.performanceScore}%
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold">{leader.name}</h1>
                            <Badge className="bg-white/10 text-white border-white/20 w-fit mx-auto md:mx-0">
                                {leader.role}
                            </Badge>
                        </div>
                        <p className="text-slate-300 mb-4">{leader.region}</p>
                        <p className="text-sm text-slate-400 italic max-w-2xl">"{leader.bio}"</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <ThumbsUp className="w-4 h-4" /> Support
                        </Button>
                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
                            <Activity className="w-4 h-4" /> Follow
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'performance', label: 'Performance', icon: Activity },
                    { id: 'projects', label: 'Projects', icon: Building2 },
                    { id: 'sentiment', label: 'Sentiment', icon: Users },
                    { id: 'transparency', label: 'Transparency', icon: Shield },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'performance' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Key Metrics */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Activity Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{leader.stats.projectsCompleted}</div>
                                    <div className="text-xs text-slate-600">Projects Completed</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600">{leader.stats.issuesResolved}</div>
                                    <div className="text-xs text-slate-600">Issues Resolved</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">{leader.stats.communityVisits}</div>
                                    <div className="text-xs text-slate-600">Community Visits</div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-600">{leader.stats.responseRate}</div>
                                    <div className="text-xs text-slate-600">Avg Response Time</div>
                                </div>
                            </div>
                        </Card>

                        {/* Contribution Breakdown */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Focus Areas</h3>
                            <div className="h-[200px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={contributionData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {contributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                {contributionData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1 text-xs text-slate-600">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                        {entry.name} ({entry.value}%)
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Aspiring Leader: Promise Tracker */}
                        {leader.type === 'aspiring' && leader.promises && (
                            <Card className="p-6 md:col-span-2">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Promise Tracker</h3>
                                <div className="space-y-4">
                                    {leader.promises.map((promise) => (
                                        <div key={promise.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-slate-800">{promise.title}</h4>
                                                    <Badge className="bg-white text-slate-600 border-slate-200 text-[10px]">{promise.category}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span>Timeline: {promise.timeline}</span>
                                                    <span>Difficulty: {promise.difficulty}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">{promise.approval}%</div>
                                                <div className="text-xs text-slate-500">Approval</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'sentiment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Approval Rating</h3>
                            <div className="flex items-center justify-center py-8">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-8 border-slate-100" />
                                    <div
                                        className="absolute inset-0 rounded-full border-8 border-green-500 border-l-transparent border-b-transparent transform -rotate-45"
                                        style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }} // Simplified visual
                                    />
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-slate-800">{leader.sentiment.approval}%</div>
                                        <div className="text-sm text-slate-500">Approval</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Sentiment Trend</h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={leader.sentiment.monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                <ThumbsUp className="w-5 h-5" /> Top Praises
                            </h3>
                            <div className="space-y-2">
                                {leader.sentiment.praises.map((praise, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        {praise}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                                <ThumbsDown className="w-5 h-5" /> Top Complaints
                            </h3>
                            <div className="space-y-2">
                                {leader.sentiment.complaints.map((complaint, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-800">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {complaint}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'transparency' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Integrity Index</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Community Trust Score</span>
                                        <span className="text-sm font-bold text-blue-600">{leader.transparency.trustScore}/100</span>
                                    </div>
                                    <Progress value={leader.transparency.trustScore} className="h-2" />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700">Open Budget Access</span>
                                    </div>
                                    {leader.transparency.openBudget ? (
                                        <Badge className="bg-green-100 text-green-700">Available</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-700">Restricted</Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700">Audit Status</span>
                                    </div>
                                    <Badge className={`
                                        ${leader.transparency.auditStatus === 'Clean' ? 'bg-green-100 text-green-700' : ''}
                                        ${leader.transparency.auditStatus === 'Queries' ? 'bg-orange-100 text-orange-700' : ''}
                                        ${leader.transparency.auditStatus === 'Pending' ? 'bg-slate-100 text-slate-700' : ''}
                                    `}>
                                        {leader.transparency.auditStatus}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* NGO Impact Score */}
                        {leader.type === 'ngo' && leader.impact && (
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Impact Efficiency</h3>
                                <div className="space-y-6">
                                    <div className="text-center p-6 bg-blue-50 rounded-2xl">
                                        <div className="text-4xl font-bold text-blue-600 mb-1">{leader.impact.fundsUtilized}%</div>
                                        <div className="text-sm text-blue-800 font-medium">Funds Utilized for Projects</div>
                                        <div className="text-xs text-blue-600 mt-1">(vs Administration costs)</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-slate-800">{leader.impact.communitiesHelped}</div>
                                            <div className="text-xs text-slate-500">Communities</div>
                                        </div>
                                        <div className="p-4 border border-slate-200 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-slate-800">{leader.impact.specialization.length}</div>
                                            <div className="text-xs text-slate-500">Focus Areas</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === 'projects' && (
                    <Card className="p-8 text-center text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Project list integration coming soon...</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LeaderScorecard;
