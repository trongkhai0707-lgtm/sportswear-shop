import { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  fetchAdminOrderDetail,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/AdminService";
import type { AdminOrder, AdminOrderDetail } from "../../services/AdminService";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const paymentColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetchAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  const openDetail = async (orderId: number) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const data = await fetchAdminOrderDetail(orderId);
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOrderStatus = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      // Cập nhật local state
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
      );
      if (detail?.orderId === orderId) {
        setDetail((prev) => (prev ? { ...prev, status } : prev));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatus = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    try {
      await updatePaymentStatus(orderId, status);
      if (detail?.orderId === orderId) {
        setDetail((prev) => (prev ? { ...prev, paymentStatus: status } : prev));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Đang tải...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
        <span className="text-sm text-gray-500">
          {filtered.length} đơn hàng
        </span>
      </div>

      {/* Filter */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <option value="">Tất cả trạng thái</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        {/* Table */}
        <div
          className={`bg-white rounded-lg border overflow-hidden ${detail ? "w-1/2" : "w-full"}`}
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o.orderId}
                    onClick={() => openDetail(o.orderId)}
                    className={`hover:bg-gray-50 cursor-pointer ${detail?.orderId === o.orderId ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-gray-400">#{o.orderId}</td>
                    <td className="px-4 py-3 font-medium">{o.customerName}</td>
                    <td className="px-4 py-3">
                      {o.totalAmount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[o.status] ?? "bg-gray-100 text-gray-500"}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {o.paymentMethod ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {(detail || detailLoading) && (
          <div className="w-1/2 bg-white rounded-lg border p-5 space-y-4 self-start">
            {detailLoading ? (
              <p className="text-gray-400 text-sm">Đang tải chi tiết...</p>
            ) : detail ? (
              <>
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold">Đơn hàng #{detail.orderId}</h2>
                  <button
                    onClick={() => setDetail(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Thông tin khách */}
                <div className="text-sm space-y-1 text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">
                      Khách hàng:
                    </span>{" "}
                    {detail.customerName}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Email:</span>{" "}
                    {detail.customerEmail}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">SĐT:</span>{" "}
                    {detail.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
                    {detail.shippingAddress}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">
                      Thanh toán:
                    </span>{" "}
                    {detail.paymentMethod}
                  </p>
                </div>

                {/* Cập nhật trạng thái đơn */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Trạng thái đơn hàng</p>
                  <div className="flex gap-2 flex-wrap">
                    {ORDER_STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={
                          detail.status === s || updatingId === detail.orderId
                        }
                        onClick={() => handleOrderStatus(detail.orderId, s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          detail.status === s
                            ? (statusColor[s] ?? "bg-gray-100") +
                              " border-transparent"
                            : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cập nhật trạng thái thanh toán */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Trạng thái thanh toán</p>
                  <div className="flex gap-2 flex-wrap">
                    {PAYMENT_STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={
                          detail.paymentStatus === s ||
                          updatingId === detail.orderId
                        }
                        onClick={() => handlePaymentStatus(detail.orderId, s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          detail.paymentStatus === s
                            ? (paymentColor[s] ?? "bg-gray-100") +
                              " border-transparent"
                            : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm font-medium mb-2">Sản phẩm</p>
                  <div className="divide-y border rounded-lg overflow-hidden">
                    {detail.items.map((item, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 text-sm flex justify-between"
                      >
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-400">
                            {item.color} / {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.subtotal.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng */}
                <div className="flex justify-between text-sm font-semibold border-t pt-3">
                  <span>Tổng cộng</span>
                  <span>{detail.totalAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
