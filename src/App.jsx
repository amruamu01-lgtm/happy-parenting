import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StudentParentRegistration from './pages/StudentParentRegistration';
import NormalGuestRegistration from './pages/NormalGuestRegistration';
import RegistrationSuccess from './pages/RegistrationSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import RegistrationManagement from './pages/RegistrationManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import ReportsExport from './pages/ReportsExport';
import AdminSettings from './pages/AdminSettings';
import { apiService } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [adminUser, setAdminUser] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [selectedRegForAdmin, setSelectedRegForAdmin] = useState(null);

  // Check existing admin session on mount
  useEffect(() => {
    const session = apiService.getAuthSession();
    if (session) {
      setAdminUser(session);
    }
  }, []);

  const handleLoginSuccess = (admin) => {
    setAdminUser(admin);
    setActivePage('admin-dashboard');
  };

  const handleLogout = () => {
    apiService.logout();
    setAdminUser(null);
    setActivePage('home');
  };

  const isAdminPage = activePage.startsWith('admin-') && activePage !== 'admin-login';

  // Guard protected admin routes
  if (isAdminPage && !adminUser) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between">
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isAdminLoggedIn={false} 
          onLogout={handleLogout} 
        />
        <AdminLogin 
          setActivePage={setActivePage} 
          onLoginSuccess={handleLoginSuccess} 
        />
        <Footer setActivePage={setActivePage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-text-primary">
      
      {/* If Admin Page, show AdminLayout */}
      {isAdminPage ? (
        <AdminLayout
          activePage={activePage}
          setActivePage={setActivePage}
          adminUser={adminUser}
          onLogout={handleLogout}
        >
          {activePage === 'admin-dashboard' && (
            <AdminDashboard 
              setActivePage={setActivePage} 
              onSelectRegistration={setSelectedRegForAdmin} 
            />
          )}
          {activePage === 'admin-registrations' && (
            <RegistrationManagement 
              adminUser={adminUser} 
            />
          )}
          {activePage === 'admin-attendance' && (
            <AttendanceManagement 
              adminUser={adminUser} 
            />
          )}
          {activePage === 'admin-reports' && (
            <ReportsExport />
          )}
          {activePage === 'admin-settings' && (
            <AdminSettings />
          )}
        </AdminLayout>
      ) : (
        /* Public Pages */
        <>
          <Navbar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            isAdminLoggedIn={!!adminUser} 
            onLogout={handleLogout} 
          />

          <main className="flex-1">
            {activePage === 'home' && (
              <HomePage setActivePage={setActivePage} />
            )}

            {activePage === 'student-parent-register' && (
              <StudentParentRegistration 
                setActivePage={setActivePage} 
                setSuccessData={setSuccessData} 
              />
            )}

            {activePage === 'normal-guest-register' && (
              <NormalGuestRegistration 
                setActivePage={setActivePage} 
                setSuccessData={setSuccessData} 
              />
            )}

            {activePage === 'registration-success' && (
              <RegistrationSuccess 
                registrationData={successData} 
                setActivePage={setActivePage} 
              />
            )}

            {activePage === 'admin-login' && (
              <AdminLogin 
                setActivePage={setActivePage} 
                onLoginSuccess={handleLoginSuccess} 
              />
            )}
          </main>

          <Footer setActivePage={setActivePage} />
        </>
      )}

    </div>
  );
}
