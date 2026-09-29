import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Award,
  Star,
  Clock,
  CheckCircle2,
  X,
  Edit2,
  Calendar,
  Eye,
  FileCheck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const {
    teachers,
    classes,
    addTeacher,
    updateTeacher,
    selectedTeacher,
    setSelectedTeacher,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    qualifications: ['Cử nhân Ngôn ngữ Anh', 'IELTS 8.0'],
    specializations: ['Cambridge Primary', 'Phonics & Pronunciation'],
    assignedClassIds: [classes[0]?.id || ''],
    workingStatus: 'full-time' as const,
    completionRate: 98,
    attendanceRate: 99,
    gradingSpeedDays: 1.2,
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    bio: 'Giáo viên giàu nhiệt huyết, tận tâm và phương pháp hiện đại.',
    joinDate: new Date().toISOString().split('T')[0],
    rating: 4.9,
    observationNotes: 'Tiết dạy sinh động, quản lý lớp tốt, học sinh hào hứng.',
  });

  const filteredTeachers = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    t.specializations.some(sp => sp.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    updateTeacher(editingTeacher.id, editingTeacher);
    setShowEditModal(false);
    if (selectedTeacher?.id === editingTeacher.id) {
      setSelectedTeacher(editingTeacher);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUẢN LÝ GIÁO VIÊN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Đội ngũ giáo viên chuyên môn cao, theo dõi tiến độ chương trình, đánh giá đa chiều và bồi dưỡng nghiệp vụ.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Thêm giáo viên
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên giáo viên, mã GV, chuyên môn..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map(teacher => {
          const assignedClasses = classes.filter(c => teacher.assignedClassIds.includes(c.id));

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Code */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.avatar}
                      alt={teacher.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{teacher.fullName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-400">{teacher.code}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {teacher.workingStatus === 'full-time' ? 'Toàn thời gian' : 'Bán thời gian'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl text-amber-600 font-extrabold text-xs">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{teacher.rating}</span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-slate-500 mb-3.5">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>

                {/* Qualifications & Specializations */}
                <div className="mb-3.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chuyên môn</div>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.specializations.map(sp => (
                      <span key={sp} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned classes */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lớp phụ trách</div>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedClasses.length > 0 ? (
                      assignedClasses.map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {c.code}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Đang sắp xếp lớp</span>
                    )}
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center text-xs mb-4">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Hoàn thành</span>
                    <span className="font-extrabold text-emerald-600">{teacher.completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Chuyên cần</span>
                    <span className="font-extrabold text-blue-600">{teacher.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-semibold">Tốc độ chấm</span>
                    <span className="font-extrabold text-slate-800">{teacher.gradingSpeedDays} ngày</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Xem hồ sơ chi tiết
                </button>
                <button
                  onClick={() => {
                    setEditingTeacher(teacher);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Sửa thông tin"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL TEACHER MODAL */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacher.avatar}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedTeacher.fullName}</h3>
                  <p className="text-xs text-slate-400">
                    Mã GV: {selectedTeacher.code} • Ngày vào làm: {selectedTeacher.joinDate}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTeacher(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-800 mb-1">Giới thiệu & Triết lý giảng dạy</h4>
                <p className="text-slate-600 leading-relaxed italic">{selectedTeacher.bio}</p>
              </div>

              {/* Qualifications */}
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" /> Bằng cấp và Chứng chỉ
                </h4>
                <ul className="space-y-1">
                  {selectedTeacher.qualifications.map((q, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Multi-criteria Evaluation notice */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-600" /> Đánh giá chuyên môn đa chiều (Theo quy chế)
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  Trung tâm Hoàng Hoài đánh giá giáo viên toàn diện dựa trên: Tỷ lệ chuyên cần (
                  {selectedTeacher.attendanceRate}%), Tốc độ chấm bài ({selectedTeacher.gradingSpeedDays} ngày),
                  Phản hồi phụ huynh ({selectedTeacher.rating}/5.0), Sự tận tâm hỗ trợ học sinh yếu và Nhật ký dự giờ — không chỉ dựa trên điểm số học sinh.
                </p>
              </div>

              {/* Observation notes */}
              <div className="p-3.5 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-800 mb-1">Nhật ký dự giờ & Kế hoạch bồi dưỡng</h4>
                <p className="text-slate-700">
                  {selectedTeacher.observationNotes || 'Được đánh giá tốt trong các đợt kiểm tra chất lượng giảng dạy định kỳ.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Thêm giáo viên mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên giáo viên *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Thầy / Cô..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hình thức làm việc</label>
                <select
                  value={formData.workingStatus}
                  onChange={e => setFormData({ ...formData, workingStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                >
                  <option value="full-time">Toàn thời gian (Full-time)</option>
                  <option value="part-time">Bán thời gian (Part-time)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiểu sử & Kinh nghiệm</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
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
                  Thêm giáo viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
