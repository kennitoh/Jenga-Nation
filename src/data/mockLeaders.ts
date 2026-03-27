import { User, Shield, Building2 } from 'lucide-react';

export type LeaderType = 'government' | 'aspiring' | 'ngo';

export interface Leader {
    id: string;
    name: string;
    photo: string;
    role: string;
    type: LeaderType;
    region: string;
    performanceScore: number;
    bio: string;
    stats: {
        projectsCompleted: number;
        issuesResolved: number;
        communityVisits: number;
        responseRate: string;
    };
    sentiment: {
        approval: number;
        trend: 'up' | 'down' | 'stable';
        praises: string[];
        complaints: string[];
        monthlyTrend: { month: string; score: number }[];
    };
    contribution: {
        infrastructure: number;
        education: number;
        healthcare: number;
        youth: number;
        agriculture: number;
    };
    transparency: {
        openBudget: boolean;
        auditStatus: 'Clean' | 'Queries' | 'Pending';
        trustScore: number;
    };
    // Specific to Aspiring
    promises?: {
        id: string;
        title: string;
        category: string;
        timeline: 'Short-term' | 'Mid-term' | 'Long-term';
        difficulty: 'Easy' | 'Medium' | 'Hard';
        approval: number;
    }[];
    // Specific to NGO
    impact?: {
        communitiesHelped: number;
        fundsUtilized: number; // Percentage
        specialization: string[];
    };
}

export const mockLeaders: Leader[] = [
    {
        id: "gov-1",
        name: "Hon. Sarah Johnson",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        role: "Governor",
        type: "government",
        region: "Nairobi County",
        performanceScore: 78,
        bio: "Focused on urban renewal and digital infrastructure transformation.",
        stats: {
            projectsCompleted: 45,
            issuesResolved: 1250,
            communityVisits: 24,
            responseRate: "2.5 days"
        },
        sentiment: {
            approval: 72,
            trend: "up",
            praises: ["Road repairs", "Youth programs", "Digital services"],
            complaints: ["Water shortages", "Traffic congestion"],
            monthlyTrend: [
                { month: "Jan", score: 65 },
                { month: "Feb", score: 68 },
                { month: "Mar", score: 72 },
                { month: "Apr", score: 70 },
                { month: "May", score: 75 },
                { month: "Jun", score: 78 }
            ]
        },
        contribution: {
            infrastructure: 40,
            education: 15,
            healthcare: 20,
            youth: 15,
            agriculture: 10
        },
        transparency: {
            openBudget: true,
            auditStatus: "Clean",
            trustScore: 85
        }
    },
    {
        id: "asp-1",
        name: "David Kamau",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        role: "Aspiring MP",
        type: "aspiring",
        region: "Westlands Constituency",
        performanceScore: 65, // Based on past community work
        bio: "Community organizer advocating for better education and youth employment.",
        stats: {
            projectsCompleted: 12,
            issuesResolved: 340,
            communityVisits: 56,
            responseRate: "1.2 days"
        },
        sentiment: {
            approval: 85,
            trend: "up",
            praises: ["Accessible", "Grassroots focus", "Honest"],
            complaints: ["Lack of resources", "Inexperienced"],
            monthlyTrend: [
                { month: "Jan", score: 60 },
                { month: "Feb", score: 70 },
                { month: "Mar", score: 75 },
                { month: "Apr", score: 80 },
                { month: "May", score: 82 },
                { month: "Jun", score: 85 }
            ]
        },
        contribution: {
            infrastructure: 10,
            education: 50,
            healthcare: 10,
            youth: 30,
            agriculture: 0
        },
        transparency: {
            openBudget: true,
            auditStatus: "Clean",
            trustScore: 92
        },
        promises: [
            { id: "p1", title: "Build 3 new libraries", category: "Education", timeline: "Mid-term", difficulty: "Medium", approval: 90 },
            { id: "p2", title: "Free Wi-Fi zones", category: "Technology", timeline: "Short-term", difficulty: "Easy", approval: 88 },
            { id: "p3", title: "Youth Innovation Hub", category: "Youth", timeline: "Long-term", difficulty: "Hard", approval: 95 }
        ]
    },
    {
        id: "ngo-1",
        name: "Green Future Foundation",
        photo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=200",
        role: "Environmental NGO",
        type: "ngo",
        region: "National",
        performanceScore: 88,
        bio: "Dedicated to sustainable agriculture and climate resilience.",
        stats: {
            projectsCompleted: 120,
            issuesResolved: 500,
            communityVisits: 150,
            responseRate: "N/A"
        },
        sentiment: {
            approval: 92,
            trend: "stable",
            praises: ["High impact", "Transparent", "Reliable"],
            complaints: ["Limited scope"],
            monthlyTrend: [
                { month: "Jan", score: 88 },
                { month: "Feb", score: 89 },
                { month: "Mar", score: 90 },
                { month: "Apr", score: 91 },
                { month: "May", score: 92 },
                { month: "Jun", score: 92 }
            ]
        },
        contribution: {
            infrastructure: 5,
            education: 20,
            healthcare: 10,
            youth: 15,
            agriculture: 50
        },
        transparency: {
            openBudget: true,
            auditStatus: "Clean",
            trustScore: 98
        },
        impact: {
            communitiesHelped: 45,
            fundsUtilized: 94,
            specialization: ["Agriculture", "Climate Change", "Water"]
        }
    }
];
