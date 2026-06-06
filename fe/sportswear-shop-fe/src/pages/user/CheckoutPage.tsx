import { useEffect, useState, type FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCartDetails, type CartDetailResponse } from "../../services/CartService";
import { getAccessToken } from "../../services/AuthService";
import { fetchUserProfile } from "../../services/UserService";
import {
  fetchPaymentMethods,
  submitCheckout,
  type PaymentMethod,
} from "../../services/OrderService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDetailResponse | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = getAccessToken();
      if (!token) {
        navigate("/dang-nhap");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [cartData, profile, methods] = await Promise.all([
          fetchCartDetails(),
          fetchUserProfile(),
          fetchPaymentMethods(),
        ]);

        setCart(cartData);
        setPaymentMethods(methods);

        // Pre-fill form with user profile data
        if (profile) {
          setFormData({
            fullName: profile.fullName || "",
            phone: profile.phone || "",
            address: profile.address || "",
            note: "",
          });
        }

        // Select first payment method by default
        if (methods.length > 0) {
          setSelectedPaymentMethod(methods[0].id);
        }
      } catch {
        setError("Không thể tải thông tin thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [navigate]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        shippingInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          note: formData.note,
        },
        paymentMethodId: selectedPaymentMethod || 0,
      };
      console.log("Checkout payload:", payload);
      await submitCheckout(payload);
      // Redirect to success page or show success message
      navigate("/");
    } catch (err) {
      console.error("Checkout error:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
      }
      // Log axios error response if available
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status: number; data: unknown } };
        console.error("Error response status:", axiosErr.response?.status);
        console.error("Error response data:", axiosErr.response?.data);
      }
      setError("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
          Đang tải thông tin thanh toán...
        </div>
      </main>
    );
  }

  const token = getAccessToken();
  if (!token) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-2xl rounded border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">Cần đăng nhập để tiếp tục</h2>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/dang-nhap")}
              className="rounded-full bg-red-600 px-6 py-3 text-white"
            >
              Đến trang đăng nhập
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-2xl rounded border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">Giỏ hàng trống</h2>
          <button
            onClick={() => navigate("/gio-hang")}
            className="mt-4 rounded bg-red-600 px-6 py-2 text-white"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold">Đặt hàng</h2>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* LEFT: Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* User Info */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Thông tin giao hàng</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFormChange("fullName", e.target.value)}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    required
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleFormChange("note", e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Phương thức thanh toán</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-red-600 px-6 py-3 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </form>

          {/* RIGHT: Order Summary */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-6 rounded-lg border bg-white p-4">
              <h3 className="mb-4 text-lg font-semibold">Đơn hàng</h3>

              <div className="space-y-3 border-b pb-4">
                {cart.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-gray-500">{item.color} - {item.sizeName}</div>
                      <div className="text-gray-500">x{item.quantity}</div>
                    </div>
                    <div className="text-right font-medium">
                      {item.subtotal.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{cart.totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-600">
                    {cart.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
