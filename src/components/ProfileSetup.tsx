import React, { useState } from 'react';
import {
    Camera, MapPin, Heart, User, CheckCircle2, ArrowRight, ArrowLeft,
    Building2, GraduationCap, Stethoscope, Lightbulb, Sprout, Home, TreePine, Briefcase, Gavel, Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { useTranslations } from '../utils/translations';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../logo.png';

interface ProfileSetupProps {
    onComplete: (profileData: any) => void;
    initialData?: any;
    startStep?: number;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, initialData, startStep = 1 }) => {
    const { language } = useTheme();
    const t = useTranslations(language);
    const [step, setStep] = useState(startStep);
    const [formData, setFormData] = useState({
        photo: null as string | null,
        fullName: '',
        gender: '',
        dob: '',
        county: '',
        constituency: '',
        ward: '',
        interests: [] as string[],
        role: '',
        govPosition: '',
        ngoFocus: '',
        ngoType: '', // 'Advocacy' or 'Operational'
        aspiringTarget: '',
        ...initialData
    });

    // Mock Data
    const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu"];
    const constituencies = {
        "Nairobi": ["Westlands", "Langata", "Dagoretti North", "Kibra", "Roysambu"],
        "Mombasa": ["Mvita", "Nyali", "Changamwe", "Likoni"],
        "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West"],
        "Nakuru": ["Nakuru Town East", "Nakuru Town West", "Naivasha"],
        "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses"]
    };
    const wards = ["Parklands", "Kitisuru", "Karen", "South C", "Kilimani", "Lavington"]; // Simplified for demo

    const interestsList = [
        { id: 'roads', label: 'Roads & Infrastructure', icon: Building2 },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'water', label: 'Water & Sanitation', icon: CheckCircle2 }, // Placeholder icon
        { id: 'health', label: 'Healthcare', icon: Stethoscope },
        { id: 'youth', label: 'Youth & Sports', icon: User },
        { id: 'tech', label: 'Technology', icon: Lightbulb },
        { id: 'agri', label: 'Agriculture', icon: Sprout },
        { id: 'housing', label: 'Housing', icon: Home },
        { id: 'env', label: 'Environment', icon: TreePine },
    ];

    const roles = [
        { id: 'citizen', label: 'Citizen', desc: 'Reports issues, follows project progress, and engages with community updates.' },
        { id: 'leader', label: 'Community Leader', desc: 'Represents a local group, helps verify issues, and can highlight community needs.' },
        { id: 'ngo', label: 'NGO / Institution', desc: 'Manages and posts development projects, shares progress, and collaborates with communities.' },
        { id: 'gov', label: 'Government Official', desc: 'Oversees county/national projects, posts official updates, and responds to public issues.' },
        { id: 'aspiring', label: 'Aspiring Leader', desc: 'Builds a public profile, shares their agenda, and engages with community issues for visibility.' },
    ];

    const ngoFocusAreas = [
        "Environment", "Education", "Healthcare", "Human Rights", "Refugees", "Agriculture", "Youth Empowerment", "Water & Sanitation"
    ];

    const govPositions = [
        "President", "Deputy President", "Cabinet Secretary", "Governor", "Senator", "MP", "MCA", "County Executive"
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData({ ...formData, photo: ev.target?.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const toggleInterest = (id: string) => {
        setFormData((prev: typeof formData) => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter((i: string) => i !== id)
                : [...prev.interests, id]
        }));
    };

    const isStep4Valid = () => {
        if (!formData.role) return false;
        if (formData.role === 'gov' && !formData.govPosition) return false;
        if (formData.role === 'ngo' && (!formData.ngoFocus || !formData.ngoType)) return false;
        if (formData.role === 'aspiring' && !formData.aspiringTarget) return false;
        return true;
    };

    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
                <p className="text-slate-600">Let's start with the basics.</p>
            </div>

            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        {formData.photo ? (
                            <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white">
                        <div className="w-3 h-3" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Gender (Optional)</label>
                        <select
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Date of Birth (Optional)</label>
                        <Input
                            type="date"
                            value={formData.dob}
                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt={t.appName} className="h-16 w-auto" />
                </div>
                <p className="text-slate-600">{t.tagline}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">County</label>
                    <select
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.county}
                        onChange={e => setFormData({ ...formData, county: e.target.value, constituency: '', ward: '' })}
                    >
                        <option value="">Select County</option>
                        {counties.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {formData.county && (
                    <div>
                        <label className="text-sm font-medium text-slate-700">Constituency</label>
                        <select
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.constituency}
                            onChange={e => setFormData({ ...formData, constituency: e.target.value })}
                        >
                            <option value="">Select Constituency</option>
                            {(constituencies as any)[formData.county]?.map((c: string) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                )}

                {formData.constituency && (
                    <div>
                        <label className="text-sm font-medium text-slate-700">Ward</label>
                        <select
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.ward}
                            onChange={e => setFormData({ ...formData, ward: e.target.value })}
                        >
                            <option value="">Select Ward</option>
                            {wards.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>
                )}

                <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">Why do we need this?</p>
                        <p>To show you relevant projects, issues, and leaders in your specific area.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Your Interests</h2>
                <p className="text-slate-600">What do you care about most?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {interestsList.map((interest) => {
                    const Icon = interest.icon;
                    const isSelected = formData.interests.includes(interest.id);
                    return (
                        <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                }`}
                        >
                            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <div className="font-medium text-sm">{interest.label}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Community Role</h2>
                <p className="text-slate-600">How do you identify?</p>
            </div>

            <div className="space-y-3">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${formData.role === role.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-100 hover:border-slate-200'
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.role === role.id ? 'border-purple-600' : 'border-slate-300'
                            }`}>
                            {formData.role === role.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                        </div>
                        <div>
                            <div className={`font-medium ${formData.role === role.id ? 'text-purple-900' : 'text-slate-800'}`}>
                                {role.label}
                            </div>
                            <div className={`text-xs ${formData.role === role.id ? 'text-purple-700' : 'text-slate-500'}`}>
                                {role.desc}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Role Specific Inputs */}
            {formData.role === 'gov' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-100 pt-4 mt-4">
                    <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                        <Gavel className="w-4 h-4" /> Official Position
                    </label>
                    <select
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.govPosition}
                        onChange={e => setFormData({ ...formData, govPosition: e.target.value })}
                    >
                        <option value="">Select Position</option>
                        {govPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                </div>
            )}

            {formData.role === 'ngo' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-100 pt-4 mt-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Organization Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Advocacy', 'Operational'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFormData({ ...formData, ngoType: type })}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.ngoType === type
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Primary Focus Area
                        </label>
                        <select
                            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.ngoFocus}
                            onChange={e => setFormData({ ...formData, ngoFocus: e.target.value })}
                        >
                            <option value="">Select Focus Area</option>
                            {ngoFocusAreas.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {formData.role === 'aspiring' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-100 pt-4 mt-4">
                    <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Target Position (Aspiring)
                    </label>
                    <Input
                        placeholder="e.g. Governor, MP, MCA"
                        value={formData.aspiringTarget}
                        onChange={e => setFormData({ ...formData, aspiringTarget: e.target.value })}
                    />
                </div>
            )}
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6 animate-in zoom-in duration-500 py-8">
            <div className="flex justify-center">
                <img src={logo} alt={t.appName} className="h-14 w-auto" />
            </div>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">You're All Set! 🎉</h2>
                <p className="text-slate-600 mt-2">Your profile is complete. You can now post issues, vote, and engage with the community.</p>
                {formData.role === 'gov' && (
                    <p className="text-sm text-blue-600 mt-1 font-medium bg-blue-50 py-1 px-3 rounded-full inline-block">Role: {formData.govPosition}</p>
                )}
                {formData.role === 'ngo' && (
                    <p className="text-sm text-blue-600 mt-1 font-medium bg-blue-50 py-1 px-3 rounded-full inline-block">
                        {formData.ngoType} - {formData.ngoFocus}
                    </p>
                )}
                {formData.role === 'aspiring' && (
                    <p className="text-sm text-blue-600 mt-1 font-medium bg-blue-50 py-1 px-3 rounded-full inline-block">Aspiring: {formData.aspiringTarget}</p>
                )}
            </div>
            <Button
                onClick={() => onComplete(formData)}
                className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2"
            >
                Start Exploring <img src={logo} alt={t.appName} className="h-5 w-auto brightness-0 invert" />
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 md:p-8">
                {/* Progress Bar */}
                {step <= 4 && (
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                            <span>Step {step} of 4</span>
                            <span>{Math.round((step / 4) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderSuccess()}
                </div>

                {/* Navigation Buttons */}
                {step <= 4 && (
                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="flex-1"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            className={`flex-1 ${step === 1 ? 'w-full' : ''} bg-slate-900 hover:bg-slate-800 text-white`}
                            disabled={
                                (step === 1 && !formData.fullName) ||
                                (step === 2 && !formData.county) ||
                                (step === 4 && !isStep4Valid())
                            }
                        >
                            {step === 4 ? 'Finish' : 'Continue'}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfileSetup;
