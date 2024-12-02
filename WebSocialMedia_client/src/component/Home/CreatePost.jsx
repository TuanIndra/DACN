import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/postApi';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && files.length === 0) {
      setError('Vui lòng nhập nội dung hoặc thêm ít nhất một tệp.');
      return;
    }

    const postDTO = { content };
    const formData = new FormData();
    formData.append('post', JSON.stringify(postDTO));

    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file));
    }

    try {
      await createPost(formData);
      setContent('');
      setFiles([]);
      setPreviewUrls([]);
      setError(null);
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
      setError(
        err.response?.data?.message || 'Đã xảy ra lỗi khi tạo bài đăng. Vui lòng thử lại!'
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      ['image/', 'video/'].some((type) => file.type.startsWith(type))
    );

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);

    const newPreviewUrls = validFiles.map((file) =>
      file.type.startsWith('image/')
        ? { type: 'image', url: URL.createObjectURL(file) }
        : { type: 'video', url: URL.createObjectURL(file) }
    );
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const removePreview = (index) => {
    URL.revokeObjectURL(previewUrls[index].url);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white"
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
          multiple
          accept="image/*,video/*"
        />

        {previewUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-4 text-primary dark:text-secondary">
              Tệp đính kèm:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {previewUrls.map((preview, index) => (
                <div key={index} className="relative">
                  {preview.type === 'image' ? (
                    <img
                      src={preview.url}
                      alt={`Preview ${index}`}
                      className="w-full h-auto max-h-[400px] object-contain rounded"
                    />
                  ) : (
                    <video
                      src={preview.url}
                      controls
                      className="w-full h-auto max-h-[400px] object-contain rounded"
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                    onClick={() => removePreview(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/80 transition"
          >
            Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
