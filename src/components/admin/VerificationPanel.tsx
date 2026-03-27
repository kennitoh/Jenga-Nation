import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/badge';
import { supabase } from '../../lib/supabase';
import { Screen } from '../../types';

interface VerificationPanelProps {
    onBack: () => void;
}

const VerificationPanel: React.FC<VerificationPanelProps> = ({ onBack }) => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingReports();
    }, []);

    const fetchPendingReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('issues')
            .select(`
                *,
                profiles ( name )
            `)
            .eq('status', 'Pending') // ONLY Pending issues for moderation
            .order('date', { ascending: false });

        if (data) {
            setReports(data.map((d: any) => ({
                id: d.id,
                title: d.title,
                category: d.category,
                author: d.profiles?.name || 'Anonymous',
                date: new Date(d.date).toISOString().split('T')[0],
                status: 'pending',
                description: d.description
            })));
        }
        setLoading(false);
    };

    const handleAction = async (id: number, action: "approve" | "reject") => {
        const newStatus = action === "approve" ? "Active" : "Rejected";
        // Attempt Update in Supabase (Protected by RLS)
        const { error } = await supabase.from('issues').update({ status: newStatus }).eq('id', id);

        if (!error) {
            // Remove from the pending list instantly
            setReports(reports.filter(r => r.id !== id));
        } else {
            console.error("Failed to update status", error);
            alert("Verification Failed: You do not have the required admin_role to verify issues.");
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
                            <p className="text-sm text-slate-600">Strictly for approving, rejecting, and reviewing suspicious reports</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <Card className="p-4 bg-orange-50 border-orange-100 mb-6">
                    <p className="text-sm text-orange-800 font-medium">
                        <strong>Moderation Workspace:</strong> You are viewing only issues that are currently in 'Pending' status. Verifying an issue makes it visible/actionable to the rest of the community.
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
                                    <th className="px-6 py-3 text-center">Verification Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading pending issues...</td>
                                    </tr>
                                ) : reports.map((report) => (
                                    <tr key={report.id} className="bg-white border-b border-slate-50 hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 mb-1">{report.title}</p>
                                            <p className="text-xs text-slate-500 line-clamp-2">{report.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-slate-100 text-slate-700">{report.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4">{report.author}</td>
                                        <td className="px-6 py-4">{report.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 justify-center">
                                                <button
                                                    onClick={() => handleAction(report.id, 'approve')}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors"
                                                    title="Approve & Mark Active"
                                                >
                                                    <Check className="w-4 h-4" /> <span className="text-xs font-bold">Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAction(report.id, 'reject')}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                                                    title="Reject Issue"
                                                >
                                                    <X className="w-4 h-4" /> <span className="text-xs font-bold">Reject</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && reports.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                            No pending issues need verification right now.
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
