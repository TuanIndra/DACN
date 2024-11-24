import React, { useEffect, useState } from 'react';
import {
  sendFriendRequest,
  cancelFriendRequest,
  fetchPendingSentRequests,
  fetchAcceptedFriends,
} from '../../api/friendshipApi';

const FriendRequestButton = ({ currentUserId }) => {
  const [friendshipStatus, setFriendshipStatus] = useState('none'); // "friend", "pendingSent", "none"
  const [friendshipId, setFriendshipId] = useState(null);

  const loggedInUserId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      try {
        setFriendshipStatus('none'); // Reset trạng thái
        setFriendshipId(null);

        // Kiểm tra danh sách bạn bè đã chấp nhận
        const acceptedFriendsResponse = await fetchAcceptedFriends();
        const acceptedFriends = acceptedFriendsResponse.data;

        const isFriend = acceptedFriends.some((friend) => friend.id === currentUserId);

        if (isFriend) {
          setFriendshipStatus('friend');
          return;
        }

        // Kiểm tra yêu cầu đã gửi
        const pendingSentResponse = await fetchPendingSentRequests();
        const pendingSent = pendingSentResponse.data;

        const sentRequest = pendingSent.find(
          (request) =>
            request.receiverId === currentUserId && request.senderId === loggedInUserId
        );

        if (sentRequest) {
          setFriendshipStatus('pendingSent');
          setFriendshipId(sentRequest.id);
          return;
        }
      } catch (error) {
        console.error('Error fetching friendship status:', error);
      }
    };

    fetchFriendshipStatus();
  }, [currentUserId, loggedInUserId]);

  const handleFriendRequest = async () => {
    try {
      await sendFriendRequest(currentUserId);
      setFriendshipStatus('pendingSent');
      // Lấy lại ID yêu cầu sau khi gửi
      const pendingSentResponse = await fetchPendingSentRequests();
      const pendingSent = pendingSentResponse.data;

      const sentRequest = pendingSent.find(
        (request) =>
          request.receiverId === currentUserId && request.senderId === loggedInUserId
      );
      if (sentRequest) {
        setFriendshipId(sentRequest.id);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleCancelFriendship = async () => {
    try {
      await cancelFriendRequest(friendshipId);
      setFriendshipStatus('none');
      setFriendshipId(null);
    } catch (error) {
      console.error('Error cancelling friendship:', error);
    }
  };

  if (loggedInUserId === currentUserId) {
    return null; // Không hiển thị nút cho chính người dùng
  }

  return (
    <div className="mt-4">
      {friendshipStatus === 'friend' ? (
        <div>
          <span className="text-green-600 font-bold">Bạn bè</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            onClick={handleCancelFriendship}
          >
            Hủy kết bạn
          </button>
        </div>
      ) : friendshipStatus === 'pendingSent' ? (
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleCancelFriendship}
        >
          Hủy yêu cầu kết bạn
        </button>
      ) : (
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleFriendRequest}>
          Kết bạn
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
