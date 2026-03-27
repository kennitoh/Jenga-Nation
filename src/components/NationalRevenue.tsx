import React, { useState } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Building2, Globe, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
// ...

interface NationalRevenueProps {
    onBack?: () => void;
    onSettings?: () => void;
}

const NationalRevenue: React.FC<NationalRevenueProps> = ({ onBack, onSettings }) => {
    const [activeTab, setActiveTab] = useState('revenue');

    // Mock Data
    const revenueData = [
        { name: 'Income Tax', value: 32, color: '#8884d8' },
        { name: 'VAT', value: 28, color: '#82ca9d' },
        { name: 'Excise Duty', value: 15, color: '#ffc658' },
        { name: 'Import Duty', value: 12, color: '#ff8042' },
        { name: 'Other', value: 13, color: '#0088fe' },
    ];

    const monthlyRevenue = [
        { name: 'Jul', amount: 180 },
        { name: 'Aug', amount: 200 },
        { name: 'Sep', amount: 190 },
        { name: 'Oct', amount: 240 },
        { name: 'Nov', amount: 210 },
        { name: 'Dec', amount: 260 },
    ];

    const allocationData = [
        { county: "Nairobi City", amount: 25.4, percent: 6.6, change: "+5.2%", purpose: "Urban Planning & Health" },
        { county: "Turkana", amount: 12.8, percent: 3.3, change: "+3.1%", purpose: "Water & Food Security" },
        { county: "Kiambu", amount: 11.2, percent: 2.9, change: "+4.0%", purpose: "Infrastructure" },
        { county: "Nakuru", amount: 10.5, percent: 2.7, change: "+2.8%", purpose: "Agriculture" },
        { county: "Kilifi", amount: 9.8, percent: 2.5, change: "+3.5%", purpose: "Tourism & Education" },
    ];

    const debtTrend = [
        { year: '2020', debt: 6.2, gdp: 62 },
        { year: '2021', debt: 7.5, gdp: 68 },
        { year: '2022', debt: 8.4, gdp: 72 },
        { year: '2023', debt: 9.1, gdp: 76 },
        { year: '2024', debt: 10.2, gdp: 78.4 },
    ];

    const loans = [
        { lender: "World Bank", amount: "USD 1.2B", rate: "1.5%", period: "30 Years", purpose: "Infrastructure Support" },
        { lender: "IMF", amount: "USD 800M", rate: "2.1%", period: "15 Years", purpose: "Budgetary Support" },
        { lender: "AfDB", amount: "USD 400M", rate: "1.8%", period: "25 Years", purpose: "Agricultural Development" },
        { lender: "Eurobond", amount: "USD 2.0B", rate: "8.5%", period: "10 Years", purpose: "Loan Refinancing" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-700" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Revenue & Debt Transparency</h1>
                            <p className="text-sm text-slate-600">National financial oversight dashboard</p>
                        </div>
                    </div>
                    {onSettings && (
                        <button
                            onClick={onSettings}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'revenue', label: 'Revenue' },
                        { id: 'allocation', label: 'Allocation' },
                        { id: 'debt', label: 'National Debt' },
                        { id: 'borrowing', label: 'Borrowing' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Revenue Section */}
                {activeTab === 'revenue' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 bg-blue-600 text-white">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Revenue (YTD)</p>
                                        <h3 className="text-3xl font-bold mt-1">KES 2.4 Trillion</h3>
                                    </div>
                                    <div className="p-2 bg-blue-500/30 rounded-lg">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-blue-100 text-sm">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+12.5% vs Last Year</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Tax Target</p>
                                        <h3 className="text-3xl font-bold text-slate-800 mt-1">92%</h3>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Target className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[92%]" />
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">Top Source</p>
                                        <h3 className="text-2xl font-bold text-slate-800 mt-1">Income Tax</h3>
                                    </div>
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mt-4">Contributes 32% of total revenue</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Sources</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revenueData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {revenueData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Collection Trend</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyRevenue}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                            <YAxis stroke="#94a3b8" fontSize={12} />
                                            <Tooltip
                                                cursor={{ fill: '#f1f5f9' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Allocation Section */}
                {activeTab === 'allocation' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="p-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold">County Allocation 2024/2025</h2>
                                    <p className="text-teal-100">Total devolved funds disbursed to regions</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold">KES 385.4 Billion</div>
                                    <p className="text-teal-100 text-sm">Target: 400B (96% Disbursed)</p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            <Card className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="p-4 font-semibold text-slate-600">County</th>
                                                <th className="p-4 font-semibold text-slate-600">Allocation (Billion)</th>
                                                <th className="p-4 font-semibold text-slate-600">% Share</th>
                                                <th className="p-4 font-semibold text-slate-600">Change</th>
                                                <th className="p-4 font-semibold text-slate-600">Primary Focus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allocationData.map((row, i) => (
                                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                                    <td className="p-4 font-medium text-slate-800">{row.county}</td>
                                                    <td className="p-4 font-bold text-slate-700">{row.amount} B</td>
                                                    <td className="p-4 text-slate-600">{row.percent}%</td>
                                                    <td className="p-4 text-green-600 font-medium">{row.change}</td>
                                                    <td className="p-4 text-slate-500">{row.purpose}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Debt Section */}
                {activeTab === 'debt' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 border-l-4 border-red-500">
                                <p className="text-slate-500 text-sm font-medium uppercase">Total National Debt</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">KES 10.2 Trillion</h3>
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" /> +12% YoY
                                </p>
                            </Card>
                            <Card className="p-6 border-l-4 border-orange-500">
                                <p className="text-slate-500 text-sm font-medium uppercase">Debt-to-GDP Ratio</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">78.4%</h3>
                                <p className="text-orange-500 text-sm mt-1">Above recommended threshold (60%)</p>
                            </Card>
                            <Card className="p-6 border-l-4 border-blue-500">
                                <p className="text-slate-500 text-sm font-medium uppercase">Repayment Progress</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">KES 1.4T Paid</h3>
                                <p className="text-slate-500 text-sm mt-1">This fiscal year</p>
                            </Card>
                        </div>

                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Historical Debt Trend (Trillions)</h3>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={debtTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="year" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="debt" name="Total Debt" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="gdp" name="Debt to GDP %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Borrowing Section */}
                {activeTab === 'borrowing' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="p-6 bg-slate-800 text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <Globe className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h2 className="text-xl font-bold">International Borrowing Portfolio</h2>
                                    <p className="text-slate-400">Transparency on external loans and conditions</p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-6">
                            <Card className="overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Recent Loans & Agreements</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="p-4 font-semibold text-slate-600">Lender</th>
                                                <th className="p-4 font-semibold text-slate-600">Amount</th>
                                                <th className="p-4 font-semibold text-slate-600">Interest Rate</th>
                                                <th className="p-4 font-semibold text-slate-600">Repayment Period</th>
                                                <th className="p-4 font-semibold text-slate-600">Purpose</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loans.map((loan, i) => (
                                                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                                    <td className="p-4 font-bold text-slate-800">{loan.lender}</td>
                                                    <td className="p-4 font-medium text-blue-600">{loan.amount}</td>
                                                    <td className="p-4 text-slate-600">{loan.rate}</td>
                                                    <td className="p-4 text-slate-600">{loan.period}</td>
                                                    <td className="p-4 text-slate-500 italic">{loan.purpose}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            <Card className="p-6 border border-yellow-200 bg-yellow-50">
                                <h4 className="font-bold text-yellow-800 mb-2">Public Notice</h4>
                                <p className="text-sm text-yellow-800/80">
                                    The Treasury intends to borrow an additional KES 50 Billion via infrastructure bonds in Q3 2025.
                                    Public participation forums will be held on January 15th, 2025 across all 47 counties.
                                </p>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple icon components for specific use cases
const Target = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

const Briefcase = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);

export default NationalRevenue;
