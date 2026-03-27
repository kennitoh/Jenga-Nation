import React, { useState } from 'react';
import { ArrowLeft, Check, X, AlertCircle, BarChart3, Users, FileText } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
    onBack?: () => void;
}

interface Report {
    id: number;
    title: string;
    category: string;
    author: string;
    date: string;
    status: "pending" | "approved" | "rejected";
    priority: "low" | "medium" | "high";
}

const mockReports: Report[] = [
    { id: 1, title: "Broken Street Light", category: "Infrastructure", author: "Jane Doe", date: "2024-03-10", status: "pending", priority: "medium" },
    { id: 2, title: "Illegal Dumping", category: "Environment", author: "John Smith", date: "2024-03-09", status: "pending", priority: "high" },
    { id: 3, title: "Pothole Repair", category: "Roads", author: "Alice Johnson", date: "2024-03-08", status: "approved", priority: "low" },
    { id: 4, title: "Water Leakage", category: "Water", author: "Bob Wilson", date: "2024-03-08", status: "rejected", priority: "medium" },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState("reports");

    React.useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const { data, error } = await supabase
            .from('issues')
            .select(`
                *,
                profiles ( name )
            `)
            .order('date', { ascending: false });

        if (data && data.length > 0) {
            setReports(data.map((d: any) => ({
                id: d.id,
                title: d.title,
                category: d.category,
                author: d.profiles?.name || 'Anonymous',
                date: new Date(d.date).toISOString().split('T')[0],
                status: d.status.toLowerCase() === 'pending' ? 'pending' : (d.status.toLowerCase() === 'active' || d.status.toLowerCase() === 'open' ? 'approved' : 'rejected'),
                priority: 'medium'
            })));
        } else {
            setReports(mockReports);
        }
    };

    const handleAction = async (id: number, action: "approve" | "reject") => {
        const newStatus = action === "approve" ? "Active" : "Rejected";
        // Update in Supabase
        const { error } = await supabase.from('issues').update({ status: newStatus }).eq('id', id);

        if (!error) {
            // Update local state instantly
            setReports(reports.map(r =>
                r.id === id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r
            ));
        } else {
            console.error("Failed to update status", error);
            alert("Failed to update issue status.");
        }
    };

    const pendingReports = reports.filter(r => r.status === "pending");

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
                        <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                        <p className="text-sm text-slate-600">Manage community reports and projects</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 flex items-center gap-4 bg-blue-50 border-blue-100">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{reports.length}</h3>
                            <p className="text-sm text-slate-600">Total Reports</p>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 bg-orange-50 border-orange-100">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{pendingReports.length}</h3>
                            <p className="text-sm text-slate-600">Pending Review</p>
                        </div>
                    </Card>
                    <Card className="p-6 flex items-center gap-4 bg-green-50 border-green-100">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">1,240</h3>
                            <p className="text-sm text-slate-600">Active Users</p>
                        </div>
                    </Card>
                </div>

                {/* Management Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="reports">Report Management</TabsTrigger>
                        <TabsTrigger value="projects">Project Oversight</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reports">
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Issue</th>
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Author</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((report) => (
                                            <tr key={report.id} className="bg-white border-b border-slate-50 hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{report.title}</td>
                                                <td className="px-6 py-4">{report.category}</td>
                                                <td className="px-6 py-4">{report.author}</td>
                                                <td className="px-6 py-4">{report.date}</td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`
                            ${report.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-orange-100 text-orange-700'}
                          `}>
                                                        {report.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {report.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAction(report.id, 'approve')}
                                                                className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(report.id, 'reject')}
                                                                className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="projects">
                        <Card className="p-8 text-center text-slate-500">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-800">Project Oversight</h3>
                            <p>Project management tools coming soon.</p>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
