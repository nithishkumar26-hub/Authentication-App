// src/components/AuthForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  supabase  from '../supabaseClient';
import { Alert } from './Alert';


interface SignupFormProps {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SigninForm: React.FC<SignupFormProps> = ({ setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>(''); 
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //useEffect hook for setting null into error validation
  useEffect(() => {
    if (emailRegex.test(email)) {
      setEmailError(null);
    }
    if (password.length >= 8) {
      setPasswordError(null);
    }
  }, [email, password]);

  const handleToggle = () => {
    navigate("/");
    setEmailError(null);
    setPasswordError(null);
  };

  //error validation
  const handleValidate = () => {
    let valid = true;

     if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must have at least 8 characters");
      valid = false;
    }

    if (valid) {
      handleLogin();
    }
  };


  //supabase api call for login the authorized account
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAlertMessage(error.message); 
      setShowAlert(true);
    } else {
      setAlertMessage("Login successful!");
      setShowAlert(true);

      if (remember) {
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          session: data.session,
          expiresAt,
        }));
      } else {
        sessionStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      }
      navigate("/success");
    }
  };

  //supabase google oauth login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setAlertMessage(error.message); 
      setShowAlert(true);
    }
  };

  //supabase api for getting data wherever event state change
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
            navigate("/success")
            console.log("signed in")
        } else if (event === 'SIGNED_OUT') {
            navigate('/');
        } 
        if (event === "PASSWORD_RECOVERY") {
            navigate("/changepass");
        }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handlePassword = () => {
    navigate("/forgotpass");
  };

  return (
    <div>
      <Alert message={alertMessage} alert={showAlert} setAlert={setShowAlert} />
      <div className="flex flex-col items-center pt-2 mb-2 bg-gray-50">
        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#7958D2] flex items-center justify-center mb-4">
              {/* Placeholder for icon or logo */}
            </div>
            <h2 className="text-2xl font-semibold mb-2">Log in to your account</h2>
            <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
          </div>

          {/* Toggle buttons for "Sign up" and "Log in" */}
          <div className="flex justify-center mb-6 w-full">
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 w-1/2 rounded-l-md border border-gray-300 focus:outline-none"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="px-4 py-2 text-sm font-medium w-1/2 bg-gray-200 text-gray-700 rounded-r-md border border-gray-300 focus:outline-none"
            >
              Log in
            </button>
          </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-500">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mr-2 mt-2" />
              <span className="font-medium">Remember for 30 days</span>
            </label>
            <button type="button" onClick={()=>handlePassword()} className="text-sm text-[#7958D2] font-medium">
              Forgot password
            </button>
          </div>

          <button type="button" onClick={()=>handleValidate()} className="w-full bg-[#7958D2] text-white p-2 rounded-md hover:bg-purple-600 transition">
            Sign in
          </button>

          <button
            type="button"
            onClick={()=>handleGoogleLogin()}
            className="w-full border mt-4 p-2 rounded-md flex items-center justify-center text-gray-600"
          >
            <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="mr-2" />
            <span className="font-semibold">Sign in with Google</span>
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Don’t have an account?{' '}
            <span onClick={()=>handleToggle()} className="text-[#7958D2] cursor-pointer">Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SigninForm;
