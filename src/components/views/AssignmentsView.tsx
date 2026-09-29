import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Mic,
  PenTool,
  HelpCircle,
  X,
  Eye,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    classes,
    students,
    addAssignment,
    updateAssignment,
    showToast,
  } = useApp();

  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.code || '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '2025-04-22',
    description: '',
    type: 'reading_writing' as const,
    difficulty: 'basic' as const,
    allowsRetry: true,
    totalStudents: 14,
    attachmentType: 'pdf' as const,
    attachmentName: 'Baitap_Unit.pdf',
    attachmentUrl: '#',
    isTemplate: false,
  });

  const filteredAssignments = assignments.filter(
    a => selectedClassFilter === 'all' || a.classId === selectedClassFilter
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find(c => c.id === formData.classId);
    addAssignment({
      ...formData,
      className: selClass?.code || 'GS6-A',
    });
    setShowCreateModal(false);
  };

  const handleQuickGradeSubmission = (studentName: string, score: number) => {
    if (!gradingAssignment) return;
    updateAssignment(gradingAssignment.id, {
      gradedCount: Math.min(gradingAssignment.gradedCount + 1, gradingAssignment.totalSubmissions),
    });
    showToast(`Đã chấm điểm ${score}/10 cho học sinh ${studentName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUẢN LÝ BÀI TẬP VỀ NHÀ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Giao bài tập trắc nghiệm, viết luận, ghi âm giọng nói; chấm điểm và theo dõi tiến độ nộp bài.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Giao bài tập mới
        </button>
      </div>

      {/* Class Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">Lọc theo lớp:</span>
          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="all">Tất cả lớp học</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAssignments.map(asn => {
          const submitRate = Math.round((asn.totalSubmissions / asn.totalStudents) * 100);

          return (
            <div
              key={asn.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {asn.className}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {asn.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {asn.difficulty === 'basic' ? 'Cơ bản' : 'Nâng cao'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1.5">{asn.title}</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    Đang mở
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {asn.description}
                </p>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Giao: {asn.assignedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-rose-400" />
                    <span className="font-bold text-rose-600">Hạn nộp: {asn.dueDate}</span>
                  </div>
                  {asn.attachmentName && (
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                      <Paperclip size={13} />
                      <span className="truncate max-w-[120px]">{asn.attachmentName}</span>
                    </div>
                  )}
                </div>

                {/* Submission Progress bar */}
                <div className="p-3 bg-slate-50 rounded-2xl mb-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Đã nộp: {asn.totalSubmissions}/{asn.totalStudents} ({submitRate}%)</span>
                    <span className="text-blue-600 font-bold">Đã chấm: {asn.gradedCount}/{asn.totalSubmissions}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${submitRate}%` }} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {asn.allowsRetry ? '✓ Cho phép làm lại' : '• Không làm lại'}
                </span>
                <button
                  onClick={() => setGradingAssignment(asn)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye size={14} /> Chấm bài & Danh sách nộp
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Giao bài tập mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài tập *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Unit 8: Past Simple Irregular Verbs"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lớp giao bài</label>
                  <select
                    value={formData.classId}
                    onChange={e => {
                      const c = classes.find(cl => cl.id === e.target.value);
                      setFormData({ ...formData, classId: e.target.value, className: c?.code || '' });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dạng bài tập</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="reading_writing">Đọc hiểu & Viết luận</option>
                    <option value="speaking">Ghi âm nói (Speaking recording)</option>
                    <option value="multiple_choice">Trắc nghiệm Online</option>
                    <option value="fill_in">Điền từ vào chỗ trống</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày giao</label>
                  <input
                    type="date"
                    value={formData.assignedDate}
                    onChange={e => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn nộp bài *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả và Hướng dẫn làm bài</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Yêu cầu học sinh làm phiếu bài tập..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowsRetry}
                    onChange={e => setFormData({ ...formData, allowsRetry: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Cho phép nộp lại / sửa bài</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Giao bài cho lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING & SUBMISSION LIST MODAL */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600">{gradingAssignment.className}</span>
                <h3 className="text-lg font-bold text-slate-900">{gradingAssignment.title}</h3>
                <p className="text-xs text-slate-400">Hạn nộp: {gradingAssignment.dueDate}</p>
              </div>
              <button onClick={() => setGradingAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase">Danh sách bài nộp của học sinh</h4>

              {students.slice(0, 4).map((st, idx) => (
                <div key={st.id} className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-[11px] text-slate-400">
                        Nộp lúc: 16/04 19:30 • {idx === 1 ? 'Nộp muộn 1 ngày' : 'Đúng hạn'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickGradeSubmission(st.fullName, 9.0)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      Chấm 9/10
                    </button>
                    <button
                      onClick={() => handleQuickGradeSubmission(st.fullName, 8.5)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                    >
                      Chấm 8.5
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setGradingAssignment(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
