import axios from "axios";
import { getAccessToken } from "./AuthService";

const CART_API_URL = "http://localhost:8080/api/v1/cart";

export interface CartResponse {
  totalItems: number;
}

export interface CartItem {
  itemId: number;
  productId: number;
  productName: string;
  color: string;
  sizeName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string | null;
}

export interface CartDetailResponse {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export const fetchCartCount = async (): Promise<number> => {
  const token = getAccessToken();
  if (!token) {
    return 0;
  }

  const response = await axios.get<CartResponse>(CART_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.totalItems ?? 0;
};

export interface AddToCartRequest {
  productId: number;
  variantId: number;
  quantity: number;
}

export const fetchCartDetails =
  async (): Promise<CartDetailResponse | null> => {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    const response = await axios.get<CartDetailResponse>(CART_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

export const addToCart = async (payload: AddToCartRequest): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  await axios.post(`${CART_API_URL}/add`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCartItem = async (
  itemId: number,
  quantity: number,
): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  // API expects quantity as query parameter
  await axios.put(
    `${CART_API_URL}/items/${itemId}?quantity=${quantity}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const deleteCartItem = async (itemId: number): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  await axios.delete(`${CART_API_URL}/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
