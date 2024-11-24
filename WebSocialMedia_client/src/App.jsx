import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/login/login';
import Homepage from './component/Home/homePage';
import Register from './component/login/register';
import PostDetail from './component/Home/PostDetail';
import FriendsPage from './component/Friend/FriendsPage';
import Profile from'./component/Profile/profile';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/post/:id" element={<PostDetail />} /> {/* Thêm route */}
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/friends" element={<FriendsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
