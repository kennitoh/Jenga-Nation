import { LucideIcon } from "lucide-react";
import {
    Construction,
    Droplet,
    Zap,
    Heart,
    GraduationCap,
    Shield,
    Leaf,
    Bus,
    Home as HomeIcon,
    Laptop,
    Wheat,
    Store,
    Trophy,
    Trees,
    Users,
    Building,
    Siren,
    Waves,
    Lightbulb,
    Landmark,
} from "lucide-react";

export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    subcategories: string[];
}

export const categories: Category[] = [
    {
        id: "infrastructure-roads",
        name: "Infrastructure & Roads",
        icon: Construction,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Road Construction", "Bridge Repairs", "Potholes", "Road Markings", "Sidewalks", "Parking"],
    },
    {
        id: "water-sanitation",
        name: "Water & Sanitation",
        icon: Droplet,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Water Supply", "Wells & Boreholes", "Sewage Systems", "Water Quality", "Pipe Leaks", "Sanitation Facilities"],
    },
    {
        id: "electricity-energy",
        name: "Electricity & Energy",
        icon: Zap,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Power Outages", "Street Lights", "Solar Energy", "Power Lines", "Transformers", "Renewable Energy"],
    },
    {
        id: "healthcare",
        name: "Healthcare Facilities",
        icon: Heart,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Clinics", "Hospitals", "Medical Equipment", "Ambulance Services", "Pharmacies", "Health Programs"],
    },
    {
        id: "education-schools",
        name: "Education & Schools",
        icon: GraduationCap,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["School Buildings", "Libraries", "Classrooms", "School Equipment", "Teacher Resources", "Vocational Training"],
    },
    {
        id: "security-safety",
        name: "Security & Safety",
        icon: Shield,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Police Stations", "Street Safety", "Crime Prevention", "Fire Services", "Emergency Response", "Community Policing"],
    },
    {
        id: "waste-environment",
        name: "Waste Management & Environment",
        icon: Leaf,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Garbage Collection", "Recycling", "Dumping Sites", "Air Quality", "Pollution Control", "Environmental Clean-up"],
    },
    {
        id: "transportation",
        name: "Transportation Systems",
        icon: Bus,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Bus Stops", "Public Transport", "Traffic Lights", "Footbridges", "Pedestrian Crossings", "Cycling Lanes"],
    },
    {
        id: "housing-urban",
        name: "Housing & Urban Planning",
        icon: HomeIcon,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Social Housing", "Urban Development", "Zoning Issues", "Building Permits", "Slum Upgrading", "Land Use"],
    },
    {
        id: "digital-services",
        name: "Digital Services & Technology",
        icon: Laptop,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Internet Access", "Digital Literacy", "E-Government", "Tech Hubs", "Mobile Services", "Connectivity"],
    },
    {
        id: "agriculture",
        name: "Agriculture & Food Security",
        icon: Wheat,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Farming Support", "Irrigation", "Food Markets", "Agricultural Extension", "Livestock", "Food Storage"],
    },
    {
        id: "business-markets",
        name: "Business & Markets Development",
        icon: Store,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Market Infrastructure", "SME Support", "Business Licenses", "Trade Centers", "Economic Development", "Entrepreneurship"],
    },
    {
        id: "youth-sports",
        name: "Youth & Sports Facilities",
        icon: Trophy,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Sports Complexes", "Playgrounds", "Youth Centers", "Recreation Facilities", "Sports Equipment", "Training Programs"],
    },
    {
        id: "recreation-public",
        name: "Recreation & Public Spaces",
        icon: Trees,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Parks", "Gardens", "Public Squares", "Walking Trails", "Benches", "Green Spaces"],
    },
    {
        id: "social-welfare",
        name: "Social Welfare & Community Services",
        icon: Users,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Community Centers", "Elderly Care", "Childcare", "Social Programs", "Disability Services", "Support Groups"],
    },
    {
        id: "government-services",
        name: "Government Services",
        icon: Building,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["County Offices", "Registries", "Administrative Services", "Public Service Delivery", "Documentation", "Civic Services"],
    },
    {
        id: "disaster-emergency",
        name: "Disaster Response & Emergency",
        icon: Siren,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Emergency Preparedness", "Disaster Relief", "Flood Control", "Evacuation Routes", "Early Warning Systems", "Emergency Shelters"],
    },
    {
        id: "water-conservation",
        name: "Water Bodies & Conservation",
        icon: Waves,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["River Protection", "Lakes & Wetlands", "Water Conservation", "Coastal Management", "Fishing Grounds", "Aquatic Ecosystems"],
    },
    {
        id: "public-utilities",
        name: "Public Utilities",
        icon: Lightbulb,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Street Lighting", "Drainage Systems", "Sewage Treatment", "Public Toilets", "Utility Maintenance", "Infrastructure Services"],
    },
    {
        id: "tourism-culture",
        name: "Tourism & Cultural Heritage",
        icon: Landmark,
        color: "#800020",
        bgColor: "rgba(128, 0, 32, 0.1)",
        subcategories: ["Historic Sites", "Museums", "Cultural Centers", "Tourist Attractions", "Heritage Preservation", "Arts & Culture"],
    },
];

export const getCategoryById = (id: string): Category | undefined => {
    return categories.find((cat) => cat.id === id);
};

export const getCategoryColor = (id: string): string => {
    return getCategoryById(id)?.color || "#800020";
};

export const getCategoryBgColor = (id: string): string => {
    return getCategoryById(id)?.bgColor || "rgba(128, 0, 32, 0.1)";
};
