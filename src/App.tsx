import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './contexts/ThemeContext';
import { Screen } from './types';
import { Auth } from './components/Auth';
import RegionSelector from './components/RegionSelector';
import Home from './components/Home';
import Projects from './components/Projects';
import ReportIssue from './components/ReportIssue';
import MapView from './components/MapView';
import Analysis from './components/Analysis';
import Polls from './components/Polls';
import News from './components/News';
import Profile from './components/Profile';
import Badges from './components/Badges';
import GovDashboard from './components/admin/GovDashboard';
import VerificationPanel from './components/admin/VerificationPanel';
import AnalyticsPanel from './components/admin/AnalyticsPanel';
import Support from './components/Support';
import IssueDetails from './components/IssueDetails';
import ProjectDetails from './components/ProjectDetails';
import PartnerPortal from './components/PartnerPortal';
import Alerts from './components/Alerts';
import ProfileSetup from './components/ProfileSetup';
import Missions from './components/Missions';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import PostProject from './components/PostProject';
import NationalRevenue from './components/NationalRevenue';
import IssuesFeed from './components/IssuesFeed';
import Notifications from './components/Notifications';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRegion, setUserRegion] = useState("");
  const [userRole, setUserRole] = useState("citizen");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [issueReturnScreen, setIssueReturnScreen] = useState<Screen>("home");

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsSessionLoading(false);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserName("");
        setCurrentScreen("auth");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserName(data.name);
      setUserRole(data.role || "citizen");
      setUserRegion(data.county || "");
      setIsProfileComplete(true);
      setCurrentScreen("home");
      setIsSessionLoading(false);
    } else {
      // Session exists but profile doesn't? Sign out to be safe.
      await supabase.auth.signOut();
      setUserName("");
      setCurrentScreen("auth");
    }
  };

  // Handle data from Auth (Login or Signup)
  const handleAuthComplete = (data: any) => {
    if (typeof data === 'string') {
      // Fallback for simple string (legacy)
      setUserName(data);
      setCurrentScreen("home");
    } else {
      // Full Object
      setUserName(data.name);
      setUserRole(data.role || "citizen");
      setUserRegion(data.county || "");
      setIsProfileComplete(data.isProfileComplete || false);
      setCurrentScreen("home");
    }
  };

  const handleProfileComplete = (data: any) => {
    setUserRegion(data.county);
    setUserRole(data.role);
    setIsProfileComplete(true);
    setCurrentScreen("home"); // Or stay on profile?
  };

  const handleProjectSelect = (id: number) => {
    setSelectedProjectId(id);
    setCurrentScreen("project-details");
  };

  const handleIssueSelect = (id: number, from: Screen = "issues") => {
    setSelectedIssueId(id);
    setIssueReturnScreen(from);
    setCurrentScreen("issue-details");
  };

  // Navigation used by Home: opening the sample issue (from news items) clears any selected real issue.
  const handleHomeNavigate = (screen: Screen) => {
    if (screen === "issue-details") {
      setSelectedIssueId(null);
      setIssueReturnScreen("home");
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    setCurrentScreen("home");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "auth": return <Auth onComplete={handleAuthComplete} />;
      case "profile-setup": return <ProfileSetup onComplete={handleProfileComplete} />;
      case "region": return <RegionSelector onBack={() => setCurrentScreen("auth")} onSelect={(r) => { setUserRegion(r); setCurrentScreen("home"); }} />;
      case "home": return <Home userName={userName} userRole={userRole} onNavigate={handleHomeNavigate} isProfileComplete={isProfileComplete} onSelectIssue={(id) => handleIssueSelect(id, "home")} />;
      case "report": return <ReportIssue onBack={goBack} onSettings={() => setCurrentScreen("settings")} />;
      case "post-project": return <PostProject onBack={goBack} onSettings={() => setCurrentScreen("settings")} />;
      case "map": return <MapView onBack={goBack} onSettings={() => setCurrentScreen("settings")} />;
      case "projects": return <Projects onBack={goBack} onSelectProject={handleProjectSelect} onSettings={() => setCurrentScreen("settings")} />;
      case "project-details": return selectedProjectId ? <ProjectDetails projectId={selectedProjectId} onBack={() => setCurrentScreen("projects")} onSettings={() => setCurrentScreen("settings")} /> : <Projects onBack={goBack} onSelectProject={handleProjectSelect} onSettings={() => setCurrentScreen("settings")} />;
      case "analysis": return <Analysis onBack={goBack} />;
      case "polls": return <Polls onBack={goBack} />;
      case "badges": return <Badges onBack={goBack} />;
      case "missions": return <Missions onBack={goBack} />;
      case "profile": return <Profile onBack={goBack} userRole={userRole} isProfileComplete={isProfileComplete} onProfileComplete={handleProfileComplete} />;
      case "admin": return <GovDashboard onBack={goBack} onNavigate={setCurrentScreen} />;
      case "verification-panel": return <VerificationPanel onBack={() => setCurrentScreen("admin")} />;
      case "analytics-panel": return <AnalyticsPanel onBack={() => setCurrentScreen("admin")} />;
      case "support": return <Support onBack={goBack} />;
      case "settings": return <Settings onBack={goBack} />;
      case "news": return <News onBack={goBack} />;
      case "issue-details": return <IssueDetails issueId={selectedIssueId} onBack={() => { setSelectedIssueId(null); setCurrentScreen(issueReturnScreen); }} onSettings={() => setCurrentScreen("settings")} />;
      case "issues": return <IssuesFeed onBack={goBack} onSelectIssue={(id) => handleIssueSelect(id, "issues")} onReport={() => setCurrentScreen(isProfileComplete ? "report" : "profile")} />;
      case "notifications": return <Notifications onBack={goBack} onOpenIssue={(id) => handleIssueSelect(id, "notifications")} />;
      case "partner": return <PartnerPortal onBack={goBack} />;
      case "national-revenue": return <NationalRevenue onBack={goBack} onSettings={() => setCurrentScreen("settings")} />;
      case "alerts": return <Alerts onBack={goBack} />;
      default: return <Home userName={userName} userRole={userRole} onNavigate={setCurrentScreen} isProfileComplete={isProfileComplete} />;
    }
  };

  const showNavigation = userName && !isSessionLoading;

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {renderScreen()}

      {showNavigation && (
        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} userRole={userRole} isProfileComplete={isProfileComplete} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;