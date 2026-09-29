import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import {
  CheckSquare,
  Calendar,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  UserCheck,
  MessageSquare,
  Users,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    classes,
    students,
    batchRecordAttendance,
    addNotification,
    showToast,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>('2025-04-17');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(s => s.centerClassId === selectedClass?.id);

  // Local state for marking attendance
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((st, idx) => {
      // Simulate realistic attendance (some present, one late, one excused)
      initial[st.id] = {
        status: idx === 1 ? 'late' : idx === 2 ? 'excused' : 'present',
        note: idx === 1 ? 'Đến muộn 10 phút' : idx === 2 ? 'Bị sốt phụ huynh xin phép' : '',
      };
    });
    return initial;
  });

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyContent, setNotifyContent] = useState('');

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        note,
      },
    }));
  };

  // Quick mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(st => {
      updated[st.id] = { status: 'present', note: '' };
    });
    setAttendanceState(updated);
    showToast('Đã chọn Tất cả học sinh Có mặt!');
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(st => ({
      studentId: st.id,
      studentName: st.fullName,
      status: attendanceState[st.id]?.status || 'present',
      note: attendanceState[st.id]?.note || '',
    }));
    batchRecordAttendance(records, selectedClass.id, attendanceDate);
  };

  const handleGenerateParentMessage = () => {
    const absents = classStudents.filter(
      st => attendanceState[st.id]?.status === 'unexcused' || attendanceState[st.id]?.status === 'excused'
    );
    const msg = `[HOÀNG HOÀI ENGLISH CENTER] Kính gửi phụ huynh lớp ${selectedClass.code}, buổi học ngày ${attendanceDate} đã hoàn tất. Điểm danh: Có mặt ${classStudents.length - absents.length}/${classStudents.length} học sinh. Các học sinh vắng mặt: ${absents.map(a => a.fullName).join(', ') || 'Không có'}. Thầy cô đã gửi tài liệu bài học vào nhóm Zalo lớp.`;
    setNotifyContent(msg);
    setShowNotifyModal(true);
  };

  const handleSendNotification = () => {
    addNotification({
      title: `Báo cáo chuyên cần ngày ${attendanceDate} - Lớp ${selectedClass.code}`,
      content: notifyContent,
      category: 'schedule',
      targetAudience: 'class',
      targetName: selectedClass.code,
      author: 'Giáo viên phụ trách',
    });
    setShowNotifyModal(false);
    showToast('Đã gửi thông báo chuyên cần tới phụ huynh học sinh!');
  };

  // Stats calculation
  const totalCount = classStudents.length;
  const presentCount = classStudents.filter(s => attendanceState[s.id]?.status === 'present').length;
  const lateCount = classStudents.filter(s => attendanceState[s.id]?.status === 'late').length;
  const absentCount = classStudents.filter(
    s => attendanceState[s.id]?.status === 'excused' || attendanceState[s.id]?.status === 'unexcused'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ĐIỂM DANH & CHUYÊN CẦN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Điểm danh học sinh từng buổi, tự động cảnh báo vắng mặt liên tiếp và gửi tin báo tức thì cho phụ huynh.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleGenerateParentMessage}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
          >
            <Send size={15} /> Tạo tin nhắn gửi phụ huynh
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Save size={16} /> Lưu điểm danh
          </button>
        </div>
      </div>

      {/* Select class and date bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Chọn lớp học</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} ({c.room})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Ngày điểm danh</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Calendar size={15} className="text-slate-400" />
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick action: mark all present */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors border border-emerald-200 flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} /> Tất cả có mặt
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Sĩ số lớp</span>
            <div className="text-lg font-black text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Có mặt</span>
            <div className="text-lg font-black text-emerald-600">{presentCount}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Đi muộn</span>
            <div className="text-lg font-black text-amber-600">{lateCount}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Vắng mặt</span>
            <div className="text-lg font-black text-rose-600">{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Trạng thái điểm danh</th>
                <th className="py-3.5 px-4">Ghi chú / Lý do</th>
                <th className="py-3.5 px-4">Cảnh báo chuyên cần</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st, index) => {
                const currentStatus = attendanceState[st.id]?.status || 'present';
                const currentNote = attendanceState[st.id]?.note || '';
                const isAbsent2 = index === 2; // sample 2 consecutive absences alert

                return (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={st.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{st.fullName}</p>
                          <p className="text-[11px] text-slate-400">{st.code} • PH: {st.parentPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'present', label: 'Có mặt', color: 'bg-emerald-600 text-white', hover: 'hover:bg-emerald-50 text-slate-600' },
                          { id: 'late', label: 'Đi muộn', color: 'bg-amber-500 text-white', hover: 'hover:bg-amber-50 text-slate-600' },
                          { id: 'excused', label: 'Có phép', color: 'bg-blue-600 text-white', hover: 'hover:bg-blue-50 text-slate-600' },
                          { id: 'unexcused', label: 'Không phép', color: 'bg-rose-600 text-white', hover: 'hover:bg-rose-50 text-slate-600' },
                          { id: 'makeup', label: 'Học bù', color: 'bg-purple-600 text-white', hover: 'hover:bg-purple-50 text-slate-600' },
                        ].map(stOption => {
                          const isSelected = currentStatus === stOption.id;
                          return (
                            <button
                              key={stOption.id}
                              type="button"
                              onClick={() => handleStatusChange(st.id, stOption.id as AttendanceStatus)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                isSelected ? stOption.color + ' shadow-xs' : 'bg-slate-100 ' + stOption.hover
                              }`}
                            >
                              {stOption.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={currentNote}
                        onChange={e => handleNoteChange(st.id, e.target.value)}
                        placeholder="Lý do đi muộn, xin nghỉ..."
                        className="w-full max-w-xs px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isAbsent2 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertTriangle size={13} /> Nghỉ 2 buổi liên tiếp
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Chuyên cần tốt (96%)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PARENT NOTIFICATION PREVIEW */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Soạn tin nhắn thông báo phụ huynh</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tin nhắn tự động tổng hợp từ kết quả điểm danh ngày {attendanceDate} lớp {selectedClass.code}.
            </p>

            <textarea
              rows={5}
              value={notifyContent}
              onChange={e => setNotifyContent(e.target.value)}
              className="w-full p-3.5 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNotifyModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                Gửi thông báo tới phụ huynh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
