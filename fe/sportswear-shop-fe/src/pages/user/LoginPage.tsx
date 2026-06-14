import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      navigate("/");
    } catch {
      setError("Tài khoản hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="h-24 bg-white flex items-center px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>

          <h1 className="text-3xl font-bold text-red-600">Sportswear</h1>

          <span className="text-gray-400 text-2xl">|</span>

          <span className="text-2xl font-medium">Đăng nhập</span>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-96px)] bg-gradient-to-br from-red-700 via-red-600 to-red-500 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-7xl flex items-center justify-between gap-16">
          {/* Left Banner */}
          <div className="hidden lg:flex flex-1 justify-center">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
              alt="Sport Banner"
              className="w-full max-w-2xl rounded-3xl shadow-2xl object-cover"
            />
          </div>

          {/* Login Card */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Đăng nhập
            </h2>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 rounded-lg bg-red-100 border border-red-200 text-red-700 px-4 py-3">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={usernameOrEmail}
                onChange={(event) => setUsernameOrEmail(event.target.value)}
                placeholder="Email hoặc tên đăng nhập"
                className="w-full h-14 border border-gray-300 rounded-lg px-4 mb-5 outline-none focus:border-red-500 transition"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mật khẩu"
                className="w-full h-14 border border-gray-300 rounded-lg px-4 mb-6 outline-none focus:border-red-500 transition"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-gray-400 text-sm">HOẶC</span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <button className="w-full h-14 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt="Google"
                className="w-6 h-6"
              />

              <span className="text-gray-700 font-medium">
                Đăng nhập với Google
              </span>
            </button>

            {/* Register */}
            <p className="text-center text-gray-500 mt-8">
              Chưa có tài khoản?{" "}
              <a
                href="/dang-ky"
                className="text-red-600 font-semibold hover:underline"
              >
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
