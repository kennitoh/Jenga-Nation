import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Vote, CheckCircle2, Clock, Users } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface PollsProps {
    onBack?: () => void;
}

interface PollOption {
    id: string;
    text: string;
    votes: number;
    percentage: number;
}

interface Poll {
    id: number;
    question: string;
    description: string;
    endDate: string;
    totalVotes: number;
    status: "active" | "completed";
    options: PollOption[];
    userVoted?: string;
}



const pollsData: Poll[] = [
    {
        id: 1,
        question: "Which community project should we prioritize next?",
        description: "We have budget for one major infrastructure project in Q3. Help us decide.",
        endDate: "2 days left",
        totalVotes: 1245,
        status: "active",
        options: [
            { id: "a", text: "New Community Library", votes: 450, percentage: 36 },
            { id: "b", text: "Sports Complex Renovation", votes: 380, percentage: 31 },
            { id: "c", text: "Street Lighting Expansion", votes: 415, percentage: 33 },
        ]
    },
    {
        id: 2,
        question: "Should we implement a car-free day in the CBD?",
        description: "Proposal to close city center to private vehicles on Sundays to reduce pollution.",
        endDate: "5 days left",
        totalVotes: 890,
        status: "active",
        options: [
            { id: "a", text: "Yes, fully support", votes: 560, percentage: 63 },
            { id: "b", text: "No, it will cause traffic", votes: 210, percentage: 24 },
            { id: "c", text: "Maybe, with modifications", votes: 120, percentage: 13 },
        ]
    },
    {
        id: 3,
        question: "Rate the new waste management system",
        description: "How satisfied are you with the new door-to-door collection service?",
        endDate: "Ended 2 weeks ago",
        totalVotes: 3400,
        status: "completed",
        options: [
            { id: "a", text: "Very Satisfied", votes: 1500, percentage: 44 },
            { id: "b", text: "Satisfied", votes: 1200, percentage: 35 },
            { id: "c", text: "Neutral", votes: 400, percentage: 12 },
            { id: "d", text: "Dissatisfied", votes: 300, percentage: 9 },
        ]
    },
    {
        id: 4,
        question: "Allocation of CDF Funds for Education",
        description: "How should the upcoming Constituency Development Fund be distributed among schools?",
        endDate: "1 week left",
        totalVotes: 2100,
        status: "active",
        options: [
            { id: "a", text: "Build New Classrooms", votes: 900, percentage: 43 },
            { id: "b", text: "Buy Textbooks & Supplies", votes: 600, percentage: 29 },
            { id: "c", text: "Scholarships for Needy Students", votes: 600, percentage: 28 },
        ]
    },
    {
        id: 5,
        question: "Local Market Upgrade Priorities",
        description: "The county is planning to renovate the main market. What is most urgent?",
        endDate: "3 days left",
        totalVotes: 1540,
        status: "active",
        options: [
            { id: "a", text: "Better Sanitation/Toilets", votes: 800, percentage: 52 },
            { id: "b", text: "Security & Lighting", votes: 400, percentage: 26 },
            { id: "c", text: "Storage Facilities", votes: 340, percentage: 22 },
        ]
    },
    {
        id: 6,
        question: "Healthcare Center Operating Hours",
        description: "Should the local dispensary extend its hours to weekends?",
        endDate: "Ended 1 month ago",
        totalVotes: 4200,
        status: "completed",
        options: [
            { id: "a", text: "Yes, open 24/7", votes: 2800, percentage: 67 },
            { id: "b", text: "Yes, 8am-5pm weekends", votes: 1000, percentage: 24 },
            { id: "c", text: "No, current hours are fine", votes: 400, percentage: 9 },
        ]
    },
    {
        id: 7,
        question: "Youth Employment Initiative Focus",
        description: "Which sector should the new county youth program focus on?",
        endDate: "Ended 3 days ago",
        totalVotes: 3100,
        status: "completed",
        options: [
            { id: "a", text: "Digital Skills & Tech", votes: 1200, percentage: 39 },
            { id: "b", text: "Agribusiness", votes: 1000, percentage: 32 },
            { id: "c", text: "Vocational Training (Plumbing, etc)", votes: 900, percentage: 29 },
        ]
    }
];

