import React, { useEffect } from 'react'
import MyOrdersPage from './MyOrdersPage'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

const Profile = () => {
  const {user} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(()=>{
  if(!user){
    navigate("/login")
  }
},[user, navigate])

const handleLogout = ()=>{
  dispatch(logout());
  dispatch(clearCart());
  navigate("/login")
}

  return (
    <div className='flex-grow container mx-auto p-4 md:p-6'>
        <div className="flex md:flex-row flex-col md:space-x-6 md:space-y-0">
            {/* left section */}
            <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 ">
                <h1 className='text-2xl md:text-3xl font-bold mb-4 '>{user?.name}</h1>
                <p className='text-lg text-gray-600 mb-4'>{user?.email}</p>
                <button onClick={handleLogout} className='bg-red-500 w-full py-2 text-white px-4 hover:bg-red-600 rounded'>Logout</button>
            </div>
            {/* right section */}
            <div className="w-full md:w-2/3 lg:w-34">
                <MyOrdersPage />
            </div>
        </div>
    </div>
  )
}

export default Profile