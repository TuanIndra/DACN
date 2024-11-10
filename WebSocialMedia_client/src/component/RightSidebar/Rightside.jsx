import React from 'react';
import friend1 from '../../assets/Rightside/download.jpg';
import friend2 from '../../assets/Rightside/download (1).jpg';
import friend3 from '../../assets/Rightside/download (2).jpg';  // Add more images as needed

// Mock data with local friend images
const onlineFriends = [
  { id: 1, name: 'John Doe', imgSrc: friend1, isOnline: true },
  { id: 2, name: 'Jane Smith', imgSrc: friend2, isOnline: true },
  { id: 3, name: 'Chris Johnson', imgSrc: friend3, isOnline: false },
  { id: 4, name: 'Emily Davis', imgSrc: friend1, isOnline: true },
  { id: 5, name: 'Michael Brown', imgSrc: friend2, isOnline: false },
];

const FriendItem = ({ imgSrc, name }) => {
  return (
    <div className='flex items-center p-2 rounded hover:bg-primary/30 transition'>
      <img src={imgSrc} alt={name} className='w-10 h-10 rounded-full border-2 border-primary' />
      <span className='ml-2 text-lg font-medium'>{name}</span>
    </div>
  );
};

const Rightside = () => {
  return (
    <div className="fixed right-0 w-[20%] h-screen flex-col pb-4 border-2 rounded-l-xl shadow-md bg-primary/30 dark:bg-gray-900 dark:text-white shadow-lg">
      <h2 className='text-xl font-bold p-4'>Online Friends</h2>
      <div className='overflow-y-auto'>
        {onlineFriends.filter(friend => friend.isOnline).map(friend => (
          <FriendItem key={friend.id} imgSrc={friend.imgSrc} name={friend.name} />
        ))}
      </div>
    </div>
  );
};

export default Rightside;
