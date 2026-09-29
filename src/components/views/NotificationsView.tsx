import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CenterNotification } from '../../types';
import {
  Bell,
  Plus,
  Send,
  CheckCheck,
  Megaphone,
  FileText,
  Coins,
  AlertTriangle,
  Users,
  X,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    classes,
    showToast,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterAudience, setFilterAudience] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    targetAudience: 'all' as const,
    targetName: 'Toàn trung tâm',
    totalRecipients: 486,
    author: 'Ban Giám Hiệu',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification(formData);
    setShowCreateModal(false);
  };

  const filteredNotifs = notifications.filter(
    n => filterAudience === 'all' || n.targetAudience === filterAudience
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            THÔNG BÁO TRUNG TÂM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phát thông báo tới toàn thể học viên, phụ huynh, giáo viên hoặc riêng từng lớp học.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <CheckCheck size={15} /> Đánh dấu đã đọc tất cả
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Plus size={16} /> Tạo thông báo mới
          </button>
        </div>
      </div>

      {/* Filter Audience Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto">
        {[
          { id: 'all', label: 'Tất cả đối tượng' },
          { id: 'parents', label: 'Dành cho Phụ huynh' },
          { id: 'teachers', label: 'Dành cho Giáo viên' },
          { id: 'class', label: 'Theo từng Lớp học' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilterAudience(item.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterAudience === item.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifs.map(notif => (
          <div
            key={notif.id}
            onClick={() => markNotificationAsRead(notif.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              notif.isRead
                ? 'bg-white border-slate-200/80 hover:border-slate-300'
                : 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.category === 'urgent'
                      ? 'bg-rose-100 text-rose-600'
                      : notif.category === 'tuition'
                      ? 'bg-amber-100 text-amber-600'
                      : notif.category === 'new_class'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <Megaphone size={18} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {notif.targetAudience === 'all'
                        ? 'Toàn trung tâm'
                        : notif.targetAudience === 'parents'
                        ? 'Gửi Phụ huynh'
                        : notif.targetAudience === 'teachers'
                        ? 'Gửi Giáo viên'
                        : notif.targetName}
                    </span>
                    {!notif.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        Mới
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{notif.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.content}</p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                    <span>Người gửi: <strong className="text-slate-700">{notif.author}</strong></span>
                    <span>• {notif.createdAt}</span>
                    <span>• Đã có {notif.readCount}/{notif.totalRecipients} người đọc</span>
                  </div>
                </div>
              </div>

              <span className="text-xs text-slate-400 whitespace-nowrap font-medium">{notif.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NOTIFICATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Tạo thông báo mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Lịch thi thử Cambridge Starters & Movers"
                  className="w-full px-3.5 py-2 border rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đối tượng nhận</label>
                  <select
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3.5 py-2 border rounded-xl"
                  >
                    <option value="all">Toàn trung tâm (486 học sinh & PH)</option>
                    <option value="parents">Phụ huynh học sinh</option>
                    <option value="teachers">Giáo viên trung tâm</option>
                    <option value="class">Một lớp cụ thể</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 border rounded-xl"
                  >
                    <option value="general">Tin tức chung</option>
                    <option value="new_class">Khai giảng lớp mới</option>
                    <option value="exam">Kiểm tra & Thi cử</option>
                    <option value="tuition">Nhắc học phí</option>
                    <option value="urgent">Thông báo khẩn (Thời tiết / Nghỉ lễ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung thông báo gửi tới người nhận..."
                  className="w-full px-3.5 py-2 border rounded-xl focus:outline-none"
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
                  Phát thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
