import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../component/Navbar/Navbar';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import FriendRequestButton from './../Friend/FriendRequestButton';
import { fetchUserProfile } from '../../api/profileApi';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = parseInt(localStorage.getItem('userId'), 10) || 0;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileResponse = await fetchUserProfile(userId);
        setProfile(profileResponse.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {profile && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              userId={profile.id}
              loggedInUserId={loggedInUserId}
            />
            {/* Friend Request Button */}
            {loggedInUserId !== profile.id && (
              <div className="mt-6 flex justify-end">
                <div className="w-full sm:w-auto flex justify-center">
                  <FriendRequestButton currentUserId={profile.id} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs Section */}
        <div className="mt-6">
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userId={userId}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
