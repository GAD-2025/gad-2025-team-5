import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNavBar.css';
import { ReactComponent as HomeIcon } from './assets/home.svg';
import { ReactComponent as CommunityIcon } from './assets/users.svg';
import { ReactComponent as RegisterIcon } from './assets/archive.svg';
import { ReactComponent as ChatIcon } from './assets/chat-typing-alt.svg';
import { ReactComponent as MyPageIcon } from './assets/user.svg'; // Assuming a user icon for My Page

const BottomNavBar = () => {
  return (
    <div className="bottom-nav-bar">
      <NavLink to="/" className="nav-item" activeClassName="active">
        <HomeIcon />
        <span>홈</span>
      </NavLink>
      <NavLink to="/community" className="nav-item" activeClassName="active">
        <CommunityIcon />
        <span>커뮤니티</span>
      </NavLink>
      <NavLink to="/register" className="nav-item" activeClassName="active">
        <RegisterIcon />
        <span>등록</span>
      </NavLink>
      <NavLink to="/chat" className="nav-item" activeClassName="active">
        <ChatIcon />
        <span>채팅</span>
      </NavLink>
      <NavLink to="/mypage" className="nav-item" activeClassName="active">
        <MyPageIcon />
        <span>마이</span>
      </NavLink>
    </div>
  );
};

export default BottomNavBar;