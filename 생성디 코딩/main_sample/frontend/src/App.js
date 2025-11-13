import React, { useState } from 'react';
import Onboarding from './Onboarding';
import MainPage from './MainPage';

function App() {
  const [page, setPage] = useState('onboarding');

  const handleNext = () => {
    setPage('main');
  };

  return (
    <div className="App">
      {page === 'onboarding' ? <Onboarding onNext={handleNext} /> : <MainPage />}
    </div>
  );
}

export default App;
