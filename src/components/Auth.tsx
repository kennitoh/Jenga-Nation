import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useTranslations } from '../utils/translations';
import { useTheme } from '../contexts/ThemeContext';
import { counties, roles, interestsList } from '../data/options';
import { Check, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../logo.png';

interface AuthProps {
    onComplete: (data: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onComplete }) => {
    const { language } = useTheme();
    const t = useTranslations(language);

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup State
    const [signupStep, setSignupStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [county, setCounty] = useState('');
    const [interests, setInterests] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("login");
    const [showVerificationSent, setShowVerificationSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleInterest = (id: string) => {
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profile) {
                    onComplete({
                        name: profile.name,
                        role: profile.role || 'citizen',
                        county: profile.county || '',
                        isProfileComplete: true
                    });
                } else {
                    // Profile is missing even though Auth succeeded (should trigger alert)
                    await supabase.auth.signOut();
                    alert("Profile not found. Please contact support.");
                }
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = () => {
        setSignupStep(prev => prev + 1);
    }

    const handlePrevStep = () => {
        setSignupStep(prev => prev - 1);
    }

    const handleSignup = async () => {
        setIsLoading(true);
        try {
            // 1. Sign Up with Metadata
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role,
                        county,
                        interests
                    }
                }
            });
            if (authError) throw authError;

            if (authData.user && !authData.session) {
                // Email confirmation is required
                setShowVerificationSent(true);
            } else if (authData.user && authData.session) {
                // User is signed in immediately (Email confirmation might be off)
                onComplete({
                    name,
                    email,
                    role,
                    county,
                    interests,
                    isProfileComplete: true
                });
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const renderSignupStep = () => {
        switch (signupStep) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Create Account</h2>
                            <p className="text-sm text-slate-500">Step 1 of 4: Basic Information</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">{t.name}</label>
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">{t.email}</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">{t.password}</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            onClick={handleNextStep}
                            className="w-full mt-4 bg-slate-900 text-white"
                            disabled={!name || !email || password.length < 8}
                        >
                            Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="flex items-start gap-2 mt-4 justify-center">
                            <p className="text-xs text-slate-500 text-center max-w-xs">
                                By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Choose Role</h2>
                            <p className="text-sm text-slate-500">Step 2 of 4: How will you use Jenga?</p>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
                            {roles.slice(0, 5).map((r) => (
                                <div
                                    key={r.id}
                                    onClick={() => setRole(r.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-left ${role === r.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-semibold ${role === r.id ? 'text-blue-700' : 'text-slate-700'}`}>{r.label}</span>
                                        {role === r.id && <Check className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <p className="text-xs text-slate-500">{r.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                className="flex-1 bg-slate-900 text-white"
                                disabled={!role}
                            >
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Select Location</h2>
                            <p className="text-sm text-slate-500">Step 3 of 4: Where do you live?</p>
                        </div>

                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-blue-50 rounded-xl mb-4">
                                <p className="text-sm text-blue-800 text-center">
                                    We use this to show you projects and issues relevant to your community.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">County</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={county}
                                    onChange={e => setCounty(e.target.value)}
                                >
                                    <option value="">Select County</option>
                                    {counties.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-8">
                            <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                className="flex-1 bg-slate-900 text-white"
                                disabled={!county}
                            >
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Your Interests</h2>
                            <p className="text-sm text-slate-500">Step 4 of 4: What do you care about?</p>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
                            {interestsList.map((interest) => {
                                const isSelected = interests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${isSelected
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <interest.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                        {interest.label}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-2">Select at least 3 topics</p>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleSignup}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90"
                                disabled={interests.length < 3 || isLoading}
                            >
                                {isLoading ? "Creating..." : "Finish Signup"}
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
            <Card className="w-full max-w-lg p-8 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm my-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt={t.appName} className="h-16 w-auto" />
                    </div>
                    <p className="text-slate-600">{t.tagline}</p>
                </div>

                <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setSignupStep(1); }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="login">{t.login}</TabsTrigger>
                        <TabsTrigger value="signup">{t.signup}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto" autoComplete="off">
                            <div className="space-y-4">
                                <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2 h-12 border-slate-200 hover:bg-slate-50">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                    <span className="text-slate-600 font-medium">Google</span>
                                </Button>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-500">Or login with email</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 ml-1">{t.email}</label>
                                <Input
                                    type="email"
                                    name="email_login_off"
                                    placeholder="Email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-700 ml-1">{t.password}</label>
                                    <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password_login_off"
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-6 h-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? "..." : "Login"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        {showVerificationSent ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your email</h2>
                                <p className="text-slate-600 mb-6 max-w-xs mx-auto">
                                    We've sent a verification link to <strong>{email}</strong>. Please click the link to activate your account.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowVerificationSent(false);
                                        setActiveTab("login");
                                        setSignupStep(1);
                                    }}
                                    className="border-slate-300"
                                >
                                    Return to Login
                                </Button>
                            </div>
                        ) : (
                            renderSignupStep()
                        )}
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};


