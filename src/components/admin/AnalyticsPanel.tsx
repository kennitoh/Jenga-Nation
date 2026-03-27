import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Map } from 'lucide-react';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { Screen } from '../../types';

interface AnalyticsPanelProps {
    onBack: () => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        // Simple analytics: fetch all active/resolved issues to calculate which categories are reported most
        const { data, error } = await supabase
            .from('issues')
            .select('category')
            .in('status', ['Active', 'Resolved']);

        if (data) {
            const counts: { [key: string]: number } = {};
            data.forEach((item: any) => {
                counts[item.category] = (counts[item.category] || 0) + 1;
            });
            setCategoryCounts(counts);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" /> Strategic Analytics
                        </h1>
                        <p className="text-sm text-slate-600">Macro trends, response times, and county heatmaps</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <Card className="p-4 bg-purple-50 border-purple-100 mb-6 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Intelligence Brief</h3>
                        <p className="text-sm text-slate-600">
                            This panel provides strategic intelligence for analysts and National Admins. This data reflects actual community needs based on verified (Active or Resolved) issues from the platform.
                        </p>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categories Chart (Mock visual using bars) */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-slate-400" /> Most Reported Categories
                        </h3>
                        {loading ? (
                            <p className="text-sm text-slate-500">Loading intelligence data...</p>
                        ) : Object.keys(categoryCounts).length === 0 ? (
                            <p className="text-sm text-slate-500">No verified data available yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(categoryCounts).map(([category, count]) => {
                                    // Calculate quick percentage relative to arbitrary max for visual bar width
                                    const maxVal = Math.max(...Object.values(categoryCounts));
                                    const widthPercent = (count / maxVal) * 100;

                                    return (
                                        <div key={category} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-700">{category}</span>
                                                <span className="text-slate-500">{count} issues</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${widthPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Placeholder for future mapping */}
                    <Card className="p-6 flex flex-col items-center justify-center text-center text-slate-500 space-y-4 min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Map className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-800 mb-1">County Heatmap</h3>
                            <p className="text-sm">Geospatial complaint mapping is being processed.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
