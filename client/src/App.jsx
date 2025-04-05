import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SearchedProducts from './pages/SearchedProducts';
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Cart from './pages/Cart';

import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = ['/login']; // Add more if needed
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>  
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchedProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

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
