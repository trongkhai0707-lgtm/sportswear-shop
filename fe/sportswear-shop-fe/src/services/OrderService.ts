import axiosInstance from "./axiosInstance";

const PAYMENT_API_URL = "/payment-methods";
const ORDERS_API_URL = "/orders";

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
  const response = await axiosInstance.get<PaymentMethod[]>(PAYMENT_API_URL);
  return response.data;
};

export const submitCheckout = async (
  payload: CheckoutRequest,
): Promise<number> => {
  const response = await axiosInstance.post<{ orderId: number }>(
    `${ORDERS_API_URL}/checkout`,
    payload,
  );
  return response.data.orderId;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>(ORDERS_API_URL);
  return response.data;
};
