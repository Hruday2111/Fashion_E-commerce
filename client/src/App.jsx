import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SearchedProducts from './pages/SearchedProducts';
import Login from "./pages/Login";
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
        {/* <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
