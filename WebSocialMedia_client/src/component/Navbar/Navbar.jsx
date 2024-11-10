import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import logo from "../../assets/logo.jpg";
import { RiGroupLine } from "react-icons/ri";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOndemandVideo } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import Darkmode from './Darkmode';
import { MdOutlineFeedback } from "react-icons/md";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlineSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
    const [hovered, setHovered] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for toggling dropdown
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    // Logout function to clear the login state and navigate to login page
    const handleLogout = () => {
        // Clear the login state from localStorage (or sessionStorage if used)
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to the login page
        navigate('/');
    };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900
     dark:text-white duration-200 relative z-40" 
        >
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center h-12 py-2 ">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <a href="#" className="font-bold text-2xl sm:text-3xl flex items-center">
              <img src={logo} alt="logo" className="w-12 h-12 rounded-full  border-2 border-black uppercase" />
              ᴄᴀᴘʏᴊᴏʏ
            </a>    
          </div>
          
          {/* Search Bar */}
          <div className="relative group hidden sm:block">
            <input 
              type="text"
              placeholder="search"
              className="w-[300px] sm:w-[300px]
              group-hover:w-[400px] transition-all 
              duration-300 
              rounded-full
              border-gray-950
              px-1 py-2 focus:outline-none 
              focus:border- focus:border-orange-400 w-12"
            />
            <IoMdSearch className='text-gray-500 group-hover:text-primary absolute top-1/2 
            -translate-y-1/2 right-3' />
          </div>

          <div className="flex items-center">
            <button className="font-bold text-xl sm:text-xl flex items-center group hover:bg-primary/30 rounded p-2">
              <RiGroupLine className="text-primary group-hover:text-primary mr-2 w-11 h-11" />
            </button>
          </div>

          <div className="flex items-center">
            <button className="font-bold text-xl sm:text-xl flex items-center group hover:bg-primary/30 rounded p-2">
              <HiOutlineUserGroup className="text-primary group-hover:text-primary mr-2 w-11 h-11" />
            </button>
          </div>

          <div className="flex items-center">
            <button className="font-bold text-xl sm:text-xl flex items-center group hover:bg-primary/30 rounded p-2">
              <MdOndemandVideo className="text-primary group-hover:text-primary mr-2 w-11 h-11" />
            </button>
          </div>

          <div className="flex items-center">
            <button 
              className="font-bold text-xl sm:text-xl flex items-center group hover:bg-primary/30 rounded p-2"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {hovered ? (
                <MdNotifications className="text-primary mr-2 w-11 h-11" />
              ) : (
                <MdNotificationsNone className="text-primary mr-2 w-11 h-11" />
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-end">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="font-bold text-xl sm:text-xl flex items-center group hover:bg-primary/30 rounded p-2"
            >
              <RxAvatar className="text-primary group-hover:text-primary mr-2 w-11 h-11" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-14 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-md py-2 w-48">
                <a href="#" className=" font-bold text-l sm:text-l flex items-center group hover:bg-primary/30 rounded p-2">
                  <MdOutlineSettings className='text-primary group-hover:text-primary mr-2 w-9 h-9 '></MdOutlineSettings>
                  Settings
                </a>
                <a href="#" className="   font-bold text-l sm:text-l flex items-center group hover:bg-primary/30 rounded p-2">
                  <MdOutlineFeedback className='text-primary group-hover:text-primary mr-2 w-9 h-9'></MdOutlineFeedback>
                  Give Feedback
                </a>
                <a href="#" className=" font-bold text-l sm:text-l flex items-center group hover:bg-primary/30 rounded p-2">
                  <IoMdHelpCircleOutline className='text-primary group-hover:text-primary mr-2 w-9 h-9 '></IoMdHelpCircleOutline>
                  Help
                </a>
                <button 
                  onClick={handleLogout} 
                  className="w-full font-bold text-l sm:text-l flex items-center group hover:bg-primary/30 rounded p-2"
                >
                  <FiLogOut className='text-primary group-hover:text-primary mr-2 w-9 h-9 '></FiLogOut>
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Dark mode setup */}
          <div>
            <Darkmode></Darkmode>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
