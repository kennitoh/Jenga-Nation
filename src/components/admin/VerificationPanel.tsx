import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, X, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/badge';
import { supabase } from '../../lib/supabase';
import { statusColor, statusLabel } from '../../lib/issues';

interface VerificationPanelProps {
    onBack: () => void;
}

type Tab = 'pending' | 'open';

const VerificationPanel: React.FC<VerificationPanelProps> = ({ onBack }) => {
    const [tab, setTab] = useState<Tab>('pending');
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async (which: Tab) => {
        setLoading(true);
        let query = supabase
            .from('issues')
            .select('id,title,description,category,status,reporter_id,date,created_at')
            .order('created_at', { ascending: false });

        query = which === 'pending'
            ? query.eq('status', 'Pending') // ONLY Pending issues for moderation
            : query.in('status', ['Active', 'In Progress']);

        const { data } = await query;

        if (data) {
            // Reporter names (verifiers can read profiles under RLS)
            const ids = Array.from(new Set(data.map((d: any) => d.reporter_id).filter(Boolean)));
            const names: Record<string, string> = {};
            if (ids.length > 0) {
                const { data: people } = await supabase.from('profiles').select('id,name').in('id', ids);
                (people || []).forEach((p: any) => { names[p.id] = p.name; });
            }
            setReports(data.map((d: any) => ({
                id: d.id,
                title: d.title,
                category: d.category,
                status: String(d.status),
                author: d.reporter_id ? (names[d.reporter_id] || 'Community member') : 'Anonymous',
                date: new Date(d.created_at || d.date).toISOString().split('T')[0],
                description: d.description
            })));
        } else {
            setReports([]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchReports(tab);
    }, [tab, fetchReports]);

    const setStatus = async (id: number, newStatus: 'Active' | 'Rejected' | 'In Progress' | 'Resolved') => {
        // Protected by RLS: only verifiers / national admins can update issues.
        // A database trigger records the timeline step and notifies the reporter.
        const { data, error } = await supabase.from('issues').update({ status: newStatus }).eq('id', id).select('id');

        if (!error && data && data.length > 0) {
            // Update lists instantly
            if (tab === 'pending' || newStatus === 'Resolved') {
                setReports(prev => prev.filter(r => r.id !== id));
            } else {
                setReports(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
            }
        } else {
            console.error("Failed to update status", error);
            alert("Update failed: you do not have the required admin_role to change issue status.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" /> Verification Panel
                            </h1>
                            <p className="text-sm text-slate-600">Approve or reject reports, then move them through to resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex gap-2">
                    {([['pending', 'Pending review'], ['open', 'Open & in progress']] as [Tab, string][]).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === key
                                ? 'bg-[#800020] text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <Card className="p-4 bg-orange-50 border-orange-100 mb-6">
                    <p className="text-sm text-orange-800 font-medium">
                        <strong>Moderation Workspace:</strong>{' '}
                        {tab === 'pending'
                            ? "You are viewing issues in 'Pending' status. Approving an issue makes it public and notifies the reporter."
                            : "Move approved issues forward. Each change is recorded on the issue's timeline and the reporter is notified."}
                    </p>
                </Card>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Issue Title & Details</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Reporter</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading issues...</td>
                                    </tr>
                                ) : reports.map((report) => (
                                    <tr key={report.id} className="bg-white border-b border-slate-50 hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 mb-1">{report.title}</p>
                                            <p className="text-xs text-slate-500 line-clamp-2">{report.description}</p>
                                            {tab === 'open' && (
                                                <Badge className={`mt-2 ${statusColor(report.status)}`}>{statusLabel(report.status)}</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-slate-100 text-slate-700">{report.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4">{report.author}</td>
                                        <td className="px-6 py-4">{report.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 justify-center flex-wrap">
                                                {tab === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => setStatus(report.id, 'Active')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                                                            title="Approve & Mark Active"
                                                        >
                                                            <Check className="w-4 h-4" /> <span className="text-xs font-bold">Approve</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setStatus(report.id, 'Rejected')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                                                            title="Reject Issue"
                                                        >
                                                            <X className="w-4 h-4" /> <span className="text-xs font-bold">Reject</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {report.status === 'Active' && (
                                                            <button
                                                                onClick={() => setStatus(report.id, 'In Progress')}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                                                                title="Mark as in progress"
                                                            >
                                                                <Play className="w-4 h-4" /> <span className="text-xs font-bold">Start work</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setStatus(report.id, 'Resolved')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                                                            title="Mark as resolved"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" /> <span className="text-xs font-bold">Resolve</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && reports.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                            {tab === 'pending'
                                                ? 'No pending issues need verification right now.'
                                                : 'No open issues right now.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VerificationPanel;
