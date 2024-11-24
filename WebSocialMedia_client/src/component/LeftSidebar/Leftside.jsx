import React from 'react'
import friend from "../../assets/navbar/capyfriend.jpg"
import avatar from "../../assets/navbar/avatar.jpg"
import group from "../../assets/navbar/grcapy.jpg"

const NavLink = ({ href, imgSrc, altText, label }) => {
  return (
    <a href={href} className='flex items-center rounded text-2xl font-bold mt-2 hover:bg-primary/30 transition'>
      <img src={imgSrc} alt={altText} className='w-11 h-11 text-primary rounded-full border-2 border-black uppercase' />
      <span className='text-lg ml-2'>{label}</span>
    </a>
  );
}

const Leftside = () => {
  return (
    <div className="fixed w-[20%] flex-col pb-4 border-2 rounded-r-xl shadow-md h-screen bg-primary/30 dark:bg-gray-900 dark:text-white shadow-lg">
      <div>
        <NavLink href="/homepage" imgSrc={avatar} altText="avatar" label="Home" />
        <NavLink href="/friends" imgSrc={friend} altText="friend" label="Friends" />
        <NavLink href="#" imgSrc={group} altText="group" label="Groups" />
      </div>
    </div>
  );
}

export default Leftside;
