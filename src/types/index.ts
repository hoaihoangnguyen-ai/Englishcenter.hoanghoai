export type UserRole = 'manager' | 'teacher' | 'staff' | 'student' | 'parent';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  phone: string;
  avatar: string;
  studentId?: string; // If role is student or parent
  teacherId?: string; // If role is teacher
}

export type SkillScores = {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  grammar?: number;
  vocab?: number;
};

export interface Student {
  id: string;
  code: string;
  fullName: string;
  birthDate: string;
  gender: 'Nam' | 'Nữ';
  school: string;
  schoolGrade: string; // e.g. "Lớp 6"
  centerClassId: string;
  centerClassName: string;
  level: string; // e.g. "Cambridge A1", "Cambridge A2", "Pre-A1", "KET"
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: 'active' | 'reserved' | 'stopped' | 'archived';
  enrollDate: string;
  avatar: string;
  address: string;
  baselineLevel: string;
  targetLevel: string;
  baselineScores: SkillScores;
  currentScores: SkillScores;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
}

export interface Teacher {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string;
  qualifications: string[]; // e.g. "Cử nhân ĐH Sư Phạm Ngoại Ngữ", "IELTS 8.0", "TESOL Certificate"
  specializations: string[];
  assignedClassIds: string[];
  workingStatus: 'full-time' | 'part-time';
  completionRate: number; // e.g. 96%
  attendanceRate: number; // 98%
  gradingSpeedDays: number; // 1.2 ngày
  avatar: string;
  bio: string;
  joinDate: string;
  rating: number; // 4.9 / 5.0
  observationNotes?: string;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  program: string; // "Tiểu học Cambridge", "THCS Nâng cao", "Luyện thi Chuyên"
  level: string;
  teacherId: string;
  teacherName: string;
  assistantName: string;
  room: string;
  startDate: string;
  scheduleDays: string; // "Thứ 2 - Thứ 5: 17:30 - 19:00"
  currentStudents: number;
  maxStudents: number;
  tuitionPerMonth: number;
  status: 'active' | 'upcoming' | 'completed';
  totalLessons: number;
  completedLessons: number;
  description: string;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  className: string;
  room: string;
  teacherId: string;
  teacherName: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'makeup';
  topic: string;
}

export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused' | 'makeup';

export interface AttendanceRecord {
  id: string;
  scheduleId: string;
  classId: string;
  date: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
  recordedBy: string;
  recordedAt: string;
}

export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'late' | 'graded' | 'resubmit';

export interface Assignment {
  id: string;
  code: string;
  title: string;
  classId: string;
  className: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachmentType?: 'pdf' | 'doc' | 'audio' | 'video' | 'link';
  attachmentName?: string;
  attachmentUrl?: string;
  type: 'multiple_choice' | 'fill_in' | 'reading_writing' | 'speaking';
  difficulty: 'basic' | 'advanced';
  allowsRetry: boolean;
  totalSubmissions: number;
  totalStudents: number;
  gradedCount: number;
  isTemplate?: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  status: AssignmentStatus;
  score?: number;
  maxScore: number;
  feedback?: string;
  studentSubmissionText?: string;
  audioRecordingUrl?: string;
  retryCount: number;
}

export interface TestScore {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  testTitle: string;
  testDate: string;
  type: 'midterm' | 'final' | 'monthly' | 'placement';
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  grammarVocab: number;
  attitude: number;
  homeworkCompletion: number;
  totalWeightedScore: number;
  isLocked: boolean;
  notes?: string;
}

export type AlertIssue = 
  | 'absent_2_sessions' 
  | 'missing_homework' 
  | 'score_dropped' 
  | 'low_skill_score' 
  | 'distracted' 
  | 'need_parent_contact';

export type AlertStatus = 'new' | 'monitoring' | 'need_contact' | 'in_progress' | 'resolved';

export interface AlertStepHistory {
  step: number;
  title: string;
  timestamp: string;
  performedBy: string;
  notes: string;
}

export interface StudentAlert {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  classId: string;
  className: string;
  issue: AlertIssue;
  issueText: string;
  status: AlertStatus;
  teacherInCharge: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number; // 1 to 9
  history: AlertStepHistory[];
  resolutionNotes?: string;
}

export interface ParentReport {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  classId: string;
  className: string;
  period: 'weekly' | 'monthly' | 'term';
  periodLabel: string;
  totalLessons: number;
  attendedLessons: number;
  attendanceRate: number;
  homeworkRate: number;
  testScoreAvg: number;
  skills: SkillScores;
  strengths: string;
  areasToImprove: string;
  teacherComment: string;
  homeRecommendations: string;
  homePractices?: string;
  nextGoals: string;
  status: 'draft' | 'approved' | 'sent' | 'viewed';
  parentFeedback?: string;
  approvedBy?: string;
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
}

export interface TuitionRecord {
  id: string;
  code: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  month: string;
  standardFee: number;
  discount: number;
  discountReason?: string;
  payableAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  paymentDate?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'vnpay_momo';
  remainingLessons: number;
  receiptNumber?: string;
  notes?: string;
}

export interface CenterNotification {
  id: string;
  title: string;
  content: string;
  category: 'new_class' | 'exam' | 'tuition' | 'schedule' | 'urgent' | 'general';
  targetAudience: 'all' | 'class' | 'teachers' | 'parents' | 'students';
  targetName?: string;
  createdAt: string;
  timeAgo: string;
  author: string;
  isRead: boolean;
  readCount: number;
  totalRecipients?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  gradeLevel: 'Tiểu học (3-5)' | 'THCS (6-9)' | 'Tất cả';
  curriculum: 'Cambridge Primary' | 'Cambridge Secondary' | 'Ngữ pháp Chuyên sâu' | 'IELTS Junior';
  unit: string;
  skill: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Grammar' | 'Tổng hợp';
  type: 'pdf' | 'doc' | 'ppt' | 'excel' | 'audio' | 'video' | 'link';
  teacherName: string;
  uploadDate: string;
  fileSize: string;
  downloadUrl: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  target: string;
  badgeColor?: string;
}
