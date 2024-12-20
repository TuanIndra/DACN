import React, { useEffect, useState } from 'react';
import {
  sendFriendRequest,
  cancelFriendRequest,
  fetchPendingSentRequests,
  fetchAcceptedFriends,
  unfriend,
} from '../../api/friendshipApi';
import { createNotification } from '../../api/notificationsApi';

const FriendRequestButton = ({ currentUserId }) => {
  const [friendshipStatus, setFriendshipStatus] = useState('none'); // "friend", "pendingSent", "none"
  const [friendshipId, setFriendshipId] = useState(null);

  const loggedInUserId = parseInt(localStorage.getItem('userId'), 10) || 0;

  useEffect(() => {
    const fetchFriendshipStatus = async () => {
      try {
        setFriendshipStatus('none');
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

      // Gửi thông báo FRIEND_REQUEST
      await createNotification(currentUserId, 'FRIEND_REQUEST', loggedInUserId);

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

  const handleUnfriend = async () => {
    try {
      await unfriend(currentUserId); // Gọi API hủy kết bạn
      setFriendshipStatus('none');
      setFriendshipId(null);
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  };

  if (loggedInUserId === currentUserId) {
    return null; // Không hiển thị nút cho chính người dùng
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      {friendshipStatus === 'friend' ? (
        <>
          <span className="text-green-600 font-semibold">Bạn bè</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition"
            onClick={handleUnfriend}
          >
            Hủy kết bạn
          </button>
        </>
      ) : friendshipStatus === 'pendingSent' ? (
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition"
          onClick={handleCancelFriendship}
        >
          Hủy yêu cầu
        </button>
      ) : (
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
          onClick={handleFriendRequest}
        >
          Kết bạn
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
