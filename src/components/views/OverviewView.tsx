import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  PieChart as PieIcon,
  ChevronDown,
  Calendar,
  FileText,
  BarChart2,
  Clock,
  Volume2,
  Mic,
  BookMarked,
  PenTool,
  ArrowUpRight,
  MoreHorizontal,
  Megaphone,
  Coins,
  UserX,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { StudentAlert } from '../../types';

export const OverviewView: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    studentAlerts,
    schedules,
    notifications,
    setActiveTab,
    setSelectedStudent,
    advanceAlertStep,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<StudentAlert | null>(null);
  const [homeworkStatusFilter, setHomeworkStatusFilter] = useState<string | null>(null);

  // Line chart interactive hover state
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);

  // 6 months dataset
  const chartData = [
    { label: 'T4', listening: 60, speaking: 52, reading: 44, writing: 35 },
    { label: 'T5', listening: 68, speaking: 60, reading: 49, writing: 42 },
    { label: 'T6', listening: 75, speaking: 66, reading: 56, writing: 48 },
    { label: 'T7', listening: 80, speaking: 72, reading: 61, writing: 53 },
    { label: 'T8', listening: 86, speaking: 78, reading: 68, writing: 60 },
    { label: 'T9', listening: 95, speaking: 88, reading: 80, writing: 70 },
  ];

  // SVG Chart dimensions
  const svgWidth = 620;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (chartData.length - 1)) * chartInnerWidth;
  const getY = (val: number) => paddingY + chartInnerHeight - (val / 100) * chartInnerHeight;

  // Path generators
  const makePath = (key: 'listening' | 'speaking' | 'reading' | 'writing') => {
    return chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
  };

  // Donut chart calculations
  const homeworkStats = [
    { label: 'Đã hoàn thành', percent: 82, color: '#10b981', count: 18 },
    { label: 'Chưa hoàn thành', percent: 12, color: '#f59e0b', count: 3 },
    { label: 'Nộp muộn', percent: 6, color: '#f43f5e', count: 2 },
  ];

  // Helper for status colors
  const getIssueBadge = (issue: string) => {
    switch (issue) {
      case 'absent_2_sessions':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <Calendar size={13} /> Nghỉ 2 buổi
          </span>
        );
      case 'missing_homework':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <FileText size={13} /> Chưa làm bài
          </span>
        );
      case 'score_dropped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <BarChart2 size={13} /> Điểm giảm
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
            <AlertTriangle size={13} /> Cần theo dõi
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'need_contact':
        return (
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-rose-100/70 text-rose-600">
            Cần liên hệ
          </span>
        );
      case 'monitoring':
        return (
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-amber-100/70 text-amber-700">
            Theo dõi
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-blue-100/70 text-blue-700">
            Đang hỗ trợ
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100/70 text-emerald-700">
            Đã cải thiện
          </span>
        );
      default:
        return (
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
            Mới phát hiện
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            TỔNG QUAN
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chào mừng bạn trở lại! Cùng xem tình hình hoạt động của trung tâm hôm nay.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200/90 rounded-2xl px-4 py-2 shadow-xs hover:border-slate-300 transition-colors">
          <Calendar size={16} className="text-slate-500" />
          <span className="text-xs md:text-sm font-semibold text-slate-700">
            Thứ Năm, 17 tháng 4, 2025
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={28} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">486</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Học sinh</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
              &uarr; +12
            </span>
            <p className="text-[10px] text-slate-400 mt-1">so với tháng trước</p>
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap size={28} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">24</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Giáo viên</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
              &uarr; +2
            </span>
            <p className="text-[10px] text-slate-400 mt-1">so với tháng trước</p>
          </div>
        </div>

        {/* Card 3: Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">18</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Lớp đang học</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
              &uarr; +2
            </span>
            <p className="text-[10px] text-slate-400 mt-1">so với tháng trước</p>
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <PieIcon size={28} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">94%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Chuyên cần</div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
              &uarr; +3%
            </span>
            <p className="text-[10px] text-slate-400 mt-1">so với tháng trước</p>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Line Chart + Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                TIẾN BỘ HỌC TẬP
              </h2>
              <p className="text-xs text-slate-400">Điểm trung bình 4 kỹ năng theo từng tháng</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="6m">6 tháng qua</option>
                <option value="3m">3 tháng qua</option>
                <option value="12m">12 tháng qua</option>
              </select>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-64 overflow-visible"
            >
              {/* Horizontal Grid lines */}
              {[0, 20, 40, 60, 80, 100].map(val => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94a3b8"
                      className="font-medium"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical month labels */}
              {chartData.map((d, i) => {
                const x = getX(i);
                return (
                  <text
                    key={d.label}
                    x={x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#64748b"
                    className="font-semibold"
                  >
                    {d.label}
                  </text>
                );
              })}

              {/* 4 Skill Lines */}
              {/* Listening (Blue) */}
              <path
                d={makePath('listening')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Speaking (Coral) */}
              <path
                d={makePath('speaking')}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Reading (Emerald) */}
              <path
                d={makePath('reading')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Writing (Purple) */}
              <path
                d={makePath('writing')}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {chartData.map((d, i) => {
                const x = getX(i);
                const isHovered = hoveredMonthIndex === i;

                return (
                  <g key={d.label} onMouseEnter={() => setHoveredMonthIndex(i)} onMouseLeave={() => setHoveredMonthIndex(null)}>
                    {isHovered && (
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={svgHeight - paddingY}
                        stroke="#cbd5e1"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle cx={x} cy={getY(d.listening)} r={isHovered ? 5 : 3.5} fill="#2563eb" className="transition-all" />
                    <circle cx={x} cy={getY(d.speaking)} r={isHovered ? 5 : 3.5} fill="#f43f5e" className="transition-all" />
                    <circle cx={x} cy={getY(d.reading)} r={isHovered ? 5 : 3.5} fill="#10b981" className="transition-all" />
                    <circle cx={x} cy={getY(d.writing)} r={isHovered ? 5 : 3.5} fill="#8b5cf6" className="transition-all" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Hover Tooltip */}
          {hoveredMonthIndex !== null && (
            <div className="mt-2 p-2.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-around animate-in fade-in duration-100">
              <span className="font-bold text-slate-300">Tháng {chartData[hoveredMonthIndex].label}:</span>
              <span className="text-blue-400 font-semibold">Listening: {chartData[hoveredMonthIndex].listening}</span>
              <span className="text-rose-400 font-semibold">Speaking: {chartData[hoveredMonthIndex].speaking}</span>
              <span className="text-emerald-400 font-semibold">Reading: {chartData[hoveredMonthIndex].reading}</span>
              <span className="text-purple-400 font-semibold">Writing: {chartData[hoveredMonthIndex].writing}</span>
            </div>
          )}

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>Listening</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>Speaking</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Reading</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span>Writing</span>
            </div>
          </div>
        </div>

        {/* Donut Chart: Homework Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              TÌNH TRẠNG BÀI TẬP
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Tỷ lệ nộp bài tập tuần này</p>
          </div>

          {/* Donut graphic */}
          <div className="relative flex items-center justify-center my-4">
            <svg viewBox="0 0 160 160" className="w-44 h-44 -rotate-90">
              {/* Background circle */}
              <circle cx="80" cy="80" r="62" fill="none" stroke="#f1f5f9" strokeWidth="18" />

              {/* Completed slice: 82% (circumference ~ 389.5, 82% = 319.4) */}
              <circle
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke="#10b981"
                strokeWidth="18"
                strokeDasharray="319.4 389.5"
                strokeDashoffset="0"
                className="transition-all duration-700"
              />

              {/* Uncompleted: 12% = 46.7 */}
              <circle
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="18"
                strokeDasharray="46.7 389.5"
                strokeDashoffset="-319.4"
                className="transition-all duration-700"
              />

              {/* Late: 6% = 23.4 */}
              <circle
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="18"
                strokeDasharray="23.4 389.5"
                strokeDashoffset="-366.1"
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">82%</span>
              <span className="text-xs font-semibold text-slate-400 -mt-0.5">Đã hoàn thành</span>
            </div>
          </div>

          {/* Interactive Legend with click to filter */}
          <div className="space-y-2.5 pt-2">
            {homeworkStats.map(item => (
              <button
                key={item.label}
                onClick={() => setHomeworkStatusFilter(item.label)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{item.percent}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Three sections (Students Needing Support, Today's Schedule, Recent Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Students Needing Support (span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wide">
                HỌC SINH CẦN HỖ TRỢ
              </h2>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Xem tất cả &rarr;
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-semibold">
                    <th className="pb-3 w-7">#</th>
                    <th className="pb-3">Họ và tên</th>
                    <th className="pb-3">Lớp</th>
                    <th className="pb-3">Vấn đề</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAlerts.slice(0, 4).map((alert, index) => {
                    const student = students.find(s => s.id === alert.studentId);

                    return (
                      <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={alert.avatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <span className="font-bold text-slate-800 truncate max-w-[105px]">
                              {alert.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-2">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-50 text-blue-600">
                            {alert.className}
                          </span>
                        </td>
                        <td className="py-3 pr-2 whitespace-nowrap">
                          {getIssueBadge(alert.issue)}
                        </td>
                        <td className="py-3 pr-2 whitespace-nowrap">
                          {getStatusBadge(alert.status)}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                if (student) {
                                  setSelectedStudent(student);
                                  setActiveTab('students');
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Xem
                            </button>
                            <button
                              onClick={() => setSelectedAlertForAction(alert)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                              title="Thao tác nhanh"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: Today's Schedule (span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wide">
                LỊCH HỌC HÔM NAY
              </h2>
              <button
                onClick={() => setActiveTab('schedules')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Xem tất cả &rarr;
              </button>
            </div>

            {/* List of class sessions */}
            <div className="space-y-3">
              {schedules.slice(0, 3).map((item, idx) => {
                const isOngoing = item.status === 'ongoing';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-blue-100 text-blue-600'
                            : idx === 1
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {idx === 0 ? <Users size={18} /> : idx === 1 ? <BookOpen size={18} /> : <Users size={18} />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{item.className}</h4>
                        <p className="text-[11px] text-slate-500">
                          {item.room} • {item.teacherName}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isOngoing ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Đang diễn ra
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                          Sắp diễn ra
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Recent Announcements (span 3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wide">
                THÔNG BÁO GẦN ĐÂY
              </h2>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Xem tất cả &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              {notifications.slice(0, 4).map((notif, idx) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      idx === 0
                        ? 'bg-emerald-100 text-emerald-600'
                        : idx === 1
                        ? 'bg-blue-100 text-blue-600'
                        : idx === 2
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {idx === 0 ? (
                      <Megaphone size={15} />
                    ) : idx === 1 ? (
                      <FileText size={15} />
                    ) : idx === 2 ? (
                      <Coins size={15} />
                    ) : (
                      <UserX size={15} />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {notif.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Alert Modal */}
      {selectedAlertForAction && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Xử lý cảnh báo học sinh</h3>
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <img src={selectedAlertForAction.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{selectedAlertForAction.studentName}</h4>
                  <p className="text-xs text-slate-500">Lớp: {selectedAlertForAction.className} • Vấn đề: {selectedAlertForAction.issueText}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Quy trình bước {selectedAlertForAction.currentStep}/9</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Bạn có thể tiến hành bước xử lý tiếp theo hoặc chuyển thẳng đến hồ sơ học sinh để lên kế hoạch bồi dưỡng chi tiết.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  advanceAlertStep(selectedAlertForAction.id);
                  setSelectedAlertForAction(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                Chuyển bước tiếp theo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Filter Modal / Detail */}
      {homeworkStatusFilter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Danh sách học sinh: {homeworkStatusFilter}</h3>
                <p className="text-xs text-slate-400">Dữ liệu bài tập tuần học hiện tại</p>
              </div>
              <button onClick={() => setHomeworkStatusFilter(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-80 overflow-y-auto">
              {students.slice(0, 5).map(st => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-[11px] text-slate-500">{st.code} • Lớp {st.centerClassName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                    {homeworkStatusFilter}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setHomeworkStatusFilter(null);
                  setActiveTab('assignments');
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Đến trang Quản lý Bài tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
