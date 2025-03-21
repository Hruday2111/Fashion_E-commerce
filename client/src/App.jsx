import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail"
// import Categories from "./pages/Categories";
// import Offers from "./pages/Offers";
// import Cart from "./pages/Cart";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
