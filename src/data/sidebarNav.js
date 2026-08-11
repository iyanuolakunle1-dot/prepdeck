import {
  LayoutDashboard, PenSquare, CalendarClock, FileText, BarChart3,
  Bookmark, Trophy, HelpCircle, Settings as SettingsIcon,
} from 'lucide-react';

export const sidebarNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: PenSquare },
  { to: '/mock-exams', label: 'Mock Exams', icon: CalendarClock },
  { to: '/past-questions', label: 'Past Questions', icon: FileText },
  { to: '/history', label: 'Performance', icon: BarChart3 },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/help', label: 'Help & Support', icon: HelpCircle },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];