const Polls: React.FC<PollsProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("active");
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch Polls
        const { data: pollsData } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });

        if (!pollsData) {
            setLoading(false);
            return;
        }

        // 2. Fetch Options & My Votes
        const builtPolls: Poll[] = [];

        for (const p of pollsData) {
            const { data: options } = await supabase
                .from('poll_options')
                .select('*')
                .eq('poll_id', p.id);

            // Check if I voted
            let userVotedOptionId: string | undefined = undefined;
            if (user) {
                const { data: myVote } = await supabase
                    .from('poll_votes')
                    .select('option_id')
                    .eq('poll_id', p.id)
                    .eq('user_id', user.id)
                    .single();

                if (myVote) userVotedOptionId = myVote.option_id.toString();
            }

            // Calculate Totals
            const totalVotes = options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;

            builtPolls.push({
                id: p.id,
                question: p.question,
                description: p.description || '',
                endDate: p.end_date ? new Date(p.end_date).toLocaleDateString() : `${p.days_left || 0} days left`,
                totalVotes: totalVotes,
                status: p.days_left > 0 ? "active" : "completed",
                userVoted: userVotedOptionId,
                options: options?.map(opt => ({
                    id: opt.id.toString(),
                    text: opt.text,
                    votes: opt.votes || 0,
                    percentage: totalVotes === 0 ? 0 : Math.round(((opt.votes || 0) / totalVotes) * 100)
                })) || []
            });
        }

        setPolls(builtPolls);
        setLoading(false);
    };

    const activePolls = polls.filter(p => p.status === "active");
    const completedPolls = polls.filter(p => p.status === "completed");

    const onVoteCast = () => {
        fetchPolls(); // Refresh data
    };

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
                        <h1 className="text-xl font-bold text-slate-800">Community Polls</h1>
                        <p className="text-sm text-slate-600">Voice your opinion on local matters</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="active">Active Polls</TabsTrigger>
                        <TabsTrigger value="completed">Past Results</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-6">
                        {activePolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} onVoteCast={onVoteCast} />
                        ))}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-6">
                        {completedPolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} readonly onVoteCast={onVoteCast} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

const PollCard: React.FC<{ poll: Poll; readonly?: boolean; onVoteCast: () => void }> = ({ poll, readonly, onVoteCast }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async () => {
        if (selectedOption && !isVoting) {
            setIsVoting(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    alert("Please login to vote");
                    return;
                }

                // 1. Record Vote
                const { error: voteError } = await supabase.from('poll_votes').insert({
                    poll_id: poll.id,
                    option_id: parseInt(selectedOption), // Schema uses option_id
                    user_id: user.id
                });

                if (voteError) throw voteError;

                // 2. The database counts the vote (trigger on poll_votes); just refresh.
                onVoteCast();

            } catch (err) {
                console.error(err);
                alert("Voting failed.");
            } finally {
                setIsVoting(false);
            }
        }
    };

    const showResults = readonly || !!poll.userVoted;

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{poll.question}</h3>
                    <p className="text-sm text-slate-600">{poll.description}</p>
                </div>
                <Badge className={readonly ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-600"}>
                    {readonly ? "Closed" : "Active"}
                </Badge>
            </div>

            <div className="space-y-4 mb-6">
                {poll.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                        {showResults ? (
                            // Result View
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={`font-medium ${poll.userVoted === option.id ? "text-blue-600" : "text-slate-700"}`}>
                                        {option.text} {poll.userVoted === option.id && "(You)"}
                                    </span>
                                    <span className="text-slate-500">{option.percentage}%</span>
                                </div>
                                <Progress value={option.percentage} className="h-2" />
                            </div>
                        ) : (
                            // Voting View
                            <button
                                onClick={() => setSelectedOption(option.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedOption === option.id
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option.id ? "border-blue-500" : "border-slate-300"
                                        }`}>
                                        {selectedOption === option.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="font-medium">{option.text}</span>
                                </div>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {poll.totalVotes.toLocaleString()} votes
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {poll.endDate}
                    </div>
                </div>

                {!showResults && (
                    <Button
                        onClick={handleVote}
                        disabled={!selectedOption || isVoting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isVoting ? "Submitting..." : "Submit Vote"}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default Polls;
