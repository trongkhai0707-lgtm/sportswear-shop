import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartDetails,
  type CartDetailResponse,
  updateCartItem,
  deleteCartItem,
} from "../../services/CartService";
import { getAccessToken } from "../../services/AuthService";
import CartItemComponent from "../../components/user/CartItem";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        setCart(null);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const data = await fetchCartDetails();
        setCart(data);
      } catch {
        setError("Không thể tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleQuantityChange = async (itemId: number, qty: number) => {
    if (!cart) return;

    // Optimistically update UI
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) =>
          it.itemId === itemId
            ? { ...it, quantity: qty, subtotal: it.price * qty }
            : it,
        ),
        totalItems: prev.items.reduce(
          (s, it) => s + (it.itemId === itemId ? qty : it.quantity),
          0,
        ),
        totalAmount: prev.items.reduce(
          (s, it) =>
            s +
            (it.itemId === itemId ? it.price * qty : it.price * it.quantity),
          0,
        ),
      };
    });

    setUpdating(itemId);
    try {
      await updateCartItem(itemId, qty);
    } catch {
      setError("Cập nhật thất bại.");
      // refresh cart from server on failure
      try {
        const data = await fetchCartDetails();
        setCart(data);
      } catch {
        // ignore
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (itemId: number) => {
    setUpdating(itemId);
    try {
      await deleteCartItem(itemId);
      setCart((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((it) => it.itemId !== itemId) }
          : prev,
      );
    } catch {
      setError("Xóa thất bại.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
          Đang tải giỏ hàng...
        </div>
      </main>
    );
  }

  const token = getAccessToken();
  if (!token) {
    return (
      <main className="p-6">
        <div className="mx-auto max-w-2xl rounded border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">Cần đăng nhập để truy cập</h2>
          <p className="mt-3 text-gray-600">
            Vui lòng đăng nhập để xem giỏ hàng.
          </p>
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
        <div className="mx-auto max-w-4xl rounded border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold">Giỏ hàng của bạn trống</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold">Giỏ hàng</h2>
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            {cart.items.map((item) => (
              <CartItemComponent
                key={item.itemId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
                updating={updating}
              />
            ))}
          </div>

          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-6 rounded-lg border bg-white p-4">
              <div className="text-sm text-gray-500">Tổng thanh toán</div>
              <div className="text-2xl font-bold text-red-600">
                {cart.totalAmount.toLocaleString("vi-VN")}đ
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate("/dat-hang")}
                  className="w-full rounded bg-red-600 px-6 py-3 text-white"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
