import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/login/login';
import Homepage from './component/Home/homePage';
import Register from './component/login/register';
import PostDetail from './component/Home/PostDetail';
import FriendsPage from './component/Friend/FriendsPage';
import Profile from './component/Profile/profile';
import ForgotPassword from './component/login/ForgotPassword';
import ResetPassword from './component/login/ResetPassword';
import Welcome from './component/Home/welcome';
import Settings from './component/Home/Settings';
import GroupList from './component/Group/GroupList';
import GroupDetailPage from './component/Group/GroupDetailPage';
import CreateGroup from './component/Group/CreateGroup';
import { AuthProvider } from '../src/component/context/AuthContext';
import MessagePage from './component/Message/MessagePage';
import NotificationList from './component/Notifications/NotificationsList';
import FeedbackPage from './component/Home/FeedbackPage';
import Page404 from './component/Home/Page404';
const App = () => {
  const userId = localStorage.getItem('userId');

  // Validate the userId existence
  if (!userId) {
    console.warn('No userId found in localStorage. Redirecting to login.');
    // Optionally redirect to the login page
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<Page404 />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/messages/:receiverId" element={<MessagePage />} />
          <Route path="/notifications" element={<NotificationList userId={userId} />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
