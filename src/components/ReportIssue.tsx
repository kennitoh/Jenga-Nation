import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Camera, MapPin, Upload, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { categories } from '../config/categories';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslations } from '../utils/translations';

interface ReportIssueProps {
    onBack?: () => void;
    onSettings?: () => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onBack, onSettings }) => {
    const { language } = useTheme();
    const t = useTranslations(language);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState("");

    const selectedCategory = categories.find(c => c.id === category);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            // Simulate AI Analysis
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setAiAnalysis({
                    confidence: 0.94,
                    suggestedCategory: 'infrastructure',
                    severity: 'High',
                    riskLevel: 'Critical'
                });
                setCategory('infrastructure');
            }, 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Determine estimated time based on severity or default
            let time = "3-5 Business Days";
            if (aiAnalysis?.severity === 'High' || aiAnalysis?.riskLevel === 'Critical') {
                time = "Within 24 Hours";
            } else if (category === 'health' || category === 'security') {
                time = "Within 48 Hours";
            }

            const { data: { user } } = await supabase.auth.getUser();

            // Insert into Supabase
            const { error } = await supabase.from('issues').insert({
                title,
                description,
                category,
                location,
                reporter_id: isAnonymous ? null : (user?.id || null),
                status: 'Pending',
                // images: [] // Handle image upload properly in future iterations
            });

            if (error) throw error;

            setEstimatedTime(time);
            setIsSuccess(true);

            setTimeout(() => {
                if (onBack) onBack();
            }, 3000); // Wait 3 seconds before going back
        } catch (error) {
            console.error("Failed to submit report:", error);
            alert("Failed to submit report. Please try again.");
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
                        <h2 className="text-2xl font-bold text-slate-800">Report Submitted!</h2>
                        <p className="text-slate-600 mt-2">Thank you for helping improve your community.</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Estimated Review Time</p>
                        <p className="text-xl font-bold text-blue-900">{estimatedTime}</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
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
                            <h1 className="text-xl font-bold text-slate-800">{t.reportIssue}</h1>
                            <p className="text-sm text-slate-600">Submit a new report to your local government</p>
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

                    {/* Media Upload First for AI Context */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">1. Evidence & AI Analysis</h3>

                        {!selectedImage ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="w-6 h-6 text-slate-500" />
                                </div>
                                <p className="text-sm font-medium text-slate-700">Upload Photo to Auto-Detect Issue</p>
                                <p className="text-xs text-slate-500 mt-1">AI will analyze the image for category and severity</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
                                    <img src={selectedImage} alt="Issue" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedImage(null); setAiAnalysis(null); }}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                </div>

                                {isAnalyzing ? (
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm font-medium">AI is analyzing the image...</span>
                                    </div>
                                ) : aiAnalysis && (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Analysis Result</span>
                                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                {(aiAnalysis.confidence * 100).toFixed(0)}% Confidence
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500">Suggested Category</p>
                                                <p className="font-medium text-slate-800 capitalize">{aiAnalysis.suggestedCategory}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Severity</p>
                                                <p className={`font-medium ${aiAnalysis.severity === 'High' ? 'text-red-600' : 'text-orange-600'}`}>
                                                    {aiAnalysis.severity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-xs text-slate-500">Risk Assessment</p>
                                            <p className="text-sm text-slate-700">{aiAnalysis.riskLevel} Risk - Requires attention within 48 hours.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Category Selection */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">2. Issue Category</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Category</label>
                                <Select value={category} onChange={setCategory} placeholder="Select a category">
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Subcategory</label>
                                <Select
                                    value={subcategory}
                                    onChange={setSubcategory}
                                    placeholder="Select subcategory"
                                    disabled={!category}
                                >
                                    {selectedCategory?.subcategories.map((sub) => (
                                        <option key={sub} value={sub}>
                                            {sub}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Details */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">3. Issue Details</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Issue Title</label>
                            <Input
                                placeholder="Brief summary of the issue"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <Textarea
                                placeholder="Provide more details about the issue..."
                                className="h-32"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    placeholder="Enter location or use current location"
                                    className="pl-12"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Submit */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-[#800020] focus:ring-[#800020]"
                            />
                            <label htmlFor="anonymous" className="text-sm text-slate-700">Report anonymously</label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;
