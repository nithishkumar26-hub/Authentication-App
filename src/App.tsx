// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Success from './components/Success';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';




const App: React.FC = () => {
  

  return (
    <Router>
      

      <Routes>
        {/* Redirect root path to signup page */}
        <Route path="/" element={<AuthForm/>} />
        <Route path='/success' element={<Success/>}/>
        <Route path='/forgotpass' element={<ForgotPassword/>}/>
        <Route path='/changepass' element={<ChangePassword/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
