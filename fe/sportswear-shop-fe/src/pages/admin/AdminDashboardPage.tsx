import type { AdminProduct, AdminOrder } from "../../services/AdminService";
import {
  fetchAdminProducts,
  fetchAdminOrders,
} from "../../services/AdminService";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminProducts(), fetchAdminOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Đang tải...</p>;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Tổng sản phẩm</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-5">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-3xl font-bold mt-1">{orders.length}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg border">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold">5 đơn hàng mới nhất</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-5 py-3">Mã đơn</th>
              <th className="px-5 py-3">Khách hàng</th>
              <th className="px-5 py-3">Tổng tiền</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-50">
                <td className="px-5 py-3">#{order.orderId}</td>
                <td className="px-5 py-3">{order.customerName}</td>
                <td className="px-5 py-3">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-5 py-3">{order.status}</td>
                <td className="px-5 py-3">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
