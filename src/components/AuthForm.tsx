import React from 'react'
import SignupForm from './SignupForm'
import { useState } from 'react';
import SigninForm from './SigninForm';
import Arrow from "../assets/down-chevron.png"

const AuthForm:React.FC = () => {
  let [isLogin, setIsLogin] = useState(true);
  console.log(isLogin)
  
  return (
    <div className='font-roboto'>
      <nav className="flex justify-between p-4 w-full bg-gray-50">
        <div className="flex space-x-6 w-[60%] justify-center">
          <span className="text-gray-600 font-semibold">Home</span>
          <div className='space-x-2 flex flex-row'>
            <span  className="text-gray-600 font-semibold">Products</span>
            <img src={Arrow} className='w-5 h-5 mt-[0.5px] '/>
          </div>
          <div className='space-x-2 flex flex-row'>
            <span  className="text-gray-600 font-semibold">Resources</span>
            <img src={Arrow} className='w-5 h-5 mt-[0.5px]'/>
          </div>
          
          <span className="text-gray-600 font-semibold">Pricing</span>
        </div>
        <div className='space-x-4 mr-10'>
          <button  className={`${isLogin ? 'text-gray-500' : 'bg-[#7958D2] text-white'} px-4 py-2 rounded-md`}  
          onClick={()=>setIsLogin(true)}>Log in</button>
          <button  className={`${isLogin ? 'bg-[#7958D2] text-white' : 'text-gray-500'} px-4 py-2 rounded-md`}
            onClick={()=>setIsLogin(false)}>Sign up</button>
        </div>
      </nav>
      {isLogin ?

      <SigninForm isLogin={isLogin} setIsLogin={setIsLogin}/> :
      <SignupForm isLogin={isLogin} setIsLogin={setIsLogin}/>
      }
      
    </div>
  )
}

export default AuthForm