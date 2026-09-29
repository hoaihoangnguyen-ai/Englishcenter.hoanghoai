import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  ClassItem,
  ScheduleItem,
  Assignment,
  TestScore,
  StudentAlert,
  ParentReport,
  TuitionRecord,
  CenterNotification,
  DocumentItem,
  ActivityLog,
  CurrentUser,
  AttendanceRecord,
  AttendanceStatus
} from '../types';
import {
  INITIAL_USER,
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_SCHEDULES,
  INITIAL_STUDENT_ALERTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TEST_SCORES,
  INITIAL_PARENT_REPORTS,
  INITIAL_TUITION,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITY_LOGS
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  demoUsers: CurrentUser[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Data
  students: Student[];
  teachers: Teacher[];
  classes: ClassItem[];
  schedules: ScheduleItem[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  testScores: TestScore[];
  studentAlerts: StudentAlert[];
  parentReports: ParentReport[];
  tuitionRecords: TuitionRecord[];
  notifications: CenterNotification[];
  documents: DocumentItem[];
  activityLogs: ActivityLog[];

  // Modals & Selection
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  selectedClass: ClassItem | null;
  setSelectedClass: (cls: ClassItem | null) => void;
  selectedTeacher: Teacher | null;
  setSelectedTeacher: (teacher: Teacher | null) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'code'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  archiveStudent: (id: string) => void;
  restoreStudent: (id: string) => void;
  transferStudentClass: (studentId: string, newClassId: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id' | 'code'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;

  addClass: (cls: Omit<ClassItem, 'id' | 'code'>) => void;
  updateClass: (id: string, updates: Partial<ClassItem>) => void;

  addSchedule: (sch: Omit<ScheduleItem, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => void;

  recordAttendance: (classId: string, date: string, studentId: string, status: AttendanceStatus, note?: string) => void;
  batchRecordAttendance: (records: { studentId: string; studentName: string; status: AttendanceStatus; note?: string }[], classId: string, date: string) => void;

  addAssignment: (asn: Omit<Assignment, 'id' | 'code' | 'totalSubmissions' | 'gradedCount'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;

  addTestScore: (score: Omit<TestScore, 'id'>) => void;
  updateTestScore: (id: string, updates: Partial<TestScore>) => void;

  advanceAlertStep: (alertId: string, note?: string) => void;
  updateAlertStatus: (alertId: string, status: StudentAlert['status'], resolutionNotes?: string) => void;

  createParentReport: (report: Omit<ParentReport, 'id' | 'createdAt'>) => void;
  approveParentReport: (reportId: string) => void;
  sendParentReport: (reportId: string) => void;
  acknowledgeParentReport: (reportId: string, feedback: string) => void;

  recordTuitionPayment: (id: string, amount: number, method: 'bank_transfer' | 'cash' | 'vnpay_momo', notes?: string) => void;
  sendTuitionReminder: (id: string) => void;

  addNotification: (notif: Omit<CenterNotification, 'id' | 'createdAt' | 'timeAgo' | 'readCount' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  deleteDocument: (id: string) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('hoanghoai_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2025-04-17');

  // Entities
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('hoanghoai_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('hoanghoai_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem('hoanghoai_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('hoanghoai_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('hoanghoai_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [testScores, setTestScores] = useState<TestScore[]>(() => {
    const saved = localStorage.getItem('hoanghoai_scores');
    return saved ? JSON.parse(saved) : INITIAL_TEST_SCORES;
  });

  const [studentAlerts, setStudentAlerts] = useState<StudentAlert[]>(() => {
    const saved = localStorage.getItem('hoanghoai_alerts');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_ALERTS;
  });

  const [parentReports, setParentReports] = useState<ParentReport[]>(() => {
    const saved = localStorage.getItem('hoanghoai_reports');
    return saved ? JSON.parse(saved) : INITIAL_PARENT_REPORTS;
  });

  const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>(() => {
    const saved = localStorage.getItem('hoanghoai_tuition');
    return saved ? JSON.parse(saved) : INITIAL_TUITION;
  });

  const [notifications, setNotifications] = useState<CenterNotification[]>(() => {
    const saved = localStorage.getItem('hoanghoai_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('hoanghoai_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('hoanghoai_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Modals / Details
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (action: string, target: string, badgeColor: string = 'blue') => {
    const now = new Date();
    const time = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      time,
      user: currentUser.name,
      role: currentUser.roleTitle,
      action,
      target,
      badgeColor,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('hoanghoai_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hoanghoai_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hoanghoai_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('hoanghoai_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('hoanghoai_alerts', JSON.stringify(studentAlerts));
  }, [studentAlerts]);

  useEffect(() => {
    localStorage.setItem('hoanghoai_tuition', JSON.stringify(tuitionRecords));
  }, [tuitionRecords]);

  // Actions implementation
  const addStudent = (data: Omit<Student, 'id' | 'code'>) => {
    const nextNum = students.length + 1001;
    const newStudent: Student = {
      ...data,
      id: `hs_${Date.now()}`,
      code: `HS-${nextNum}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    logActivity('Thêm mới học sinh', `${newStudent.fullName} (${newStudent.code})`, 'emerald');
    showToast(`Đã thêm thành công học sinh ${newStudent.fullName}!`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logActivity('Cập nhật hồ sơ học sinh', `Mã HS: ${id}`, 'blue');
    showToast('Đã lưu thay đổi hồ sơ học sinh!');
  };

  const archiveStudent = (id: string) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status: 'archived' } : s)));
    logActivity('Lưu trữ hồ sơ học sinh', `ID: ${id}`, 'amber');
    showToast('Đã chuyển hồ sơ học sinh vào mục Lưu trữ.');
  };

  const restoreStudent = (id: string) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status: 'active' } : s)));
    logActivity('Khôi phục hồ sơ học sinh', `ID: ${id}`, 'emerald');
    showToast('Đã khôi phục trạng thái học tập của học sinh.');
  };

  const transferStudentClass = (studentId: string, newClassId: string) => {
    const targetClass = classes.find(c => c.id === newClassId);
    if (!targetClass) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          centerClassId: newClassId,
          centerClassName: targetClass.code,
        };
      }
      return s;
    }));
    logActivity('Chuyển lớp học sinh', `Chuyển sang lớp ${targetClass.name}`, 'blue');
    showToast(`Đã chuyển học sinh sang lớp ${targetClass.code} thành công.`);
  };

  const addTeacher = (data: Omit<Teacher, 'id' | 'code'>) => {
    const nextNum = teachers.length + 1;
    const newTeacher: Teacher = {
      ...data,
      id: `gv_${Date.now()}`,
      code: `GV-${nextNum.toString().padStart(2, '0')}`,
    };
    setTeachers(prev => [...prev, newTeacher]);
    logActivity('Thêm giáo viên mới', `${newTeacher.fullName}`, 'emerald');
    showToast(`Đã thêm giáo viên ${newTeacher.fullName}!`);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    logActivity('Cập nhật thông tin giáo viên', `ID: ${id}`, 'blue');
    showToast('Đã cập nhật thông tin giáo viên thành công.');
  };

  const addClass = (data: Omit<ClassItem, 'id' | 'code'>) => {
    const newClass: ClassItem = {
      ...data,
      id: `cls_${Date.now()}`,
      code: `CLS-${classes.length + 1}`,
    };
    setClasses(prev => [...prev, newClass]);
    logActivity('Mở lớp học mới', `${newClass.name} (${newClass.code})`, 'emerald');
    showToast(`Đã tạo lớp ${newClass.code} thành công!`);
  };

  const updateClass = (id: string, updates: Partial<ClassItem>) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    logActivity('Cập nhật thông tin lớp học', `ID: ${id}`, 'blue');
    showToast('Đã lưu thay đổi lớp học.');
  };

  const addSchedule = (data: Omit<ScheduleItem, 'id'>) => {
    const newSchedule: ScheduleItem = {
      ...data,
      id: `sch_${Date.now()}`,
    };
    setSchedules(prev => [...prev, newSchedule]);
    logActivity('Thêm buổi học', `${newSchedule.className} lúc ${newSchedule.startTime}`, 'emerald');
    showToast('Đã xếp lịch buổi học thành công.');
  };

  const updateSchedule = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logActivity('Điều chỉnh lịch học', `ID: ${id}`, 'amber');
    showToast('Đã cập nhật lịch học.');
  };

  const recordAttendance = (classId: string, date: string, studentId: string, status: AttendanceStatus, note?: string) => {
    const student = students.find(s => s.id === studentId);
    const newRec: AttendanceRecord = {
      id: `att_${Date.now()}`,
      scheduleId: 'sch_active',
      classId,
      date,
      studentId,
      studentName: student?.fullName || 'Học sinh',
      status,
      note,
      recordedBy: currentUser.name,
      recordedAt: new Date().toISOString(),
    };
    setAttendanceRecords(prev => [newRec, ...prev]);
  };

  const batchRecordAttendance = (records: { studentId: string; studentName: string; status: AttendanceStatus; note?: string }[], classId: string, date: string) => {
    const newRecords: AttendanceRecord[] = records.map(r => ({
      id: `att_${Date.now()}_${r.studentId}`,
      scheduleId: 'sch_active',
      classId,
      date,
      studentId: r.studentId,
      studentName: r.studentName,
      status: r.status,
      note: r.note,
      recordedBy: currentUser.name,
      recordedAt: new Date().toISOString(),
    }));
    setAttendanceRecords(prev => [...newRecords, ...prev]);
    logActivity('Điểm danh lớp', `Lớp ID ${classId} ngày ${date}`, 'emerald');
    showToast(`Đã lưu điểm danh cho ${records.length} học sinh thành công!`);
  };

  const addAssignment = (data: Omit<Assignment, 'id' | 'code' | 'totalSubmissions' | 'gradedCount'>) => {
    const targetClass = classes.find(c => c.id === data.classId);
    const newAsn: Assignment = {
      ...data,
      id: `asn_${Date.now()}`,
      code: `HW-${targetClass?.code || 'CL'}-${assignments.length + 1}`,
      totalSubmissions: 0,
      gradedCount: 0,
    };
    setAssignments(prev => [newAsn, ...prev]);
    logActivity('Giao bài tập mới', `${newAsn.title}`, 'emerald');
    showToast(`Đã giao bài tập "${newAsn.title}" cho lớp!`);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Đã cập nhật bài tập.');
  };

  const addTestScore = (data: Omit<TestScore, 'id'>) => {
    const newScore: TestScore = {
      ...data,
      id: `ts_${Date.now()}`,
    };
    setTestScores(prev => [newScore, ...prev]);
    logActivity('Nhập điểm kiểm tra', `${newScore.studentName} - ${newScore.testTitle}`, 'emerald');
    showToast(`Đã lưu điểm thi của học sinh ${newScore.studentName}!`);
  };

  const updateTestScore = (id: string, updates: Partial<TestScore>) => {
    setTestScores(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Đã lưu thay đổi bảng điểm.');
  };

  const advanceAlertStep = (alertId: string, note?: string) => {
    setStudentAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        const nextStep = Math.min(alert.currentStep + 1, 9);
        const stepTitles = [
          '',
          'Ghi nhận vấn đề',
          'Phân công giáo viên phụ trách',
          'Trao đổi với học sinh',
          'Giao bài bổ trợ',
          'Liên hệ phụ huynh',
          'Sắp xếp phụ đạo nếu cần',
          'Đặt ngày kiểm tra lại',
          'Ghi nhận kết quả',
          'Đóng cảnh báo khi học sinh đã cải thiện',
        ];
        const newHistoryItem = {
          step: nextStep,
          title: stepTitles[nextStep] || `Bước ${nextStep}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          performedBy: currentUser.name,
          notes: note || 'Đã tiến hành xử lý theo quy trình.',
        };
        const updatedStatus = nextStep === 9 ? 'resolved' : nextStep >= 5 ? 'in_progress' : alert.status;
        return {
          ...alert,
          currentStep: nextStep,
          status: updatedStatus,
          history: [...alert.history, newHistoryItem],
          updatedAt: new Date().toLocaleString('vi-VN'),
        };
      }
      return alert;
    }));
    showToast('Đã chuyển sang bước quy trình tiếp theo.');
  };

  const updateAlertStatus = (alertId: string, status: StudentAlert['status'], resolutionNotes?: string) => {
    setStudentAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status,
          resolutionNotes: resolutionNotes || a.resolutionNotes,
          updatedAt: new Date().toLocaleString('vi-VN'),
        };
      }
      return a;
    }));
    logActivity('Cập nhật trạng thái hỗ trợ', `Mã alert: ${alertId}`, 'blue');
    showToast('Đã cập nhật tình trạng hỗ trợ học sinh.');
  };

  const createParentReport = (data: Omit<ParentReport, 'id' | 'createdAt'>) => {
    const newReport: ParentReport = {
      ...data,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setParentReports(prev => [newReport, ...prev]);
    logActivity('Tạo báo cáo phụ huynh', `Học sinh: ${newReport.studentName}`, 'emerald');
    showToast('Đã tạo phiếu báo cáo học tập thành công!');
  };

  const approveParentReport = (reportId: string) => {
    setParentReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: 'approved', approvedBy: currentUser.name } : r)));
    logActivity('Duyệt báo cáo học tập', `Report ID: ${reportId}`, 'blue');
    showToast('Quản lý đã duyệt báo cáo!');
  };

  const sendParentReport = (reportId: string) => {
    setParentReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: 'sent', sentAt: new Date().toLocaleString('vi-VN') } : r)));
    logActivity('Gửi báo cáo phụ huynh', `Gửi qua Zalo & Portal`, 'emerald');
    showToast('Đã gửi báo cáo cho phụ huynh thành công.');
  };

  const acknowledgeParentReport = (reportId: string, feedback: string) => {
    setParentReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: 'viewed', parentFeedback: feedback, viewedAt: new Date().toLocaleString('vi-VN') } : r)));
    logActivity('Phụ huynh phản hồi báo cáo', `Góp ý: ${feedback}`, 'emerald');
    showToast('Đã lưu phản hồi của phụ huynh!');
  };

  const recordTuitionPayment = (id: string, amount: number, method: 'bank_transfer' | 'cash' | 'vnpay_momo', notes?: string) => {
    setTuitionRecords(prev => prev.map(t => {
      if (t.id === id) {
        const newPaid = t.paidAmount + amount;
        const newStatus = newPaid >= t.payableAmount ? 'paid' : 'partial';
        return {
          ...t,
          paidAmount: newPaid,
          status: newStatus,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: method,
          receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: notes || t.notes,
        };
      }
      return t;
    }));
    logActivity('Thu học phí', `Ghi nhận thanh toán ${amount.toLocaleString('vi-VN')} đ`, 'emerald');
    showToast('Đã lập phiếu thu học phí thành công!');
  };

  const sendTuitionReminder = (id: string) => {
    const record = tuitionRecords.find(t => t.id === id);
    if (!record) return;
    logActivity('Gửi nhắc nộp học phí', `Gửi SMS/Zalo tới PH ${record.parentName} (${record.parentPhone})`, 'amber');
    showToast(`Đã gửi thông báo nhắc học phí tới phụ huynh ${record.parentName}!`);
  };

  const addNotification = (data: Omit<CenterNotification, 'id' | 'createdAt' | 'timeAgo' | 'readCount' | 'isRead'>) => {
    const newNotif: CenterNotification = {
      ...data,
      totalRecipients: data.totalRecipients || 486,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      timeAgo: 'Vừa xong',
      readCount: 0,
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    logActivity('Phát thông báo trung tâm', `${newNotif.title}`, 'blue');
    showToast('Đã gửi thông báo đến các đối tượng nhận.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu đã đọc tất cả thông báo.');
  };

  const addDocument = (data: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...data,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity('Tải lên tài liệu', `${newDoc.title}`, 'emerald');
    showToast('Đã thêm tài liệu học tập thành công!');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    logActivity('Xóa tài liệu', `ID: ${id}`, 'amber');
    showToast('Đã xóa tài liệu khỏi hệ thống.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        demoUsers: DEMO_USERS,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,

        students,
        teachers,
        classes,
        schedules,
        attendanceRecords,
        assignments,
        testScores,
        studentAlerts,
        parentReports,
        tuitionRecords,
        notifications,
        documents,
        activityLogs,

        selectedStudent,
        setSelectedStudent,
        selectedClass,
        setSelectedClass,
        selectedTeacher,
        setSelectedTeacher,

        addStudent,
        updateStudent,
        archiveStudent,
        restoreStudent,
        transferStudentClass,

        addTeacher,
        updateTeacher,

        addClass,
        updateClass,

        addSchedule,
        updateSchedule,

        recordAttendance,
        batchRecordAttendance,

        addAssignment,
        updateAssignment,

        addTestScore,
        updateTestScore,

        advanceAlertStep,
        updateAlertStatus,

        createParentReport,
        approveParentReport,
        sendParentReport,
        acknowledgeParentReport,

        recordTuitionPayment,
        sendTuitionReminder,

        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        addDocument,
        deleteDocument,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
