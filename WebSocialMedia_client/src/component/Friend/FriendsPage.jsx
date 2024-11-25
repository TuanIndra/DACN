import React, { useEffect, useState } from 'react';
import {
  fetchPendingReceivedRequests,
  fetchAcceptedFriends,
  acceptFriendRequest,
  cancelFriendRequest,
} from '../../api/friendshipApi';
import Navbar from '../../component/Navbar/Navbar';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('pendingRequests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pendingResponse = await fetchPendingReceivedRequests();
        console.log('Pending Requests:', pendingResponse.data); // Check the data structure
        setPendingRequests(pendingResponse.data || []);
        const friendsResponse = await fetchAcceptedFriends();
        setFriends(friendsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset selected user when switching tabs
  useEffect(() => {
    setSelectedUser(null);
  }, [activeTab]);

  const getAvatarUrl = (avatarUrl) => {
    if (avatarUrl) {
      return avatarUrl.startsWith('http')
        ? avatarUrl
        : `http://localhost:8082/uploads/${avatarUrl}`;
    }
    return '/default-avatar.png';
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await acceptFriendRequest(friendshipId);
      const acceptedRequest = pendingRequests.find(
        (request) => request.id === friendshipId
      );
      if (acceptedRequest && acceptedRequest.requester) {
        setFriends((prev) => [...prev, acceptedRequest.requester]);
      }
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== friendshipId)
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (friendshipId) => {
    try {
      await cancelFriendRequest(friendshipId);
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== friendshipId)
      );
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-200 dark:bg-gray-800 h-screen sticky top-0 p-4">
          <button
            className={`w-full px-4 py-2 mb-4 rounded ${
              activeTab === 'pendingRequests'
                ? 'bg-primary text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('pendingRequests')}
          >
            Lời mời kết bạn
          </button>
          <button
            className={`w-full px-4 py-2 rounded ${
              activeTab === 'friends'
                ? 'bg-primary text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('friends')}
          >
            Bạn bè
          </button>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4">
          {activeTab === 'pendingRequests' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Lời mời kết bạn
              </h1>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Không có lời mời kết bạn nào.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white dark:bg-gray-900 p-4 shadow rounded text-center"
                    >
                      {request.requester ? (
                        <>
                          <img
                            src={getAvatarUrl(request.requester.avatarUrl)}
                            alt={request.requester.fullName || 'Người dùng'}
                            className="w-12 h-12 rounded-full mx-auto object-cover"
                          />
                          <h3 className="mt-2 text-center text-gray-800 dark:text-gray-200">
                            {request.requester.fullName || 'Ẩn danh'}
                          </h3>
                        </>
                      ) : (
                        <>
                          <img
                            src="/default-avatar.png"
                            alt="Người dùng"
                            className="w-12 h-12 rounded-full mx-auto object-cover"
                          />
                          <h3 className="mt-2 text-center text-gray-800 dark:text-gray-200">
                            Ẩn danh
                          </h3>
                        </>
                      )}
                      <div className="flex justify-center mt-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Đồng ý
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Bạn bè
              </h1>
              {friends.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Bạn chưa có bạn bè nào.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-white dark:bg-gray-900 p-4 shadow rounded text-center"
                    >
                      <img
                        src={getAvatarUrl(friend.avatarUrl)}
                        alt={friend.fullName || 'Người dùng'}
                        className="w-12 h-12 rounded-full mx-auto object-cover"
                      />
                      <h3 className="mt-2 text-center text-gray-800 dark:text-gray-200">
                        {friend.fullName || 'Ẩn danh'}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
