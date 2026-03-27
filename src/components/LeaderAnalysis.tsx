import React, { useState } from 'react';
import { Search, Filter, User, Building2, Vote } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import LeaderScorecard from './LeaderScorecard';
import { mockLeaders, Leader, LeaderType } from '../data/mockLeaders';

const LeaderAnalysis: React.FC = () => {
    const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
    const [filterType, setFilterType] = useState<LeaderType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLeaders = mockLeaders.filter(leader => {
        const matchesType = filterType === 'all' || leader.type === filterType;
        const matchesSearch = leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            leader.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (selectedLeader) {
        return <LeaderScorecard leader={selectedLeader} onBack={() => setSelectedLeader(null)} />;
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Search leaders, roles, or regions..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('government')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'government' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <Building2 className="w-4 h-4" /> Gov
                    </button>
                    <button
                        onClick={() => setFilterType('aspiring')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'aspiring' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <Vote className="w-4 h-4" /> Aspiring
                    </button>
                    <button
                        onClick={() => setFilterType('ngo')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'ngo' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <User className="w-4 h-4" /> NGOs
                    </button>
                </div>
            </div>

            {/* Leaders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeaders.map((leader) => (
                    <Card
                        key={leader.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => setSelectedLeader(leader)}
                    >
                        <div className="flex items-start gap-4">
                            <img
                                src={leader.photo}
                                alt={leader.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-blue-100 transition-colors"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 truncate">{leader.name}</h3>
                                    <Badge className={`
                                        ${leader.performanceScore >= 80 ? 'bg-green-100 text-green-700' : ''}
                                        ${leader.performanceScore >= 60 && leader.performanceScore < 80 ? 'bg-blue-100 text-blue-700' : ''}
                                        ${leader.performanceScore < 60 ? 'bg-orange-100 text-orange-700' : ''}
                                    `}>
                                        {leader.performanceScore}%
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-1">{leader.role}</p>
                                <p className="text-xs text-slate-400 truncate">{leader.region}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-sm font-bold text-slate-800">{leader.stats.projectsCompleted}</div>
                                <div className="text-[10px] text-slate-500 uppercase">Projects</div>
                            </div>
                            <div className="border-l border-slate-100">
                                <div className="text-sm font-bold text-slate-800">{leader.sentiment.approval}%</div>
                                <div className="text-[10px] text-slate-500 uppercase">Approval</div>
                            </div>
                            <div className="border-l border-slate-100">
                                <div className="text-sm font-bold text-slate-800">{leader.transparency.trustScore}</div>
                                <div className="text-[10px] text-slate-500 uppercase">Trust</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LeaderAnalysis;
