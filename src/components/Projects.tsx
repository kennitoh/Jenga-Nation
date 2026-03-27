import React, { useState } from 'react';
import { mockProjects } from '../data/mockProjects';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Search, MapPin, Building2, Users, Clock, AlertCircle, CheckCircle2, Settings, BookOpen, Activity, Leaf, Droplets, Monitor, Users2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface ProjectsProps {
  onBack?: () => void;
  onSelectProject: (id: number) => void;
  onSettings?: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onBack, onSelectProject, onSettings }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Active" | "Paused">("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setProjects(data);
    } else {
      // Fallback
      setProjects(mockProjects);
    }
    setLoading(false);
  };

  const categories = [
    { id: 'infrastructure', name: 'Infrastructure', color: '#2563eb', bgColor: '#dbeafe', icon: Building2 },
    { id: 'health', name: 'Health', color: '#dc2626', bgColor: '#fee2e2', icon: Activity },
    { id: 'education', name: 'Education', color: '#16a34a', bgColor: '#dcfce7', icon: BookOpen },
    { id: 'water-sanitation', name: 'Water & Sanitation', color: '#0891b2', bgColor: '#cffafe', icon: Droplets },
    { id: 'digital-technology', name: 'Tech & Digital', color: '#7c3aed', bgColor: '#ede9fe', icon: Monitor },
    { id: 'community-social', name: 'Community', color: '#f59e0b', bgColor: '#fef3c7', icon: Users2 },
    { id: 'environmental-climate', name: 'Environment', color: '#059669', bgColor: '#d1fae5', icon: Leaf },
  ];

  // Helper function for category
  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  // Helper for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#dcfce7', text: '#16a34a', icon: CheckCircle2 };
      case 'Active': return { bg: '#fef9c3', text: '#ca8a04', icon: Clock };
      case 'Paused': return { bg: '#fee2e2', text: '#dc2626', icon: AlertCircle };
      default: return { bg: '#f1f5f9', text: '#475569', icon: Clock };
    }
  };

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-800">Community Projects</h1>
              <p className="text-sm text-slate-600">Track development in your area</p>
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

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>

            <Tabs value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Completed">Done</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Paused">Paused</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => {
            const category = getCategoryById(project.category);
            const CategoryIcon = category?.icon;
            const statusStyle = getStatusColor(project.status);
            const StatusIcon = statusStyle.icon;

            return (
              <Card
                key={project.id}
                className="overflow-hidden group cursor-pointer"
                onClick={() => onSelectProject(project.id)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className="flex items-center gap-1 shadow-sm"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{project.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                    {category && (
                      <Badge
                        className="flex items-center gap-1 text-[10px]"
                        style={{ backgroundColor: category.bgColor, color: category.color }}
                      >
                        {CategoryIcon && <CategoryIcon className="w-3 h-3" />}
                        {category.name}
                      </Badge>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3 h-3 mt-0.5 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Managed by</p>
                        <p className="text-xs font-medium text-slate-700">{project.manager}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-start gap-2">
                        <Users className="w-3 h-3 mt-0.5 text-slate-400" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Funded by</p>
                          <p className="text-xs font-medium text-slate-700">{project.funded_by}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                        {project.budget}
                      </span>
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

export default Projects;
