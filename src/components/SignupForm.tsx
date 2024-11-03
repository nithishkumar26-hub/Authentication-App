// src/components/AuthForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  supabase  from '../supabaseClient';
import { Alert } from './Alert';

interface SignupFormProps {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<SignupFormProps> = ({ setIsLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
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
    
    //toggle button for changing signup and login
    const handleToggle = () => {
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setEmailError(null);
        setPasswordError(null);
    };

    //error validation for signup input 
    const handleValidateSignup = () => {
        if (!email) {
            setEmailError("Enter a Valid Email");
        }
        if (!password) {
            setPasswordError("Password is required");
        }
        if (password.length < 8) {
            setPasswordError('Password must have at least 8 characters');
        }
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
        }

        if (!emailError && !passwordError && email && password) {
            handleSignup();
        }
    };

    //supabase api for signup
    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if(error.message === "User already registered"){
                setShowAlert(true)
                setAlertMessage("User already registered! Please Log in")
            }
            else{
                setShowAlert(true)
                setAlertMessage(error.message)                
            }
            
        } else {
            setAlertMessage("Sign up successful! Please check email for confirmation");
            setShowAlert(true);
            setEmail('')
            setPassword('')
        }
    };

    //supabase api for google oauth login
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
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
        } else if (event === "PASSWORD_RECOVERY") {
            navigate("/changepass");
        }
        });

        return () => {
        authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    //form submission event
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleValidateSignup();
    };

    return (
        <div>
            <Alert message={alertMessage} alert={showAlert} setAlert={setShowAlert} />
            <div className="flex flex-col items-center p-2 mb-2 justify-center bg-gray-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
                    <div className="flex flex-col items-center mb-6">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#7958D2] flex items-center justify-center">
                                {/* Replace this div with an actual icon if needed */}
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
                        <p className="text-sm text-gray-500">Sign up to get started</p>
                    </div>

                    <div className="flex justify-center mb-6 w-full">
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-l-md border border-gray-300 focus:outline-none w-1/2"
                        >
                            Sign up
                        </button>
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="px-4 py-2 text-sm font-medium text-gray-500 rounded-r-md border border-gray-300 focus:outline-none w-1/2"
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

                    <button type="submit" className="w-full bg-[#7958D2] text-white p-2 rounded-md hover:bg-purple-600 transition">
                        Sign up
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full border mt-4 p-2 rounded-md flex items-center justify-center text-gray-600"
                    >
                        <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="mr-2" />
                        <span className="font-semibold">Sign up with Google</span>
                    </button>

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Already have an account?{' '}
                        <span onClick={handleToggle} className="text-[#7958D2] cursor-pointer">
                            Log in
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
