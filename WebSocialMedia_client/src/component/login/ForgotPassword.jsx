import React, { useState } from 'react';
import { forgotPassword } from '../../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 dark:text-gray-300 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-80 transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
