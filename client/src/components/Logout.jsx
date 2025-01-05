import React from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    
    localStorage.removeItem('auth');
    localStorage.removeItem('token');

   
    navigate('/login'); 
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 mt-5 py-3 bg-zinc-950 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
    >
      Logout
    </button>
  );
};

export default Logout;
