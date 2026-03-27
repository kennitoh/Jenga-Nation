import { Building2, GraduationCap, CheckCircle2, Stethoscope, User, Lightbulb, Sprout, Home, TreePine } from 'lucide-react';

export const counties = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
].sort();

export const interestsList = [
    { id: 'roads', label: 'Roads & Infrastructure', icon: Building2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'water', label: 'Water & Sanitation', icon: CheckCircle2 },
    { id: 'health', label: 'Healthcare', icon: Stethoscope },
    { id: 'youth', label: 'Youth & Sports', icon: User },
    { id: 'tech', label: 'Technology', icon: Lightbulb },
    { id: 'agri', label: 'Agriculture', icon: Sprout },
    { id: 'housing', label: 'Housing', icon: Home },
    { id: 'env', label: 'Environment', icon: TreePine },
];

export const roles = [
    { id: 'citizen', label: 'Citizen', desc: 'Reports issues, follows project progress, and engages with community updates.' },
    { id: 'leader', label: 'Community Leader', desc: 'Represents a local group, helps verify issues, and can highlight community needs.' },
    { id: 'ngo', label: 'NGO / Institution', desc: 'Manages and posts development projects, shares progress, and collaborates with communities.' },
    { id: 'gov', label: 'Government Official', desc: 'Oversees county/national projects, posts official updates, and responds to public issues.' },
    { id: 'aspiring', label: 'Aspiring Leader', desc: 'Builds a public profile, shares their agenda, and engages with community issues for visibility.' },
];
