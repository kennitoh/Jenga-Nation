import React, { useState } from 'react';
import { ArrowLeft, Search, TrendingUp, MapPin, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { getCategoryById } from '../config/categories';

interface NewsProps {
    onBack?: () => void;
}

interface NewsArticle {
    id: number;
    title: string;
    summary: string;
    image: string;
    region: string;
    categoryId: string;
    date: string;
    trending: boolean;
}

const newsArticles: NewsArticle[] = [
    {
        id: 1,
        title: "New Water Treatment Plant Opens in Nairobi County",
        summary: "State-of-the-art facility will serve over 100,000 residents with clean, safe drinking water year-round.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
        region: "Nairobi",
        categoryId: "water-sanitation",
        date: "2 hours ago",
        trending: true,
    },
    {
        id: 2,
        title: "County Government Launches Digital Services Portal",
        summary: "Residents can now access government services online, reducing wait times and improving efficiency.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        region: "Kisumu",
        categoryId: "digital-services",
        date: "5 hours ago",
        trending: true,
    },
    {
        id: 3,
        title: "Community Health Initiative Reaches 50,000 People",
        summary: "Free health screenings and vaccinations provided to residents across three counties this month.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        region: "Nakuru",
        categoryId: "healthcare",
        date: "1 day ago",
        trending: false,
    },
    {
        id: 4,
        title: "Solar Street Lights Installed in 15 Neighborhoods",
        summary: "Renewable energy project improves safety and reduces electricity costs for local communities.",
        image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800",
        region: "Mombasa",
        categoryId: "electricity-energy",
        date: "1 day ago",
        trending: false,
    },
    {
        id: 5,
        title: "New School Bus Program Launched for Rural Students",
        summary: "Safe, reliable transportation ensures 2,000 students can attend school regularly.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
        region: "Garissa",
        categoryId: "transportation",
        date: "2 days ago",
        trending: false,
    },
    {
        id: 6,
        title: "Agricultural Extension Program Boosts Farmer Yields by 40%",
        summary: "Modern farming techniques and training help local farmers increase production and income.",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        region: "Uasin Gishu",
        categoryId: "agriculture",
        date: "3 days ago",
        trending: false,
    },
    {
        id: 7,
        title: "Waste Recycling Plant Processes 100 Tons Daily",
        summary: "New facility creates jobs while addressing environmental challenges in the region.",
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
        region: "Thika",
        categoryId: "waste-environment",
        date: "3 days ago",
        trending: false,
    },
    {
        id: 8,
        title: "Youth Sports Complex Opens with Modern Facilities",
        summary: "State-of-the-art training center will develop next generation of African athletes.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
        region: "Eldoret",
        categoryId: "youth-sports",
        date: "4 days ago",
        trending: false,
    },
    {
        id: 9,
        title: "Emergency Response Teams Receive New Equipment",
        summary: "Enhanced disaster preparedness capabilities will improve community safety and response times.",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
        region: "Nairobi",
        categoryId: "disaster-emergency",
        date: "5 days ago",
        trending: false,
    },
    {
        id: 10,
        title: "Cultural Heritage Site Receives UNESCO Recognition",
        summary: "Landmark designation expected to boost tourism and preserve local history for future generations.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
        region: "Lamu",
        categoryId: "tourism-culture",
        date: "1 week ago",
        trending: false,
    },
];

const News: React.FC<NewsProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState("all");

    const filteredArticles = newsArticles.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRegion = regionFilter === "all" || article.region === regionFilter;

        return matchesSearch && matchesRegion;
    });

    const trendingArticles = newsArticles.filter(a => a.trending);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-700" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Regional News</h1>
                        <p className="text-sm text-slate-600">Stay informed about community developments</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#800020]">
                            <TrendingUp className="w-5 h-5" />
                            <h2 className="font-bold text-lg">Trending Now</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trendingArticles.map((article) => {
                                const category = getCategoryById(article.categoryId);
                                return (
                                    <Card key={article.id} className="flex overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 border-0">
                                        <div className="w-1/3 relative">
                                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-2/3 p-4 flex flex-col justify-center">
                                            <Badge
                                                className="w-fit mb-2"
                                                style={{ backgroundColor: category?.bgColor, color: category?.color }}
                                            >
                                                {category?.name}
                                            </Badge>
                                            <h3 className="font-bold text-slate-800 line-clamp-2 mb-2">{article.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {article.date}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search news..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>

                    <div className="overflow-x-auto pb-2">
                        <Tabs value={regionFilter} onValueChange={setRegionFilter} className="w-full">
                            <TabsList className="inline-flex w-auto">
                                <TabsTrigger value="all">All Regions</TabsTrigger>
                                <TabsTrigger value="Nairobi">Nairobi</TabsTrigger>
                                <TabsTrigger value="Kisumu">Kisumu</TabsTrigger>
                                <TabsTrigger value="Mombasa">Mombasa</TabsTrigger>
                                <TabsTrigger value="Nakuru">Nakuru</TabsTrigger>
                                <TabsTrigger value="Eldoret">Eldoret</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => {
                        const category = getCategoryById(article.categoryId);
                        const CategoryIcon = category?.icon;

                        return (
                            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                                    {article.trending && (
                                        <Badge className="absolute top-4 right-4 bg-red-500 text-white shadow-sm">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Trending
                                        </Badge>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{article.summary}</p>

                                    <div className="border-t border-slate-100 pt-4 space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{article.region}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            {category && (
                                                <Badge
                                                    className="flex items-center gap-1"
                                                    style={{ backgroundColor: category.bgColor, color: category.color }}
                                                >
                                                    {CategoryIcon && <CategoryIcon className="w-3 h-3" />}
                                                    {category.name}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {article.date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default News;
