import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import AdminLogin from './admin/Login'
import Dashboard from './admin/Dashboard'
import AddProduct from './admin/AddProduct'
import ManageProducts from './admin/ManageProducts'
import ProtectedRoute from './admin/ProtectedRoute'
import EditProduct from './admin/EditProduct'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/manage" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />
        <Route path="/admin/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}