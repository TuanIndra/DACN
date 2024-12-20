import React, { useState, useEffect, useRef } from "react";

// Hàm xử lý URL ảnh đại diện
const getAvatarUrl = (avatarUrl) => {
  const defaultAvatarUrl = "http://26.159.243.47:8082/uploads/default-avatar.png";
  if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
    return defaultAvatarUrl;
  }
  const cleanedUrl = avatarUrl.replace(/\/{2,}/g, "/");
  return avatarUrl.startsWith("http")
    ? cleanedUrl
    : `http://26.159.243.47:8082/uploads${cleanedUrl.replace("/uploads", "")}`;
};

const FriendList = ({ friends, onFriendClick, currentUserId }) => {
  const [visibleFriends, setVisibleFriends] = useState([]); // Danh sách bạn bè hiển thị
  const containerRef = useRef(null);

  useEffect(() => {
    // Chỉ hiển thị những bạn bè đầu tiên khi load trang
    setVisibleFriends(friends.slice(0, 10));
  }, [friends]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - 10 // Cuộn gần cuối
    ) {
      loadMore();
    }
  };

  const loadMore = () => {
    // Tải thêm bạn bè
    const currentLength = visibleFriends.length;
    const nextBatch = friends.slice(currentLength, currentLength + 10); // Thêm 10 bạn bè tiếp theo
    if (nextBatch.length > 0) {
      setVisibleFriends((prevFriends) => [...prevFriends, ...nextBatch]);
    }
  };

  // Hàm xác định nội dung hiển thị tin nhắn cuối cùng
  const getLastMessagePreview = (friend) => {
    const lastMessage = friend.lastMessage;
    if (!lastMessage || !lastMessage.content) return "Chưa có tin nhắn.";
    return lastMessage.senderId === currentUserId
      ? `Bạn: ${lastMessage.content}`
      : `${friend.fullName || "Ẩn danh"}: ${lastMessage.content}`;
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-1/4 h-full border-r border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Bạn bè</h2>
      <div>
        {visibleFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-2 mb-2 rounded-lg hover:bg-primary/30 cursor-pointer"
            onClick={() => onFriendClick(friend.id)}
          >
            <img
              src={getAvatarUrl(friend.avatarUrl)}
              alt={friend.fullName || "Ẩn danh"}
              className="w-12 h-12 rounded-full border-2 border-primary object-cover"
            />
            <div className="ml-3">
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                {friend.fullName || "Ẩn danh"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getLastMessagePreview(friend)}
              </p>
            </div>
          </div>
        ))}
        {visibleFriends.length < friends.length && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Đang tải thêm bạn bè...
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
