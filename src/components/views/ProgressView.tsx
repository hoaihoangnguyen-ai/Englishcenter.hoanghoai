import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Download,
  Award,
  BookOpen,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { students, classes, showToast } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handlePrintPDF = () => {
    window.print();
  };

  const skillsData = [
    {
      name: 'Listening (Kỹ năng Nghe)',
      baseline: currentStudent.baselineScores.listening,
      current: currentStudent.currentScores.listening,
      classAvg: 72,
      target: 85,
      color: 'bg-blue-600',
    },
    {
      name: 'Speaking (Kỹ năng Nói & Phát âm)',
      baseline: currentStudent.baselineScores.speaking,
      current: currentStudent.currentScores.speaking,
      classAvg: 68,
      target: 80,
      color: 'bg-rose-500',
    },
    {
      name: 'Reading (Đọc hiểu & Từ vựng)',
      baseline: currentStudent.baselineScores.reading,
      current: currentStudent.currentScores.reading,
      classAvg: 70,
      target: 80,
      color: 'bg-emerald-500',
    },
    {
      name: 'Writing (Viết câu & Đoạn văn)',
      baseline: currentStudent.baselineScores.writing,
      current: currentStudent.currentScores.writing,
      classAvg: 64,
      target: 75,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            THEO DÕI TIẾN BỘ HỌC TẬP
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Biểu đồ so sánh trình độ đầu vào, hiện tại và mục tiêu đầu ra cho từng học sinh và lớp học.
          </p>
        </div>

        <button
          onClick={handlePrintPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Printer size={16} /> Xuất Báo cáo tiến bộ PDF
        </button>
      </div>

      {/* Student Selector Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img
            src={currentStudent.avatar}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg">{currentStudent.fullName}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                {currentStudent.centerClassName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Mã: {currentStudent.code} • Trình độ: {currentStudent.level} • Khối: {currentStudent.schoolGrade}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Chọn học sinh:</span>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.centerClassName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Cards: Baseline vs Current vs Goal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Trình độ đầu vào</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{currentStudent.baselineLevel}</div>
          <p className="text-xs text-slate-500 mt-1">Đánh giá lúc nhập học: {currentStudent.enrollDate}</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 shadow-xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Trình độ hiện tại</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{currentStudent.level}</div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">&uarr; Tăng trưởng đều đặn qua các tháng</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mục tiêu kỳ này</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{currentStudent.targetLevel}</div>
          <p className="text-xs text-slate-500 mt-1">Dự kiến hoàn thành vào 06/2025</p>
        </div>
      </div>

      {/* Progress Bars comparison */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wide">
            TIẾN TRÌNH CHI TIẾT 4 KỸ NĂNG
          </h3>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Đầu vào</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Hiện tại</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Trung bình lớp</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mục tiêu</span>
          </div>
        </div>

        <div className="space-y-5">
          {skillsData.map(sk => {
            const growth = sk.current - sk.baseline;

            return (
              <div key={sk.name} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <span className="font-bold text-slate-800 text-sm">{sk.name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">Đầu vào: <strong className="text-slate-700">{sk.baseline}</strong></span>
                    <span className="text-blue-600">Hiện tại: <strong className="text-blue-700 font-extrabold">{sk.current}</strong></span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">+{growth} điểm</span>
                    <span className="text-slate-400">TB lớp: {sk.classAvg}</span>
                    <span className="text-emerald-700">Mục tiêu: {sk.target}</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="relative w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`${sk.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${sk.current}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher periodic review and notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" /> Điểm mạnh ghi nhận
          </h4>
          <ul className="space-y-2 text-xs">
            {currentStudent.strengths?.map(s => (
              <li key={s} className="p-2.5 bg-emerald-50/60 text-emerald-800 rounded-xl font-medium border border-emerald-100">
                • {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-500" /> Nội dung cần bồi dưỡng thêm
          </h4>
          <ul className="space-y-2 text-xs">
            {currentStudent.weaknesses?.map(w => (
              <li key={w} className="p-2.5 bg-amber-50/60 text-amber-800 rounded-xl font-medium border border-amber-100">
                • {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
