import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';
import Onboarding from './Onboarding';
import DetailPage from './DetailPage';
import BookDetail from './BookDetail';
import Register from './Register';
import RegisterPage2 from './RegisterPage2';
import PaymentPage from './PaymentPage';
import Community from './Community';


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
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/community" element={<Community />} />

      </Routes>
    </Router>
  );
}

export default App;
