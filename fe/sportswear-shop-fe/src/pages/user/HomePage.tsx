import { useEffect, useState } from "react";
import BannerSlider from "../../components/user/BannerSlider";
import ProductGrid from "../../components/user/ProductGrid";
import {
  fetchProductsByCategorySlug,
  fetchProducts,
  type ProductItem,
} from "../../services/ProductService";
import { CATEGORY_SLUGS } from "../../constants/categorySlug";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [jerseyProducts, setJerseyProducts] = useState<ProductItem[]>([]);
  const [pantsProducts, setPantsProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featured, jerseys, pants] = await Promise.all([
          fetchProducts(),
          fetchProductsByCategorySlug(CATEGORY_SLUGS.JERSEY),
          fetchProductsByCategorySlug(CATEGORY_SLUGS.PANTS),
        ]);
        setFeaturedProducts(featured);
        setJerseyProducts(jerseys);
        setPantsProducts(pants);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      }
    };

    fetchAll();
  }, []);

  return (
    <div>
      <BannerSlider />
      <ProductGrid title="Sản phẩm nổi bật" products={featuredProducts} />
      <ProductGrid title="Sport Jersey" products={jerseyProducts} />
      <ProductGrid title="Quần Thể Thao" products={pantsProducts} />
    </div>
  );
}
