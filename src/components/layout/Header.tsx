import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User,
  KeyRound,
  LogOut,
  CheckCheck,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    demoUsers,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    students,
    classes,
    teachers,
    setActiveTab,
    setSelectedStudent,
    setSelectedClass,
    setSelectedTeacher,
    showToast,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const query = searchQuery.trim().toLowerCase();
  const searchResultsStudents = query
    ? students.filter(s => s.fullName.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || s.centerClassName.toLowerCase().includes(query)).slice(0, 4)
    : [];
  const searchResultsClasses = query
    ? classes.filter(c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query) || c.program.toLowerCase().includes(query)).slice(0, 3)
    : [];
  const searchResultsTeachers = query
    ? teachers.filter(t => t.fullName.toLowerCase().includes(query) || t.code.toLowerCase().includes(query) || t.specializations.some(sp => sp.toLowerCase().includes(query))).slice(0, 3)
    : [];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    showToast('Đổi mật khẩu thành công!');
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-4 transition-all">
        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setShowSearchModal(true);
                } else {
                  setShowSearchModal(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSearchModal(true);
              }}
              placeholder="Tìm kiếm học sinh, lớp học, giáo viên..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
            />
          </div>

          {/* Live Search Quick Results Dropdown */}
          {showSearchModal && query.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400 font-semibold border-b border-slate-100 mb-2">
                <span>KẾT QUẢ TÌM KIẾM CHO "{searchQuery}"</span>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Đóng
                </button>
              </div>

              {searchResultsStudents.length === 0 && searchResultsClasses.length === 0 && searchResultsTeachers.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  Không tìm thấy kết quả phù hợp. Hãy thử từ khóa khác.
                </div>
              )}

              {/* Students */}
              {searchResultsStudents.length > 0 && (
                <div className="mb-2">
                  <div className="text-[11px] font-bold text-blue-600 uppercase px-2 mb-1 flex items-center gap-1">
                    <Users size={12} /> Học sinh ({searchResultsStudents.length})
                  </div>
                  {searchResultsStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setActiveTab('students');
                        setShowSearchModal(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={student.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{student.fullName}</p>
                          <p className="text-[11px] text-slate-400">{student.code} • Lớp: {student.centerClassName}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Classes */}
              {searchResultsClasses.length > 0 && (
                <div className="mb-2">
                  <div className="text-[11px] font-bold text-amber-600 uppercase px-2 mb-1 flex items-center gap-1">
                    <BookOpen size={12} /> Lớp học ({searchResultsClasses.length})
                  </div>
                  {searchResultsClasses.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setSelectedClass(cls);
                        setActiveTab('classes');
                        setShowSearchModal(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/60 text-left transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{cls.code} - {cls.name}</p>
                        <p className="text-[11px] text-slate-400">{cls.program} • {cls.room} • {cls.teacherName}</p>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Teachers */}
              {searchResultsTeachers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-600 uppercase px-2 mb-1 flex items-center gap-1">
                    <GraduationCap size={12} /> Giáo viên ({searchResultsTeachers.length})
                  </div>
                  {searchResultsTeachers.map(tc => (
                    <button
                      key={tc.id}
                      onClick={() => {
                        setSelectedTeacher(tc);
                        setActiveTab('teachers');
                        setShowSearchModal(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/60 text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={tc.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{tc.fullName}</p>
                          <p className="text-[11px] text-slate-400">{tc.code} • {tc.specializations[0]}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative" ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors"
              title="Thông báo"
            >
              <Bell size={19} />
              {unreadNotifs.length > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">Thông báo trung tâm</span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-600 rounded-full font-bold">
                        {unreadNotifs.length} mới
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck size={14} /> Đã đọc hết
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto py-2 space-y-2.5 divide-y divide-slate-100">
                  {notifications.slice(0, 5).map(item => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationAsRead(item.id)}
                      className={`pt-2.5 first:pt-0 cursor-pointer rounded-lg p-2 transition-colors ${
                        item.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${item.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.content}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Xem tất cả thông báo &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Date Picker / Quick Selector */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200/80">
            <Calendar size={14} className="text-slate-500" />
            <span>Thứ Năm, 17 tháng 4, 2025</span>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(prev => !prev)}
              className="flex items-center gap-3 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">{currentUser.roleTitle}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                {/* Current User Card */}
                <div className="p-3 bg-slate-50 rounded-xl mb-2">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-blue-600 font-medium">{currentUser.roleTitle}</p>
                  <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                </div>

                {/* Role Switcher Section for Reviewer testing */}
                <div className="px-2 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-500" /> Đổi vai trò kiểm thử hệ thống
                </div>
                <div className="space-y-1 mb-2">
                  {demoUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        showToast(`Đã chuyển sang vai trò: ${u.roleTitle}`);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-blue-100/70 text-blue-700 font-bold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{u.name} ({u.roleTitle.split(' ')[0]})</span>
                      {currentUser.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <User size={15} className="text-slate-400" /> Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <KeyRound size={15} className="text-slate-400" /> Đổi mật khẩu
                  </button>
                  <button
                    onClick={() => {
                      showToast('Đã đăng xuất phiên làm việc.');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut size={15} className="text-rose-400" /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Hồ sơ cá nhân</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow" />
              <div>
                <h4 className="font-bold text-slate-900">{currentUser.name}</h4>
                <p className="text-xs text-blue-600 font-semibold">{currentUser.roleTitle}</p>
                <p className="text-xs text-slate-500">Mã định danh: {currentUser.id}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Số điện thoại:</span>
                <span className="font-medium text-slate-800">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Trạng thái tài khoản:</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Đang hoạt động</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Đổi mật khẩu tài khoản</h3>
            <p className="text-xs text-slate-500 mb-4">Vui lòng nhập mật khẩu mới tối thiểu 6 ký tự để bảo mật tài khoản.</p>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
