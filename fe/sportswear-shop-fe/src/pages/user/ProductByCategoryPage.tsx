import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/user/ProductCard";
import { type ProductItem } from "../../services/ProductService";
import { fetchCategoryBySlug } from "../../services/CategoryService";
import { fetchProductsByCategorySlug } from "../../services/ProductService";

export default function ProductByCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categoryTitle, setCategoryTitle] = useState<string>("");

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      setLoading(true);
      setError("");
      setProducts([]);
      setCategoryTitle("");

      console.log("Loading category and products for slug:", categorySlug);
      if (!categorySlug) {
        setError("Không tồn tại thể loại sản phẩm này");
        setLoading(false);
        return;
      }

      try {
        // Fetch category info by slug
        const categoryData = await fetchCategoryBySlug(categorySlug);
        setCategoryTitle(categoryData?.name ?? categorySlug);

        // Fetch products by category slug via ProductService
        const mapped = await fetchProductsByCategorySlug(categorySlug);
        setProducts(mapped);
      } catch (err: unknown) {
        console.error("Error loading category/products:", err);
        setError("Không tồn tại thể loại sản phẩm này");
      } finally {
        setLoading(false);
      }
    };

    void loadCategoryAndProducts();
  }, [categorySlug]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.categoryName))
    );

    return ["all", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || product.categoryName === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const count = filteredProducts.length;

  return (
    <div>
      <main className="p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {categoryTitle ? `${categoryTitle} — ` : "Danh sách sản phẩm: "}
              {count} kết quả
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 sm:w-64"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 sm:w-56"
            >
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName === "all" ? "Tất cả danh mục" : categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div className="rounded border border-red-200 bg-red-50 p-10 text-center text-red-700">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/san-pham/${product.id}`}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
