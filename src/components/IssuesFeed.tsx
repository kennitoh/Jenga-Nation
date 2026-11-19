import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, MessageSquare, ThumbsUp, Search, FileText } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { categories, getCategoryById } from '../config/categories';
import { LiveIssue, fetchIssues, relativeTime, statusColor, statusLabel } from '../lib/issues';

interface IssuesFeedProps {
    onBack: () => void;
    onSelectIssue: (id: number) => void;
    onReport: () => void;
}

const STATUS_FILTERS = ['all', 'Active', 'In Progress', 'Resolved'];

const IssuesFeed: React.FC<IssuesFeedProps> = ({ onBack, onSelectIssue, onReport }) => {
    const [issues, setIssues] = useState<LiveIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');

    useEffect(() => {
        let cancelled = false;
        fetchIssues(100).then(rows => {
            if (!cancelled) {
                setIssues(rows);
                setLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return issues.filter(i =>
            (category === 'all' || i.category === category) &&
            (status === 'all' || i.status === status) &&
            (!q || i.title.toLowerCase().includes(q) || i.location.toLowerCase().includes(q))
        );
    }, [issues, search, category, status]);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Community Reports</h1>
                        <p className="text-sm text-slate-600">Reports from residents, with their status</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search by title or place"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Select value={category} onChange={setCategory}>
                        <option value="all">All categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    <Select value={status} onChange={setStatus}>
                        {STATUS_FILTERS.map(s => (
                            <option key={s} value={s}>{s === 'all' ? 'All statuses' : statusLabel(s)}</option>
                        ))}
                    </Select>
                </div>

                {loading && <p className="text-center text-slate-500 py-10">Loading reports...</p>}

                {!loading && filtered.length === 0 && (
                    <Card className="p-8 text-center space-y-3">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-slate-600">
                            {issues.length === 0
                                ? 'No reports have been published yet. Reports appear here once a moderator approves them.'
                                : 'No reports match your filters.'}
                        </p>
                        <Button onClick={onReport}>Report an issue</Button>
                    </Card>
                )}

                {filtered.map(issue => {
                    const cat = getCategoryById(issue.category);
                    const Icon = cat?.icon;
                    return (
                        <Card
                            key={issue.id}
                            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => onSelectIssue(issue.id)}
                        >
                            <div className="flex items-start gap-4">
                                {Icon && (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: cat?.bgColor }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: cat?.color }} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-semibold text-slate-800">{issue.title}</h3>
                                        <Badge className={`shrink-0 ${statusColor(issue.status)}`}>{statusLabel(issue.status)}</Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                        <MapPin className="w-3 h-3" /> {issue.location}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {issue.upvotes}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {issue.commentsCount}</span>
                                        <span className="ml-auto">{relativeTime(issue.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default IssuesFeed;
