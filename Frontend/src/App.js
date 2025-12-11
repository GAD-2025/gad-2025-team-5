import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import List from './List';
import BookDetail from './BookDetail';
import Register from './Register';
import PaymentPage from './PaymentPage';
import Onboarding from './pages/Onboarding';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import CommunityPage from './CommunityPage';
import ChatPage from './ChatPage';
import ConversationListPage from './pages/ConversationListPage';
import CommunityPostDetail from './pages/CommunityPostDetail';

import { initializeChats } from './chatManager';
import ScrollToTop from './components/ScrollToTop';

function App() {
  initializeChats(); // Initialize chat data in localStorage
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/chat" element={<ConversationListPage />} />
          <Route path="/community/:id" element={<CommunityPostDetail />} />
        </Route>
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/list/*" element={<List />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
