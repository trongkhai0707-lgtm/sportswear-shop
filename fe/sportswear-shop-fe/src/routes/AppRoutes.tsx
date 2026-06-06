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

export default function AppRoutes() {
  return (
    <Routes>

      {/* MAIN WEBSITE */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/tat-ca-san-pham"
          element={<ProductListPage />}
        />

        <Route
          path="/the-loai-san-pham/:categorySlug"
          element={<ProductByCategoryPage/>}
        />

        <Route
          path="/san-pham/:productId"
          element={<ProductDetailPage />}
        />
        <Route
          path="/gio-hang"
          element={<CartPage />}
        />
        <Route
          path="/dat-hang"
          element={<CheckoutPage />}
        />
        <Route
          path="/tai-khoan"
          element={<AccountPage />}
        />
      </Route>

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route
          path="/dang-nhap"
          element={<LoginPage />}
        />
        <Route
          path="/dang-ky"
          element={<RegisterPage />}
        />
      </Route>

    </Routes>
  );
}