import axios from "axios";
import { getAccessToken } from "./AuthService";

const PAYMENT_API_URL = "http://localhost:8080/api/v1/payment-methods";
const ORDERS_API_URL = "http://localhost:8080/api/v1/orders";

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  note: string;
}

export interface CheckoutRequest {
  shippingInfo: ShippingInfo;
  paymentMethodId: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  status: string;
  totalAmount: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await axios.get<PaymentMethod[]>(PAYMENT_API_URL);
  return response.data;
};

export const submitCheckout = async (payload: CheckoutRequest): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  await axios.post(`${ORDERS_API_URL}/checkout`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchOrders = async (): Promise<Order[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  const response = await axios.get<Order[]>(ORDERS_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
