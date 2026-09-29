import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TuitionRecord } from '../../types';
import {
  Coins,
  Search,
  Filter,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Printer,
  X,
  CreditCard,
  Building,
  User,
} from 'lucide-react';

export const TuitionView: React.FC = () => {
  const {
    tuitionRecords,
    classes,
    recordTuitionPayment,
    sendTuitionReminder,
    currentUser,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  const [paymentModalRecord, setPaymentModalRecord] = useState<TuitionRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(1000000);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'vnpay_momo'>('bank_transfer');
  const [receiptRecord, setReceiptRecord] = useState<TuitionRecord | null>(null);

  // Filter records (if currentUser is parent, only show their child's tuition!)
  const visibleRecords = tuitionRecords.filter(t => {
    if (currentUser.role === 'parent' && currentUser.studentId) {
      if (t.studentId !== currentUser.studentId) return false;
    }
    const matchSearch =
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.parentPhone.includes(search);
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchClass = filterClass === 'all' || t.classId === filterClass;
    return matchSearch && matchStatus && matchClass;
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalRecord) return;
    recordTuitionPayment(paymentModalRecord.id, paymentAmount, paymentMethod);
    setPaymentModalRecord(null);
  };

  const handleExportCSV = () => {
    const headers = ['Mã phiếu,Học sinh,Lớp,Tháng,Học phí chuẩn,Giảm trừ,Phải đóng,Đã đóng,Còn lại,Hạn nộp,Trạng thái'];
    const rows = visibleRecords.map(t =>
      `"${t.code}","${t.studentName}","${t.className}","${t.month}",${t.standardFee},${t.discount},${t.payableAmount},${t.paidAmount},${t.payableAmount - t.paidAmount},"${t.dueDate}","${t.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_cao_hoc_phi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất báo cáo học phí ra file CSV (Excel)!');
  };

  // Stats
  const totalReceivable = visibleRecords.reduce((acc, cur) => acc + cur.payableAmount, 0);
  const totalCollected = visibleRecords.reduce((acc, cur) => acc + cur.paidAmount, 0);
  const totalRemainingDebt = totalReceivable - totalCollected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            QUẢN LÝ HỌC PHÍ & PHIẾU THU
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi công nợ học phí, chính sách ưu đãi, phiếu thu điện tử và gửi tin nhắc thanh toán.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={15} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tổng phải thu (Tháng 4)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalReceivable.toLocaleString('vi-VN')} đ</div>
          <p className="text-xs text-slate-500 mt-0.5">Đã trừ các khoản học bổng và ưu đãi</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Đã thực thu</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalCollected.toLocaleString('vi-VN')} đ</div>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">
            Tỷ lệ hoàn thành: {totalReceivable > 0 ? Math.round((totalCollected / totalReceivable) * 100) : 0}%
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-rose-200 bg-gradient-to-br from-white to-rose-50/40 shadow-xs">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Công nợ còn lại</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{totalRemainingDebt.toLocaleString('vi-VN')} đ</div>
          <p className="text-xs text-rose-600 font-semibold mt-0.5">Cần nhắc phụ huynh thanh toán</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã phiếu, SĐT phụ huynh..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán đủ</option>
            <option value="partial">Thanh toán một phần</option>
            <option value="overdue">Quá hạn nộp</option>
          </select>

          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả lớp</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tuition Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Mã phiếu</th>
                <th className="py-3.5 px-4">Học sinh & Lớp</th>
                <th className="py-3.5 px-4">Kỳ thu</th>
                <th className="py-3.5 px-4">Học phí chuẩn</th>
                <th className="py-3.5 px-4">Giảm trừ</th>
                <th className="py-3.5 px-4">Phải đóng</th>
                <th className="py-3.5 px-4">Đã đóng</th>
                <th className="py-3.5 px-4">Hạn nộp</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRecords.map(t => {
                const debt = t.payableAmount - t.paidAmount;

                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{t.studentName}</div>
                      <div className="text-[11px] text-slate-400">
                        {t.className} • PH: {t.parentPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.month}</td>
                    <td className="py-3.5 px-4 text-slate-700">{t.standardFee.toLocaleString('vi-VN')} đ</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-medium">
                      {t.discount > 0 ? `-${t.discount.toLocaleString('vi-VN')} đ` : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.payableAmount.toLocaleString('vi-VN')} đ</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{t.paidAmount.toLocaleString('vi-VN')} đ</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{t.dueDate}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {t.status === 'paid' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          Đã thanh toán
                        </span>
                      ) : t.status === 'partial' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Còn thiếu {debt.toLocaleString('vi-VN')} đ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          Quá hạn
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status !== 'paid' && (
                          <>
                            <button
                              onClick={() => {
                                setPaymentModalRecord(t);
                                setPaymentAmount(debt);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                            >
                              Thu tiền
                            </button>
                            <button
                              onClick={() => sendTuitionReminder(t.id)}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                              title="Gửi nhắc nộp học phí"
                            >
                              <Send size={14} />
                            </button>
                          </>
                        )}
                        {t.status === 'paid' && (
                          <button
                            onClick={() => setReceiptRecord(t)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1"
                          >
                            <Receipt size={13} /> Phiếu thu
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {paymentModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Lập phiếu thu học phí</h3>
            <p className="text-xs text-slate-500 mb-4">
              Thu học phí cho học sinh <strong className="text-slate-800">{paymentModalRecord.studentName}</strong> ({paymentModalRecord.className}).
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số tiền thanh toán (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border rounded-xl font-extrabold text-sm text-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 border rounded-xl"
                >
                  <option value="bank_transfer">Chuyển khoản Ngân hàng (Vietcombank)</option>
                  <option value="cash">Tiền mặt tại quầy lễ tân</option>
                  <option value="vnpay_momo">Ví điện tử VNPAY / MoMo</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalRecord(null)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                >
                  Xác nhận thu tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {receiptRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  H
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">PHIẾU THU HỌC PHÍ</h3>
                  <p className="text-[11px] text-slate-400">Số: {receiptRecord.receiptNumber || 'REC-8821'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button onClick={() => window.print()} className="p-2 bg-slate-100 rounded-xl" title="In phiếu thu">
                  <Printer size={16} />
                </button>
                <button onClick={() => setReceiptRecord(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Đơn vị thu:</span>
                <span className="font-bold text-slate-800">HOÀNG HOÀI ENGLISH CENTER</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Học sinh:</span>
                <span className="font-bold text-slate-800">{receiptRecord.studentName} ({receiptRecord.className})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Người nộp tiền (Phụ huynh):</span>
                <span className="font-bold text-slate-800">{receiptRecord.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kỳ học phí:</span>
                <span className="font-bold text-slate-800">{receiptRecord.month}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Số tiền đã thanh toán:</span>
                <span className="font-black text-emerald-600 text-base">{receiptRecord.paidAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Hình thức thanh toán:</span>
                <span className="font-bold text-slate-800">
                  {receiptRecord.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Tiền mặt'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between text-[11px] text-slate-500 text-center">
              <div>
                <p className="font-bold text-slate-700">Người nộp tiền</p>
                <p className="italic mt-8">(Ký, họ tên)</p>
              </div>
              <div>
                <p className="font-bold text-slate-700">Người lập phiếu (Kế toán)</p>
                <p className="italic mt-8">Đặng Thu Hằng</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
