import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';
import Onboarding from './Onboarding';
import DetailPage from './DetailPage';
import BookDetail from './BookDetail';
import Register from './Register';
import RegisterPage2 from './RegisterPage2';
import Community from './Community'; // Keep remote change
import ChatPage from './ChatPage'; // Keep local change

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
        <Route path="/community" element={<Community />} /> {/* Keep remote change */}
        <Route path="/chat/:title" element={<ChatPage />} /> {/* Keep local change */}
      </Routes>
    </Router>
  );
}

export default App;
