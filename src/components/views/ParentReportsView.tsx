import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ParentReport } from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  X,
} from 'lucide-react';

export const ParentReportsView: React.FC = () => {
  const {
    parentReports,
    students,
    classes,
    createParentReport,
    approveParentReport,
    sendParentReport,
    acknowledgeParentReport,
    currentUser,
    showToast,
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<ParentReport | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [parentReplyText, setParentReplyText] = useState('');

  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.fullName || '',
    studentAvatar: students[0]?.avatar || '',
    classId: classes[0]?.id || '',
    className: classes[0]?.code || '',
    period: 'monthly' as const,
    periodLabel: 'Báo cáo Học tập Tháng 4/2025',
    totalLessons: 8,
    attendedLessons: 8,
    attendanceRate: 100,
    homeworkRate: 90,
    testScoreAvg: 78,
    skills: { listening: 80, speaking: 75, reading: 78, writing: 70 },
    strengths: 'Con tiếp thu bài nhanh, tự giác và rất nhiệt tình phát biểu.',
    areasToImprove: 'Cần chú ý chia động từ thì quá khứ đơn và cấu trúc câu ghép.',
    teacherComment: 'Cô đánh giá cao sự tiến bộ và tính chủ động của con trong các hoạt động nhóm.',
    homeRecommendations: 'Dành 15 phút mỗi tối nghe audio mẩu chuyện thiếu nhi và luyện phát âm.',
    nextGoals: 'Đạt từ 80 điểm trở lên trong bài kiểm tra định kỳ tới.',
    status: 'draft' as const,
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === formData.studentId);
    const cls = classes.find(c => c.id === formData.classId);

    createParentReport({
      ...formData,
      studentName: st?.fullName || formData.studentName,
      studentAvatar: st?.avatar || formData.studentAvatar,
      className: cls?.code || formData.className,
    });
    setShowCreateModal(false);
  };

  const handleParentSubmitFeedback = () => {
    if (!selectedReport || !parentReplyText.trim()) return;
    acknowledgeParentReport(selectedReport.id, parentReplyText);
    setParentReplyText('');
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            BÁO CÁO HỌC TẬP PHỤ HUYNH
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phiếu báo cáo định kỳ đa chiều: chuyên cần, bài tập, tiến bộ 4 kỹ năng, phê duyệt của quản lý và tương tác phụ huynh.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Tạo phiếu báo cáo mới
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parentReports.map(rep => {
          const isSent = rep.status === 'sent' || rep.status === 'viewed';
          const isApproved = rep.status === 'approved';

          return (
            <div
              key={rep.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rep.studentAvatar}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{rep.studentName}</h3>
                      <p className="text-xs text-slate-400">
                        {rep.className} • {rep.periodLabel}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rep.status === 'viewed'
                        ? 'bg-purple-100 text-purple-700'
                        : isSent
                        ? 'bg-emerald-100 text-emerald-700'
                        : isApproved
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {rep.status === 'viewed'
                      ? 'PH đã xem & phản hồi'
                      : isSent
                      ? 'Đã gửi PH'
                      : isApproved
                      ? 'Quản lý đã duyệt'
                      : 'Bản nháp (Chờ duyệt)'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Chuyên cần</span>
                    <span className="font-extrabold text-emerald-600">{rep.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Bài tập</span>
                    <span className="font-extrabold text-blue-600">{rep.homeworkRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Điểm TB</span>
                    <span className="font-extrabold text-slate-800">{rep.testScoreAvg}/100</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-2xl mb-4 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Nhận xét giáo viên:</span>
                  <p className="text-slate-600 line-clamp-2 italic">"{rep.teacherComment}"</p>
                </div>

                {rep.parentFeedback && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs mb-3 border border-emerald-100">
                    <span className="font-bold block">Phản hồi của phụ huynh:</span>
                    <p className="italic">"{rep.parentFeedback}"</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedReport(rep)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Xem & In phiếu
                </button>

                {rep.status === 'draft' && (
                  <button
                    onClick={() => approveParentReport(rep.id)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                  >
                    Duyệt
                  </button>
                )}

                {rep.status === 'approved' && (
                  <button
                    onClick={() => sendParentReport(rep.id)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Send size={13} /> Gửi PH
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REPORT CARD MODAL & PRINTABLE VIEW */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header branding */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                  H
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-base uppercase">HOÀNG HOÀI ENGLISH CENTER</h2>
                  <p className="text-xs text-slate-500 font-medium">Phiếu Đánh Giá Chất Lượng Học Tập Định Kỳ</p>
                </div>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  title="In / Xuất PDF"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Student info banner */}
            <div className="my-5 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">{selectedReport.periodLabel}</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedReport.studentName}</h3>
                <p className="text-xs text-slate-500">Lớp: {selectedReport.className}</p>
              </div>
              <img
                src={selectedReport.studentAvatar}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500"
              />
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <span className="font-extrabold text-emerald-700 text-base">{selectedReport.attendanceRate}%</span>
                <p className="text-[11px] text-emerald-600 mt-0.5">Chuyên cần ({selectedReport.attendedLessons}/{selectedReport.totalLessons} buổi)</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="font-extrabold text-blue-700 text-base">{selectedReport.homeworkRate}%</span>
                <p className="text-[11px] text-blue-600 mt-0.5">Hoàn thành bài tập</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <span className="font-extrabold text-purple-700 text-base">{selectedReport.testScoreAvg}/100</span>
                <p className="text-[11px] text-purple-600 mt-0.5">Điểm kiểm tra trung bình</p>
              </div>
            </div>

            {/* 4 Skills Breakdown */}
            <div className="mb-5 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase">Đánh giá 4 kỹ năng tiếng Anh</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Listening</span>
                  <span className="font-black text-blue-600 text-sm">{selectedReport.skills.listening}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Speaking</span>
                  <span className="font-black text-rose-600 text-sm">{selectedReport.skills.speaking}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Reading</span>
                  <span className="font-black text-emerald-600 text-sm">{selectedReport.skills.reading}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 block">Writing</span>
                  <span className="font-black text-purple-600 text-sm">{selectedReport.skills.writing}</span>
                </div>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Điểm mạnh nổi bật:</span>
                <p className="text-slate-700">{selectedReport.strengths}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Nội dung cần cải thiện:</span>
                <p className="text-slate-700">{selectedReport.areasToImprove}</p>
              </div>
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                <span className="font-bold text-blue-900 block mb-1">Nhận xét chi tiết của giáo viên:</span>
                <p className="text-slate-700 italic">"{selectedReport.teacherComment}"</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Bài tập nên luyện thêm ở nhà:</span>
                <p className="text-slate-700">{selectedReport.homeRecommendations}</p>
              </div>
            </div>

            {/* Parent Feedback submission section */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-2">Ý kiến phản hồi của phụ huynh:</h4>
              {selectedReport.parentFeedback ? (
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-medium">
                  "{selectedReport.parentFeedback}"
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={parentReplyText}
                    onChange={e => setParentReplyText(e.target.value)}
                    placeholder="Phụ huynh nhập phản hồi hoặc lời nhắn gửi tới thầy cô..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleParentSubmitFeedback}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE REPORT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Tạo phiếu báo cáo phụ huynh</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chọn lớp</label>
                  <select
                    value={formData.classId}
                    onChange={e => {
                      const c = classes.find(cl => cl.id === e.target.value);
                      setFormData({ ...formData, classId: e.target.value, className: c?.code || '' });
                    }}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Học sinh *</label>
                  <select
                    value={formData.studentId}
                    onChange={e => {
                      const st = students.find(s => s.id === e.target.value);
                      setFormData({
                        ...formData,
                        studentId: e.target.value,
                        studentName: st?.fullName || '',
                        studentAvatar: st?.avatar || '',
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề kỳ báo cáo</label>
                <input
                  type="text"
                  value={formData.periodLabel}
                  onChange={e => setFormData({ ...formData, periodLabel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nhận xét của giáo viên *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.teacherComment}
                  onChange={e => setFormData({ ...formData, teacherComment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bài tập nên luyện thêm ở nhà</label>
                <input
                  type="text"
                  value={formData.homeRecommendations}
                  onChange={e => setFormData({ ...formData, homeRecommendations: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Tạo bản nháp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
