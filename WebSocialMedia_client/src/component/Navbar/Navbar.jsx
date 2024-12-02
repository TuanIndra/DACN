import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.jpg";
import { RiGroupLine } from "react-icons/ri";
import { IoMdSearch, IoMdHelpCircleOutline } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOndemandVideo, MdNotificationsNone, MdNotifications, MdOutlineFeedback, MdOutlineSettings } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import SearchBar from "./SearchBar"
import Darkmode from './Darkmode';

const Navbar = () => {
  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Hàm đăng xuất để xóa trạng thái đăng nhập và chuyển hướng đến trang đăng nhập
  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear();
    
    // Chuyển hướng đến trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center h-12 py-2">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/homepage" className="font-bold text-2xl sm:text-3xl flex items-center">
              <img src={logo} alt="logo" className="w-12 h-12 rounded-full border-2 border-black" />
              <span className="ml-2 uppercase">ᴄᴀᴘʏᴊᴏʏ</span>
            </a>
          </div>
          
          {/* Thanh tìm kiếm */}
          <SearchBar />

          {/* Biểu tượng điều hướng */}
          <div className="flex items-center space-x-4">
            <a href='friends'>
            <button className="group hover:bg-primary/30 p-2 rounded">
              <RiGroupLine className="text-primary w-8 h-8 group-hover:text-primary" />
            </button>
            </a>
            <button className="group hover:bg-primary/30 p-2 rounded">
              <HiOutlineUserGroup className="text-primary w-8 h-8 group-hover:text-primary" />
            </button>
            <button className="group hover:bg-primary/30 p-2 rounded">
              <MdOndemandVideo className="text-primary w-8 h-8 group-hover:text-primary" />
            </button>
            <button
              className="group hover:bg-primary/30 p-2 rounded"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {hovered ? (
                <MdNotifications className="text-primary w-8 h-8" />
) : (
                <MdNotificationsNone className="text-primary w-8 h-8" />
              )}
            </button>
          </div>

          {/* Ảnh đại diện người dùng và menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="group hover:bg-primary/30 p-2 rounded"
            >
              <RxAvatar className="text-primary w-8 h-8 group-hover:text-primary" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-md py-2 w-48">
                <a href="/Settings" className="flex items-center px-4 py-2 hover:bg-primary/30 rounded">
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

          {/* Chế độ tối */}
          <Darkmode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;