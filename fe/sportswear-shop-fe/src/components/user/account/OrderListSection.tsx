import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../../services/OrderService";

export default function OrderListSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch {
        setError("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return (
      <div className="rounded border border-gray-200 bg-white p-6 text-center text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-white p-6 text-center text-gray-600">
        Chưa có đơn hàng nào
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "PENDING": "Đang xử lý",
      "CONFIRMED": "Đã xác nhận",
      "SHIPPED": "Đang giao",
      "DELIVERED": "Đã giao",
      "CANCELLED": "Đã hủy",
    };
    return statusMap[status.toUpperCase()] || status;
  };

  const getPaymentStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "PENDING": "Chưa thanh toán",
      "PAID": "Đã thanh toán",
      "FAILED": "Thanh toán thất bại",
    };
    return statusMap[status.toUpperCase()] || status;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Danh sách đơn hàng</h3>

      {orders.map((order) => (
        <div key={order.orderId} className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <div>
              <div className="text-sm text-gray-500">Đơn hàng #{order.orderId}</div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="flex gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusBadgeColor(
                  order.paymentStatus
                )}`}
              >
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4 space-y-3 border-b pb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-gray-500">
                    {item.color} - {item.size} (x{item.quantity})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {item.subtotal.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-gray-500">
                    {item.price.toLocaleString("vi-VN")}đ/cái
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Info */}
          <div className="mb-4 grid grid-cols-2 gap-4 border-b pb-4 text-sm">
            <div>
              <div className="font-medium text-gray-600">Người nhận</div>
              <div>{order.shippingInfo.fullName}</div>
              <div className="text-gray-600">{order.shippingInfo.phone}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">Địa chỉ giao hàng</div>
              <div>{order.shippingInfo.address}</div>
            </div>
          </div>

          {/* Payment & Total */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-gray-600">Phương thức thanh toán: </span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Tổng cộng</div>
              <div className="text-2xl font-bold text-red-600">
                {order.totalAmount.toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
