import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CheckSquare,
  FileText,
  BarChart3,
  TrendingUp,
  HeartHandshake,
  FileSpreadsheet,
  Coins,
  Bell,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  rolesAllowed?: string[];
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    studentAlerts,
    notifications,
    currentUser,
  } = useApp();

  const unreadAlertsCount = studentAlerts.filter(a => a.status !== 'resolved').length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'students', label: 'Học sinh', icon: Users },
    { id: 'teachers', label: 'Giáo viên', icon: GraduationCap },
    { id: 'classes', label: 'Lớp học', icon: BookOpen },
    { id: 'schedules', label: 'Lịch học', icon: CalendarDays },
    { id: 'attendance', label: 'Điểm danh', icon: CheckSquare },
    { id: 'assignments', label: 'Bài tập', icon: FileText },
    { id: 'scores', label: 'Kiểm tra - Điểm số', icon: BarChart3 },
    { id: 'progress', label: 'Theo dõi tiến bộ', icon: TrendingUp },
    { id: 'alerts', label: 'Học sinh cần hỗ trợ', icon: HeartHandshake, badge: unreadAlertsCount },
    { id: 'parent_reports', label: 'Báo cáo phụ huynh', icon: FileSpreadsheet },
    { id: 'tuition', label: 'Học phí', icon: Coins, rolesAllowed: ['manager', 'staff', 'parent'] },
    { id: 'notifications', label: 'Thông báo', icon: Bell, badge: unreadNotifsCount },
    { id: 'documents', label: 'Tài liệu', icon: FolderOpen },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  // Filter based on user role (Parent and Student see tailored navigation while manager sees everything)
  const filteredMenuItems = menuItems.filter(item => {
    if (currentUser.role === 'manager' || currentUser.role === 'staff') return true;
    if (currentUser.role === 'teacher') {
      return item.id !== 'tuition'; // teachers don't view overall tuition
    }
    if (currentUser.role === 'student') {
      return ['overview', 'classes', 'schedules', 'assignments', 'scores', 'progress', 'documents', 'notifications'].includes(item.id);
    }
    if (currentUser.role === 'parent') {
      return ['overview', 'classes', 'schedules', 'attendance', 'assignments', 'scores', 'progress', 'parent_reports', 'tuition', 'notifications'].includes(item.id);
    }
    return true;
  });

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#111f38] text-slate-300 transition-all duration-300 flex flex-col justify-between shadow-2xl select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Logo */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <span className="text-xl tracking-tight">H</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white font-black text-lg tracking-wider">HOÀI</span>
                <span className="text-cyan-400 text-xs font-semibold px-1 py-0.5 bg-cyan-950/70 border border-cyan-800/60 rounded">EDU</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase -mt-0.5">English Center</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
            H
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="text-slate-400 hover:text-white hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors ml-1 hidden md:block"
          title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav List with custom scroll */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left relative group ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate flex-1 tracking-tight">{item.label}</span>
              )}

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white text-blue-600'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip in collapsed mode */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                  {item.badge ? ` (${item.badge})` : ''}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Center Status Info */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/30 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Hệ thống Quản trị</p>
              <p className="text-[11px] text-slate-400 truncate">Phiên bản 2.5 (2025)</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
