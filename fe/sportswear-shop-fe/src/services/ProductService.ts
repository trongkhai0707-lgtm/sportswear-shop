import axiosInstance from "./axiosInstance";

const PRODUCTS_API_URL = "/products";

export interface ProductApiResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  imageUrl: string | null;
  active: boolean;
  categoryId: number;
  categoryName: string;
  minPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: number;
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  categoryName: string;
  description: string;
}

export interface ProductVariantResponse {
  id: number;
  color: string;
  sizeName: string;
  price: number;
  stock: number;
}

const mapProductResponse = (product: ProductApiResponse): ProductItem => ({
  id: product.id,
  name: product.name,
  description: product.description,
  categoryName: product.categoryName,
  price: product.minPrice
    ? product.minPrice.toLocaleString("vi-VN") + "đ"
    : "Liên hệ",
  oldPrice: "",
  image:
    product.imageUrl && product.imageUrl.trim()
      ? product.imageUrl
      : "https://via.placeholder.com/400x320?text=No+Image",
});

export const fetchProducts = async (): Promise<ProductItem[]> => {
  const response =
    await axiosInstance.get<ProductApiResponse[]>(PRODUCTS_API_URL);
  return response.data.map(mapProductResponse);
};

export const fetchProductsByCategorySlug = async (
  slug: string,
): Promise<ProductItem[]> => {
  const response = await axiosInstance.get<ProductApiResponse[]>(
    `${PRODUCTS_API_URL}/category/slug/${slug}`,
  );
  return response.data.map(mapProductResponse);
};

export const fetchProductById = async (
  productId: number,
): Promise<ProductApiResponse> => {
  const response = await axiosInstance.get<ProductApiResponse>(
    `${PRODUCTS_API_URL}/${productId}`,
  );
  return response.data;
};

export const fetchProductsByCategory = async (
  categoryId: number,
): Promise<ProductItem[]> => {
  const response = await axiosInstance.get<ProductApiResponse[]>(
    `${PRODUCTS_API_URL}/category/id/${categoryId}`,
  );
  return response.data.map(mapProductResponse);
};

export const fetchProductVariants = async (
  productId: number,
): Promise<ProductVariantResponse[]> => {
  const response = await axiosInstance.get<ProductVariantResponse[]>(
    `${PRODUCTS_API_URL}/${productId}/variants`,
  );
  return response.data;
};

export const searchProducts = async (
  keyword: string,
): Promise<ProductItem[]> => {
  if (!keyword.trim()) return [];
  const response = await axiosInstance.get<ProductApiResponse[]>(
    `${PRODUCTS_API_URL}/search`,
    { params: { keyword: keyword.trim() } },
  );
  return response.data.map(mapProductResponse);
};
