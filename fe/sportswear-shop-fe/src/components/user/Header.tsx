import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ← thêm mới

  const visibleSearchResults = useMemo(
    () => searchResults.slice(0, 3),
    [searchResults],
  );

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <header className="bg-red-600 text-white shadow-md">
      {/* ── TOP BAR ── */}
      <div className="relative flex items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight sm:text-4xl"
        >
          Sportswear
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/tat-ca-san-pham"
            className="rounded-md px-3 py-2 text-lg font-semilight transition-all duration-200 hover:bg-white hover:text-red-600"
          >
            Tất cả sản phẩm
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button className="rounded-md px-3 py-2 text-lg font-semilight transition-all duration-200 hover:bg-white hover:text-red-600">
              Thể loại sản phẩm
            </button>
            {showCategories && (
              <div className="absolute left-0 top-full z-30 pt-2">
                <div className="w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 text-black shadow-2xl">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/the-loai-san-pham/${category.slug}`}
                        className="block px-5 py-3 text-base transition hover:bg-red-50 hover:text-red-600"
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

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH — desktop only */}
          <div className="hidden sm:block">
            <div className="flex items-center rounded-full bg-white px-4 py-2 text-black shadow-sm">
              <FaSearch className="text-base text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="ml-3 w-36 bg-transparent text-base outline-none lg:w-48"
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
            <span className="absolute -right-2 -top-2 rounded-full bg-white px-1.5 py-[1px] text-xs font-bold text-red-600">
              {cartCount}
            </span>
          </Link>

          {/* USER — desktop only */}
          <Link
            to={user ? "/tai-khoan" : "/dang-nhap"}
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-lg font-semibold transition-all duration-200 hover:bg-white hover:text-red-600 sm:flex"
          >
            <FaUser className="text-2xl" />
            <span className="max-w-[120px] truncate">
              {user?.fullName ?? "Đăng nhập"}
            </span>
          </Link>

          {/* HAMBURGER — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-2xl lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="border-t border-red-500 bg-red-600 px-4 pb-4 lg:hidden">
          {/* Search mobile */}
          <div className="mb-3 mt-3">
            <div className="flex items-center rounded-full bg-white px-4 py-2 text-black">
              <FaSearch className="text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="ml-3 w-full bg-transparent text-base outline-none"
              />
            </div>
            {search.trim().length > 0 && (
              <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-3 text-black shadow-xl">
                {searching ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    Đang tìm...
                  </div>
                ) : visibleSearchResults.length > 0 ? (
                  <div className="space-y-2">
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
                  <div className="py-4 text-center text-sm text-gray-500">
                    Không tìm thấy.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav links mobile */}
          <Link
            to="/tat-ca-san-pham"
            className="block py-2 text-base font-medium hover:underline"
          >
            Tất cả sản phẩm
          </Link>

          <div className="py-2">
            <div className="mb-1 text-base font-medium">Thể loại sản phẩm</div>
            <div className="ml-3 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/the-loai-san-pham/${cat.slug}`}
                  className="block py-1 text-sm hover:underline"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to={user ? "/tai-khoan" : "/dang-nhap"}
            className="mt-2 flex items-center gap-2 py-2 text-base font-medium hover:underline"
          >
            <FaUser />
            <span>{user?.fullName ?? "Đăng nhập"}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
