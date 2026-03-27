import React, { useState } from 'react';
import { ArrowLeft, Bell, AlertTriangle, Phone, Radio, Settings, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AlertsProps {
    onBack: () => void;
}

const Alerts: React.FC<AlertsProps> = ({ onBack }) => {
    const [subscriptions, setSubscriptions] = useState({
        sms: true,
        whatsapp: false,
        email: true,
        push: true
    });

    const toggleSubscription = (key: keyof typeof subscriptions) => {
        setSubscriptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Emergency Alerts</h1>
                        <p className="text-sm text-slate-600">Stay informed about critical updates</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                {/* Active Alerts */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                        Active Alerts
                    </h3>

                    <Card className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h4 className="font-bold text-red-900">Heavy Rainfall Warning</h4>
                            </div>
                            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                Critical
                            </span>
                        </div>
                        <p className="text-sm text-red-800 mb-3">
                            Heavy rainfall expected in Nairobi and surrounding areas for the next 48 hours. Potential for flash floods in low-lying areas.
                        </p>
                        <div className="flex justify-between items-center text-xs text-red-700">
                            <span>Issued: 2 hours ago</span>
                            <span>Source: Meteorological Dept</span>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                <h4 className="font-bold text-orange-900">Traffic Disruption</h4>
                            </div>
                            <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                High
                            </span>
                        </div>
                        <p className="text-sm text-orange-800 mb-3">
                            Major accident on Thika Superhighway near Roysambu. Expect delays of up to 2 hours. Use alternative routes.
                        </p>
                        <div className="flex justify-between items-center text-xs text-orange-700">
                            <span>Issued: 45 mins ago</span>
                            <span>Source: Traffic Police</span>
                        </div>
                    </Card>
                </div>

                {/* Notification Settings */}
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5 text-slate-500" />
                        Notification Preferences
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">SMS Alerts</p>
                                    <p className="text-xs text-slate-500">Receive critical alerts via SMS</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={subscriptions.sms}
                                    onChange={() => toggleSubscription('sms')}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">WhatsApp</p>
                                    <p className="text-xs text-slate-500">Get updates on WhatsApp</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={subscriptions.whatsapp}
                                    onChange={() => toggleSubscription('whatsapp')}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">Push Notifications</p>
                                    <p className="text-xs text-slate-500">In-app notifications</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={subscriptions.push}
                                    onChange={() => toggleSubscription('push')}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Emergency Contacts */}
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Emergency Contacts</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 border-red-100 hover:bg-red-50 text-red-600">
                            <span className="text-lg font-bold">999</span>
                            <span className="text-xs">Police / Ambulance</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 border-orange-100 hover:bg-orange-50 text-orange-600">
                            <span className="text-lg font-bold">1199</span>
                            <span className="text-xs">Red Cross</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Alerts;
