import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, MapPin, MessageSquare, ThumbsUp, Share2, Shield, User, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface IssueDetailsProps {
    onBack: () => void;
    onSettings?: () => void;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ onBack, onSettings }) => {
    const [comment, setComment] = useState("");
    const [likes, setLikes] = useState(24);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasVerified, setHasVerified] = useState(false);

    // Mock Data
    const issue = {
        id: "ISS-2024-001",
        title: "Large Pothole on Moi Avenue",
        description: "There is a very large pothole near the intersection causing heavy traffic and potential vehicle damage. It has been there for 2 weeks.",
        category: "Infrastructure",
        status: "In Progress",
        location: "Moi Avenue, Nairobi CBD",
        date: "2 days ago",
        reporter: "John Doe",
        reporterLevel: "Level 3 Contributor",
        verifiedCount: 12,
        images: [
            "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584463635346-9584b5098846?auto=format&fit=crop&q=80&w=800"
        ],
        timeline: [
            { status: "Received", date: "Oct 24, 10:00 AM", completed: true },
            { status: "Verified", date: "Oct 24, 02:30 PM", completed: true },
            { status: "Assigned", date: "Oct 25, 09:15 AM", completed: true },
            { status: "In Progress", date: "Oct 25, 11:00 AM", completed: true },
            { status: "Completed", date: "Pending", completed: false },
        ],
        comments: [
            { id: 1, user: "Alice W.", text: "I saw this too! It's getting worse.", time: "1 day ago", likes: 5 },
            { id: 2, user: "County Rep", text: "Team has been dispatched to assess.", time: "5 hours ago", likes: 12, isOfficial: true },
        ]
    };

    const handleLike = () => {
        if (hasLiked) {
            setLikes(prev => prev - 1);
        } else {
            setLikes(prev => prev + 1);
        }
        setHasLiked(!hasLiked);
    };

    const handleVerify = () => {
        if (!hasVerified) {
            setHasVerified(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
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
                            <h1 className="text-xl font-bold text-slate-800">Issue Details</h1>
                            <p className="text-sm text-slate-600">#{issue.id}</p>
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

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                {/* Status Card */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1">{issue.status}</Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {issue.date}</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative flex justify-between items-center px-2">
                        {/* Progress Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
                            style={{ width: '75%' }}
                        />

                        {issue.timeline.map((step, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.completed
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-slate-200 text-slate-300"
                                    }`}>
                                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-slate-200" />}
                                </div>
                                <span className={`text-[10px] font-medium ${step.completed ? "text-slate-800" : "text-slate-400"}`}>
                                    {step.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Main Content */}
                <Card className="overflow-hidden">
                    {/* Image Gallery */}
                    <div className="h-64 bg-slate-200 relative">
                        <img src={issue.images[0]} alt="Issue" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                            1/2 Photos
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800">{issue.title}</h2>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            {issue.location}
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                            {issue.description}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{issue.reporter}</p>
                                    <p className="text-xs text-slate-500">{issue.reporterLevel}</p>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                                <Shield className="w-3 h-3" />
                                {issue.verifiedCount} Community Verifications
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                        <Button
                            variant="outline"
                            className={`flex-1 gap-2 ${hasLiked ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}`}
                            onClick={handleLike}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            {likes} Upvotes
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={hasVerified}
                            className={`flex-1 gap-2 ${hasVerified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {hasVerified ? 'Verified (+50 XP)' : 'Verify Issue'}
                        </Button>
                    </div>
                </Card>

                {/* Discussion */}
                <Card className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Discussion
                    </h3>

                    <div className="space-y-4">
                        {issue.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${comment.isOfficial ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {comment.isOfficial ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-800">{comment.user}</span>
                                            {comment.isOfficial && (
                                                <Badge className="text-[10px] bg-blue-100 text-blue-700 h-5">Official</Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">{comment.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{comment.text}</p>
                                    <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                        <div className="flex-1 flex gap-2">
                            <Input
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="h-10"
                            />
                            <Button size="sm" disabled={!comment}>Post</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default IssueDetails;
