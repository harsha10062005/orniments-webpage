import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminPagePhotos from './pages/admin/AdminPagePhotos'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminBanners from './pages/admin/AdminBanners'
import AdminInstagram from './pages/admin/AdminInstagram'
import MainLayout from './components/layouts/MainLayout'
import AdminLayout from './components/layouts/AdminLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductForm />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/page-photos" element={<AdminPagePhotos />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
        <Route path="/admin/instagram" element={<AdminInstagram />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

