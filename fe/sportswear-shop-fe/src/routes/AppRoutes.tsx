import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/user/HomePage";
import ProductListPage from "../pages/user/ProductListPage";
import ProductDetailPage from "../pages/user/ProductDetailPage";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import AccountPage from "../pages/user/AccountPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import AuthLayout from "../layouts/AuthLayout";
import ProductByCategoryPage from "../pages/user/ProductByCategoryPage";
import OrderSuccessPage from "../pages/user/OrderSuccessPage";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "../components/auth/PrivateRoute";
import AdminRoute from "../components/auth/AdminRoute";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminProductFormPage from "../pages/admin/AdminProductFormPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
export default function AppRoutes() {
  return (
    <Routes>
      {/* MAIN WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/tat-ca-san-pham" element={<ProductListPage />} />

        <Route
          path="/the-loai-san-pham/:categorySlug"
          element={<ProductByCategoryPage />}
        />

        <Route path="/san-pham/:productId" element={<ProductDetailPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/dat-hang" element={<CheckoutPage />} />
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
        <Route path="/tai-khoan" element={<AccountPage />} />
      </Route>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route
              path="/admin/products/new"
              element={<AdminProductFormPage />}
            />
            <Route
              path="/admin/products/:id/edit"
              element={<AdminProductFormPage />}
            />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
