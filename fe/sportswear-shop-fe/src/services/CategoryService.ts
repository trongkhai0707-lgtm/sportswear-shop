import axios from "axios";

const CATEGORIES_API_URL = "http://localhost:8080/api/v1/categories";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(CATEGORIES_API_URL);
  return response.data;
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await axios.get<Category>(`${CATEGORIES_API_URL}/slug/${slug}`);
  return response.data;
};
