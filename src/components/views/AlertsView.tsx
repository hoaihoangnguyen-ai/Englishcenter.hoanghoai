import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAlert } from '../../types';
import {
  HeartHandshake,
  Calendar,
  FileText,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  PhoneCall,
  BookOpen,
  X,
  History,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const {
    studentAlerts,
    advanceAlertStep,
    updateAlertStatus,
    showToast,
  } = useApp();

  const [activeAlert, setActiveAlert] = useState<StudentAlert | null>(null);
  const [stepNote, setStepNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stepTitles = [
    '',
    '1. Ghi nhận vấn đề',
    '2. Phân công giáo viên phụ trách',
    '3. Trao đổi với học sinh',
    '4. Giao bài bổ trợ',
    '5. Liên hệ phụ huynh',
    '6. Sắp xếp phụ đạo nếu cần',
    '7. Đặt ngày kiểm tra lại',
    '8. Ghi nhận kết quả',
    '9. Đóng cảnh báo khi đã cải thiện',
  ];

  const filteredAlerts = studentAlerts.filter(
    a => statusFilter === 'all' || a.status === statusFilter
  );

  const handleAdvanceStep = () => {
    if (!activeAlert) return;
    advanceAlertStep(activeAlert.id, stepNote || undefined);
    setStepNote('');
    // refresh active alert from updated data
    const updated = studentAlerts.find(a => a.id === activeAlert.id);
    if (updated) setActiveAlert(updated);
  };

  const handleMarkResolved = (alertId: string) => {
    updateAlertStatus(alertId, 'resolved', 'Học sinh đã hoàn thành chương trình bổ trợ và tiến bộ rõ rệt.');
    showToast('Đã đóng cảnh báo: Học sinh đã cải thiện thành công!');
    if (activeAlert?.id === alertId) {
      setActiveAlert(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            HỌC SINH CẦN HỖ TRỢ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quy trình chuẩn hóa 9 bước can thiệp kịp thời: phát hiện, liên hệ gia đình, phân công phụ đạo và đánh giá lại.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'need_contact', label: 'Cần liên hệ' },
            { id: 'monitoring', label: 'Theo dõi' },
            { id: 'in_progress', label: 'Đang hỗ trợ' },
            { id: 'resolved', label: 'Đã cải thiện' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Alert List + Detail Workflow Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: List of Alerts (span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredAlerts.map(alert => {
            const isResolved = alert.status === 'resolved';

            return (
              <div
                key={alert.id}
                onClick={() => setActiveAlert(alert)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  activeAlert?.id === alert.id
                    ? 'bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={alert.avatar}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{alert.studentName}</h3>
                        <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-blue-50 text-blue-600">
                          {alert.className}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        GV phụ trách: <strong className="text-slate-700">{alert.teacherInCharge}</strong> • Cập nhật: {alert.updatedAt}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-700'
                        : alert.status === 'need_contact'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isResolved ? 'Đã cải thiện' : alert.status === 'need_contact' ? 'Cần liên hệ' : 'Theo dõi'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl mb-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    <span className="font-bold text-slate-800">Vấn đề: {alert.issueText}</span>
                  </div>
                  <span className="font-extrabold text-blue-600">Bước {alert.currentStep}/9</span>
                </div>

                {/* Step indicator bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isResolved ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${(alert.currentStep / 9) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: 9-Step Process Detail View (span 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
          {activeAlert ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase">Quy trình xử lý chuẩn 9 bước</span>
                  <h3 className="font-black text-slate-900 text-lg">{activeAlert.studentName}</h3>
                  <p className="text-xs text-slate-400">Lớp: {activeAlert.className} • Vấn đề: {activeAlert.issueText}</p>
                </div>
                <button onClick={() => setActiveAlert(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {/* Current Step Focus */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-[11px] font-bold uppercase text-blue-700 block">Bước hiện tại đang thực hiện</span>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  {stepTitles[activeAlert.currentStep]}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Người phụ trách: <strong className="text-slate-800">{activeAlert.teacherInCharge}</strong>
                </p>

                {activeAlert.currentStep < 9 && (
                  <div className="mt-3 pt-3 border-t border-blue-200/60 space-y-2">
                    <input
                      type="text"
                      value={stepNote}
                      onChange={e => setStepNote(e.target.value)}
                      placeholder="Ghi chú kết quả bước này (VD: Đã gọi điện cho mẹ)..."
                      className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleAdvanceStep}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs"
                      >
                        Chuyển bước {activeAlert.currentStep + 1} &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {activeAlert.currentStep >= 8 && activeAlert.status !== 'resolved' && (
                  <button
                    onClick={() => handleMarkResolved(activeAlert.id)}
                    className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  >
                    Đóng cảnh báo (Xác nhận học sinh đã cải thiện)
                  </button>
                )}
              </div>

              {/* 9-step Timeline */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <h4 className="font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5">
                  <History size={13} className="text-slate-400" /> Nhật ký 9 bước xử lý
                </h4>

                <div className="space-y-2 text-xs">
                  {stepTitles.slice(1).map((title, i) => {
                    const stepNum = i + 1;
                    const isDone = stepNum < activeAlert.currentStep;
                    const isCurrent = stepNum === activeAlert.currentStep;
                    const historyItem = activeAlert.history?.find(h => h.step === stepNum);

                    return (
                      <div
                        key={stepNum}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          isDone
                            ? 'bg-slate-50 border-slate-200/60 text-slate-700'
                            : isCurrent
                            ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-bold'
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            ) : (
                              <span className={`w-3.5 h-3.5 rounded-full border text-[9px] flex items-center justify-center ${
                                isCurrent ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                              }`}>
                                {stepNum}
                              </span>
                            )}
                            <span>{title}</span>
                          </span>
                          {historyItem && (
                            <span className="text-[10px] text-slate-400 font-normal">{historyItem.timestamp.split(' ')[0]}</span>
                          )}
                        </div>
                        {historyItem?.notes && (
                          <p className="text-[11px] text-slate-500 font-normal mt-1 pl-5 italic">
                            - {historyItem.notes} ({historyItem.performedBy})
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              <HeartHandshake size={32} className="mx-auto mb-2 text-slate-300" />
              <p>Chọn một học sinh từ danh sách bên trái để xem quy trình 9 bước can thiệp chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
