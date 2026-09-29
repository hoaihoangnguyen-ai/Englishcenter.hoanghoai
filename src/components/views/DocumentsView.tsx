import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import {
  FolderOpen,
  Plus,
  Search,
  Download,
  FileText,
  File,
  Volume2,
  Video,
  Presentation,
  Paperclip,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, deleteDocument, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [filterCurriculum, setFilterCurriculum] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    gradeLevel: 'Tiểu học (3-5)' as const,
    curriculum: 'Cambridge Primary' as const,
    unit: 'Unit 1',
    skill: 'Grammar' as const,
    type: 'pdf' as const,
    teacherName: 'Tổ Chuyên Môn',
    fileSize: '2.5 MB',
    downloadUrl: '#',
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument(formData);
    setShowUploadModal(false);
  };

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchCurriculum = filterCurriculum === 'all' || doc.curriculum === filterCurriculum;
    const matchSkill = filterSkill === 'all' || doc.skill === filterSkill;
    return matchSearch && matchCurriculum && matchSkill;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return <Volume2 size={20} className="text-purple-600" />;
      case 'ppt':
        return <Presentation size={20} className="text-amber-600" />;
      case 'video':
        return <Video size={20} className="text-rose-600" />;
      default:
        return <FileText size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            KHO TÀI LIỆU & GIÁO ÁN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ngân hàng đề thi Cambridge, giáo án điện tử, audio nghe, video bài giảng và phiếu bài tập.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Tải lên tài liệu
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài giảng, tài liệu, giáo án..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterCurriculum}
            onChange={e => setFilterCurriculum(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả chương trình</option>
            <option value="Cambridge Primary">Cambridge Primary</option>
            <option value="Cambridge Secondary">Cambridge Secondary</option>
            <option value="Ngữ pháp Chuyên sâu">Ngữ pháp Chuyên sâu</option>
          </select>

          <select
            value={filterSkill}
            onChange={e => setFilterSkill(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="Listening">Listening</option>
            <option value="Speaking">Speaking</option>
            <option value="Reading">Reading</option>
            <option value="Writing">Writing</option>
            <option value="Grammar">Grammar</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getFileIcon(doc.type)}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  {doc.type}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2 mb-2 leading-relaxed">
                {doc.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <p>Khối: <strong className="text-slate-700">{doc.gradeLevel}</strong></p>
                <p>Chương trình: <strong className="text-slate-700">{doc.curriculum}</strong></p>
                <p>Kỹ năng: <strong className="text-blue-600">{doc.skill}</strong> • {doc.unit}</p>
                <p className="text-[11px] text-slate-400">Tải lên: {doc.uploadDate} bởi {doc.teacherName}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{doc.fileSize}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => showToast(`Đang tải xuống tài liệu "${doc.title}"...`)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <Download size={13} /> Tải về
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                  title="Xóa tài liệu"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Tải lên tài liệu học tập</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên tài liệu / Tiêu đề giáo án *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Giáo án Cambridge Starters Unit 4..."
                  className="w-full px-3.5 py-2 border rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={e => setFormData({ ...formData, gradeLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Tiểu học (3-5)">Tiểu học (Khối 3-5)</option>
                    <option value="THCS (6-9)">THCS (Khối 6-9)</option>
                    <option value="Tất cả">Tất cả các khối</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kỹ năng</label>
                  <select
                    value={formData.skill}
                    onChange={e => setFormData({ ...formData, skill: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Grammar">Grammar (Ngữ pháp)</option>
                    <option value="Listening">Listening (Nghe)</option>
                    <option value="Speaking">Speaking (Nói)</option>
                    <option value="Reading">Reading (Đọc)</option>
                    <option value="Writing">Writing (Viết)</option>
                    <option value="Tổng hợp">Tổng hợp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Định dạng file</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="pdf">Tệp PDF (.pdf)</option>
                    <option value="doc">Tài liệu Word (.docx)</option>
                    <option value="ppt">Slide bài giảng (.pptx)</option>
                    <option value="audio">File âm thanh nghe (.mp3)</option>
                    <option value="video">Video minh họa (.mp4)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kích thước file</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Tải lên kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
