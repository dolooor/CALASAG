import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from "../Images/no-bg-logo.png";
import { FaUserCircle, FaBell, FaMoon, FaSun, FaChevronDown, FaChevronLeft, FaChevronRight, FaTable, FaChartBar, FaKey, FaCalendarAlt, FaFileAlt, FaCubes, FaLock, FaUser, FaHome, FaCog, FaDownload, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface Admin {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    lastLogin: string;
    permissions: string[];
}

interface FeatureUpdate {
    id: number;
    name: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
}

interface Report {
    id: number;
    type: 'incident' | 'alert';
    title: string;
    status: 'pending' | 'reviewed' | 'resolved';
    date: string;
    priority: 'high' | 'medium' | 'low';
}

const SuperAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"name": "Super Admin", "email": "superadmin@calasag.com", "role": "Super Administrator"}');

    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
    const [showAddAdmin, setShowAddAdmin] = useState<boolean>(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(false);
    const [showFeatureUpdateModal, setShowFeatureUpdateModal] = useState<boolean>(false);
    const [showReportDetails, setShowReportDetails] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [showProfileSettings, setShowProfileSettings] = useState<boolean>(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingSecurity, setIsEditingSecurity] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        name: currentUser.name,
        email: currentUser.email
    });
    const [securityInfo, setSecurityInfo] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notifications, setNotifications] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsList] = useState([
        { id: 1, message: 'New admin added', time: '2 mins ago' },
        { id: 2, message: 'Incident report resolved', time: '1 hour ago' },
    ]);

    const [featureUpdates, setFeatureUpdates] = useState<FeatureUpdate[]>([
        { id: 1, name: "New Alert System", description: "Implementation of real-time alert system", status: 'pending', date: "2024-03-20" },
        { id: 2, name: "UI Enhancement", description: "Dashboard redesign for better UX", status: 'approved', date: "2024-03-19" },
        { id: 3, name: "Security Update", description: "Critical security patches", status: 'pending', date: "2024-03-18" }
    ]);

    const [reports, setReports] = useState<Report[]>([
        { id: 1, type: 'incident', title: "System Outage Report", status: 'pending', date: "2024-03-20", priority: 'high' },
        { id: 2, type: 'alert', title: "Security Alert Report", status: 'resolved', date: "2024-03-18", priority: 'low' }
    ]);

    const [admins, setAdmins] = useState<Admin[]>([
        { id: 1, name: "Admin One", email: "admin1@calasag.com", status: "active", lastLogin: "2024-03-20 10:30", permissions: ['user_management', 'report_view'] },
        { id: 2, name: "Admin Two", email: "admin2@calasag.com", status: "active", lastLogin: "2024-03-19 15:45", permissions: ['user_management'] },
        { id: 3, name: "Admin Three", email: "admin3@calasag.com", status: "inactive", lastLogin: "2024-03-18 09:15", permissions: ['report_view'] },
    ]);

    // Chart data
    const incidentData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Incidents',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#005524',
                backgroundColor: 'rgba(0, 85, 36, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const adminActivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Active Admins',
                data: [3, 4, 3, 5, 4, 2, 3],
                backgroundColor: '#005524',
            },
        ],
    };

    const reportDistributionData = {
        labels: ['Incidents', 'Alerts'],
        datasets: [
            {
                data: [45, 30],
                backgroundColor: [
                    '#005524',
                    '#f9a01b',
                    '#be4c1d',
                ],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowAddAdmin(false);
    };

    const handleToggleAdminStatus = (adminId: number) => {
        setAdmins(admins.map(admin =>
            admin.id === adminId
                ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
                : admin
        ));
    };

    const handleUpdatePermissions = (adminId: number, permissions: string[]) => {
        setAdmins(admins.map(admin =>
            admin.id === adminId
                ? { ...admin, permissions }
                : admin
        ));
        setShowPermissionsModal(false);
    };

    const handleFeatureUpdate = (updateId: number, status: 'approved' | 'rejected') => {
        setFeatureUpdates(featureUpdates.map(update => {
            if (update.id === updateId) {
                return {
                    ...update,
                    status: status
                };
            }
            return update;
        }));
        setShowFeatureUpdateModal(false);
    };

    const handleReportAction = (reportId: number, action: 'review' | 'resolve') => {
        setReports(reports.map(report => {
            if (report.id === reportId) {
                return {
                    ...report,
                    status: action === 'review' ? 'reviewed' : 'resolved'
                };
            }
            return report;
        }));
        setShowReportDetails(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="space-y-8">
                        {/* Top Metric Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total Admins */}
                            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#005524]/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">TOTAL ADMINS</p>
                                        <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
                                        <p className="text-sm text-green-600 mt-1">+12% since last month</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#005524] to-[#004015] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FaUser size={20} />
                                    </div>
                                </div>
                            </div>
                            {/* Active Admins */}
                            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#f69f00]/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">ACTIVE ADMINS</p>
                                        <p className="text-3xl font-bold text-gray-900">{admins.filter(a => a.status === 'active').length}</p>
                                        <p className="text-sm text-green-600 mt-1">+8% since last week</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#f69f00] to-[#be4c1d] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FaUser size={20} />
                                    </div>
                                </div>
                            </div>
                            {/* Pending Feature Updates */}
                            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">PENDING UPDATES</p>
                                        <p className="text-3xl font-bold text-gray-900">{featureUpdates.filter(fu => fu.status === 'pending').length}</p>
                                        <p className="text-sm text-blue-600 mt-1">+15% this quarter</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FaCog size={20} />
                                    </div>
                                </div>
                            </div>
                            {/* High Priority Reports */}
                            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">HIGH PRIORITY REPORTS</p>
                                        <p className="text-3xl font-bold text-gray-900">{reports.filter(r => r.priority === 'high').length}</p>
                                        <p className="text-sm text-red-600 mt-1">-5% since yesterday</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FaBell size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Incident Trends Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Incident Trends</h3>
                                        <p className="text-sm text-gray-600">4% more in 2024</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                            Week
                                        </button>
                                        <button className="px-3 py-1 text-xs bg-[#005524] text-white rounded-lg">
                                            Month
                                        </button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                            Year
                                        </button>
                                    </div>
                                </div>
                                <div style={{ height: '300px' }}>
                                    <Line data={incidentData} options={{
                                        ...chartOptions, plugins: {
                                            legend: {
                                                position: 'bottom' as const,
                                                labels: {
                                                    usePointStyle: true,
                                                    padding: 20,
                                                },
                                            },
                                        }
                                    }} />
                                </div>
                            </div>

                            {/* Admin Activity Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Admin Activity</h3>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <FaDownload size={16} />
                                    </button>
                                </div>
                                <div style={{ height: '300px' }}>
                                    <Bar data={adminActivityData} options={{
                                        ...chartOptions, plugins: {
                                            legend: {
                                                position: 'bottom' as const,
                                                labels: {
                                                    usePointStyle: true,
                                                    padding: 20,
                                                },
                                            },
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Recent Admins */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Admins</h3>
                                    <button className="text-[#005524] hover:text-[#004015] text-sm font-medium">
                                        View all
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {admins.slice(0, 3).map((admin) => (
                                        <div key={admin.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#005524] to-[#f69f00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{admin.name}</p>
                                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {admin.status === 'active' ? 'ONLINE' : 'OFFLINE'}
                                                </span>
                                                <button className="p-1 text-gray-400 hover:text-[#005524] opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Reports */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                                    <button className="text-[#005524] hover:text-[#004015] text-sm font-medium">
                                        View all
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {reports.slice(0, 3).map((report) => (
                                        <div key={report.id}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setShowReportDetails(true);
                                            }}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${report.priority === 'high' ? 'bg-red-100' :
                                                    report.priority === 'medium' ? 'bg-orange-100' :
                                                        'bg-yellow-100'
                                                    }`}>
                                                    <FaBell size={12} className={
                                                        report.priority === 'high' ? 'text-red-600' :
                                                            report.priority === 'medium' ? 'text-orange-600' :
                                                                'text-yellow-600'
                                                    } />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{report.title}</p>
                                                    <p className="text-sm text-gray-500">{report.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-400">{report.date}</span>
                                                <button className="p-1 text-gray-400 hover:text-[#005524] opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <FaEye size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                                    <button className="text-[#005524] hover:text-[#004015] text-sm font-medium"> Details </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">Security System</span>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">98%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FaUser size={12} className="text-green-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">User Management</span>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">95%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <FaBell size={12} className="text-purple-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">Alert System</span>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">92%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "admin-management":
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">All Admins (Table View)</h2>
                            <button
                                onClick={() => setShowAddAdmin(true)}
                                className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-[#004d20] transition-colors flex items-center gap-2"
                            >
                                <FaPlus size={14} /> Add New Admin
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Permissions</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{admin.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{admin.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {admin.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{admin.lastLogin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <div className="flex flex-wrap gap-1">
                                                    {admin.permissions.map((permission, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 space-x-2">
                                                <button
                                                    onClick={() => { setSelectedAdmin(admin); setShowPermissionsModal(true); }}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                                                >
                                                    <FaEdit size={12} className="inline mr-1" /> Permissions
                                                </button>
                                                <button
                                                    onClick={() => handleToggleAdminStatus(admin.id)}
                                                    className={`px-3 py-1 rounded-lg transition-colors ${admin.status === 'active' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                                >
                                                    <FaLock size={12} className="inline mr-1" /> {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "feature-updates":
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Feature Updates</h2>
                            <button
                                onClick={() => setShowFeatureUpdateModal(true)}
                                className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-[#004d20] transition-colors flex items-center gap-2"
                            >
                                <FaPlus size={14} /> Add New Update
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {featureUpdates.map((update) => (
                                        <tr key={update.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{update.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{update.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${update.status === 'approved' ? 'bg-green-100 text-green-800' : update.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {update.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{update.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 space-x-2">
                                                {update.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleFeatureUpdate(update.id, 'approved')}
                                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleFeatureUpdate(update.id, 'rejected')}
                                                            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "system-reports":
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">System Reports</h2>
                            <button className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-[#004d20] transition-colors flex items-center gap-2">
                                <FaPlus size={14} /> Generate Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.priority === 'high' ? 'bg-red-100 text-red-800' : report.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                    {report.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 space-x-2">
                                                <button
                                                    onClick={() => handleReportAction(report.id, 'review')}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                                                >
                                                    Review
                                                </button>
                                                <button
                                                    onClick={() => handleReportAction(report.id, 'resolve')}
                                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => { setShowReportDetails(true); setSelectedReport(report); }}
                                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                <button
                                    onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                                    className="text-sm font-medium text-[#005524] hover:text-[#004d20]"
                                >
                                    {isEditingPersonal ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                        disabled={!isEditingPersonal}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditingPersonal ? 'bg-gray-100' : 'bg-white'}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={personalInfo.email}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                        disabled={!isEditingPersonal}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${!isEditingPersonal ? 'bg-gray-100' : 'bg-white'}`}
                                    />
                                </div>
                                {isEditingPersonal && (
                                    <div className="flex justify-end">
                                        <button type="button" className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-[#004d20]">
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                        {/* Security Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Security</h3>
                                <button
                                    onClick={() => setIsEditingSecurity(!isEditingSecurity)}
                                    className="text-sm font-medium text-[#005524] hover:text-[#004d20]"
                                >
                                    {isEditingSecurity ? 'Cancel' : 'Change Password'}
                                </button>
                            </div>
                            <form className="space-y-4">
                                {isEditingSecurity && (
                                    <>
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                value={securityInfo.currentPassword}
                                                onChange={(e) => setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                value={securityInfo.newPassword}
                                                onChange={(e) => setSecurityInfo({ ...securityInfo, newPassword: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                value={securityInfo.confirmPassword}
                                                onChange={(e) => setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="button" className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-[#004d20]">
                                                Change Password
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                        {/* General Settings Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                                        <p className="text-sm text-gray-600">Enable/disable notifications</p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${notifications ? 'bg-[#005524]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive email notifications for updates</p>
                                    </div>
                                    <button
                                        onClick={() => setEmailNotifications(!emailNotifications)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${emailNotifications ? 'bg-[#005524]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm z-30 fixed inset-y-0 left-0`}>
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img src={logoImage} alt="CALASAG Logo" className="h-8 w-auto object-contain" />
                        {!isSidebarCollapsed && (<span className="text-lg font-semibold">CALASAG</span>)}
                    </div>
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        {isSidebarCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1 p-4 bg-white/60 backdrop-blur-sm rounded-r-3xl shadow-inner border-r border-gray-100">
                    <div className="mb-2">
                        <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${isSidebarCollapsed ? 'text-center' : 'ml-3'}`}>
                            {/* Navigation */}
                        </h3>
                    </div>

                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-r-full transition-all duration-200 text-sm font-medium overflow-hidden group
                        ${activeTab === "dashboard" ? 'bg-[#E7F6EE] text-[#005524]' : 'text-gray-700 hover:bg-[#F1FAF4] hover:text-[#005524]'}
                        `}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-[#005524]' : 'bg-transparent group-hover:bg-[#CDE6D3]'}`} />
                        <div className="relative flex items-center gap-3 z-10">
                            <FaHome size={18} />
                            {!isSidebarCollapsed && 'Dashboard'}
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("admin-management")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-r-full transition-all duration-200 text-sm font-medium group
                        ${activeTab === 'admin-management' ? 'bg-[#E7F6EE] text-[#005524]' : 'text-gray-700 hover:bg-[#F1FAF4] hover:text-[#005524]'}
                        ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-200 ${activeTab === 'admin-management' ? 'bg-[#005524]' : 'bg-transparent group-hover:bg-[#CDE6D3]'}`} />
                        <div className="relative flex items-center gap-3 z-10">
                            <FaUser size={18} />
                            {!isSidebarCollapsed && 'Admin Management'}
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("feature-updates")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-r-full transition-all duration-200 text-sm font-medium group
                        ${activeTab === 'feature-updates' ? 'bg-[#E7F6EE] text-[#005524]' : 'text-gray-700 hover:bg-[#F1FAF4] hover:text-[#005524]'}
                        `}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-200 ${activeTab === 'feature-updates' ? 'bg-[#005524]' : 'bg-transparent group-hover:bg-[#CDE6D3]'}`} />
                        <div className="relative flex items-center gap-3 z-10">
                            <FaCubes size={18} />
                            {!isSidebarCollapsed && 'Feature Updates'}
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("system-reports")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-r-full transition-all duration-200 text-sm font-medium group
                        ${activeTab === 'system-reports' ? 'bg-[#E7F6EE] text-[#005524]' : 'text-gray-700 hover:bg-[#F1FAF4] hover:text-[#005524]'}
                        `}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-200 ${activeTab === 'system-reports' ? 'bg-[#005524]' : 'bg-transparent group-hover:bg-[#CDE6D3]'}`} />
                        <div className="relative flex items-center gap-3 z-10">
                            <FaFileAlt size={18} />
                            {!isSidebarCollapsed && 'System Reports'}
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-r-full transition-all duration-200 text-sm font-medium group
                        ${activeTab === 'settings' ? 'bg-[#E7F6EE] text-[#005524]' : 'text-gray-700 hover:bg-[#F1FAF4] hover:text-[#005524]'}
                        `}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-200 ${activeTab === 'settings' ? 'bg-[#005524]' : 'bg-transparent group-hover:bg-[#CDE6D3]'}`} />
                        <div className="relative flex items-center gap-3 z-10">
                            <FaCog size={18} />
                            {!isSidebarCollapsed && 'Settings'}
                        </div>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200 group"
                    >
                        <FaLock size={18} />
                        {!isSidebarCollapsed && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                {/* Header */}
                <header className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>Dashboard</span>
                                                    <FaChevronRight size={12} />
                                                    <span className="text-gray-900 font-medium">
                                                        {activeTab === 'admin-management' && 'Admin Management'}
                                                        {activeTab === 'feature-updates' && 'Feature Updates'}
                                                        {activeTab === 'system-reports' && 'System Reports'}
                                                        {activeTab === 'settings' && 'Settings'}
                                                    </span>
                                                </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications((prev) => !prev)}
                                className="text-gray-400 hover:text-gray-600 transition-colors relative"
                            >
                                <FaBell size={18} />
                                {notificationsList.length > 0 && (
                                    <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notificationsList.length > 0 ? (
                                            notificationsList.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                                >
                                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-center text-gray-500">
                                                No new notifications
                                            </div>
                                        )}
                                    </div>
                                    {notificationsList.length > 0 && (
                                        <div className="px-4 py-2 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    // clear notifications
                                                    // keep behavior non-destructive here for example
                                                    setShowNotifications(false);
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-700 w-full text-center"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfileSettings(true)}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=005524&color=fff`}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full border border-gray-200"
                                />
                                <span className="hidden md:inline text-gray-700 font-medium">{currentUser.name}</span>
                            </button>
                        </div>
                    </div>
                </header>
                {/* Content */}
                <main className="p-8">
                    {renderContent()}
                </main>
            </div>

            {/* Modals */}
            {/* Add New Admin Modal */}
            {showAddAdmin && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#005524] mb-4">Add New Admin</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="adminName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="adminEmail" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="adminPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAdmin(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                                    Add Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Permissions Modal */}
            {showPermissionsModal && selectedAdmin && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#005524] mb-4">Edit Permissions for {selectedAdmin.name}</h2>
                        <div className="space-y-4">
                            {['user_management', 'report_view', 'settings_access'].map(permission => (
                                <div key={permission} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={permission}
                                        checked={selectedAdmin.permissions.includes(permission)}
                                        onChange={(e) => {
                                            const newPermissions = e.target.checked
                                                ? [...selectedAdmin.permissions, permission]
                                                : selectedAdmin.permissions.filter(p => p !== permission);
                                            setSelectedAdmin({ ...selectedAdmin, permissions: newPermissions });
                                        }}
                                        className="h-4 w-4 text-[#005524] border-gray-300 rounded focus:ring-[#005524]"
                                    />
                                    <label htmlFor={permission} className="ml-3 block text-sm font-medium text-gray-700">
                                        {permission.replace(/_/g, ' ')}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowPermissionsModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdatePermissions(selectedAdmin.id, selectedAdmin.permissions)}
                                className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Feature Update Modal */}
            {showFeatureUpdateModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#005524] mb-4">Add Feature Update</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="updateName" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="updateName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label htmlFor="updateDesc" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="updateDesc" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required></textarea>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowFeatureUpdateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                                    Add Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Details Modal */}
            {showReportDetails && selectedReport && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#005524] mb-4">Report Details</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedReport.title}</h3>
                                <p className="text-sm text-gray-600">Type: {selectedReport.type}</p>
                                <p className="text-sm text-gray-600">Status: {selectedReport.status}</p>
                                <p className="text-sm text-gray-600">Priority: {selectedReport.priority}</p>
                                <p className="text-sm text-gray-600">Date: {selectedReport.date}</p>
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowReportDetails(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#005524] mb-4">Confirm Logout</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-[#005524] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;