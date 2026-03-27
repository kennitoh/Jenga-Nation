import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { Screen } from '../../types';

interface GovDashboardProps {
    onBack?: () => void;
    onNavigate: (screen: Screen) => void;
}

const GovDashboard: React.FC<GovDashboardProps> = ({ onBack, onNavigate }) => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        resolved: 0
    });
    const [recentReports, setRecentReports] = useState<any[]>([]);

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        // Fetch stats
        const { data: issues } = await supabase.from('issues').select('status');
        if (issues) {
            setStats({
                total: issues.length,
                pending: issues.filter(i => i.status.toLowerCase() === 'pending').length,
                active: issues.filter(i => i.status.toLowerCase() === 'active').length,
                resolved: issues.filter(i => i.status.toLowerCase() === 'resolved').length,
            });
        }

        // Fetch recent
        const { data: recent } = await supabase
            .from('issues')
            .select(`id, title, category, date, status`)
            .order('date', { ascending: false })
            .limit(5);

        if (recent) setRecentReports(recent);
    };

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
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Gov Control Center</h1>
                        <p className="text-sm text-slate-600">High-level overview of national and county operations</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 flex flex-col items-center justify-center text-center bg-white border-slate-200 shadow-sm">
                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
                        <p className="text-sm font-medium text-slate-500">Total Issues</p>
                    </Card>
                    <Card className="p-6 flex flex-col items-center justify-center text-center bg-orange-50 border-orange-100">
                        <AlertCircle className="w-8 h-8 text-orange-500 mb-2" />
                        <h3 className="text-3xl font-bold text-slate-800">{stats.pending}</h3>
                        <p className="text-sm font-medium text-slate-600">Pending Review</p>
                    </Card>
                    <Card className="p-6 flex flex-col items-center justify-center text-center bg-indigo-50 border-indigo-100">
                        <ShieldAlert className="w-8 h-8 text-indigo-500 mb-2" />
                        <h3 className="text-3xl font-bold text-slate-800">{stats.active}</h3>
                        <p className="text-sm font-medium text-slate-600">Active / Actioned</p>
                    </Card>
                    <Card className="p-6 flex flex-col items-center justify-center text-center bg-green-50 border-green-100">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                        <h3 className="text-3xl font-bold text-slate-800">{stats.resolved}</h3>
                        <p className="text-sm font-medium text-slate-600">Resolved</p>
                    </Card>
                </div>

                {/* Navigation Hub */}
                <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">Workspace Hub</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => onNavigate('verification-panel')}
                        className="text-left group bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all"
                    >
                        <h4 className="text-lg font-bold text-blue-700 mb-1 group-hover:text-blue-800">Moderation & Verification Panel</h4>
                        <p className="text-sm text-slate-600">Review pending issues, approve, reject, and check for duplicates or false reports. Restricted to Verifiers.</p>
                    </button>

                    <button
                        onClick={() => onNavigate('analytics-panel')}
                        className="text-left group bg-white border border-slate-200 p-6 rounded-2xl hover:border-purple-400 hover:shadow-md transition-all"
                    >
                        <h4 className="text-lg font-bold text-purple-700 mb-1 group-hover:text-purple-800">Strategic Analytics</h4>
                        <p className="text-sm text-slate-600">View county heatmaps, most reported categories, response times, and identify macro trends. Restricted to Analysts.</p>
                    </button>
                </div>

                {/* Recent Reports Overview */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Influx (Overview)</h3>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Issue</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Current Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map((report) => (
                                        <tr key={report.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{report.title}</td>
                                            <td className="px-6 py-4">{report.category}</td>
                                            <td className="px-6 py-4">{new Date(report.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                    ${report.status.toLowerCase() === 'active' ? 'bg-indigo-100 text-indigo-700' :
                                                        report.status.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                            report.status.toLowerCase() === 'resolved' ? 'bg-green-100 text-green-700' :
                                                                'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {report.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentReports.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                No recent reports found in the database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GovDashboard;
