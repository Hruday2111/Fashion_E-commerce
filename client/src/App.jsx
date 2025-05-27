import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SearchedProducts from './pages/SearchedProducts';
// import OrderSummary from './pages/OrderSummary';
import Checkout from './pages/Checkout';
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import BuyNow from './pages/BuyNow';

import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ useAuth imported here


// AppContent is separated so it can use useLocation (inside <Router>)
function AppContent() {
  const location = useLocation();
  const { loading } = useAuth(); // ✅ Access context values correctly

  if (loading) {
    return <div>Loading...</div>; // Or your custom spinner
  }

  const hideNavbarPaths = ['/login']; // Add more paths if you want to hide the navbar
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* <Route path="/ordersummary/:id" element={<OrderSummary />} /> */}
        <Route path="/checkout_cart" element={<Checkout />} />
        <Route path="/buynow/:id" element={<BuyNow />} />
        <Route path="/search" element={<SearchedProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

// Main App component wraps everything with AuthProvider and Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
