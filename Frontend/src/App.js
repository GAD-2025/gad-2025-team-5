import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';
import Onboarding from './pages/Onboarding';
import LoginPage from './pages/LoginPage';
import DetailPage from './DetailPage';
import BookDetail from './BookDetail';
import Register from './Register';
import RegisterPage2 from './RegisterPage2';
import CommunityPage from './CommunityPage'; // Use the new CommunityPage
import ChatPage from './ChatPage'; // Keep local change
import OnboardingPage2 from './pages/OnboardingPage2';
import PaymentPage from './PaymentPage';
import RegisterPage from './pages/RegisterPage';


import Layout from './Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/register2" element={<RegisterPage2 />} />
        <Route path="/onboarding2" element={<OnboardingPage2 />} />

        {/* Routes that should have the bottom navigation bar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/list/:category" element={<List />} />
          <Route path="/book/:title" element={<DetailPage />} />
          <Route path="/book-detail" element={<BookDetail />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/chat/:title" element={<ChatPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
