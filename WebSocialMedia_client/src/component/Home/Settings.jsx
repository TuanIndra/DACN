import React, { useState, useEffect } from 'react';
import Navbar from '../../component/Navbar/Navbar';
import UpdateFullName from './../Settings/UpdateFullName';
import ChangePassword from './../Settings/ChangePassword';
import UpdateAvatar from './../Settings/UpdateAvatar';
import ForgotPassword from '../login/ForgotPassword';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('fullName');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log('User information:', userInfo); // Debug log
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b pb-2 mb-4">
          <button
            onClick={() => setActiveTab('fullName')}
            className={`px-4 py-2 ${
              activeTab === 'fullName' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
          >
            Update Full Name
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 ${
              activeTab === 'password' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-4 py-2 ${
              activeTab === 'avatar' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
            }`}
          >
            Update Avatar
          </button>
          <button
            onClick={() => setActiveTab('forgotPassword')}
            className={`px-4 py-2 ${
              activeTab === 'forgotPassword'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'fullName' && <UpdateFullName />}
          {activeTab === 'password' && <ChangePassword />}
          {activeTab === 'avatar' && <UpdateAvatar />}
          {activeTab === 'forgotPassword' && <ForgotPassword />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
