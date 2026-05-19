import { Route, Routes } from "react-router-dom"
import Home from "./pages/store/homePage"
import CartPage from "./pages/store/cartPage"
import CheckoutPage from "./pages/store/checkoutPage"
import AdminProductPage from "./pages/admin/productPage"
import CreateProductPage from "./pages/admin/createProductPage"
import AdminOrdersPage from "./pages/admin/ordersPage"
import AdminDashboardPage from "./pages/admin/dashboardPage"

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
