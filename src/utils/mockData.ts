// Mock data without type imports to avoid compilation errors

export const mockUser = {
  id: 1,
  name: "Sarah M.",
  email: "sarah.m@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  level: 8,
  points: 450,
  reports: 12,
  joinedDate: "November 2024",
  role: "community",
  region: "Kenya",
  badges: ["First Report", "Community Hero", "Super Voter"],
  interests: ["Infrastructure", "Education"],
  isProfileComplete: true,
  stats: {
    reports: 12,
    projects: 3,
    impact: 85
  }
};

export const mockIssues = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    category: "Infrastructure",
    status: "Pending",
    location: "Nairobi, Kenya",
    reporter: mockUser,
    date: "2 days ago",
    upvotes: 15,
    comments: 3,
    position: { top: "45%", left: "52%" },
    color: "bg-red-500",
    timeline: [
      { status: "Received", date: "2 days ago", completed: true },
      { status: "Verified", date: "1 day ago", completed: true },
      { status: "Assigned", date: "Pending", completed: false }
    ]
  },
  {
    id: 2,
    title: "Water Supply Issue",
    description: "Irregular water supply in residential area",
    category: "Water",
    status: "In Progress",
    location: "Mombasa, Kenya",
    reporter: mockUser,
    date: "1 week ago",
    upvotes: 23,
    comments: 7,
    position: { top: "60%", left: "48%" },
    color: "bg-blue-500",
    timeline: [
      { status: "Received", date: "1 week ago", completed: true },
      { status: "Verified", date: "6 days ago", completed: true },
      { status: "In Progress", date: "2 days ago", completed: true }
    ]
  },
  {
    id: 3,
    title: "School Renovation",
    description: "School building needs renovation",
    category: "Education",
    status: "Resolved",
    location: "Kisumu, Kenya",
    reporter: mockUser,
    date: "2 weeks ago",
    upvotes: 42,
    comments: 12,
    position: { top: "30%", left: "55%" },
    color: "bg-green-500",
    timeline: [
      { status: "Received", date: "2 weeks ago", completed: true },
      { status: "Verified", date: "12 days ago", completed: true },
      { status: "Resolved", date: "1 day ago", completed: true }
    ]
  }
];

export const mockProjects = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description: "Providing clean water access to rural communities",
    category: "Water",
    status: "Active",
    location: "Nairobi County",
    progress: 75,
    raised: 45000,
    goal: 60000,
    image: "https://images.unsplash.com/photo-1541976544387-e43ca9be2dca?auto=format&fit=crop&q=80&w=800",
    contributors: [mockUser]
  },
  {
    id: 2,
    title: "School Library Project",
    description: "Building libraries in underserved schools",
    category: "Education",
    status: "Active",
    location: "Mombasa",
    progress: 60,
    raised: 28000,
    goal: 45000,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    contributors: [mockUser]
  },
  {
    id: 3,
    title: "Healthcare Clinic",
    description: "Establishing healthcare clinics in remote areas",
    category: "Healthcare",
    status: "Active",
    location: "Kisumu",
    progress: 90,
    raised: 85000,
    goal: 95000,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    contributors: [mockUser]
  }
];

export const mockPolls = [
  {
    id: 1,
    title: "Priority Road Repairs",
    question: "Which road should be repaired first?",
    category: "Infrastructure",
    options: [
      { text: "Main Street", votes: 245 },
      { text: "Highway 5", votes: 178 },
      { text: "Park Avenue", votes: 120 }
    ],
    daysLeft: 3,
    totalVotes: 543,
    comments: 34
  },
  {
    id: 2,
    title: "Healthcare Priorities",
    question: "What healthcare service is most needed?",
    category: "Healthcare",
    options: [
      { text: "Mobile clinic", votes: 312 },
      { text: "Maternity ward", votes: 189 },
      { text: "Pharmacy", votes: 101 }
    ],
    daysLeft: 5,
    totalVotes: 602,
    comments: 56
  }
];

export const mockBadges = [
  {
    id: 1,
    name: "First Report",
    description: "Submit your first issue",
    icon: "CheckCircle2",
    color: "text-green-600",
    requirement: "Submit your first issue",
    earned: true
  },
  {
    id: 2,
    name: "Community Hero",
    description: "Get 50+ upvotes",
    icon: "Heart",
    color: "text-red-600",
    requirement: "Get 50+ upvotes on your reports",
    earned: true
  },
  {
    id: 3,
    name: "Super Voter",
    description: "Vote in 10+ polls",
    icon: "Vote",
    color: "text-blue-600",
    requirement: "Vote in 10+ polls",
    earned: true
  },
  {
    id: 4,
    name: "Power User",
    description: "Submit 100 reports",
    icon: "Zap",
    color: "text-gray-400",
    requirement: "Submit 100 reports",
    earned: false,
    progress: { current: 45, total: 100 }
  },
  {
    id: 5,
    name: "Gold Contributor",
    description: "Earn 1000 points",
    icon: "Award",
    color: "text-gray-400",
    requirement: "Earn 1000 points",
    earned: false,
    progress: { current: 450, total: 1000 }
  }
];

export const mockRegions = [
  {
    name: "Kenya",
    counties: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    position: { top: "45%", left: "52%" }
  },
  {
    name: "Tanzania",
    counties: ["Dar es Salaam", "Arusha", "Mwanza", "Zanzibar"],
    position: { top: "60%", left: "48%" }
  },
  {
    name: "Uganda",
    counties: ["Kampala", "Gulu", "Mbarara", "Jinja"],
    position: { top: "25%", left: "50%" }
  },
  {
    name: "Rwanda",
    counties: ["Kigali", "Butare", "Ruhengeri", "Gitarama"],
    position: { top: "35%", left: "47%" }
  },
  {
    name: "Ethiopia",
    counties: ["Addis Ababa", "Dire Dawa", "Mek'ele", "Bahir Dar"],
    position: { top: "40%", left: "58%" }
  },
  {
    name: "Nigeria",
    counties: ["Lagos", "Abuja", "Kano", "Ibadan"],
    position: { top: "55%", left: "40%" }
  },
  {
    name: "South Africa",
    counties: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
    position: { top: "75%", left: "45%" }
  },
  {
    name: "Ghana",
    counties: ["Accra", "Kumasi", "Tamale", "Sekondi"],
    position: { top: "58%", left: "35%" }
  }
];