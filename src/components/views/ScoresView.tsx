import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestScore } from '../../types';
import {
  BarChart3,
  Plus,
  Lock,
  Unlock,
  Download,
  Upload,
  Edit2,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Settings2,
} from 'lucide-react';

export const ScoresView: React.FC = () => {
  const {
    testScores,
    classes,
    students,
    addTestScore,
    updateTestScore,
    showToast,
  } = useApp();

  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);
  const [showWeightsModal, setShowWeightsModal] = useState(false);

  // Skill weights (default standard: Listening 25%, Speaking 25%, Reading 25%, Writing 25%)
  const [weights, setWeights] = useState({
    listening: 25,
    speaking: 25,
    reading: 25,
    writing: 25,
  });

  const [newScore, setNewScore] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.fullName || '',
    classId: classes[0]?.id || '',
    className: classes[0]?.code || '',
    testTitle: 'Kiểm tra Giữa kỳ II',
    testDate: new Date().toISOString().split('T')[0],
    type: 'midterm' as const,
    listening: 80,
    speaking: 75,
    reading: 78,
    writing: 70,
    grammarVocab: 75,
    attitude: 90,
    homeworkCompletion: 85,
    totalWeightedScore: 75.7,
    isLocked: false,
    notes: 'Kỹ năng làm bài tốt.',
  });

  const filteredScores = testScores.filter(
    s => selectedClassFilter === 'all' || s.classId === selectedClassFilter
  );

  const calculateWeighted = (sc: typeof newScore) => {
    const total =
      (sc.listening * weights.listening +
        sc.speaking * weights.speaking +
        sc.reading * weights.reading +
        sc.writing * weights.writing) /
      100;
    return Number(total.toFixed(1));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === newScore.studentId);
    const cls = classes.find(c => c.id === newScore.classId);
    const total = calculateWeighted(newScore);

    addTestScore({
      ...newScore,
      studentName: st?.fullName || newScore.studentName,
      className: cls?.code || newScore.className,
      totalWeightedScore: total,
    });
    setShowAddScoreModal(false);
  };

  const handleToggleLock = (score: TestScore) => {
    updateTestScore(score.id, { isLocked: !score.isLocked });
    showToast(score.isLocked ? 'Đã mở khóa bảng điểm để chỉnh sửa' : 'Đã khóa bảng điểm an toàn!');
  };

  const handleExportCSV = () => {
    const headers = ['Mã HS,Họ và tên,Lớp,Kỳ thi,Listening,Speaking,Reading,Writing,Grammar/Vocab,Điểm tổng kết'];
    const rows = filteredScores.map(s =>
      `"${s.studentId}","${s.studentName}","${s.className}","${s.testTitle}",${s.listening},${s.speaking},${s.reading},${s.writing},${s.grammarVocab},${s.totalWeightedScore}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_diem_Hoang_Hoai_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất bảng điểm ra file CSV (Excel)!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            KIỂM TRA & ĐIỂM SỐ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bảng điểm chi tiết 4 kỹ năng (Nghe, Nói, Đọc, Viết) kết hợp ngữ pháp, thái độ học tập và khóa điểm an toàn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setShowWeightsModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Settings2 size={15} /> Cấu hình trọng số
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Download size={15} /> Xuất bảng điểm
          </button>
          <button
            onClick={() => setShowAddScoreModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Plus size={16} /> Nhập điểm kiểm tra
          </button>
        </div>
      </div>

      {/* Class filter */}
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

        <div className="text-xs text-slate-400 font-semibold">
          Trọng số hiện tại: Nghe {weights.listening}% • Nói {weights.speaking}% • Đọc {weights.reading}% • Viết {weights.writing}%
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Bài kiểm tra</th>
                <th className="py-3.5 px-4 text-center">Listening</th>
                <th className="py-3.5 px-4 text-center">Speaking</th>
                <th className="py-3.5 px-4 text-center">Reading</th>
                <th className="py-3.5 px-4 text-center">Writing</th>
                <th className="py-3.5 px-4 text-center">Grammar</th>
                <th className="py-3.5 px-4 text-center">Tổng điểm</th>
                <th className="py-3.5 px-4 text-right">Khóa / Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((sc, index) => (
                <tr key={sc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-semibold">{index + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sc.studentName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-50 text-blue-600">
                      {sc.className}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{sc.testTitle}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-600">{sc.listening}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-rose-600">{sc.speaking}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{sc.reading}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-purple-600">{sc.writing}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{sc.grammarVocab}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-700">
                      {sc.totalWeightedScore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleLock(sc)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        sc.isLocked
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={sc.isLocked ? 'Bảng điểm đang khóa - Nhấn để mở' : 'Khóa bảng điểm'}
                    >
                      {sc.isLocked ? <Lock size={15} /> : <Unlock size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WEIGHTS CONFIG MODAL */}
      {showWeightsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cấu hình trọng số kỹ năng</h3>
            <p className="text-xs text-slate-500 mb-4">Tổng các trọng số phải bằng 100%.</p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Listening (Nghe)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={weights.listening}
                    onChange={e => setWeights({ ...weights, listening: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded-lg text-center font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Speaking (Nói)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={weights.speaking}
                    onChange={e => setWeights({ ...weights, speaking: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded-lg text-center font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Reading (Đọc)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={weights.reading}
                    onChange={e => setWeights({ ...weights, reading: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded-lg text-center font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-700">Writing (Viết)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={weights.writing}
                    onChange={e => setWeights({ ...weights, writing: Number(e.target.value) })}
                    className="w-16 px-2 py-1 border rounded-lg text-center font-bold"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setShowWeightsModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Đã lưu cấu hình trọng số thành công!');
                  setShowWeightsModal(false);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Lưu trọng số
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SCORE MODAL */}
      {showAddScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Nhập điểm kiểm tra học sinh</h3>
              <button onClick={() => setShowAddScoreModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chọn lớp</label>
                  <select
                    value={newScore.classId}
                    onChange={e => {
                      const c = classes.find(cl => cl.id === e.target.value);
                      setNewScore({ ...newScore, classId: e.target.value, className: c?.code || '' });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Học sinh *</label>
                  <select
                    value={newScore.studentId}
                    onChange={e => {
                      const st = students.find(s => s.id === e.target.value);
                      setNewScore({ ...newScore, studentId: e.target.value, studentName: st?.fullName || '' });
                    }}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên bài thi / kỳ kiểm tra</label>
                <input
                  type="text"
                  required
                  value={newScore.testTitle}
                  onChange={e => setNewScore({ ...newScore, testTitle: e.target.value })}
                  placeholder="Kiểm tra Định kỳ Tháng 4..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-800 uppercase mb-2">Điểm 4 Kỹ năng (Thang 100)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-600 mb-1">Listening</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newScore.listening}
                      onChange={e => setNewScore({ ...newScore, listening: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-600 mb-1">Speaking</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newScore.speaking}
                      onChange={e => setNewScore({ ...newScore, speaking: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-600 mb-1">Reading</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newScore.reading}
                      onChange={e => setNewScore({ ...newScore, reading: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-purple-600 mb-1">Writing</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newScore.writing}
                      onChange={e => setNewScore({ ...newScore, writing: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddScoreModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Lưu bảng điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
