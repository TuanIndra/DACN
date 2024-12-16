import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'; // Import Navbar
import emailjs from 'emailjs-com';

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const feedbackOptions = [
    { value: '', label: 'Chọn vấn đề...' },
    { value: 'bug', label: 'Lỗi hệ thống' },
    { value: 'ui', label: 'Góp ý giao diện' },
    { value: 'feature', label: 'Đề xuất tính năng' },
    { value: 'other', label: 'Khác' },
  ];

  const handleSendFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackType || !message || !email) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Gửi email qua EmailJS
      await emailjs.send(
        'YOUR_SERVICE_ID', // Thay thế bằng ID dịch vụ EmailJS
        'YOUR_TEMPLATE_ID', // Thay thế bằng ID mẫu EmailJS
        {
          feedback_type: feedbackType,
          message: message,
          user_email: email,
        },
        'YOUR_PUBLIC_KEY' // Thay thế bằng Public Key EmailJS
      );

      setSuccess(true);
      setMessage('');
      setEmail('');
      setFeedbackType('');
    } catch (err) {
      console.error('Error sending feedback:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Gửi Phản Hồi</h1>

          {success && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
              Cảm ơn bạn đã gửi phản hồi. Chúng tôi sẽ xem xét trong thời gian sớm nhất.
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSendFeedback}>
            {/* Chọn loại vấn đề */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Chọn vấn đề
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
              >
                {feedbackOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email của bạn
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Nội dung phản hồi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nội dung phản hồi
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Nhập nội dung phản hồi của bạn"
                className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
                required
              ></textarea>
            </div>

            {/* Gửi phản hồi */}
            <button
              type="submit"
              className={`w-full p-2 text-white rounded-lg ${
                loading ? 'bg-gray-500' : 'bg-primary hover:bg-primary/90'
              }`}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
