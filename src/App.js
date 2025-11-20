import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';
import Onboarding from './pages/Onboarding';
import DetailPage from './DetailPage';
import BookDetail from './BookDetail';
import Register from './Register';
import RegisterPage2 from './RegisterPage2';
import CommunityPage from './CommunityPage'; // Use the new CommunityPage
import ChatPage from './ChatPage'; // Keep local change
import OnboardingPage2 from './pages/OnboardingPage2';
import PaymentPage from './PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/list/:category" element={<List />} />
        <Route path="/book/:title" element={<DetailPage />} />
        <Route path="/book-detail" element={<BookDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register2" element={<RegisterPage2 />} />
        <Route path="/community" element={<CommunityPage />} /> {/* Use the new CommunityPage */}
        <Route path="/chat/:title" element={<ChatPage />} /> {/* Keep local change */}
        <Route path="/onboarding2" element={<OnboardingPage2 />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
