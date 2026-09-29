import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  ShieldCheck,
  Users,
  Activity,
  Save,
  CheckCircle2,
  Clock,
  KeyRound,
  FileCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activityLogs, demoUsers, currentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'roles' | 'logs'>('general');

  // General settings state
  const [centerInfo, setCenterInfo] = useState({
    name: 'HOÀNG HOÀI ENGLISH CENTER',
    slogan: 'Chắp Cánh Ước Mơ Ngoại Ngữ Cho Thế Hệ Tương Lai',
    address: 'Số 128 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    hotline: '0988 123 456 - (024) 3789 9999',
    email: 'contact@hoanghoai.edu.vn',
    website: 'https://hoanghoai.edu.vn',
    academicYear: 'Năm học 2024 - 2025',
    director: 'Hoàng Thị Hoài (Thạc sĩ TESOL)',
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Đã lưu thông tin cấu hình trung tâm thành công!');
  };

  const rolePermissions = [
    {
      role: 'Quản lý (Manager)',
      desc: 'Toàn quyền điều hành: quản lý lớp, học sinh, giáo viên, duyệt báo cáo học tập, quản lý học phí và cấu hình hệ thống.',
      badge: 'bg-rose-100 text-rose-700',
    },
    {
      role: 'Giáo viên (Teacher)',
      desc: 'Quản lý lớp được phân công, điểm danh, giao và chấm bài tập, nhập điểm 4 kỹ năng, soạn nhận xét học sinh (không xem học phí trung tâm).',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    {
      role: 'Nhân viên (Staff)',
      desc: 'Quản lý hồ sơ học sinh, tuyển sinh, xếp lớp, xếp lịch học, lập phiếu thu và nhắc nộp học phí.',
      badge: 'bg-blue-100 text-blue-700',
    },
    {
      role: 'Học sinh (Student)',
      desc: 'Xem thời khóa biểu lớp, nhận và nộp bài tập trực tuyến, xem điểm số, nhận xét của giáo viên và biểu đồ tiến bộ cá nhân.',
      badge: 'bg-amber-100 text-amber-700',
    },
    {
      role: 'Phụ huynh (Parent)',
      desc: 'Chỉ xem thông tin con em mình: chuyên cần, kết quả bài tập, điểm thi, báo cáo định kỳ, học phí và gửi phản hồi cho giáo viên.',
      badge: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CÀI ĐẶT HỆ THỐNG & NHẬT KÝ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cấu hình thông tin trung tâm, phân quyền 5 vai trò bảo mật và nhật ký hoạt động hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building size={15} /> Thông tin trung tâm
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck size={15} /> Phân quyền & Tài khoản (5 Vai trò)
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity size={15} /> Nhật ký hoạt động ({activityLogs.length})
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 max-w-3xl">
          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên đơn vị giáo dục *</label>
              <input
                type="text"
                required
                value={centerInfo.name}
                onChange={e => setCenterInfo({ ...centerInfo, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border rounded-xl font-bold text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khẩu hiệu / Slogan</label>
              <input
                type="text"
                value={centerInfo.slogan}
                onChange={e => setCenterInfo({ ...centerInfo, slogan: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hotline / Điện thoại liên hệ</label>
                <input
                  type="text"
                  value={centerInfo.hotline}
                  onChange={e => setCenterInfo({ ...centerInfo, hotline: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email chính thức</label>
                <input
                  type="email"
                  value={centerInfo.email}
                  onChange={e => setCenterInfo({ ...centerInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trụ sở trung tâm</label>
                <input
                  type="text"
                  value={centerInfo.address}
                  onChange={e => setCenterInfo({ ...centerInfo, address: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giám đốc trung tâm / Chủ nhiệm</label>
                <input
                  type="text"
                  value={centerInfo.director}
                  onChange={e => setCenterInfo({ ...centerInfo, director: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Save size={15} /> Lưu thiết lập
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ROLES & ACCOUNTS */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* 5 Roles Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base uppercase">Ma trận phân quyền 5 vai trò chuẩn</h3>
            <div className="space-y-3">
              {rolePermissions.map((rp, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${rp.badge}`}>
                      {rp.role}
                    </span>
                    <p className="text-slate-600 mt-2 leading-relaxed">{rp.desc}</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-xs shrink-0 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Đã kích hoạt
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User accounts list */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
            <h3 className="font-extrabold text-slate-900 text-base uppercase mb-4">Tài khoản người dùng mẫu thử nghiệm</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {demoUsers.map(u => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                      <p className="text-slate-400">{u.email} • {u.phone}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs">
                    {u.roleTitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase">Nhật ký hoạt động bảo mật & thay đổi dữ liệu</h3>
            <span className="text-xs text-slate-400 font-medium">Lưu vết tự động theo thời gian thực</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {activityLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{log.user}</strong>
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-600">
                        {log.role}
                      </span>
                      <span className="text-blue-600 font-bold">{log.action}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.target}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 whitespace-nowrap text-[11px]">
                  <Clock size={12} />
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
