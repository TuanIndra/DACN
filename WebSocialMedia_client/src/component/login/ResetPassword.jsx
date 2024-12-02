import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy token từ URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage('Mật khẩu đã được đặt lại thành công!');
      setError('');
      setTimeout(() => navigate('/'), 3000); // Chuyển về trang đăng nhập sau 3 giây
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Đặt lại mật khẩu</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        {!successMessage && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="new-password">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirm-password">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-80"
              onClick={handleResetPassword}
            >
              Đặt lại mật khẩu
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
