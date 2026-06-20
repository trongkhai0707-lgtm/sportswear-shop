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
  const [shirtProducts, setShirtProducts] = useState<ProductItem[]>([]);
  const [nikeDriFitProducts, setNikeDriFitProducts] = useState<ProductItem[]>(
    [],
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featured, shirts, nikeDriFit] = await Promise.all([
          fetchProducts(),
          fetchProductsByCategorySlug(CATEGORY_SLUGS.SHIRT),
          fetchProductsByCategorySlug(CATEGORY_SLUGS.NIKE_SHIRT),
        ]);
        setFeaturedProducts(featured);
        setShirtProducts(shirts);
        setNikeDriFitProducts(nikeDriFit);
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
      <ProductGrid title="Áo thun co giãn" products={shirtProducts} />
      <ProductGrid title="Áo thun Nike Dri-FIT" products={nikeDriFitProducts} />
    </div>
  );
}
