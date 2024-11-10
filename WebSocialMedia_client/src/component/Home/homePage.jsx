import React from 'react'
import Navbar from '../Navbar/Navbar';  // Đảm bảo đường dẫn đúng
import Leftside from '../LeftSidebar/Leftside';
import Rightside from '../RightSidebar/Rightside';
import PostsList from './PostsList';
const homePage = () => {
  return (
    <div className='w-full'>
    <div className='fixed top-0 z-10 w-full bg-white'>
      <Navbar/>

    </div>
    <div className='flex bg-gray-100 pt-16 w-[20%] '>
      <div className='flex-auto w-[20%]'>
        <Leftside ></Leftside >
      </div>
      <div className="w-[60%] px-4">
          <PostsList />
        </div>
      <div className='w-[80%] flex justify-end'>
          <Rightside />
        </div>
    </div>
  </div>
  )
}

export default homePage