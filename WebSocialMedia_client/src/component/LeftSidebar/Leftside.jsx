import React from "react";
import friend from "../../assets/navbar/capyfriend.jpg";
import avatar from "../../assets/navbar/avatar.jpg";
import group from "../../assets/navbar/grcapy.jpg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
const NavLink = ({ href, imgSrc, altText, label }) => {
  return (
    <a
      href={href}
      className="flex items-center rounded px-4 py-3 hover:bg-primary/20 dark:hover:bg-gray-700 transition"
    >
      <img
        src={imgSrc}
        alt={altText}
        className="w-12 h-12 text-primary rounded-full border-2 border-primary dark:border-white"
      />
      <span className="text-lg font-semibold ml-3 text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </a>
  );
};

const ContactInfo = ({ label, value, icon }) => {
  return (
    <div className="flex items-center space-x-4 mt-4 px-4">
      <div className="w-10 h-10 flex items-center justify-center bg-primary/20 dark:bg-gray-700 text-primary dark:text-white rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
          {label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
      </div>
    </div>
  );
};

const Leftside = () => {
  return (
    <div className="fixed w-[20%] flex flex-col pb-4 border-r-2 rounded-r-xl shadow-md h-screen bg-white dark:bg-gray-900">
      {/* Navigation Links */}
      <div className="pt-6">
        <NavLink href="/homepage" imgSrc={avatar} altText="Home" label="Home" />
        <NavLink href="/friends" imgSrc={friend} altText="Friends" label="Friends" />
        <NavLink href="/groups" imgSrc={group} altText="Groups" label="Groups" />
      </div>

      {/* Contact Information */}
      <div className="mt-6">
        <h2 className="text-lg font-bold px-4 text-gray-800 dark:text-white">
          Liên lạc
        </h2>
        <ContactInfo
          label="Email"
          value="vukxxxxxxx@example.com"
          icon={<MdEmail />}
        />
        <ContactInfo
          label="Số điện thoại"
          value="03xxxxxxxx"
          icon={<FaPhoneAlt/>}
        />
        <ContactInfo
          label="Địa chỉ"
          value="Vin com thu duc, TP.HCM"
          icon={<FaLocationDot />}
        />
      </div>
    </div>
  );
};

export default Leftside;
