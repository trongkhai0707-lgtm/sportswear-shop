import axios from "axios";
import { getAccessToken } from "./AuthService";

const BASE = "http://localhost:8080/api/v1/admin";

const authHeader = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

// ---- Products ----
export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  imageUrl: string | null;
  active: boolean;
  categoryId: number;
  categoryName: string;
  minPrice: number;
  createdAt: string;
  updatedAt: string;
}

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const res = await axios.get(`${BASE}/products`, { headers: authHeader() });
  return res.data;
};

export interface ProductRequest {
  name: string;
  description: string;
  categoryId: number;
  brand: string;
  imageUrl: string;
  active: boolean;
}

export const createAdminProduct = async (
  data: ProductRequest,
): Promise<void> => {
  await axios.post(`${BASE}/products`, data, { headers: authHeader() });
};

export const updateAdminProduct = async (
  id: number,
  data: ProductRequest,
): Promise<void> => {
  await axios.put(`${BASE}/products/${id}`, data, { headers: authHeader() });
};

export const fetchAdminProductById = async (
  id: number,
): Promise<AdminProduct> => {
  const res = await axios.get(`${BASE}/products/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};

// ---- Orders ----
export interface AdminOrder {
  orderId: number;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export const fetchAdminOrders = async (): Promise<AdminOrder[]> => {
  const res = await axios.get(`${BASE}/orders`, { headers: authHeader() });
  return res.data;
};

export interface AdminOrderItem {
  productId: number;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface AdminOrderDetail {
  orderId: number;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: AdminOrderItem[];
}

export const fetchAdminOrderDetail = async (
  orderId: number,
): Promise<AdminOrderDetail> => {
  const res = await axios.get(`${BASE}/orders/${orderId}`, {
    headers: authHeader(),
  });
  return res.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
): Promise<void> => {
  await axios.put(`${BASE}/orders/${orderId}/status?status=${status}`, null, {
    headers: authHeader(),
  });
};

export const updatePaymentStatus = async (
  orderId: number,
  status: string,
): Promise<void> => {
  await axios.put(
    `${BASE}/orders/${orderId}/payment-status?status=${status}`,
    null,
    { headers: authHeader() },
  );
};

// ---- Category ----
export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
  active: boolean;
}

export const fetchAdminCategories = async (): Promise<AdminCategory[]> => {
  const res = await axios.get(`${BASE}/categories`, { headers: authHeader() });
  return res.data;
};

export const createAdminCategory = async (
  data: CategoryRequest,
): Promise<void> => {
  await axios.post(`${BASE}/categories`, data, { headers: authHeader() });
};

export const updateAdminCategory = async (
  id: number,
  data: CategoryRequest,
): Promise<void> => {
  await axios.put(`${BASE}/categories/${id}`, data, { headers: authHeader() });
};

export const deleteAdminCategory = async (id: number): Promise<void> => {
  await axios.delete(`${BASE}/categories/${id}`, { headers: authHeader() });
};

// ---- Users ----
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
}

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const res = await axios.get(`${BASE}/users`, { headers: authHeader() });
  return res.data;
};
