import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import List from './List';
import DetailPage from './DetailPage';
import Register from './Register';
import PaymentPage from './PaymentPage';
import Onboarding from './pages/Onboarding';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import CommunityPage from './CommunityPage';
import ChatPage from './ChatPage';
import ConversationListPage from './pages/ConversationListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/chat" element={<ConversationListPage />} />
        </Route>
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/list/*" element={<List />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
