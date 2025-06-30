import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SearchedProducts from './pages/SearchedProducts';

import Checkout from './pages/Checkout';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import BuyNow from './pages/BuyNow';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

import { AuthProvider, useAuth } from './context/AuthContext'; // useAuth imported here
import { GoogleAuthProvider } from './context/GoogleAuthContext'; // Import GoogleAuthProvider

// AppContent is separated so it can use useLocation (inside <Router>)
function AppContent() {
  const location = useLocation();
  const { loading, user, isLoggedIn } = useAuth(); // Access user and isLoggedIn from context

  console.log("AuthContext user:", user, "isLoggedIn:", isLoggedIn); // Debug log

  if (loading) {
    return <div>Loading...</div>; // Or your custom spinner
  }

  const hideNavbarPaths = ['/login', '/signup']; // Add more paths if you want to hide the navbar
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  // Admin route protection
  function AdminRoute({ children }) {
    const { loading, user } = useAuth();
    console.log("AdminRoute check - loading:", loading, "user:", user);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/" />;
    return children;
  }

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* <Route path="/ordersummary/:id" element={<OrderSummary />} /> */}
        <Route path="/checkout_cart" element={<Checkout />} />
        <Route path="/buynow/:id" element={<BuyNow />} />
        <Route path="/search" element={<SearchedProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </>
  );
}

// Main App component wraps everything with AuthProvider and Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <GoogleAuthProvider>
          <AppContent />
        </GoogleAuthProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
