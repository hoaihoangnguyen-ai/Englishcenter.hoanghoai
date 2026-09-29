import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  ArrowRightLeft,
  X,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  FileText,
  BarChart2,
  PieChart,
  FileCheck,
  TrendingUp,
  Volume2,
  HelpCircle,
  Clock,
  Printer,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    archiveStudent,
    restoreStudent,
    transferStudentClass,
    selectedStudent,
    setSelectedStudent,
    showToast,
  } = useApp();

  // Filters & search
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [studentToTransfer, setStudentToTransfer] = useState<Student | null>(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [showPlacementTestModal, setShowPlacementTestModal] = useState(false);
  const [confirmArchiveStudent, setConfirmArchiveStudent] = useState<Student | null>(null);

  // Profile Detail Active Tab (1 to 11 tabs!)
  const [detailTab, setDetailTab] = useState<number>(1);

  // New Student Form State
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '2014-06-15',
    gender: 'Nam' as 'Nam' | 'Nữ',
    school: '',
    schoolGrade: 'Lớp 5',
    centerClassId: classes[0]?.id || '',
    level: 'Cambridge A1',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    status: 'active' as const,
    enrollDate: new Date().toISOString().split('T')[0],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    baselineLevel: 'Pre-A1',
    targetLevel: 'Cambridge A2',
    baselineScores: { listening: 50, speaking: 50, reading: 50, writing: 45, grammar: 50, vocab: 50 },
    currentScores: { listening: 65, speaking: 60, reading: 62, writing: 55, grammar: 60, vocab: 65 },
    strengths: ['Hăng hái phát biểu', 'Phát âm tự nhiên'],
    weaknesses: ['Cần bổ sung từ vựng theo chủ đề'],
    notes: '',
  });

  // Placement Test Form State
  const [placementData, setPlacementData] = useState({
    candidateName: '',
    candidateBirthYear: '2014',
    schoolGrade: 'Lớp 5',
    vocabScore: 70,
    grammarScore: 65,
    listeningScore: 72,
    speakingScore: 68,
    readingScore: 65,
    writingScore: 60,
    manualClassOverride: '',
  });

  // Calculate Placement Recommendation
  const calcPlacement = () => {
    const avg = (
      placementData.vocabScore +
      placementData.grammarScore +
      placementData.listeningScore +
      placementData.speakingScore +
      placementData.readingScore +
      placementData.writingScore
    ) / 6;

    let level = 'Pre-A1 Starters';
    let recClass = 'Cambridge A1';

    if (avg >= 80) {
      level = 'Cambridge B1 Preliminary (PET)';
      recClass = 'GS8-B';
    } else if (avg >= 65) {
      level = 'Cambridge A2 Flyers / KET';
      recClass = 'GS6-A';
    } else if (avg >= 45) {
      level = 'Cambridge A1 Movers';
      recClass = 'Cambridge A1';
    }

    return { avg: Math.round(avg), level, recClass };
  };

  // Filter students
  const filteredStudents = students.filter(st => {
    const matchSearch =
      st.fullName.toLowerCase().includes(search.toLowerCase()) ||
      st.code.toLowerCase().includes(search.toLowerCase()) ||
      st.parentPhone.includes(search);
    const matchClass = filterClass === 'all' || st.centerClassId === filterClass;
    const matchLevel = filterLevel === 'all' || st.level === filterLevel;
    const matchStatus = filterStatus === 'all' || st.status === filterStatus;
    return matchSearch && matchClass && matchLevel && matchStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Mã HS,Họ và tên,Ngày sinh,Giới tính,Trường,Khối lớp,Lớp trung tâm,Trình độ,Phụ huynh,SĐT,Trạng thái'];
    const rows = filteredStudents.map(s =>
      `"${s.code}","${s.fullName}","${s.birthDate}","${s.gender}","${s.school}","${s.schoolGrade}","${s.centerClassName}","${s.level}","${s.parentName}","${s.parentPhone}","${s.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_Hoang_Hoai_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất danh sách học sinh ra file CSV (Excel)!');
  };

  const handleImportSample = () => {
    showToast('Đã nhập dữ liệu thành công từ file mẫu!');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find(c => c.id === formData.centerClassId);
    addStudent({
      ...formData,
      centerClassName: selClass?.code || 'GS5-A',
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const selClass = classes.find(c => c.id === editingStudent.centerClassId);
    updateStudent(editingStudent.id, {
      ...editingStudent,
      centerClassName: selClass?.code || editingStudent.centerClassName,
    });
    setShowEditModal(false);
    if (selectedStudent?.id === editingStudent.id) {
      setSelectedStudent({ ...editingStudent, centerClassName: selClass?.code || editingStudent.centerClassName });
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentToTransfer && targetClassId) {
      transferStudentClass(studentToTransfer.id, targetClassId);
      setShowTransferModal(false);
    }
  };

  const handleSavePlacementStudent = () => {
    const result = calcPlacement();
    const targetClass = classes.find(c => c.code === (placementData.manualClassOverride || result.recClass)) || classes[0];
    addStudent({
      fullName: placementData.candidateName,
      birthDate: `${placementData.candidateBirthYear}-01-01`,
      gender: 'Nam',
      school: 'Tiểu học / THCS',
      schoolGrade: placementData.schoolGrade,
      centerClassId: targetClass.id,
      centerClassName: targetClass.code,
      level: result.level,
      parentName: 'Phụ huynh ' + placementData.candidateName,
      parentPhone: '0988 000 111',
      parentEmail: 'phuhuynh@gmail.com',
      address: 'Hà Nội',
      status: 'active',
      enrollDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      baselineLevel: result.level,
      targetLevel: 'Nâng cao 1 bậc',
      baselineScores: {
        listening: placementData.listeningScore,
        speaking: placementData.speakingScore,
        reading: placementData.readingScore,
        writing: placementData.writingScore,
        grammar: placementData.grammarScore,
        vocab: placementData.vocabScore,
      },
      currentScores: {
        listening: placementData.listeningScore,
        speaking: placementData.speakingScore,
        reading: placementData.readingScore,
        writing: placementData.writingScore,
        grammar: placementData.grammarScore,
        vocab: placementData.vocabScore,
      },
      strengths: ['Kết quả kiểm tra đầu vào khá tốt'],
      weaknesses: ['Cần bám sát lộ trình lớp mới'],
    });
    setShowPlacementTestModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUẢN LÝ HỌC SINH
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý hồ sơ, quá trình học tập, xếp lớp và đánh giá chất lượng học sinh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPlacementTestModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
          >
            <Award size={15} /> Kiểm tra đầu vào & Xếp lớp
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={15} /> Xuất Excel/CSV
          </button>
          <button
            onClick={handleImportSample}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Upload size={15} /> Nhập Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Plus size={16} /> Thêm học sinh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS, SĐT phụ huynh..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Filter Class */}
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả lớp học</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          {/* Filter Level */}
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả trình độ</option>
            <option value="Cambridge A1">Cambridge A1</option>
            <option value="Cambridge A2">Cambridge A2</option>
            <option value="B1 Preliminary">B1 Preliminary</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang học</option>
            <option value="reserved">Bảo lưu</option>
            <option value="stopped">Ngừng học</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>
      </div>

      {/* Main Student Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Ngày sinh</th>
                <th className="py-3.5 px-4">Trường & Khối</th>
                <th className="py-3.5 px-4">Lớp tại TT</th>
                <th className="py-3.5 px-4">Trình độ</th>
                <th className="py-3.5 px-4">Phụ huynh & SĐT</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const isArchived = st.status === 'archived';
                  const isReserved = st.status === 'reserved';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{st.fullName}</div>
                            <div className="text-[11px] text-slate-400">{st.code} • {st.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{st.birthDate}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{st.school}</div>
                        <div className="text-[11px] text-slate-400">{st.schoolGrade}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {st.centerClassName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                          {st.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{st.parentName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone size={11} className="text-slate-400" /> {st.parentPhone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isArchived ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                            Đã lưu trữ
                          </span>
                        ) : isReserved ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                            Bảo lưu
                          </span>
                        ) : st.status === 'stopped' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                            Ngừng học
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                            Đang học
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => {
                              setSelectedStudent(st);
                              setDetailTab(1);
                            }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Xem chi tiết hồ sơ (11 tabs)"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingStudent(st);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Transfer Class */}
                          <button
                            onClick={() => {
                              setStudentToTransfer(st);
                              setTargetClassId(st.centerClassId);
                              setShowTransferModal(true);
                            }}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Chuyển lớp"
                          >
                            <ArrowRightLeft size={16} />
                          </button>

                          {/* Archive / Restore */}
                          {isArchived ? (
                            <button
                              onClick={() => restoreStudent(st.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Khôi phục hồ sơ"
                            >
                              <RefreshCw size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmArchiveStudent(st)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Lưu trữ hồ sơ (Thùng rác an toàn)"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Hiển thị {filteredStudents.length} / {students.length} học sinh</span>
          <span>Hệ thống lưu trữ an toàn - Dữ liệu bảo mật</span>
        </div>
      </div>

      {/* MODAL 1: ADD NEW STUDENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Thêm học sinh mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên học sinh *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh *</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trường phổ thông đang học</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                    placeholder="THCS Giảng Võ, Tiểu học..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <input
                    type="text"
                    value={formData.schoolGrade}
                    onChange={e => setFormData({ ...formData, schoolGrade: e.target.value })}
                    placeholder="Lớp 5, Lớp 6..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp xếp tại trung tâm *</label>
                  <select
                    value={formData.centerClassId}
                    onChange={e => setFormData({ ...formData, centerClassId: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Thông tin phụ huynh</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tên phụ huynh *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Phụ huynh"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentPhone}
                      onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="0912..."
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email phụ huynh</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="phuhuynh@gmail.com"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Quận Cầu Giấy, Hà Nội..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Sửa hồ sơ: {editingStudent.fullName}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fullName}
                    onChange={e => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái học tập</label>
                  <select
                    value={editingStudent.status}
                    onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="active">Đang học</option>
                    <option value="reserved">Bảo lưu</option>
                    <option value="stopped">Ngừng học</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trường phổ thông</label>
                  <input
                    type="text"
                    value={editingStudent.school}
                    onChange={e => setEditingStudent({ ...editingStudent, school: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <input
                    type="text"
                    value={editingStudent.schoolGrade}
                    onChange={e => setEditingStudent({ ...editingStudent, schoolGrade: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên phụ huynh</label>
                  <input
                    type="text"
                    value={editingStudent.parentName}
                    onChange={e => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SĐT Phụ huynh</label>
                  <input
                    type="text"
                    value={editingStudent.parentPhone}
                    onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú học vụ</label>
                <textarea
                  rows={3}
                  value={editingStudent.notes || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  placeholder="Ghi chú về học sinh..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CLASS TRANSFER */}
      {showTransferModal && studentToTransfer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chuyển lớp học sinh</h3>
            <p className="text-xs text-slate-500 mb-4">
              Chuyển học sinh <span className="font-bold text-slate-800">{studentToTransfer.fullName}</span> ({studentToTransfer.centerClassName}) sang lớp mới.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn lớp mới muốn chuyển đến *</label>
                <select
                  value={targetClassId}
                  onChange={e => setTargetClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} ({c.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 rounded-2xl text-xs">
                Học phí và lịch học của học sinh sẽ tự động điều chỉnh tương ứng với lớp mới.
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Xác nhận chuyển lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ARCHIVE CONFIRMATION */}
      {confirmArchiveStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chuyển vào Lưu trữ an toàn?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Theo quy định bảo vệ dữ liệu học sinh, hồ sơ của <span className="font-bold">{confirmArchiveStudent.fullName}</span> sẽ được chuyển vào mục lưu trữ thay vì xóa vĩnh viễn ngay lập tức. Bạn có thể khôi phục bất cứ lúc nào.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setConfirmArchiveStudent(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  archiveStudent(confirmArchiveStudent.id);
                  setConfirmArchiveStudent(null);
                }}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Xác nhận lưu trữ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PLACEMENT TEST & CLASS RECOMMENDATION (Section 6) */}
      {showPlacementTestModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Kiểm tra đầu vào & Xếp lớp tự động</h3>
                <p className="text-xs text-slate-400">Đánh giá 6 kỹ năng và đề xuất lớp Cambridge phù hợp</p>
              </div>
              <button onClick={() => setShowPlacementTestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên thí sinh / học sinh *</label>
                  <input
                    type="text"
                    required
                    value={placementData.candidateName}
                    onChange={e => setPlacementData({ ...placementData, candidateName: e.target.value })}
                    placeholder="VD: Lê Hoàng Quân"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={placementData.schoolGrade}
                    onChange={e => setPlacementData({ ...placementData, schoolGrade: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="Lớp 3">Lớp 3</option>
                    <option value="Lớp 4">Lớp 4</option>
                    <option value="Lớp 5">Lớp 5</option>
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9">Lớp 9</option>
                  </select>
                </div>
              </div>

              {/* 6 Skill Scores */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Kết quả các phần thi (Thang điểm 100)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Từ vựng (Vocab)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.vocabScore}
                      onChange={e => setPlacementData({ ...placementData, vocabScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ngữ pháp (Grammar)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.grammarScore}
                      onChange={e => setPlacementData({ ...placementData, grammarScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nghe (Listening)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.listeningScore}
                      onChange={e => setPlacementData({ ...placementData, listeningScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nói (Speaking)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.speakingScore}
                      onChange={e => setPlacementData({ ...placementData, speakingScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Đọc (Reading)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.readingScore}
                      onChange={e => setPlacementData({ ...placementData, readingScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Viết (Writing)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placementData.writingScore}
                      onChange={e => setPlacementData({ ...placementData, writingScore: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendation Box */}
              {(() => {
                const res = calcPlacement();
                return (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-blue-700">Đề xuất xếp lớp tự động</span>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5">
                          Trình độ đề xuất: <span className="text-blue-600">{res.level}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Điểm trung bình kiểm tra: <span className="font-bold text-slate-800">{res.avg}/100</span> • Khuyên xếp vào lớp: <span className="font-bold text-indigo-700">{res.recClass}</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                        {res.avg}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Quyền quản lý điều chỉnh:</span>
                      <select
                        value={placementData.manualClassOverride}
                        onChange={e => setPlacementData({ ...placementData, manualClassOverride: e.target.value })}
                        className="px-2.5 py-1 text-xs bg-white border border-blue-300 rounded-lg font-semibold"
                      >
                        <option value="">Theo đề xuất hệ thống ({res.recClass})</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPlacementTestModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={!placementData.candidateName.trim()}
                  onClick={handleSavePlacementStudent}
                  className="px-5 py-2 bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Xác nhận & Thêm học sinh vào lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: COMPREHENSIVE 11-TAB STUDENT PROFILE (Section 5) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl max-h-[92vh] flex flex-col">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedStudent.avatar}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedStudent.fullName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {selectedStudent.centerClassName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Mã HS: {selectedStudent.code} • Ngày sinh: {selectedStudent.birthDate} • Trình độ: {selectedStudent.level}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl"
                  title="In hồ sơ / Xuất PDF"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 11 Horizontal Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto py-3 border-b border-slate-100 text-xs font-bold shrink-0">
              {[
                { id: 1, label: '1. Cá nhân' },
                { id: 2, label: '2. Phụ huynh' },
                { id: 3, label: '3. Quá trình' },
                { id: 4, label: '4. Chuyên cần' },
                { id: 5, label: '5. Bài tập' },
                { id: 6, label: '6. Điểm số' },
                { id: 7, label: '7. Tiến bộ' },
                { id: 8, label: '8. Nhận xét' },
                { id: 9, label: '9. Kế hoạch' },
                { id: 10, label: '10. Học phí' },
                { id: 11, label: '11. Minh chứng' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    detailTab === t.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 overflow-y-auto py-4 text-xs">
              {/* Tab 1: Personal */}
              {detailTab === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Họ và tên:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.fullName}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Giới tính:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.gender}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Ngày sinh:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.birthDate}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Trường phổ thông:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.school}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Khối lớp:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.schoolGrade}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-slate-400">Ngày nhập học:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.enrollDate}</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-slate-400">Địa chỉ thường trú:</span>
                    <p className="font-medium text-slate-900 mt-1">{selectedStudent.address}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Parents */}
              {detailTab === 2 && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <h4 className="font-bold text-slate-800 mb-2">Hồ sơ liên lạc phụ huynh</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400">Họ tên phụ huynh:</span>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedStudent.parentName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Số điện thoại liên hệ:</span>
                        <p className="font-bold text-blue-600 mt-0.5">{selectedStudent.parentPhone}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Email:</span>
                        <p className="font-bold text-slate-800 mt-0.5">{selectedStudent.parentEmail || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <h5 className="font-bold text-blue-900 mb-1">Lịch sử tương tác phụ huynh</h5>
                    <p className="text-slate-600">Đã gửi báo cáo học tập định kỳ và thông báo học phí qua tin nhắn Zalo.</p>
                  </div>
                </div>
              )}

              {/* Tab 3: Learning Path */}
              {detailTab === 3 && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Trình độ đầu vào:</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.baselineLevel}</p>
                    </div>
                    <span className="text-slate-400 font-bold">&rarr;</span>
                    <div>
                      <span className="text-slate-400">Trình độ hiện tại:</span>
                      <p className="font-bold text-blue-600 text-sm mt-0.5">{selectedStudent.level}</p>
                    </div>
                    <span className="text-slate-400 font-bold">&rarr;</span>
                    <div>
                      <span className="text-slate-400">Mục tiêu đầu ra:</span>
                      <p className="font-bold text-emerald-600 text-sm mt-0.5">{selectedStudent.targetLevel}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Attendance */}
              {detailTab === 4 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-center">
                      <span className="text-emerald-700 font-extrabold text-xl">96%</span>
                      <p className="text-[11px] text-emerald-600 mt-0.5">Tỷ lệ chuyên cần</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-2xl text-center">
                      <span className="text-blue-700 font-extrabold text-xl">28/30</span>
                      <p className="text-[11px] text-blue-600 mt-0.5">Buổi có mặt</p>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-2xl text-center">
                      <span className="text-rose-700 font-extrabold text-xl">2</span>
                      <p className="text-[11px] text-rose-600 mt-0.5">Buổi nghỉ (Có phép: 2)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Homework */}
              {detailTab === 5 && (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Unit 7: Comparative Quiz</span>
                      <p className="text-[11px] text-slate-400">Hạn nộp: 19/04/2025</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg">Đã nộp (9/10)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Unit 6: Reading Comprehension</span>
                      <p className="text-[11px] text-slate-400">Hạn nộp: 12/04/2025</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg">Đã nộp (8.5/10)</span>
                  </div>
                </div>
              )}

              {/* Tab 6: Test Scores */}
              {detailTab === 6 && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <div className="flex justify-between font-bold text-slate-800 mb-2">
                      <span>Kiểm tra định kỳ gần nhất</span>
                      <span className="text-blue-600">Tổng điểm: 75/100</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-white rounded-xl">Listening: <span className="font-bold text-blue-600">{selectedStudent.currentScores.listening}</span></div>
                      <div className="p-2 bg-white rounded-xl">Speaking: <span className="font-bold text-rose-600">{selectedStudent.currentScores.speaking}</span></div>
                      <div className="p-2 bg-white rounded-xl">Reading: <span className="font-bold text-emerald-600">{selectedStudent.currentScores.reading}</span></div>
                      <div className="p-2 bg-white rounded-xl">Writing: <span className="font-bold text-purple-600">{selectedStudent.currentScores.writing}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Skill Progress (Comparison Baseline vs Current) */}
              {detailTab === 7 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">So sánh Đầu vào vs Hiện tại</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Listening (Nghe)', base: selectedStudent.baselineScores.listening, cur: selectedStudent.currentScores.listening, color: 'bg-blue-600' },
                      { name: 'Speaking (Nói)', base: selectedStudent.baselineScores.speaking, cur: selectedStudent.currentScores.speaking, color: 'bg-rose-500' },
                      { name: 'Reading (Đọc)', base: selectedStudent.baselineScores.reading, cur: selectedStudent.currentScores.reading, color: 'bg-emerald-500' },
                      { name: 'Writing (Viết)', base: selectedStudent.baselineScores.writing, cur: selectedStudent.currentScores.writing, color: 'bg-purple-500' },
                    ].map(s => (
                      <div key={s.name} className="p-3 bg-slate-50 rounded-2xl">
                        <div className="flex justify-between font-bold text-slate-800 mb-1.5">
                          <span>{s.name}</span>
                          <span className="text-slate-500">
                            Đầu vào: {s.base} &rarr; Hiện tại: <span className="text-blue-600">{s.cur}</span> (+{s.cur - s.base})
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.cur}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 8: Teacher Comments */}
              {detailTab === 8 && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Nhận xét của Giáo viên chủ nhiệm</h4>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{selectedStudent.notes || 'Học sinh có ý thức học tập rất tốt, ngoan ngoãn và chăm chỉ phát biểu.'}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">- Cô Nguyễn Thị Lan (Giáo viên phụ trách)</p>
                </div>
              )}

              {/* Tab 9: Intervention Plan */}
              {detailTab === 9 && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-900">Kế hoạch hỗ trợ cá nhân hóa</h4>
                  <div>
                    <span className="font-semibold text-slate-700">Điểm mạnh:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedStudent.strengths?.map(st => (
                        <span key={st} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-medium">{st}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Nội dung cần cải thiện:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedStudent.weaknesses?.map(wk => (
                        <span key={wk} className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-medium">{wk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 10: Tuition */}
              {detailTab === 10 && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Tình trạng học phí</h4>
                  <p className="text-slate-700">Đã đóng học phí tháng 4/2025 đầy đủ. Không có công nợ tồn đọng.</p>
                </div>
              )}

              {/* Tab 11: Documents and Evidence */}
              {detailTab === 11 && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900">Tài liệu & Minh chứng bài làm</h4>
                  <p className="text-slate-600">Phiếu kiểm tra giữa kỳ (scan PDF), file ghi âm bài nói Movers (mp3) đã lưu trữ an toàn trong kho dữ liệu.</p>
                </div>
              )}
            </div>

            {/* Modal Bottom Buttons */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
