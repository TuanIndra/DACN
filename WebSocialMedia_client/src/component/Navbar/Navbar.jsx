import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.jpg";
import { RiGroupLine } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOndemandVideo, MdNotifications, MdOutlineFeedback, MdOutlineSettings } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import SearchBar from "./SearchBar";
import Darkmode from './Darkmode';
import NotificationList from '../Notifications/NotificationsList';
import { fetchUserNotificationsById } from '../../api/notificationsApi';
import { getAuth, signOut } from 'firebase/auth';
import app from '../../../firebaseConfig';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const userId = localStorage.getItem('userId');

  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetchUserNotificationsById(userId);
          setNotifications(response.data);
          const unread = response.data.filter((notif) => !notif.isRead).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('userId');
        navigate('/login');
      })
      .catch((error) => console.error('Lỗi khi đăng xuất:', error));
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white transition relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/homepage" className="font-bold text-2xl sm:text-3xl flex items-center">
              <img src={logo} alt="logo" className="w-12 h-12 rounded-full border-2 border-black" />
              <span className="ml-2 uppercase">ᴄᴀᴘʏᴊᴏʏ</span>
            </a>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <a href="/friends" className="group hover:bg-primary/30 p-2 rounded">
              <RiGroupLine className="text-primary w-8 h-8" />
            </a>
            <a href="/groups" className="group hover:bg-primary/30 p-2 rounded">
              <HiOutlineUserGroup className="text-primary w-8 h-8" />
            </a>
            <a href="/videos" className="group hover:bg-primary/30 p-2 rounded">
              <MdOndemandVideo className="text-primary w-8 h-8" />
            </a>

            {/* Notifications */}
            <div className="relative">
              <button onClick={toggleNotif} className="relative focus:outline-none group">
                <MdNotifications className="text-primary w-8 h-8" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10 overflow-y-auto">
                  <NotificationList notifications={notifications} userId={userId} />
                </div>
              )}
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="group hover:bg-primary/30 p-2 rounded"
            >
              <RxAvatar className="text-primary w-8 h-8" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-md py-2 w-48">
                <a href="/settings" className="flex items-center px-4 py-2 hover:bg-primary/30 rounded">
                  <MdOutlineSettings className="text-primary w-6 h-6 mr-2" />
                  Cài đặt
                </a>
                <a href="/feedback" className="flex items-center px-4 py-2 hover:bg-primary/30 rounded">
                  <MdOutlineFeedback className="text-primary w-6 h-6 mr-2" />
                  Góp ý
                </a>
                <a href="/help" className="flex items-center px-4 py-2 hover:bg-primary/30 rounded">
                  <IoMdHelpCircleOutline className="text-primary w-6 h-6 mr-2" />
                  Trợ giúp
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 hover:bg-primary/30 rounded"
                >
                  <FiLogOut className="text-primary w-6 h-6 mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <Darkmode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
