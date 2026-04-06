import { Route, Routes } from "react-router-dom"
import Home from "./pages/HomePage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import AdminProductPage from "./pages/AdminProductPage"
import CreateProductPage from "./pages/CreateProductPage"
import AdminOrdersPage from "./pages/AdminOrdersPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminProductPage />} />
      <Route path="/admin/create" element={<CreateProductPage />} />
      <Route path="/admin/edit/:id" element={<CreateProductPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  )
}

export default App
