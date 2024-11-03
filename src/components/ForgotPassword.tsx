// src/components/ForgotPassword.tsx

import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Alert } from './Alert';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword: React.FC = () => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>(''); 
  const [showAlert, setShowAlert] = useState(false);
  
  const navigate = useNavigate();

  //useEffect hook for setting null into error validation
  useEffect(()=>{
    if (emailRegex.test(resetEmail)) {
      setResetMessage(null);
    }

  },[resetEmail])

  //supabase api call for getting verification email for forgot password
  const handleForgotPassword = async () => {
    

    if (!emailRegex.test(resetEmail)) {
      setResetMessage("Please enter a valid email address.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
        setAlertMessage(error.message); 
        setShowAlert(true)
    } else {
      setAlertMessage("Password reset email sent! Check your inbox.");
      setShowAlert(true)
    }
  };

  return (
    <div>
        <Alert message={alertMessage} alert={showAlert} setAlert={setShowAlert} />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-roboto">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">Reset Password</h3>
            
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
            />
            
            {resetMessage && (
              <p className="mb-4  text-red-500 text-left">{resetMessage}</p>
            )}
            
            <button 
              onClick={handleForgotPassword} 
              className="w-full p-[10px] text-[18px] bg-[#7958D2] hover:bg-purple-600 text-white rounded-md mb-4 "
            >
              Send Reset Link
            </button>
            
            <button 
              onClick={() => navigate("/")} 
              className="text-sm text-white px-6 py-2 rounded-md bg-[#7958D2] hover:bg-purple-600"
            >
              Close
            </button>
          </div>
        </div>
    </div>
    
  );
};

export default ForgotPassword;
