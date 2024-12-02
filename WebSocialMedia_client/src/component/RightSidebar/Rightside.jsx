import React from 'react';
import friend1 from '../../assets/Rightside/download.jpg';
import friend2 from '../../assets/Rightside/download (1).jpg';
import friend3 from '../../assets/Rightside/download (2).jpg'; // Add more images as needed

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
    <div className="flex items-center p-2 rounded-lg hover:bg-primary/30 transition">
      <img
        src={imgSrc}
        alt={name}
        className="w-12 h-12 rounded-full border-2 border-primary object-cover"
      />
      <span className="ml-3 text-lg font-medium dark:text-white">{name}</span>
    </div>
  );
};

const Rightside = () => {
  return (
    <div className="fixed right-0 w-[20%] h-screen flex flex-col pb-4 border-l-2 border-gray-300 dark:border-gray-700 rounded-l-xl shadow-md bg-primary/20 dark:bg-gray-900 dark:text-white shadow-lg">
      <h2 className="text-2xl font-bold p-4 text-gray-800 dark:text-white">Bạn bè trực tuyến</h2>
      <div className="flex-1 overflow-y-auto px-4">
        {onlineFriends
          .filter((friend) => friend.isOnline)
          .map((friend) => (
            <FriendItem key={friend.id} imgSrc={friend.imgSrc} name={friend.name} />
          ))}
      </div>
    </div>
  );
};

export default Rightside;
