import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import profileIcon from "./profile.svg";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook to navigate
  const { isLoggedIn } = useAuth();


  // Function to handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-50 to-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              ShopEase
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-colors text-base font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Icons (Cart & User) */}
          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
            </Link>


            {isLoggedIn ? (
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <img src={profileIcon} alt="Profile" className="w-7 h-7" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-base bg-white text-blue-600 border border-blue-600 px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-center space-x-12 py-3 text-base font-medium">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-2 py-1 transition-colors border-b-2 border-transparent hover:border-blue-600"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-blue-600 px-2 py-1 transition-colors border-b-2 border-transparent hover:border-blue-600"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                to="/offers"
                className="text-gray-700 hover:text-blue-600 px-2 py-1 transition-colors border-b-2 border-transparent hover:border-blue-600"
              >
                Offers
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
