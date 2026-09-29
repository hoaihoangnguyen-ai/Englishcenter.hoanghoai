import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassItem } from '../../types';
import {
  BookOpen,
  Plus,
  Users,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Coins,
  CheckCircle2,
  X,
  Eye,
  Edit2,
  FileText,
  BarChart3,
  Award,
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    classes,
    students,
    teachers,
    addClass,
    updateClass,
    selectedClass,
    setSelectedClass,
    setSelectedStudent,
    setActiveTab,
    showToast,
  } = useApp();

  const [classDetailTab, setClassDetailTab] = useState<string>('students');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    program: 'Tiểu học Cambridge Primary',
    level: 'Cambridge A1',
    teacherId: teachers[0]?.id || '',
    teacherName: teachers[0]?.fullName || '',
    assistantName: 'Cô Lê Thu Trang (TA)',
    room: 'Phòng 201',
    startDate: '2025-05-01',
    scheduleDays: 'Thứ 2 - Thứ 5: 17:30 - 19:00',
    currentStudents: 0,
    maxStudents: 16,
    tuitionPerMonth: 1800000,
    status: 'active' as const,
    totalLessons: 48,
    completedLessons: 0,
    description: 'Chương trình rèn luyện 4 kỹ năng tiếng Anh toàn diện.',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selTeacher = teachers.find(t => t.id === formData.teacherId);
    addClass({
      ...formData,
      teacherName: selTeacher?.fullName || 'Chưa phân công',
    });
    setShowAddClassModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUẢN LÝ LỚP HỌC
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Danh sách các lớp Tiểu học & THCS, tiến độ chương trình, phân công giáo viên và quản lý sĩ số.
          </p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Mở lớp học mới
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(cls => {
          const classStudents = students.filter(s => s.centerClassId === cls.id);
          const percentProgress = Math.round((cls.completedLessons / cls.totalLessons) * 100);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                      {cls.program}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{cls.code} - {cls.name}</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    Đang học
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-slate-400 shrink-0" />
                    <span>GV: <strong className="text-slate-800">{cls.teacherName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400 shrink-0" />
                    <span>Trợ giảng: {cls.assistantName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{cls.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <span>{cls.scheduleDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins size={14} className="text-slate-400 shrink-0" />
                    <span>Học phí: <strong className="text-blue-600">{cls.tuitionPerMonth.toLocaleString('vi-VN')} đ/tháng</strong></span>
                  </div>
                </div>

                {/* Students capacity progress bar */}
                <div className="mb-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Sĩ số: {classStudents.length}/{cls.maxStudents} học sinh</span>
                    <span className="text-slate-400">{Math.round((classStudents.length / cls.maxStudents) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(classStudents.length / cls.maxStudents) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Lessons progress */}
                <div className="mb-4 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium mb-1">
                    <span>Tiến độ chương trình</span>
                    <span className="font-bold text-slate-800">{cls.completedLessons}/{cls.totalLessons} buổi ({percentProgress}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedClass(cls);
                    setClassDetailTab('students');
                  }}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Chi tiết lớp học
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLASS DETAIL MODAL WITH TABS */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">{selectedClass.program}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedClass.code} - {selectedClass.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedClass.room} • {selectedClass.scheduleDays} • GV: {selectedClass.teacherName}
                </p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-slate-100 text-xs font-bold shrink-0">
              {[
                { id: 'students', label: 'Danh sách học sinh' },
                { id: 'syllabus', label: 'Tiến độ chương trình' },
                { id: 'attendance', label: 'Chuyên cần lớp' },
                { id: 'assignments', label: 'Bài tập đã giao' },
                { id: 'tuition', label: 'Học phí lớp' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setClassDetailTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    classDetailTab === t.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto py-4 text-xs">
              {classDetailTab === 'students' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-sm">Danh sách học sinh đang học</span>
                    <span className="text-slate-400 font-semibold">
                      Tổng số: {students.filter(s => s.centerClassId === selectedClass.id).length} học sinh
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {students
                      .filter(s => s.centerClassId === selectedClass.id)
                      .map((st, i) => (
                        <div key={st.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-slate-400 font-bold">{i + 1}</span>
                            <img src={st.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-800">{st.fullName}</p>
                              <p className="text-[11px] text-slate-400">{st.code} • PH: {st.parentPhone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedClass(null);
                              setSelectedStudent(st);
                              setActiveTab('students');
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                          >
                            Xem hồ sơ
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {classDetailTab === 'syllabus' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <h4 className="font-bold text-slate-900 mb-1">Nội dung khung chương trình chuẩn</h4>
                    <p className="text-slate-600 mb-3">{selectedClass.description}</p>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Unit 1 - Unit 4: Foundation & Daily Life</p>
                          <p className="text-[11px] text-slate-400">Từ vựng gia đình, trường học, thì hiện tại đơn & hiện tại tiếp diễn</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">Đã hoàn thành</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Unit 5 - Unit 8: Around the World & Past Tense</p>
                          <p className="text-[11px] text-slate-400">Động từ bất quy tắc, thì quá khứ đơn, so sánh hơn/nhất</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px]">Đang học</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Unit 9 - Unit 12: Future & Final Exam Revision</p>
                          <p className="text-[11px] text-slate-400">Luyện đề thi chứng chỉ Cambridge định kỳ</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[11px]">Sắp học</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {classDetailTab === 'attendance' && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Thống kê chuyên cần lớp</h4>
                  <p className="text-slate-600">Tỷ lệ chuyên cần bình quân: <strong className="text-emerald-600 font-extrabold text-sm">94.8%</strong></p>
                  <p className="text-slate-500">Giáo viên đã cập nhật điểm danh đầy đủ các buổi học theo quy định.</p>
                </div>
              )}

              {classDetailTab === 'assignments' && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Bài tập của lớp</h4>
                  <p className="text-slate-600">Đã giao 12 bài tập về nhà. Tỷ lệ hoàn thành trung bình của lớp đạt 91%.</p>
                </div>
              )}

              {classDetailTab === 'tuition' && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Tình trạng học phí lớp</h4>
                  <p className="text-slate-600">Mức học phí: <strong className="text-blue-600">{selectedClass.tuitionPerMonth.toLocaleString('vi-VN')} đ/tháng</strong>.</p>
                  <p className="text-slate-500">12/14 học sinh đã hoàn thành học phí tháng 4.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLASS */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Mở lớp học mới</h3>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên lớp học *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Tiếng Anh Khối 7 - Lớp Chuyên"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chương trình học</label>
                  <select
                    value={formData.program}
                    onChange={e => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Tiểu học Cambridge Primary">Tiểu học Cambridge Primary</option>
                    <option value="THCS Cambridge A2 Key">THCS Cambridge A2 Key</option>
                    <option value="THCS B1 Preliminary (PET)">THCS B1 Preliminary (PET)</option>
                    <option value="Luyện thi Chuyên Ngoại Ngữ">Luyện thi Chuyên Ngoại Ngữ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trình độ</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Pre-A1">Pre-A1 Starters</option>
                    <option value="Cambridge A1">Cambridge A1 Movers</option>
                    <option value="Cambridge A2">Cambridge A2 Flyers / KET</option>
                    <option value="Cambridge B1">Cambridge B1 PET</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giáo viên phụ trách</label>
                  <select
                    value={formData.teacherId}
                    onChange={e => {
                      const t = teachers.find(tc => tc.id === e.target.value);
                      setFormData({ ...formData, teacherId: e.target.value, teacherName: t?.fullName || '' });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    {teachers.map(tc => (
                      <option key={tc.id} value={tc.id}>{tc.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng học</label>
                  <select
                    value={formData.room}
                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Phòng 101">Phòng 101 (Tầng 1)</option>
                    <option value="Phòng 102">Phòng 102 (Tầng 1)</option>
                    <option value="Phòng 201">Phòng 201 (Tầng 2)</option>
                    <option value="Phòng 202">Phòng 202 (Tầng 2)</option>
                    <option value="Phòng 301">Phòng 301 (Tầng 3)</option>
                    <option value="Phòng 303">Phòng 303 (Tầng 3)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lịch học hàng tuần</label>
                  <input
                    type="text"
                    value={formData.scheduleDays}
                    onChange={e => setFormData({ ...formData, scheduleDays: e.target.value })}
                    placeholder="Thứ 2 - Thứ 5: 17:30 - 19:00"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Học phí (VNĐ / tháng)</label>
                  <input
                    type="number"
                    value={formData.tuitionPerMonth}
                    onChange={e => setFormData({ ...formData, tuitionPerMonth: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Lưu lớp học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
