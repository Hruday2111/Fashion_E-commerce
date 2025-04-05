import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SearchedProducts from './pages/SearchedProducts';
import Cart from './pages/Cart';
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Cart from './pages/Cart';
// import Categories from "./pages/Categories";
// import Offers from "./pages/Offers";
// import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchedProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<Offers />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;
