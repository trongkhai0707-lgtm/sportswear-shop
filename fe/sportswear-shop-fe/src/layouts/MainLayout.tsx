import { Outlet } from "react-router-dom";

import Header from "../components/user/Header";
import Footer from "../components/user/Footer";

export default function MainLayout() {
  return (
    <div>
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}
