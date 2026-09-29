import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';

import { OverviewView } from './components/views/OverviewView';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { ClassesView } from './components/views/ClassesView';
import { SchedulesView } from './components/views/SchedulesView';
import { AttendanceView } from './components/views/AttendanceView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { ScoresView } from './components/views/ScoresView';
import { ProgressView } from './components/views/ProgressView';
import { AlertsView } from './components/views/AlertsView';
import { ParentReportsView } from './components/views/ParentReportsView';
import { TuitionView } from './components/views/TuitionView';
import { NotificationsView } from './components/views/NotificationsView';
import { DocumentsView } from './components/views/DocumentsView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, isSidebarCollapsed } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'classes':
        return <ClassesView />;
      case 'schedules':
        return <SchedulesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'scores':
        return <ScoresView />;
      case 'progress':
        return <ProgressView />;
      case 'alerts':
        return <AlertViewWrapper />;
      case 'parent_reports':
        return <ParentReportsView />;
      case 'tuition':
        return <TuitionView />;
      case 'notifications':
        return <NotificationsView />;
      case 'documents':
        return <DocumentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

// Simple wrapper for alerts view
const AlertViewWrapper: React.FC = () => {
  return <AlertsView />;
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
