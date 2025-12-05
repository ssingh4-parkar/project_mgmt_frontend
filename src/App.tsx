import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import UserManagementPage from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import TaskManagement from './pages/TaskManagement';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';

// Layout component handles sidebar visibility and routing based on login status
function AppLayout() {
    const { user, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (isLoading) { return <div className="flex items-center justify-center h-screen">Loading application...</div>; }

    if (user) {
         return (
            <div className="flex h-screen overflow-hidden bg-gray-100">
                
                <Sidebar isOpen={isSidebarOpen} />
                
                {/* A single fixed button positioned at the middle-left edge, handling both show/hide */}
                <button 
                    onClick={toggleSidebar} 
                    className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r-lg shadow-lg z-30 hover:bg-gray-700 transition duration-300"
                    title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                >
                    {/* Icon changes based on state */}
                    {isSidebarOpen ? '◀️' : '▶️'} 
                </button>

                {/* Main content area: Uses dynamic margin to prevent content overlap */}
                <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/users" element={<UserManagementPage />} />
                        <Route path="/roles" element={<RoleManagement />} />
                        <Route path="/tasks" element={<TaskManagement />} />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/login" element={<Navigate to="/home" replace />} />
                        <Route path="/signup" element={<Navigate to="/home" replace />} />
                    </Routes>
                </main>
            </div>
        );
    }
    
    // If not logged in, only show public auth pages
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Redirect all other routes to login if not authenticated */}
            <Route path="*" element={<LoginPage />} /> 
        </Routes>
    );
}

// Main App wrapped in provider
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </Router>
    );
}

export default App;
