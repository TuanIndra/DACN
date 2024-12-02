import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/login/login';
import Homepage from './component/Home/homePage';
import Register from './component/login/register';
import PostDetail from './component/Home/PostDetail';
import FriendsPage from './component/Friend/FriendsPage';
import Profile from'./component/Profile/profile';
import ForgotPassword from './component/login/ForgotPassword';
import ResetPassword from './component/login/ResetPassword';
import Welcome from './component/Home/welcome';
import Settings from './component/Home/Settings';
import GroupList from './component/Group/GroupList';
import GroupDetail from './component/Group/GroupDetail';
import CreateGroup from './component/Group/CreateGroup';
import GroupDetailPage from './component/Group/GroupDetailPage';
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/post/:id" element={<PostDetail />} /> {/* Thêm route */}
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/groups" element={<GroupList />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
