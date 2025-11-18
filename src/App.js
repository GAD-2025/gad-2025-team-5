import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import List from './List';
import Onboarding from './Onboarding';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/list/:category" element={<List />} />
      </Routes>
    </Router>
  );
}

export default App;
