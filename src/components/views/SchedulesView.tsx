import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  ArrowRight,
  Bell,
} from 'lucide-react';

export const SchedulesView: React.FC = () => {
  const {
    schedules,
    classes,
    teachers,
    addSchedule,
    updateSchedule,
    addNotification,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [filterClass, setFilterClass] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMakeupModal, setShowMakeupModal] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    classId: classes[0]?.id || '',
    className: classes[0]?.code || '',
    room: 'Phòng 101',
    teacherId: teachers[0]?.id || '',
    teacherName: teachers[0]?.fullName || '',
    date: '2025-04-18',
    dayOfWeek: 'Thứ Sáu',
    startTime: '08:00',
    endTime: '09:30',
    status: 'upcoming' as const,
    topic: 'Unit 8: Grammar & Speaking Practice',
  });

  // Conflict Checker
  const checkScheduleConflict = (date: string, startTime: string, room: string, teacherId: string) => {
    const conflict = schedules.find(
      s => s.date === date && s.startTime === startTime && (s.room === room || s.teacherId === teacherId)
    );
    if (conflict) {
      if (conflict.room === room) {
        return `Phòng học ${room} đã có lớp ${conflict.className} vào khung giờ ${startTime}!`;
      }
      if (conflict.teacherId === teacherId) {
        return `Giáo viên ${conflict.teacherName} đã có lịch dạy lớp ${conflict.className} lúc ${startTime}!`;
      }
    }
    return null;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const conflict = checkScheduleConflict(
      newSession.date,
      newSession.startTime,
      newSession.room,
      newSession.teacherId
    );
    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    addSchedule(newSession);
    showToast('Đã xếp buổi học mới thành công!');
    setShowAddModal(false);
    setConflictWarning(null);
  };

  const handleCancelSession = (session: ScheduleItem) => {
    updateSchedule(session.id, { status: 'cancelled' });
    addNotification({
      title: `Thông báo hủy buổi học lớp ${session.className}`,
      content: `Buổi học ngày ${session.date} (${session.startTime} - ${session.endTime}) đã được hủy. Trung tâm sẽ thông báo lịch học bù sau.`,
      category: 'schedule',
      targetAudience: 'class',
      targetName: session.className,
      author: 'Phòng Đào Tạo',
    });
    showToast(`Đã hủy buổi học và gửi thông báo tới học sinh lớp ${session.className}!`);
  };

  const daysOfWeek = [
    { day: 'Thứ Hai', date: '14/04' },
    { day: 'Thứ Ba', date: '15/04' },
    { day: 'Thứ Tư', date: '16/04' },
    { day: 'Thứ Năm (Hôm nay)', date: '17/04', isToday: true },
    { day: 'Thứ Sáu', date: '18/04' },
    { day: 'Thứ Bảy', date: '19/04' },
    { day: 'Chủ Nhật', date: '20/04' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            LỊCH HỌC & THỜI KHÓA BIỂU
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi lịch giảng dạy, kiểm tra xung đột phòng học / giáo viên và quản lý lịch học bù.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Plus size={16} /> Tạo buổi học mới
          </button>
        </div>
      </div>

      {/* View Mode Toggle and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'day' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Theo Ngày
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'week' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Theo Tuần
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'month' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Theo Tháng
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả lớp</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>

          <select
            value={filterTeacher}
            onChange={e => setFilterTeacher(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả giáo viên</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.fullName}</option>
            ))}
          </select>

          <select
            value={filterRoom}
            onChange={e => setFilterRoom(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả phòng học</option>
            <option value="Phòng 101">Phòng 101</option>
            <option value="Phòng 102">Phòng 102</option>
            <option value="Phòng 201">Phòng 201</option>
            <option value="Phòng 202">Phòng 202</option>
            <option value="Phòng 301">Phòng 301</option>
            <option value="Phòng 303">Phòng 303</option>
          </select>
        </div>
      </div>

      {/* Week Calendar Board */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {daysOfWeek.map((dayItem, idx) => (
            <div key={idx} className={`p-4 ${dayItem.isToday ? 'bg-blue-50/40' : ''}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <span className={`text-xs font-bold block ${dayItem.isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                    {dayItem.day}
                  </span>
                  <span className="text-[11px] text-slate-400">{dayItem.date}</span>
                </div>
                {dayItem.isToday && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Sessions for that day */}
              <div className="space-y-3">
                {schedules.map(session => {
                  const isCancelled = session.status === 'cancelled';

                  return (
                    <div
                      key={session.id}
                      className={`p-3 rounded-2xl border text-xs transition-all ${
                        isCancelled
                          ? 'bg-slate-100 border-slate-200 opacity-60'
                          : session.status === 'ongoing'
                          ? 'bg-emerald-50 border-emerald-200 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-slate-900">{session.className}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{session.startTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{session.topic}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>{session.room}</span>
                        <span>{session.teacherName.split(' ').slice(-2).join(' ')}</span>
                      </div>

                      {/* Cancel / Makeup quick actions */}
                      {!isCancelled && (
                        <div className="mt-2 flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCancelSession(session)}
                            className="text-[10px] text-rose-500 hover:underline font-semibold"
                          >
                            Hủy buổi
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADD NEW SESSION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Xếp buổi học mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {conflictWarning && (
              <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn lớp học *</label>
                <select
                  value={newSession.classId}
                  onChange={e => {
                    const c = classes.find(cl => cl.id === e.target.value);
                    setNewSession({ ...newSession, classId: e.target.value, className: c?.code || '' });
                  }}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày học *</label>
                  <input
                    type="date"
                    required
                    value={newSession.date}
                    onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khung giờ *</label>
                  <select
                    value={newSession.startTime}
                    onChange={e => {
                      const start = e.target.value;
                      let end = '09:30';
                      if (start === '10:00') end = '11:30';
                      if (start === '13:30') end = '15:00';
                      if (start === '17:30') end = '19:00';
                      if (start === '19:15') end = '20:45';
                      setNewSession({ ...newSession, startTime: start, endTime: end });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="08:00">08:00 - 09:30</option>
                    <option value="10:00">10:00 - 11:30</option>
                    <option value="13:30">13:30 - 15:00</option>
                    <option value="17:30">17:30 - 19:00</option>
                    <option value="19:15">19:15 - 20:45</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng học *</label>
                  <select
                    value={newSession.room}
                    onChange={e => setNewSession({ ...newSession, room: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Phòng 101">Phòng 101</option>
                    <option value="Phòng 102">Phòng 102</option>
                    <option value="Phòng 201">Phòng 201</option>
                    <option value="Phòng 202">Phòng 202</option>
                    <option value="Phòng 301">Phòng 301</option>
                    <option value="Phòng 303">Phòng 303</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giáo viên phụ trách *</label>
                  <select
                    value={newSession.teacherId}
                    onChange={e => {
                      const t = teachers.find(tc => tc.id === e.target.value);
                      setNewSession({ ...newSession, teacherId: e.target.value, teacherName: t?.fullName || '' });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {teachers.map(tc => (
                      <option key={tc.id} value={tc.id}>{tc.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung / Chủ đề bài học</label>
                <input
                  type="text"
                  value={newSession.topic}
                  onChange={e => setNewSession({ ...newSession, topic: e.target.value })}
                  placeholder="Unit 8: Grammar & Speaking Practice..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Xác nhận lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
