import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { getAccessToken, logout } from "../../services/AuthService";
import UserInfoSection from "../../components/user/account/UserInfoSection";
import OrderListSection from "../../components/user/account/OrderListSection";

type ActiveTab = "info" | "orders";

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/dang-nhap");
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/dang-nhap");
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
          Đang tải...
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold">Tài khoản</h2>

        <div className="flex gap-6">
          {/* LEFT: Sidebar Menu */}
          <aside className="w-64 flex-shrink-0">
            <div className="rounded-lg border bg-white p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition ${
                    activeTab === "info"
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaUser className="text-lg" />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition ${
                    activeTab === "orders"
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaClipboardList className="text-lg" />
                  Danh sách đơn hàng
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <FaSignOutAlt className="text-lg" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </aside>

          {/* RIGHT: Content */}
          <div className="flex-1">
            {activeTab === "info" && <UserInfoSection />}
            {activeTab === "orders" && <OrderListSection />}
          </div>
        </div>
      </div>
    </main>
  );
}
