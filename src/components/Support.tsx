import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface SupportProps {
    onBack?: () => void;
}

const faqs = [
    {
        question: "How do I report an issue?",
        answer: "Navigate to the 'Report' section from the home screen or floating menu. Select a category, provide details, upload a photo if available, and submit."
    },
    {
        question: "Can I report anonymously?",
        answer: "Yes, you can choose to submit reports anonymously by checking the 'Report anonymously' box at the bottom of the reporting form."
    },
    {
        question: "How do I track my report status?",
        answer: "You can track your reports in the 'Profile' section under the 'Activity' tab. You will also receive notifications if you have enabled them."
    },
    {
        question: "How are projects funded?",
        answer: "Projects are funded through a combination of local government budgets, international development partners, and community contributions."
    },
];

const Support: React.FC<SupportProps> = ({ onBack }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Help & Support</h1>
                        <p className="text-sm text-slate-600">We're here to help you</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-8">
                {/* Quick Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Call Us</h3>
                        <p className="text-xs text-slate-500 mt-1">+254 700 000 000</p>
                    </Card>
                    <Card className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-3">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Email Us</h3>
                        <p className="text-xs text-slate-500 mt-1">support@jenganation.org</p>
                    </Card>
                    <Card className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-3">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Live Chat</h3>
                        <p className="text-xs text-slate-500 mt-1">Available 8am - 5pm</p>
                    </Card>
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden cursor-pointer"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            >
                                <div className="p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                                    <span className="font-medium text-slate-700">{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                                {openFaq === index && (
                                    <div className="p-4 pt-0 bg-white text-sm text-slate-600 border-t border-slate-50">
                                        {faq.answer}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">Send us a message</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Name</label>
                            <Input placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <Input placeholder="Your email" type="email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Subject</label>
                        <Input placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Message</label>
                        <Textarea placeholder="Describe your issue or feedback..." className="h-32" />
                    </div>
                    <Button className="w-full bg-[#800020] hover:bg-[#600018]">Send Message</Button>
                </Card>
            </div>
        </div>
    );
};

export default Support;
