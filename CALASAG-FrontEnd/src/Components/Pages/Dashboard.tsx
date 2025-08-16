import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaExclamationTriangle,
  FaCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaFire,
  FaShieldAlt,
  FaCarCrash,
  FaAmbulance,
  FaHeart,
  FaShare,
  FaComment,
  FaEllipsisH,
} from "react-icons/fa";
import logoImage from "../Images/no-bg-logo.png";
import mapImage from "../Images/ph-map.png";

interface Location {
  lat: number;
  lng: number;
}

interface Emergency {
  id: number;
  name: string;
  avatar: string;
  emergency: string;
  message: string;
  location: Location;
}

interface Connection {
  id: number;
  name: string;
  avatar: string;
}

interface Type {
  id: number;
  name: string;
  content: string;
  icon: string;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface CrisisAlert {
  type: string;
  reporter: string;
  isSelf: boolean;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState<string>("Juan Dela Cruz");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLocationView, setShowLocationView] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null
  );
  const [showCallConfirm, setShowCallConfirm] = useState<boolean>(false);
  const [showReportConfirm, setShowReportConfirm] = useState<boolean>(false);
  const [showAlertConfirm, setShowAlertConfirm] = useState<boolean>(false);
  const [selectedAlertType, setSelectedAlertType] = useState<string | null>(
    null
  );
  const [selectedEmergencyForAction, setSelectedEmergencyForAction] =
    useState<Emergency | null>(null);
  const [isSafe, setIsSafe] = useState<boolean>(false);
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert>({
    type: "Fire",
    reporter: "Justine Mae Dolor",
    isSelf: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatRecipient, setCurrentChatRecipient] = useState<string>("");
  const [showChatList, setShowChatList] = useState<boolean>(true);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [connectionTab, setConnectionTab] = useState<"profile" | "message">(
    "profile"
  );
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  // State for Safety Tips Modal
  const [showSafetyTipModal, setShowSafetyTipModal] = useState<boolean>(false);
  const [selectedSafetyTip, setSelectedSafetyTip] = useState<Type | null>(null);

  const [emergencies, setEmergencies] = useState<Emergency[]>([
    {
      id: 1,
      name: "Jonathan Ray Sicat",
      avatar: "/avatars/myah.png",
      emergency: "Needs Ambulance - Medical Emergency",
      message: "I AM INVOLVED IN A MOTORCYCLE ACCIDENT!!!",
      location: { lat: 13.767783, lng: 121.063503 },
    },
    {
      id: 2,
      name: "Dawn Emmanuel Aguila",
      avatar: "/avatars/olli.png",
      emergency: "Reporting Incident",
      message: "Car Crash at SLEX",
      location: { lat: 13.788724, lng: 121.060253 },
    },
    {
      id: 3,
      name: "Justine Mae Dolor",
      avatar: "/avatars/jess.png",
      emergency: "Fire Alert",
      message: "Fire in the building!",
      location: { lat: 13.7565, lng: 121.0583 },
    },
    {
      id: 4,
      name: "German Gerrich Cardona",
      avatar: "/avatars/john.png",
      emergency: "Lost Child",
      message: "Child missing in the park.",
      location: { lat: 52.3737, lng: 4.899 },
    },
    {
      id: 5,
      name: "Justin Anthony Aleta",
      avatar: "/avatars/elli.png",
      emergency: "Car Accident",
      message: "Need assistance at the intersection.",
      location: { lat: 13.788724, lng: 121.060253 },
    },
    {
      id: 6,
      name: "Hyacinth Louisse Almiro",
      avatar: "/avatars/bo.png",
      emergency: "Looking for help",
      message: "The flood is getting worse! HELP!",
      location: { lat: 13.788724, lng: 121.060253 },
    },
    {
      id: 7,
      name: "Jix Jimrei Ilao",
      avatar: "/avatars/nataniel.png",
      emergency: "Looking for help!",
      message: "An earthquake has occured! Many injured people in our area.",
      location: { lat: 13.767783, lng: 121.063503 },
    },
  ]);

  const [connections] = useState<Connection[]>([
    { id: 1, name: "Jonathan Ray Sicat", avatar: "/avatars/jess.png" },
    { id: 2, name: "Dawn Emmanuel Aguila", avatar: "/avatars/john.png" },
    { id: 3, name: "Justine Mae Dolor", avatar: "/avatars/olli.png" },
    { id: 4, name: "Hyacinth Louisse Almiro", avatar: "/avatars/elli.png" },
    { id: 5, name: "Julius Caniete", avatar: "/avatars/bo.png" },
    { id: 6, name: "German Gerrich Cardona", avatar: "/avatars/nikita.png" },
    { id: 7, name: "Justin Anthony Aleta", avatar: "/avatars/nataniel.png" },
    { id: 8, name: "Jix Jimrei Ilao", avatar: "/avatars/ayisha.png" },
  ]);

  const [type] = useState<Type[]>([
    { id: 1, name: "Medical Emergency", content: "Stay calm and assess the situation. Call emergency services if necessary.", icon: 'FaAmbulance' },
    { id: 2, name: "Missing Person", content: "Report to authorities immediately. Provide a detailed description of the person.", icon: 'FaInfoCircle' },
    { id: 3, name: "Fire", content: "Activate the fire alarm. Evacuate the building using designated exits. Do not use elevators.", icon: 'FaFire' },
    { id: 4, name: "Accident", content: "Ensure the scene is safe. Check for injuries. Call for medical help if needed.", icon: 'FaCarCrash' },
    { id: 5, name: "Theft", content: "Report the theft to the police immediately. Secure the area to preserve evidence.", icon: 'FaShieldAlt' },
    { id: 6, name: "General Assistance", content: "Identify the type of assistance needed. Contact appropriate services or individuals.", icon: 'FaInfoCircle' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New emergency reported in your area",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "Your connection Vin Vernon Perez is nearby",
      time: "10 minutes ago",
      read: false,
    },
  ]);

  const [deviceStatus, setDeviceStatus] = useState<"Active" | "Inactive">(
    "Active"
  );

  const iconMap: { [key: string]: React.ElementType } = {
    FaAmbulance: FaAmbulance,
    FaInfoCircle: FaInfoCircle,
    FaFire: FaFire,
    FaCarCrash: FaCarCrash,
    FaShieldAlt: FaShieldAlt,
    // Add other icons as needed
  };

  const handleEmergencyAlert = (type: string) => {
    setCrisisAlert({
      type,
      reporter: activeUser,
      isSelf: true,
    });
    setIsSafe(false);
    setSelectedAlertType(type);
    setShowAlertConfirm(true);
  };

  const resetCrisisAlert = () => {
    setIsSafe(false);
    setCrisisAlert({
      type: "Fire",
      reporter: "Justine Mae Dolor",
      isSelf: false,
    });
  };

  const refreshFeed = () => {
    setEmergencies((prevEmergencies) => {
      const shuffled = [...prevEmergencies].sort(() => Math.random() - 0.5);
      return shuffled;
    });
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        setShowMessages(false);
        setShowReport(false);
        refreshFeed();
        break;
      case "message":
        setShowMessages(true);
        setShowReport(false);
        break;
      case "report":
        setShowMessages(false);
        setShowReport(true);
        break;
    }
  };

  const handleProfileAction = (action: string) => {
    setShowProfileMenu(false);
    switch (action) {
      case "profile":
        setShowProfile(true);
        break;
      case "settings":
        setShowSettings(true);
        break;
      case "logout":
        setShowLogoutConfirm(true);
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleViewLocation = (emergency: Emergency) => {
    setSelectedLocation(emergency.location);
    setSelectedEmergency(emergency);
    setShowLocationView(true);
  };

  const handleCallAssistance = (emergency: Emergency) => {
    setSelectedEmergencyForAction(emergency);
    setShowCallConfirm(true);
  };

  const handleReport = (emergency: Emergency) => {
    setSelectedEmergencyForAction(emergency);
    setShowReportConfirm(true);
  };

  const initiateCall = () => {
    window.open("tel:911", "_blank");
    setShowCallConfirm(false);
  };

  const submitReport = () => {
    console.log("Report submitted for:", selectedEmergencyForAction);
    setShowReportConfirm(false);
  };

  const handleSendMessage = (receiver: string, content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: activeUser,
      receiver: receiver,
      content: content,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setMessageSent(true);
    setCurrentChatRecipient(receiver);
    setShowChatList(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setSelectedConnection(null);
    }, 1500);
  };

  const getUniqueChatRecipients = () => {
    const recipients = new Set<string>();
    messages.forEach((message) => {
      if (message.sender === activeUser) {
        recipients.add(message.receiver);
      } else {
        recipients.add(message.sender);
      }
    });
    return Array.from(recipients);
  };

  const getLastMessage = (recipient: string) => {
    const relevantMessages = messages.filter(
      (msg) =>
        (msg.sender === activeUser && msg.receiver === recipient) ||
        (msg.sender === recipient && msg.receiver === activeUser)
    );
    return relevantMessages[relevantMessages.length - 1];
  };
  return (
    <div className="min-h-screen bg-[#f8eed4] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#005524] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-24 h-24 bg-[#f69f00] rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-[#be4c1d] rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="bg-[#f8eed4] border-b-2 border-[#005524]/20 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="p-2 sm:p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative group">
              <img src={logoImage} className="h-8 sm:h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-110" alt="Logo" />
              <div className="absolute inset-0 bg-[#005524]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search emergencies..."
                className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 w-32 sm:w-40 md:w-48 text-sm border-2 border-transparent focus:border-[#005524] focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#005524] hover:text-[#f69f00] transition-colors duration-300">
                <FaSearch size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4">
            <button
              onClick={() => handleNavigation('home')}
              className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300 group ${activeTab === 'home'
                ? 'text-[#005524] bg-white/60 shadow-lg scale-105'
                : 'text-gray-600 hover:text-[#005524] hover:bg-white/40'
                }`}
            >
              <div className="relative">
                <FaHome size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                {activeTab === 'home' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#005524] rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:inline font-medium">Home</span>
            </button>
            <button
              onClick={() => handleNavigation('message')}
              className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300 group ${activeTab === 'message'
                ? 'text-[#005524] bg-white/60 shadow-lg scale-105'
                : 'text-gray-600 hover:text-[#005524] hover:bg-white/40'
                }`}
            >
              <div className="relative">
                <FaBell size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                {activeTab === 'message' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#005524] rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:inline font-medium">Messages</span>
            </button>
            <button
              onClick={() => handleNavigation('report')}
              className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300 group ${activeTab === 'report'
                ? 'text-[#005524] bg-white/60 shadow-lg scale-105'
                : 'text-gray-600 hover:text-[#005524] hover:bg-white/40'
                }`}
            >
              <div className="relative">
                <FaExclamationTriangle size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                {activeTab === 'report' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#005524] rounded-full animate-pulse"></div>
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:inline font-medium">Report</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 sm:p-3 rounded-full bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <FaBell size={16} className="text-[#f69f00] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs font-bold animate-bounce shadow-lg">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${!notification.read ? "bg-blue-50 border-l-4 border-blue-500" : ""
                          }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p className="text-gray-800 text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005524] to-[#f69f00] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {activeUser.charAt(0)}
                </div>
                <div className="hidden sm:flex items-center text-[#005524]">
                  <span className="font-semibold text-sm">{activeUser}</span>
                  <FaEllipsisH className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-90" />
                </div>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{activeUser}</p>
                    <p className="text-sm text-gray-500">Emergency Response Network</p>
                  </div>
                  <button
                    onClick={() => handleProfileAction("profile")}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center text-sm transition-all duration-200 group"
                  >
                    <FaUser className="mr-3 text-[#005524] group-hover:scale-110 transition-transform duration-200" />
                    Profile
                  </button>
                  <button
                    onClick={() => handleProfileAction("settings")}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center text-sm transition-all duration-200 group"
                  >
                    <FaCog className="mr-3 text-[#005524] group-hover:scale-110 transition-transform duration-200" />
                    Settings
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleProfileAction("logout")}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center text-sm transition-all duration-200 group"
                  >
                    <FaSignOutAlt className="mr-3 group-hover:scale-110 transition-transform duration-200" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 relative flex-col lg:flex-row">
        {/* Left Side - Enhanced Device Info & Safety Tips */}
        <div className="w-full lg:w-1/4 p-3 sm:p-4 lg:p-6 flex flex-col space-y-4 lg:space-y-6 order-2 lg:order-1">
          {/* Mobile Search */}
          <div className="relative sm:hidden">
            <input
              type="text"
              placeholder="Search emergencies..."
              className="w-full bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 text-sm border-2 border-transparent focus:border-[#005524] focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#005524] hover:text-[#f69f00] transition-colors duration-300">
              <FaSearch size={16} />
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#005524] to-[#005524] rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Device</h2>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-white/90 font-medium">Device ID:</span>
                <span className="text-white font-bold">01-JD-C24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-white/90 font-medium">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${deviceStatus === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                  }`}>
                  {deviceStatus}
                </span>
              </div>
              <button
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${deviceStatus === "Active"
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  }`}
                onClick={() => setDeviceStatus(deviceStatus === "Active" ? "Inactive" : "Active")}
              >
                {deviceStatus === "Active" ? "Deactivate Device" : "Activate Device"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hidden sm:block">
            <h2 className="text-xl sm:text-2xl font-bold text-[#005524] mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-[#f69f00]" />
              Safety Tips
            </h2>
            <div className="space-y-3">
              {type.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-[#005524]/10 hover:to-[#005524]/20 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-[#005524]/30 active:scale-95"
                  onClick={() => {
                    setSelectedSafetyTip(item);
                    setShowSafetyTipModal(true);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f69f00] to-[#be4c1d] flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {iconMap[item.icon] ? React.createElement(iconMap[item.icon]) : '?'}
                  </div>
                  <span className="text-gray-800 ml-4 font-semibold group-hover:text-[#005524] transition-colors duration-300">
                    {item.name}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaInfoCircle className="text-[#005524] text-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/4 p-3 sm:p-4 lg:p-6 order-1 lg:order-2">
          <div className="bg-gradient-to-r from-[#005524] to-[#004015] rounded-2xl shadow-xl p-2 sm:p-3 mb-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center text-[#005524] font-bold text-2xl shadow-lg">
                {activeUser.charAt(0)}
              </div>
              <div>
                <h3 className="text-white text-xl sm:text-2xl font-bold">{activeUser}</h3>
              </div>
            </div>
          </div>

          {emergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-[#005524]/20"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#005524] to-[#f69f00] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {emergency.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-[#005524] font-bold text-lg">{emergency.name}</h3>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">Just now</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                      {emergency.emergency}
                    </p>
                    <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                      {emergency.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewLocation(emergency)}
                    className="text-[#005524] hover:text-[#f69f00] transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaMapMarkerAlt size={20} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => handleCallAssistance(emergency)}
                    className="flex-1 py-4 px-6 text-center text-[#005524] hover:bg-[#005524] hover:text-white font-semibold transition-all duration-300 flex items-center justify-center group"
                  >
                    <FaPhone className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Call Assistance
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button
                    onClick={() => handleReport(emergency)}
                    className="flex-1 py-4 px-6 text-center text-[#be4c1d] hover:bg-[#be4c1d] hover:text-white font-semibold transition-all duration-300 flex items-center justify-center group"
                  >
                    <FaExclamationTriangle className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Connections & Alerts */}
        <div className="w-full lg:w-1/4 p-3 sm:p-4 lg:p-6 order-3 lg:order-3">
          {/* Crisis Response Card */}
          <div className="bg-gradient-to-br from-[#005524] to-[#005524] rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Crisis Response
            </h3>
            <p className="text-white/90 text-sm mb-4 text-center">
              Respond to nearby emergencies or mark yourself as safe.
            </p>
            {isSafe ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FaCheck className="text-white text-2xl" />
                </div>
                <p className="text-white font-bold text-sm mb-2">You are marked as Safe</p>
                <button
                  className="text-white/80 text-sm underline hover:text-white transition-colors duration-300"
                  onClick={resetCrisisAlert}
                >
                  Undo
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-4">
                  {crisisAlert.isSelf
                    ? `You reported a ${crisisAlert.type} Alert`
                    : `${crisisAlert.type} Alert reported by ${crisisAlert.reporter} nearby`}
                </p>
                <button
                  className="w-full bg-white text-[#f69f00] py-3 px-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                  onClick={() => setIsSafe(true)}
                >
                  <FaCheck className="mr-2" /> I am Safe
                </button>
              </div>
            )}
          </div>

          {/* Connections Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
            <h3 className="text-[#005524] text-lg sm:text-xl font-bold mb-4 flex items-center">
              <FaUser className="mr-2 text-[#f69f00]" />
              Connections
            </h3>
            <div className="space-y-3">
              {connections.slice(0, 5).map((connection) => (
                <div
                  key={connection.id}
                  className="group flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 transform hover:scale-105"
                  onClick={() => setSelectedConnection(connection)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005524] to-[#f69f00] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {connection.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 ml-3">
                    <p className="font-semibold text-gray-900 truncate">{connection.name}</p>
                    <p className="text-green-600 text-sm font-medium">Active now</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-[#005524] hover:text-[#f69f00] font-semibold text-sm transition-colors duration-300">
              See all connections →
            </button>
          </div>

          {/* Emergency Alerts Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h3 className="text-[#005524] text-lg sm:text-xl font-bold mb-4 flex items-center">
              <FaBell className="mr-2 text-[#f69f00]" />
              Emergency Alerts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleEmergencyAlert("Fire")}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center group"
              >
                <FaFire className="mb-2 text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="text-sm font-medium">Fire</span>
              </button>
              <button
                onClick={() => handleEmergencyAlert("Police")}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center group"
              >
                <FaShieldAlt className="mb-2 text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="text-sm font-medium">Police</span>
              </button>
              <button
                onClick={() => handleEmergencyAlert("Accident")}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 px-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center group"
              >
                <FaCarCrash className="mb-2 text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="text-sm font-medium">Accident</span>
              </button>
              <button
                onClick={() => handleEmergencyAlert("Medical")}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex flex-col items-center group"
              >
                <FaAmbulance className="mb-2 text-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="text-sm font-medium">Medical</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMessages && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {!showChatList && (
                  <button
                    onClick={() => setShowChatList(true)}
                    className="mr-4 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:-translate-x-1"
                  >
                    ←
                  </button>
                )}
                <h2 className="text-2xl font-bold text-[#005524]">
                  {showChatList ? "Messages" : `${currentChatRecipient}`}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowMessages(false);
                  setShowChatList(true);
                  setCurrentChatRecipient("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            {showChatList ? (
              <div className="space-y-2">
                {getUniqueChatRecipients().length === 0 ? (
                  <p className="text-gray-600">No conversations yet.</p>
                ) : (
                  getUniqueChatRecipients().map((recipient) => {
                    const lastMessage = getLastMessage(recipient);
                    return (
                      <div
                        key={recipient}
                        onClick={() => {
                          setCurrentChatRecipient(recipient);
                          setShowChatList(false);
                        }}
                        className="p-4 hover:bg-gradient-to-r hover:from-[#005524]/5 hover:to-[#005524]/10 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-[#005524]/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                            👤
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900">
                                {recipient}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {lastMessage?.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages
                  .filter(
                    (message) =>
                      (message.sender === activeUser &&
                        message.receiver === currentChatRecipient) ||
                      (message.sender === currentChatRecipient &&
                        message.receiver === activeUser)
                  )
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-2xl shadow-md max-w-[80%] transform hover:scale-105 transition-all duration-300 ${message.sender === activeUser
                        ? "bg-gradient-to-r from-[#005524] to-[#004015] text-white ml-auto"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                          {message.sender === activeUser
                            ? "You"
                            : message.sender}
                        </span>
                        <span className="text-xs opacity-75">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">
                Report an Emergency
              </h2>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Emergency Type
                </label>
                <select className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-[#005524] focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-lg focus:shadow-xl">
                  <option>Medical Emergency</option>
                  <option>Fire</option>
                  <option>Accident</option>
                  <option>Crime</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-[#005524] focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-lg focus:shadow-xl resize-none"
                  rows={4}
                  placeholder="Describe the emergency situation..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-[#005524] focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-lg focus:shadow-xl"
                  placeholder="Enter your location"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#005524] to-[#004015] text-white py-4 px-8 rounded-2xl font-bold hover:from-[#004015] hover:to-[#005524] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#f69f00] to-[#be4c1d] rounded-3xl p-8 w-full max-w-md shadow-2xl border-0 transform animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-[#005524] mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-bold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-[#005524] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#004015] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#005524] to-[#f69f00] flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {activeUser.charAt(0)}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {activeUser}
                </h3>
                <p className="text-gray-500 font-medium">Member since 2024</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-800 font-semibold">user@example.com</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <span className="text-gray-600 font-medium">Phone</span>
                  <span className="text-gray-800 font-semibold">+63 123 456 7890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-lg">Notifications</h3>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <span className="text-gray-700 font-medium">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#005524] peer-checked:to-[#004015] shadow-lg"></div>
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-lg">Privacy</h3>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                  <span className="text-gray-700 font-medium">Location Sharing</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#005524] peer-checked:to-[#004015] shadow-lg"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLocationView && selectedLocation && selectedEmergency && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">
                Emergency Location
              </h2>
              <button
                onClick={() => setShowLocationView(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedEmergency.name}
                </h3>
                <p className="text-gray-600">{selectedEmergency.emergency}</p>
                <p className="text-gray-600 mt-1">
                  {selectedEmergency.message}
                </p>
              </div>
              <div className="relative h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={mapImage}
                  alt="Map location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                    📍 Emergency Location
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">Latitude:</span>{" "}
                  {selectedLocation.lat}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span>{" "}
                  {selectedLocation.lng}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-[#005524] text-white py-2 px-4 rounded-lg hover:bg-[#004015] transition-all duration-300 hover:scale-105 group flex items-center justify-center"
                >
                  <span className="mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <FaMapMarkedAlt size={16} />
                  </span>{" "}
                  Open in Maps
                </button>
                <button
                  onClick={() => setShowLocationView(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCallConfirm && selectedEmergencyForAction && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">
                Call Assistance
              </h2>
              <button
                onClick={() => setShowCallConfirm(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to call emergency assistance for{" "}
                {selectedEmergencyForAction.name}'s{" "}
                {selectedEmergencyForAction.emergency}?
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  This will initiate a call to emergency services. Please
                  ensure this is a genuine emergency.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCallConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={initiateCall}
                  className="flex-1 bg-[#005524] text-white py-2 px-4 rounded-lg hover:bg-[#004015] transition-all duration-300 hover:scale-105 group flex items-center justify-center"
                >
                  📞 Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlertConfirm && selectedAlertType && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">
                Emergency Alert
              </h2>
              <button
                onClick={() => {
                  setShowAlertConfirm(false);
                  setSelectedAlertType(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-xl">
                  <FaExclamationTriangle className="text-2xl" />
                </div>
              </div>
              <p className="text-gray-700 text-lg text-center font-medium">
                You have triggered this <span className="text-[#005524] font-bold">{selectedAlertType}</span> alert.
              </p>
              <p className="text-gray-700 text-md text-center font-small">
                This will notify nearby users and emergency services about the situation.
              </p>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setShowAlertConfirm(false);
                    setSelectedAlertType(null);
                  }}
                  className="bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportConfirm && selectedEmergencyForAction && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">
                Report Emergency
              </h2>
              <button
                onClick={() => setShowReportConfirm(false)}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                You are about to report {selectedEmergencyForAction.name}'s{" "}
                {selectedEmergencyForAction.emergency}.
              </p>
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  Additional Details
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Add any additional information about the emergency..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowReportConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300 hover:scale-110"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  className="flex-1 bg-[#be4c1d] text-white py-2 px-4 rounded-lg hover:bg-[#a33d16] transition-all duration-300 hover:scale-105 group flex items-center justify-center"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tip Details Modal */}
      {showSafetyTipModal && selectedSafetyTip && (
        <div className="fixed inset-0 backdrop-blur-lg bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-0 transform animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#005524]">{selectedSafetyTip.name}</h2>
              <button
                onClick={() => {
                  setShowSafetyTipModal(false);
                  setSelectedSafetyTip(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f69f00] to-[#be4c1d] flex items-center justify-center text-white shadow-xl">
                  {iconMap[selectedSafetyTip.icon] ? React.createElement(iconMap[selectedSafetyTip.icon]) : '?'}
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg mb-3">Safety Guidelines</h3>
                <p className="text-gray-700 leading-relaxed">{selectedSafetyTip.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;