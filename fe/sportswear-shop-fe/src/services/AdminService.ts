import axiosInstance from "./axiosInstance";

const BASE = "/api/v1/admin";

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
  const res = await axiosInstance.get(`${BASE}/products`);
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
  await axiosInstance.post(`${BASE}/products`, data);
};

export const updateAdminProduct = async (
  id: number,
  data: ProductRequest,
): Promise<void> => {
  await axiosInstance.put(`${BASE}/products/${id}`, data);
};

export const fetchAdminProductById = async (
  id: number,
): Promise<AdminProduct> => {
  const res = await axiosInstance.get(`${BASE}/products/${id}`);
  return res.data;
};

export interface ImageUploadResponse {
  imageUrls: string[];
  totalUploaded: number;
}

export const uploadProductImages = async (
  files: File[],
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await axiosInstance.post(
    `${BASE}/products/upload-image`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
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
  const res = await axiosInstance.get(`${BASE}/orders`);
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
  const res = await axiosInstance.get(`${BASE}/orders/${orderId}`);
  return res.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
): Promise<void> => {
  await axiosInstance.put(
    `${BASE}/orders/${orderId}/status?status=${status}`,
    null,
  );
};

export const updatePaymentStatus = async (
  orderId: number,
  status: string,
): Promise<void> => {
  await axiosInstance.put(
    `${BASE}/orders/${orderId}/payment-status?status=${status}`,
    null,
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
  const res = await axiosInstance.get(`${BASE}/categories`);
  return res.data;
};

export const createAdminCategory = async (
  data: CategoryRequest,
): Promise<void> => {
  await axiosInstance.post(`${BASE}/categories`, data);
};

export const updateAdminCategory = async (
  id: number,
  data: CategoryRequest,
): Promise<void> => {
  await axiosInstance.put(`${BASE}/categories/${id}`, data);
};

export const deleteAdminCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${BASE}/categories/${id}`);
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
  const res = await axiosInstance.get(`${BASE}/users`);
  return res.data;
};

// ---- Variants ----
export interface ProductVariant {
  id: number;
  color: string;
  sizeName: string;
  price: number;
  stock: number;
}

export interface ProductVariantRequest {
  color: string;
  sizeId: number;
  price: number;
  stock: number;
}

export const fetchAdminVariants = async (
  productId: number,
): Promise<ProductVariant[]> => {
  const res = await axiosInstance.get(`${BASE}/products/${productId}/variants`);
  return res.data;
};

export const createAdminVariant = async (
  productId: number,
  data: ProductVariantRequest,
): Promise<void> => {
  await axiosInstance.post(`${BASE}/products/${productId}/variants`, data);
};

export const updateAdminVariant = async (
  variantId: number,
  data: ProductVariantRequest,
): Promise<void> => {
  await axiosInstance.put(`${BASE}/products/variants/${variantId}`, data);
};

export const deleteAdminVariant = async (variantId: number): Promise<void> => {
  await axiosInstance.delete(`${BASE}/products/variants/${variantId}`);
};

// ---- Sizes ----
export interface Size {
  id: number;
  name: string;
}

export const fetchSizes = async (): Promise<Size[]> => {
  const res = await axiosInstance.get("/api/v1/sizes");
  return res.data;
};
