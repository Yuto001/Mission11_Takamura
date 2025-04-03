import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProjectsPage from './pages/ProjectsPage';
import AddCartPage from './pages/AddCartPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import AdminProjectsPage from './pages/AdminProjectsPage';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route
              path="/addCart/:title/:bookID/:price"
              element={<AddCartPage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminbooks" element={<AdminProjectsPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
