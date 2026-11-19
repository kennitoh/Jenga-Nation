import { supabase } from './supabase';

/**
 * Data helpers for the live backend (issues, timeline, votes, comments,
 * notifications, stats). Reads never throw: on any error they return an
 * empty/null result so screens can fall back to their built-in sample data.
 * Writes throw an Error with a readable message.
 */

export interface LiveIssue {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    location: string;
    reporterId: string | null;
    reporterName: string;
    reporterLevel: number | null;
    createdAt: string;
    upvotes: number;
    commentsCount: number;
    verifications: number;
    images: string[];
}

export interface TimelineRow {
    status: string;
    date: string | null;
}

export interface LiveComment {
    id: number;
    userId: string;
    userName: string;
    body: string;
    isOfficial: boolean;
    createdAt: string;
}

export interface LiveNotification {
    id: number;
    type: string;
    title: string;
    body: string | null;
    issueId: number | null;
    isRead: boolean;
    createdAt: string;
}

export interface PlatformStats {
    activeIssues: number;
    resolvedIssues: number;
    completedProjects: number;
}

const ISSUE_COLUMNS =
    'id,title,description,category,status,location,reporter_id,date,created_at,upvotes,comments_count,verifications_count,images';

export const ISSUE_STEPS = ['Received', 'Verified', 'Assigned', 'In Progress', 'Completed'] as const;

export function statusLabel(status: string): string {
    switch (status) {
        case 'Pending': return 'Pending review';
        case 'Active': return 'Open';
        default: return status;
    }
}

export function statusColor(status: string): string {
    switch (status) {
        case 'Resolved': return 'bg-green-100 text-green-700';
        case 'In Progress': return 'bg-blue-100 text-blue-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        case 'Pending': return 'bg-orange-100 text-orange-700';
        default: return 'bg-slate-100 text-slate-700';
    }
}

export function relativeTime(iso: string | null | undefined): string {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';
    const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
    if (seconds < 60) return 'just now';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    return new Date(iso).toLocaleDateString();
}

export async function getCurrentUserId(): Promise<string | null> {
    try {
        const { data } = await supabase.auth.getUser();
        return data.user?.id ?? null;
    } catch {
        return null;
    }
}

/** id -> { name, level } using the safe public_profiles view. */
async function fetchPeople(ids: string[]): Promise<Record<string, { name: string; level: number | null }>> {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    if (unique.length === 0) return {};
    const { data, error } = await supabase
        .from('public_profiles')
        .select('id,name,level')
        .in('id', unique);
    if (error || !data) return {};
    const map: Record<string, { name: string; level: number | null }> = {};
    data.forEach((p: any) => { map[p.id] = { name: p.name, level: p.level ?? null }; });
    return map;
}

function toLiveIssue(row: any, people: Record<string, { name: string; level: number | null }>): LiveIssue {
    const person = row.reporter_id ? people[row.reporter_id] : undefined;
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        status: String(row.status ?? 'Pending'),
        location: row.location,
        reporterId: row.reporter_id ?? null,
        reporterName: row.reporter_id ? (person?.name || 'Community member') : 'Anonymous',
        reporterLevel: person?.level ?? null,
        createdAt: row.created_at || row.date,
        upvotes: row.upvotes ?? 0,
        commentsCount: row.comments_count ?? 0,
        verifications: row.verifications_count ?? 0,
        images: Array.isArray(row.images) ? row.images : [],
    };
}

export async function fetchIssues(limit = 50): Promise<LiveIssue[]> {
    const { data, error } = await supabase
        .from('issues')
        .select(ISSUE_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error || !data) return [];
    const people = await fetchPeople(data.map((r: any) => r.reporter_id));
    return data.map((r: any) => toLiveIssue(r, people));
}

export async function fetchIssue(id: number): Promise<LiveIssue | null> {
    const { data, error } = await supabase
        .from('issues')
        .select(ISSUE_COLUMNS)
        .eq('id', id)
        .maybeSingle();
    if (error || !data) return null;
    const people = await fetchPeople([data.reporter_id]);
    return toLiveIssue(data, people);
}

export async function fetchTimeline(issueId: number): Promise<TimelineRow[]> {
    const { data, error } = await supabase
        .from('issue_timeline')
        .select('status,date')
        .eq('issue_id', issueId)
        .order('id', { ascending: true });
    if (error || !data) return [];
    return data.map((r: any) => ({ status: r.status, date: r.date }));
}

export async function fetchComments(issueId: number): Promise<LiveComment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select('id,user_id,body,is_official,created_at')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });
    if (error || !data) return [];
    const people = await fetchPeople(data.map((r: any) => r.user_id));
    return data.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: people[r.user_id]?.name || 'Community member',
        body: r.body,
        isOfficial: !!r.is_official,
        createdAt: r.created_at,
    }));
}

export async function fetchMyIssueState(issueId: number, userId: string): Promise<{ voted: boolean; verified: boolean }> {
    const [vote, verification] = await Promise.all([
        supabase.from('issue_votes').select('issue_id').eq('issue_id', issueId).eq('user_id', userId).maybeSingle(),
        supabase.from('issue_verifications').select('issue_id').eq('issue_id', issueId).eq('user_id', userId).maybeSingle(),
    ]);
    return { voted: !!vote.data, verified: !!verification.data };
}

export async function setUpvote(issueId: number, userId: string, on: boolean): Promise<void> {
    const { error } = on
        ? await supabase.from('issue_votes').insert({ issue_id: issueId, user_id: userId })
        : await supabase.from('issue_votes').delete().eq('issue_id', issueId).eq('user_id', userId);
    if (error) throw new Error(error.message);
}

export async function verifyIssue(issueId: number, userId: string): Promise<void> {
    const { error } = await supabase.from('issue_verifications').insert({ issue_id: issueId, user_id: userId });
    if (error) throw new Error(error.message);
}

export async function addComment(issueId: number, userId: string, body: string): Promise<void> {
    const { error } = await supabase.from('comments').insert({ issue_id: issueId, user_id: userId, body: body.trim() });
    if (error) throw new Error(error.message);
}

export async function fetchNotifications(limit = 50): Promise<LiveNotification[]> {
    const { data, error } = await supabase
        .from('notifications')
        .select('id,type,title,body,issue_id,is_read,created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error || !data) return [];
    return data.map((r: any) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        body: r.body,
        issueId: r.issue_id ?? null,
        isRead: !!r.is_read,
        createdAt: r.created_at,
    }));
}

export async function fetchUnreadCount(): Promise<number> {
    const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);
    if (error) return 0;
    return count ?? 0;
}

export async function markNotificationRead(id: number): Promise<void> {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
}

export async function fetchPlatformStats(): Promise<PlatformStats | null> {
    const { data, error } = await supabase.from('platform_stats').select('*').maybeSingle();
    if (error || !data) return null;
    return {
        activeIssues: Number(data.active_issues ?? 0),
        resolvedIssues: Number(data.resolved_issues ?? 0),
        completedProjects: Number(data.completed_projects ?? 0),
    };
}
