import React, { useEffect, useState } from 'react';
import { mockNews } from '../data/mockNews';
import { mockReports } from '../data/mockReports';
import { mockProjects } from '../data/mockProjects';
import { supabase } from '../lib/supabase';
import logo from '../logo.png';
import {
  FileText,
  Plus,
  FolderKanban,
  Newspaper,
  Map,
  Vote,
  TrendingUp,
  CheckCircle2,
  Award,
  Settings,
  Shield,
  Bell,
  MapPin,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/badge';
import { useTranslations } from '../utils/translations';
import { useTheme } from '../contexts/ThemeContext';
import { getCategoryById } from '../config/categories';
import { Screen } from '../types';
import {
  LiveIssue,
  fetchIssues,
  fetchPlatformStats,
  fetchUnreadCount,
  relativeTime,
  statusColor,
  statusLabel
} from '../lib/issues';

interface HomeProps {
  userName: string;
  userRole: string;
  onNavigate: (screen: Screen) => void;
  isProfileComplete: boolean;
  onSelectIssue?: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ userName, userRole, onNavigate, isProfileComplete, onSelectIssue }) => {
  const { language } = useTheme();
  const t = useTranslations(language);

  const [updates, setUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeIssues: 0,
    completedProjects: 0
  });
  const [reports, setReports] = useState<LiveIssue[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // 1. Fetch News
    const { data: newsData } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(5);

    if (newsData && newsData.length > 0) {
      setUpdates(newsData.map(item => ({
        id: item.id,
        title: item.title,
        time: new Date(item.published_at).toLocaleDateString(),
        categoryId: item.category_id
      })));
    } else {
      // Fallback Mock News
      setUpdates(mockNews.map(item => ({
        id: item.id,
        title: item.title,
        time: new Date(item.published_at).toLocaleDateString(),
        categoryId: item.category_id
      })));
    }

    // 2. Fetch Stats (live view first, then the previous queries)
    const live = await fetchPlatformStats();
    let issueCount: number | null = live ? live.activeIssues : null;
    let projectCount: number | null = live ? live.completedProjects : null;

    if (!live) {
      const issues = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'Resolved'); // Active issues
      const projects = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed');
      issueCount = issues.count;
      projectCount = projects.count;
    }

    // Use DB stats if available, otherwise sample stats
    const finalIssueCount = issueCount || mockReports.filter(r => r.status !== 'Resolved').length;
    const finalProjectCount = projectCount || mockProjects.filter(p => p.status === 'Completed').length;

    setStats({
      activeIssues: finalIssueCount,
      completedProjects: finalProjectCount
    });

    // 3. Latest community reports + unread notifications
    const [latest, unreadCount] = await Promise.all([fetchIssues(3), fetchUnreadCount()]);
    setReports(latest);
    setUnread(unreadCount);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <img src={logo} alt={t.appName} className="h-10 w-auto" />
            <p className="text-slate-600 text-sm">{t.tagline}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('notifications')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-slate-600" />
              {unread > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#800020] text-white text-[10px] font-bold flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {t.welcome}, <span className="text-[#800020]">{userName}</span>!
          </h2>
          <p className="text-slate-600">Here's what's happening in your community today.</p>
          {!isProfileComplete && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Complete your profile</h3>
                <p className="text-sm text-orange-700">Set up your location and interests to participate.</p>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-sm font-medium transition-colors"
              >
                Setup
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-5 gap-4">
          {['gov'].includes(userRole) && (
            <button onClick={() => onNavigate('admin')} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors shadow-sm">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">Admin</span>
            </button>
          )}

          {['ngo', 'gov', 'aspiring'].includes(userRole) ? (
            <button
              onClick={() => isProfileComplete ? onNavigate('post-project') : onNavigate('profile')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${isProfileComplete ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-100'
                }`}>
                <Plus className={`w-6 h-6 ${isProfileComplete ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">Post Project</span>
            </button>
          ) : (
            <button
              onClick={() => isProfileComplete ? onNavigate('report') : onNavigate('profile')}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${isProfileComplete ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-slate-100'
                }`}>
                <FileText className={`w-6 h-6 ${isProfileComplete ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">{t.reportIssue}</span>
            </button>
          )}

          <button onClick={() => onNavigate('projects')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors shadow-sm">
              <FolderKanban className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">{t.viewProjects}</span>
          </button>

          <button onClick={() => onNavigate('news')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shadow-sm">
              <Newspaper className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">{t.regionalNews}</span>
          </button>

          <button onClick={() => onNavigate('map')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors shadow-sm">
              <Map className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">{t.mapView}</span>
          </button>

          <button onClick={() => onNavigate('polls')} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors shadow-sm">
              <Vote className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center">{t.polls}</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Issues</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.activeIssues}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600 font-medium">Projects Completed</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.completedProjects}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600 font-medium">Participation Rate</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">78%</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-xl">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Latest community reports (live) */}
        {reports.length > 0 && onSelectIssue && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Latest Community Reports</h3>
              <button
                onClick={() => onNavigate('issues')}
                className="text-sm font-medium text-[#800020] hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {reports.map((issue) => (
                <Card
                  key={issue.id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onSelectIssue(issue.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-slate-800 font-medium">{issue.title}</h4>
                    <Badge className={`shrink-0 ${statusColor(issue.status)}`}>{statusLabel(issue.status)}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.location}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {issue.upvotes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {issue.commentsCount}</span>
                    <span className="ml-auto">{relativeTime(issue.createdAt)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Updates */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {updates.map((update, index) => {
              const category = getCategoryById(update.categoryId);
              const CategoryIcon = category?.icon;

              return (
                <Card
                  key={index}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate('issue-details')}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {CategoryIcon && (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category?.bgColor }}
                        >
                          <CategoryIcon className="w-5 h-5" style={{ color: category?.color }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-800 font-medium">{update.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-500">{update.time}</span>
                        {category && (
                          <Badge
                            className="rounded-full flex items-center gap-1"
                            style={{ backgroundColor: category.bgColor, color: category.color }}
                          >
                            {category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;