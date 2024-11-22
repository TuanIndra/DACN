import React from 'react';

const Post = ({ post }) => {
  const { id, content, user, createdAt, mediaList, comments, reactions, shares } = post;

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <div className="flex items-center mb-2">
        <img
          src={user.avatarUrl ? `http://localhost:8082/uploads/${user.avatarUrl}` : '/default-avatar.png'}

          alt={user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-bold">{user.name}</h3>
          <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      <p className="mb-2">{content}</p>
      {mediaList && mediaList.length > 0 && (
        <div className="mb-2">
          {mediaList.map((media) => (
            <img key={media.id} src={`http://localhost:8082${media.url}`} alt="Media" className="w-full rounded mb-2" />
          ))}
        </div>
      )}
      <div className="flex items-center mt-2">
        <span className="mr-4">{reactions.length} Thích</span>
        <span className="mr-4">{comments.length} Bình luận</span>
        <span>{shares.length} Chia sẻ</span>
      </div>
    </div>
  );
};

export default Post;
