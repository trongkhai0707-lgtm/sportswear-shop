import { useEffect, useState } from "react";
import { fetchAdminProducts } from "../../services/AdminService";
import type { AdminProduct } from "../../services/AdminService";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(keyword.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  if (loading) return <p className="text-gray-500">Đang tải...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
        {/* [SỬA] thay span số lượng bằng nhóm gồm số lượng + nút thêm */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filtered.length} sản phẩm
          </span>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700"
          >
            + Thêm sản phẩm
          </button>
        </div>
        {/* [KẾT THÚC SỬA] */}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm theo tên hoặc danh mục..."
        value={keyword}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full max-w-sm border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Giá từ</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Thao tác</th> {/* [THÊM MỚI] */}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  {" "}
                  {/* [SỬA] colSpan 6→7 */}
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">#{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                  <td className="px-4 py-3">
                    {p.minPrice
                      ? p.minPrice.toLocaleString("vi-VN") + "đ"
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  {/* [THÊM MỚI] nút Sửa */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                  </td>
                  {/* [KẾT THÚC THÊM MỚI] */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
          >
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border ${
                p === page
                  ? "bg-gray-900 text-white border-gray-900"
                  : "hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
