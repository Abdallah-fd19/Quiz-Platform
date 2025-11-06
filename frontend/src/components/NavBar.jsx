import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleClick = () =>{
    setIsOpen((prev) => !prev)
  }
  return (
    <div className="fixed top-0 left-0 py-2 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-rose-600 hover:text-rose-700 transition-colors">
            QuizMaster
          </Link>
          {/* For Mobile */}
          <div className='flex flex-col justify-center items-center gap-y-4 md:hidden' onClick={handleClick}>
            {isOpen ? <IoClose className='size-6 text-rose-600 hover:text-rose-400' /> : <RxHamburgerMenu className='size-6 text-rose-600 hover:text-rose-400'/> }
            
            <div className={`${isOpen ? "flex flex-col gap-y-4 items-center space-x-8" : "hidden"} `}>
            <Link to="/" className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors font-medium">
              Home
            </Link>
            <Link
                  to="/quiz/generate"
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Generate Quiz
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
              
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>                
              </div>
            )}
            </div>
          </div>
          {/* For Tablets Laptops */}
          <div className={`hidden md:flex items-center space-x-8`}>
            <Link to="/" className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors font-medium">
              Home
            </Link>
            <Link
                  to="/quiz/generate"
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Generate Quiz
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
              
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-rose-500 hover:text-rose-700 cursor-pointer transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar
