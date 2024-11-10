import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../../api/postApi';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response.data); // Lưu trữ danh sách bài viết
      } catch (err) {
        setError('Không thể tải danh sách bài viết');
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.user.fullName}</h3>
          <p>{post.content}</p>
          {/* Hiển thị thêm thông tin khác nếu cần */}
        </div>
      ))}
    </div>
  );
};

export default PostsList;
