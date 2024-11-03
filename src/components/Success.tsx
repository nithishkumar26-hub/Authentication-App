import { useNavigate } from 'react-router-dom';
import  supabase from '../supabaseClient';
import { useEffect } from 'react';

const Success = () => {
  const navigate = useNavigate();
  
  //useeffect hook for getting user data
  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user);
          
        }
      });
    }
    getUserData();
  }, []);

  //function for user logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#7958D2] text-white font-roboto">
      <h1 className="text-4xl font-bold mb-8">Successfully Logged in!</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 text-lg font-semibold bg-white text-violet-500 rounded-lg shadow-md hover:bg-violet-100 transition"
      >
        Log out
      </button>
    </div>
  );
};

export default Success;
