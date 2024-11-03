import React, { useEffect, useState } from 'react';
import  supabase  from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Alert } from './Alert';

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newpasswordError,setNewpasswordError]=useState<string |null>(null)
  const [passwordError,setPasswordError]=useState<string |null>(null)
  const [alertMessage, setAlertMessage] = useState<string>(''); 
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  //useEffect hook for setting null into error validation
  useEffect(()=>{
    if(newPassword){
        setPasswordError("Password must have atleast 8 characters")
    }
    if(newPassword.length >8){
        setPasswordError(null)
    }
    if(confirmPassword){
        setNewpasswordError(null)
    }
  },[newPassword,confirmPassword])


  //error handling for input fields
  const handleAuthenticate = () => {
    setAlertMessage("")
    setShowAlert(false)

    if (!newPassword) {
      setPasswordError("This field is required");
    } else if (newPassword.length < 8) {
      setPasswordError("Password must have at least 8 characters");
    } else {
      setPasswordError(null);
    }

    if (!confirmPassword) {
      setNewpasswordError("This field is required");
    } else {
      setNewpasswordError(null);
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true)
    }

    // Only proceed if all fields are valid and there are no errors
    if (newPassword && newPassword.length >= 8 && newPassword === confirmPassword) {
      handleChangePassword();
    }
  };
  //supabase api call for change password
  const handleChangePassword = async () => {
    

    // Reset error and success message
    setAlertMessage("")
    setShowAlert(false)
    setNewPassword('')
    setConfirmPassword("")

    // Update password with Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
        setAlertMessage(error.message); 
        setShowAlert(true);
    } else {
      setAlertMessage('Password updated successfully!');
      setShowAlert(true);
      navigate("/")
    }
  };

  return (
    <div>
        <Alert message={alertMessage} alert={showAlert} setAlert={setShowAlert} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 font-roboto ">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-medium mb-6 text-center">Change Password</h2>

                {/* New Password Input */}
                <label className="block mb-2 text-gray-700">New Password</label>
                <div className="mb-4">
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 mb-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter new password"
                />
                {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
                </div>

                {/* Confirm New Password Input */}
                <label className="block mb-2 text-gray-700">Confirm New Password</label>
                <div className="mb-4">
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 mb-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Confirm new password"
                />
                {newpasswordError && <p className="text-red-500 mb-4">{newpasswordError}</p>}
                </div>

                {/* Change Password Button */}
                <button
                onClick={handleAuthenticate}
                className="w-full bg-[#7958D2] hover:brightness-110 text-white font-semibold py-2 px-4 rounded mb-4"
                >
                Change Your Password
                </button>

                {/* Additional Links */}
                <div className="flex flex-col items-center text-sm text-gray-600">
                <span className="mb-2">
                    Didn’t receive a confirmation email?{' '}
                    <button
                    onClick={() => {navigate("/forgotpass")}}
                    className="text-[#7958D2] hover:underline"
                    >
                    Request a new one
                    </button>
                </span>
                <span>
                    Already have an account?{' '}
                    <button
                    onClick={() => navigate('/')}
                    className="text-[#7958D2] hover:underline"
                    >
                    Sign in
                    </button>
                </span>
                </div>
            </div>
        </div>


    </div>
    
  );
};

export default ChangePassword;
