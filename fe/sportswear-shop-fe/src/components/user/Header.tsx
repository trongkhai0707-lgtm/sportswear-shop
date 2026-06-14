import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { getCurrentUser, getAccessToken } from "../../services/AuthService";
import { fetchCartCount } from "../../services/CartService";
import { fetchCategories, type Category } from "../../services/CategoryService";
import {
  searchProducts,
  type ProductItem,
} from "../../services/ProductService";
import SearchResultCard from "./SearchResultCard";

export default function Header() {
  const location = useLocation();
  const user = getCurrentUser();
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
  const [searching, setSearching] = useState(false);

  const visibleSearchResults = useMemo(
    () => searchResults.slice(0, 3),
    [searchResults],
  );

  useEffect(() => {
    const loadCartCount = async () => {
      const token = getAccessToken();
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const count = await fetchCartCount();
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    void loadCartCount();
  }, [location]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch {
        setCategories([]);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const results = await searchProducts(search.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="relative flex items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link to="/" className="text-4xl font-extrabold tracking-tight">
          Sportswear
        </Link>

        {/* MENU */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* ALL PRODUCTS */}
          <Link
            to="/tat-ca-san-pham"
            className="
      rounded-md px-3 py-2
      text-lg font-semilight
      transition-all duration-200
      hover:bg-white hover:text-red-600
    "
          >
            Tất cả sản phẩm
          </Link>

          {/* CATEGORY DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            {/* BUTTON */}
            <button
              className="
        rounded-md px-3 py-2
        text-lg font-semilight
        transition-all duration-200
        hover:bg-white hover:text-red-600
      "
            >
              Thể loại sản phẩm
            </button>

            {/* DROPDOWN */}
            {showCategories && (
              <div
                className="
      absolute left-0 top-full z-30
      pt-2
    "
              >
                <div
                  className="
        w-64
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        py-2
        text-black
        shadow-2xl
      "
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/the-loai-san-pham/${category.slug}`}
                        className="
              block px-5 py-3
              text-base
              transition
              hover:bg-red-50
              hover:text-red-600
            "
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-sm text-gray-500">
                      Không có thể loại.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* SEARCH */}
          <div>
            <div
              className="
            flex items-center
            rounded-full bg-white
            px-4 py-2
            text-black
            shadow-sm
          "
            >
              <FaSearch className="text-base text-gray-600" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm"
                className="
              ml-3 w-48
              bg-transparent
              text-base
              outline-none
            "
              />
            </div>

            {search.trim().length > 0 && (
              <div className="absolute left-1/2 top-full z-20 mt-3 w-[92vw] max-w-[64rem] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white p-4 text-black shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Kết quả tìm kiếm
                  </span>
                  {searching && (
                    <span className="text-xs text-gray-500">Đang tìm...</span>
                  )}
                </div>

                {searching ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    Đang tìm sản phẩm...
                  </div>
                ) : visibleSearchResults.length > 0 ? (
                  <div className="space-y-3">
                    {visibleSearchResults.map((item) => (
                      <SearchResultCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        categoryName={item.categoryName}
                        price={item.price}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">
                    Không tìm thấy sản phẩm.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CART */}
          <Link
            to="/gio-hang"
            className="relative text-3xl transition hover:scale-110"
          >
            <FaShoppingCart />

            <span
              className="
            absolute -right-2 -top-2
            rounded-full bg-white
            px-1.5 py-[1px]
            text-xs font-bold
            text-red-600
          "
            >
              {cartCount}
            </span>
          </Link>

          {/* USER */}
          <Link
            to={user ? "/tai-khoan" : "/dang-nhap"}
            className="
          flex items-center gap-2
          rounded-md px-3 py-2
          text-lg font-semibold
          transition-all duration-200
          hover:bg-white hover:text-red-600
        "
          >
            <FaUser className="text-2xl" />

            <span>{user?.fullName ?? "Đăng nhập"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
