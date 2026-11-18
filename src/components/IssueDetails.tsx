import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, MapPin, MessageSquare, ThumbsUp, Share2, Shield, User, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { getCategoryById } from '../config/categories';
import {
    ISSUE_STEPS,
    LiveComment,
    LiveIssue,
    TimelineRow,
    addComment,
    fetchComments,
    fetchIssue,
    fetchMyIssueState,
    fetchTimeline,
    getCurrentUserId,
    relativeTime,
    setUpvote,
    statusColor,
    statusLabel,
    verifyIssue,
} from '../lib/issues';

interface IssueDetailsProps {
    /** When given, the screen loads this report from the database. Without it (or if it can't be found) the built-in sample report is shown. */
    issueId?: number | null;
    onBack: () => void;
    onSettings?: () => void;
}

// Sample report, shown when no real report is selected.
const MOCK_ISSUE = {
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
    ] as { id: number; user: string; text: string; time: string; likes: number; isOfficial?: boolean }[]
};

interface ViewComment { id: number; user: string; text: string; time: string; isOfficial?: boolean }

const IssueDetails: React.FC<IssueDetailsProps> = ({ issueId, onBack, onSettings }) => {
    const [comment, setComment] = useState("");
    const [likes, setLikes] = useState(24);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasVerified, setHasVerified] = useState(false);
    const [mockComments, setMockComments] = useState(MOCK_ISSUE.comments);

    // Live data
    const [live, setLive] = useState<LiveIssue | null>(null);
    const [liveTimeline, setLiveTimeline] = useState<TimelineRow[]>([]);
    const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(!!issueId);
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    const loadAll = useCallback(async () => {
        if (!issueId) return;
        const [issue, timeline, comments, uid] = await Promise.all([
            fetchIssue(issueId),
            fetchTimeline(issueId),
            fetchComments(issueId),
            getCurrentUserId(),
        ]);
        setLive(issue);
        setLiveTimeline(timeline);
        setLiveComments(comments);
        setUserId(uid);
        if (issue) {
            setLikes(issue.upvotes);
            if (uid) {
                const mine = await fetchMyIssueState(issueId, uid);
                setHasLiked(mine.voted);
                setHasVerified(mine.verified);
            }
        }
        setLoading(false);
    }, [issueId]);

    useEffect(() => { loadAll(); }, [loadAll]);

    const isLive = !!live;

    // ---- Build the view model (live report or sample report) ----
    let view: {
        refLabel: string; title: string; description: string; category: string; status: string;
        location: string; updated: string; reporter: string; reporterLevel: string; verifiedCount: number;
        images: string[]; steps: { status: string; completed: boolean }[]; progressPct: number;
        comments: ViewComment[]; rejected: boolean;
    };

    if (live) {
        const reached = liveTimeline.reduce((max, row) => {
            const idx = ISSUE_STEPS.indexOf(row.status as typeof ISSUE_STEPS[number]);
            return idx > max ? idx : max;
        }, 0);
        const lastRow = liveTimeline[liveTimeline.length - 1];
        view = {
            refLabel: `JN-${live.id}`,
            title: live.title,
            description: live.description,
            category: getCategoryById(live.category)?.name || live.category,
            status: statusLabel(live.status),
            location: live.location,
            updated: relativeTime(lastRow?.date || live.createdAt),
            reporter: live.reporterName,
            reporterLevel: live.reporterLevel ? `Level ${live.reporterLevel}` : '',
            verifiedCount: live.verifications,
            images: live.images,
            steps: ISSUE_STEPS.map((s, i) => ({ status: s, completed: i <= reached })),
            progressPct: (reached / (ISSUE_STEPS.length - 1)) * 100,
            comments: liveComments.map(c => ({
                id: c.id, user: c.userName, text: c.body, time: relativeTime(c.createdAt), isOfficial: c.isOfficial,
            })),
            rejected: live.status === 'Rejected',
        };
    } else {
        view = {
            refLabel: MOCK_ISSUE.id,
            title: MOCK_ISSUE.title,
            description: MOCK_ISSUE.description,
            category: MOCK_ISSUE.category,
            status: MOCK_ISSUE.status,
            location: MOCK_ISSUE.location,
            updated: MOCK_ISSUE.date,
            reporter: MOCK_ISSUE.reporter,
            reporterLevel: MOCK_ISSUE.reporterLevel,
            verifiedCount: MOCK_ISSUE.verifiedCount + (hasVerified ? 1 : 0),
            images: MOCK_ISSUE.images,
            steps: MOCK_ISSUE.timeline.map(s => ({ status: s.status, completed: s.completed })),
            progressPct: 75,
            comments: mockComments.map(c => ({ id: c.id, user: c.user, text: c.text, time: c.time, isOfficial: c.isOfficial })),
            rejected: false,
        };
    }

    const handleLike = async () => {
        if (!isLive || !live) {
            setLikes(prev => (hasLiked ? prev - 1 : prev + 1));
            setHasLiked(!hasLiked);
            return;
        }
        if (!userId) { setNotice('Please sign in to support a report.'); return; }
        if (busy) return;
        setBusy(true);
        try {
            await setUpvote(live.id, userId, !hasLiked);
            setHasLiked(!hasLiked);
            setLikes(prev => (hasLiked ? Math.max(prev - 1, 0) : prev + 1));
            setNotice(null);
        } catch (err: any) {
            setNotice(err.message || 'Could not update your support.');
        } finally {
            setBusy(false);
        }
    };

    const handleVerify = async () => {
        if (hasVerified) return;
        if (!isLive || !live) {
            setHasVerified(true);
            return;
        }
        if (!userId) { setNotice('Please sign in to verify a report.'); return; }
        if (busy) return;
        setBusy(true);
        try {
            await verifyIssue(live.id, userId);
            setHasVerified(true);
            setLive({ ...live, verifications: live.verifications + 1 });
            setNotice(null);
        } catch (err: any) {
            setNotice(err.message || 'Could not verify this report.');
        } finally {
            setBusy(false);
        }
    };

    const handleShare = async () => {
        const text = `${view.title} - Jenga Nation`;
        try {
            if (navigator.share) {
                await navigator.share({ title: text, text: view.description });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(`${text}: ${view.description}`);
                setNotice('Copied to clipboard.');
            }
        } catch {
            // user cancelled sharing
        }
    };

    const handlePostComment = async () => {
        const text = comment.trim();
        if (!text) return;
        if (!isLive || !live) {
            setMockComments(prev => [...prev, { id: Date.now(), user: 'You', text, time: 'just now', likes: 0 }]);
            setComment("");
            return;
        }
        if (!userId) { setNotice('Please sign in to comment.'); return; }
        if (busy) return;
        setBusy(true);
        try {
            await addComment(live.id, userId, text);
            setComment("");
            setLiveComments(await fetchComments(live.id));
            setNotice(null);
        } catch (err: any) {
            setNotice(err.message || 'Could not post your comment.');
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        );
    }

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
                            <p className="text-sm text-slate-600">#{view.refLabel}{!isLive && ' (sample)'}</p>
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
                {issueId && !isLive && (
                    <Card className="p-4 bg-orange-50 border-orange-100">
                        <p className="text-sm text-orange-800">
                            That report could not be loaded (it may be awaiting review or removed), so a sample report is shown instead.
                        </p>
                    </Card>
                )}

                {notice && (
                    <Card className="p-3 bg-blue-50 border-blue-100">
                        <p className="text-sm text-blue-800">{notice}</p>
                    </Card>
                )}

                {/* Status Card */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Badge className={`text-sm px-3 py-1 ${isLive ? statusColor(live!.status) : 'bg-blue-100 text-blue-700'}`}>{view.status}</Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {view.updated}</span>
                        </div>
                    </div>

                    {view.rejected && (
                        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3 mb-6">
                            This report was not approved by the moderators.
                        </p>
                    )}

                    {/* Timeline */}
                    <div className="relative flex justify-between items-center px-2">
                        {/* Progress Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
                            style={{ width: `${view.progressPct}%` }}
                        />

                        {view.steps.map((step, index) => (
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
                    {view.images.length > 0 && (
                        <div className="h-64 bg-slate-200 relative">
                            <img src={view.images[0]} alt="Issue" className="w-full h-full object-cover" />
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                1/{view.images.length} Photos
                            </div>
                        </div>
                    )}

                    <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800">{view.title}</h2>

                        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {view.location}
                            </span>
                            <Badge className="bg-slate-100 text-slate-700">{view.category}</Badge>
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                            {view.description}
                        </p>

                        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{view.reporter}</p>
                                    {view.reporterLevel && <p className="text-xs text-slate-500">{view.reporterLevel}</p>}
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                                <Shield className="w-3 h-3" />
                                {view.verifiedCount} Community Verifications
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                        <Button
                            variant="outline"
                            className={`flex-1 gap-2 ${hasLiked ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}`}
                            onClick={handleLike}
                            disabled={busy}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            {likes} Upvotes
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={hasVerified || busy}
                            className={`flex-1 gap-2 ${hasVerified ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {hasVerified ? (isLive ? 'Verified' : 'Verified (+50 XP)') : 'Verify Issue'}
                        </Button>
                    </div>
                </Card>

                {/* Discussion */}
                <Card className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Discussion
                    </h3>

                    <div className="space-y-4">
                        {view.comments.length === 0 && (
                            <p className="text-sm text-slate-500">No comments yet. Start the discussion.</p>
                        )}
                        {view.comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.isOfficial ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {c.isOfficial ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-800">{c.user}</span>
                                            {c.isOfficial && (
                                                <Badge className="text-[10px] bg-blue-100 text-blue-700 h-5">Official</Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400">{c.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{c.text}</p>
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
                                maxLength={2000}
                                className="h-10"
                            />
                            <Button size="sm" disabled={!comment.trim() || busy} onClick={handlePostComment}>Post</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default IssueDetails;
