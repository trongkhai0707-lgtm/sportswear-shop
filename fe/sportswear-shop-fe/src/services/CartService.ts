import axiosInstance from "./axiosInstance";

const CART_API_URL = "/cart";

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
  const response = await axiosInstance.get<CartResponse>(CART_API_URL);
  return response.data?.totalItems ?? 0;
};

export interface AddToCartRequest {
  productId: number;
  variantId: number;
  quantity: number;
}

export const fetchCartDetails =
  async (): Promise<CartDetailResponse | null> => {
    const response = await axiosInstance.get<CartDetailResponse>(CART_API_URL);
    return response.data;
  };

export const addToCart = async (payload: AddToCartRequest): Promise<void> => {
  await axiosInstance.post(`${CART_API_URL}/add`, payload);
};

export const updateCartItem = async (
  itemId: number,
  quantity: number,
): Promise<void> => {
  await axiosInstance.put(
    `${CART_API_URL}/items/${itemId}?quantity=${quantity}`,
    null,
  );
};

export const deleteCartItem = async (itemId: number): Promise<void> => {
  await axiosInstance.delete(`${CART_API_URL}/items/${itemId}`);
};
