import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  // Function to handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar w-full bg-white shadow-md">
      <div className="navbar-container max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="logo text-3xl font-bold text-gray-800">
          <Link to="/" className="hover:text-gray-900">ShopEase</Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar flex items-center">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Icons (Cart & User) */}
        <div className="nav-icons flex items-center space-x-4">
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">Cart</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="nav-links flex justify-center space-x-8 py-3">
        <ul className="flex justify-center space-x-8 py-3">
          <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
          <li><Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link></li>
          <li><Link to="/offers" className="text-gray-600 hover:text-gray-900">Offers</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
