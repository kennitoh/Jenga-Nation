export type Screen =
  | "auth"
  | "region"
  | "home"
  | "report"
  | "map"
  | "projects"
  | "analysis"
  | "polls"
  | "badges"
  | "profile"
  | "admin"
  | "verification-panel"
  | "analytics-panel"
  | "support"
  | "settings"
  | "news"
  | "project-details"
  | "issue-details"
  | "missions"
  | "partner"
  | "alerts"
  | "profile-setup"
  | "post-project"
  | "national-revenue";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  constituency?: string;
  ward?: string;
  interests: string[];
  role: string;
  isProfileComplete: boolean;
  level: number;
  points: number;
  reports: number;
  joinedDate: string;
  region?: string;
  badges: string[];
  stats: {
    reports: number;
    projects: number;
    impact: number;
  };
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "In Progress" | "Resolved";
  location: string;
  reporter: User;
  date: string;
  upvotes: number;
  comments: number;
  images?: string[];
  position: { top: string; left: string };
  color: string;
  timeline: { status: string; date: string; completed: boolean }[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Active" | "Completed";
  location: string;
  progress: number;
  raised: number;
  goal: number;
  image: string;
  contributors: User[];
  startDate?: string;
  endDate?: string;
}

export interface Poll {
  id: number;
  title: string;
  question: string;
  category: string;
  options: {
    text: string;
    votes: number;
  }[];
  daysLeft: number;
  totalVotes: number;
  comments: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  earned: boolean;
  progress?: { current: number; total: number };
}

export interface Region {
  name: string;
  counties: string[];
  position: { top: string; left: string };
}

export type ProjectCategory =
  | "Infrastructure"
  | "Water & Sanitation"
  | "Energy & Power"
  | "Health"
  | "Education"
  | "Housing & Urban Development"
  | "Security & Law Enforcement"
  | "Environmental & Climate"
  | "Agriculture & Food Security"
  | "Digital & Technology"
  | "Community & Social Welfare"
  | "Economic Development"
  | "Governance & Public Service Reform"
  | "Transport & Mobility";