import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Upload, DollarSign, Calendar, Target, Settings, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { categories } from '../config/categories';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import VerificationPrompt from './VerificationPrompt';

interface PostProjectProps {
    onBack: () => void;
    onSettings?: () => void;
}

const PostProject: React.FC<PostProjectProps> = ({ onBack, onSettings }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Verification State
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending_review' | 'verified' | 'rejected'>('unverified');

    React.useEffect(() => {
        const checkVerification = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (data) {
                    setUser(data);
                    setVerificationStatus(data.verification_status || 'unverified');
                }
            }
            setIsLoadingProfile(false);
        };
        checkVerification();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Extract numeric value from budget string if possible
            const numericGoal = parseFloat(budget.replace(/[^0-9.-]+/g, "")) || 0;

            const { error } = await supabase.from('projects').insert({
                title,
                description,
                category,
                location,
                goal: numericGoal,
                start_date: startDate || null,
                end_date: endDate || null,
                status: 'Active',
                progress: 0,
                raised: 0
            });

            if (error) throw error;

            setIsSuccess(true);
            setTimeout(() => {
                onBack();
            }, 2000);
        } catch (error) {
            console.error("Failed to post project:", error);
            alert("Failed to publish the project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Project Posted!</h2>
                        <p className="text-slate-600 mt-2">Your project has been successfully published for the community.</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Estimated Review Time</p>
                        <p className="text-xl font-bold text-blue-900">5-7 Business Days</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // KYC Verification Gate
    if (verificationStatus === 'unverified') {
        return (
            <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-4">
                <div className="max-w-xl mx-auto mb-6">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                </div>
                <VerificationPrompt user={user} onVerificationSubmitted={() => setVerificationStatus('pending_review')} />
            </div>
        );
    }

    if (verificationStatus === 'pending_review') {
        return (
            <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-md mx-auto mb-6 w-full text-left">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                </div>
                <Card className="max-w-md w-full p-8 space-y-6 bg-blue-50/50 border-blue-100">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                        <Camera className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Verification Pending</h2>
                        <p className="text-slate-600 mt-2">Your documents are under review by National Admins. You will be able to post projects once approved.</p>
                    </div>
                    <Button variant="outline" onClick={onBack} className="w-full">Return Home</Button>
                </Card>
            </div>
        );
    }

    if (verificationStatus === 'rejected') {
        return (
            <div className="min-h-screen bg-slate-50 pb-20 pt-10 px-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-md mx-auto mb-6 w-full text-left">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </button>
                </div>
                <Card className="max-w-md w-full p-8 space-y-6 bg-red-50/50 border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Verification Rejected</h2>
                        <p className="text-slate-600 mt-2">Your identity documents were rejected. Please contact support or retry verification.</p>
                    </div>
                    <Button onClick={() => setVerificationStatus('unverified')} className="w-full">Retry Verification</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Post New Project</h1>
                            <p className="text-sm text-slate-600">Share your development plans with the community</p>
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

            <div className="max-w-3xl mx-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Project Overview</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Project Title</label>
                            <Input
                                placeholder="e.g., Downtown Road Resurfacing"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Category</label>
                            <Select value={category} onChange={setCategory} placeholder="Select category">
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <Textarea
                                placeholder="Detailed description of the project..."
                                className="h-32"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Details & Media</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Location
                                </label>
                                <Input
                                    placeholder="Project location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Estimated Budget
                                </label>
                                <Input
                                    placeholder="e.g., KES 5,000,000"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Estimated Finish
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Project Image</label>
                            {!selectedImage ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Camera className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Upload Project Visualization</p>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
                                    <img src={selectedImage} alt="Project" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Publishing..." : "Publish Project"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PostProject;
