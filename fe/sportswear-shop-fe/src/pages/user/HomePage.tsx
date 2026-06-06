import { useEffect, useState } from "react";
import BannerSlider from "../../components/user/BannerSlider";
import ProductGrid from "../../components/user/ProductGrid";
import { fetchProductsByCategory, fetchProducts , type ProductItem } from "../../services/ProductService";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [shirtProducts, setShirtProducts] = useState<ProductItem[]>([]);
  const [shoeProducts, setShoeProducts] = useState<ProductItem[]>([]);

    useEffect(() => {
      try {
        const fetchFeaturedProducts = async () => {
          const products = await fetchProducts();
          setFeaturedProducts(products);
        };
        const fetchShirtProducts = async () => {
          const products = await fetchProductsByCategory(1);
          setShirtProducts(products);
        };
        const fetchShoeProducts = async () => {
          const products = await fetchProductsByCategory(3);
          setShoeProducts(products);
        }
        fetchFeaturedProducts();
        fetchShirtProducts();
        fetchShoeProducts();
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    }, []);
  return (
    <div>
      <BannerSlider />

      <ProductGrid title="Sản phẩm nổi bật" products={featuredProducts} />

      <ProductGrid title="Áo thun" products={shirtProducts} />

      <ProductGrid title="Giày thể thao" products={shoeProducts} />
    </div>
  );
}