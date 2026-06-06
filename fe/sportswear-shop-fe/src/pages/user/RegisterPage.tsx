import { useState, type FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
import NotificationDialog from "../../components/util/NotificationDialog";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register({
        username,
        email,
        password,
        fullName,
        phone,
        address,
      });
      setNotificationType("success");
      setNotificationMessage("Đăng ký tài khoản thành công. Vui lòng đăng nhập.");
      setNotificationOpen(true);
    } catch {
      setNotificationType("error");
      setNotificationMessage("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
      setNotificationOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NotificationDialog
        open={notificationOpen}
        type={notificationType}
        message={notificationMessage}
        onClose={() => {
          setNotificationOpen(false);
          if (notificationType === "success") {
            navigate("/dang-nhap");
          }
        }}
      />

      <header className="h-24 bg-white flex items-center px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>

          <h1 className="text-3xl font-bold text-red-600">Sportswear</h1>

          <span className="text-gray-400 text-2xl">|</span>

          <span className="text-2xl font-medium">Đăng ký</span>
        </div>
      </header>

      <main className="min-h-[calc(100vh-96px)] bg-gradient-to-br from-red-700 via-red-600 to-red-500 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="hidden lg:flex flex-1 justify-center">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
              alt="Sport Banner"
              className="w-full max-w-2xl rounded-3xl shadow-2xl object-cover"
            />
          </div>

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Đăng ký tài khoản</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Tên đăng nhập"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mật khẩu"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Họ và tên"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Số điện thoại"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Địa chỉ"
                required
                className="w-full h-14 border border-gray-300 rounded-lg px-4 outline-none focus:border-red-500 transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-8">
              Đã có tài khoản? {" "}
              <a href="/dang-nhap" className="text-red-600 font-semibold hover:underline">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}