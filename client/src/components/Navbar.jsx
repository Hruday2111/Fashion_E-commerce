import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">ShopEase</Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search for products..." />
          <button>Search</button>
        </div>

        {/* Icons (Cart & User) */}
        <div className="nav-icons">
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/offers">Offers</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
