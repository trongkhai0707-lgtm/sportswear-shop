import { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../services/AdminService";
import type {
  AdminCategory,
  CategoryRequest,
} from "../../services/AdminService";

const EMPTY_FORM: CategoryRequest = { name: "", description: "", active: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CategoryRequest>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetchAdminCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      active: cat.active,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateAdminCategory(editTarget.id, form);
      } else {
        await createAdminCategory(form);
      }
      closeModal();
      load();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: AdminCategory) => {
    if (!confirm(`Ẩn danh mục "${cat.name}"?`)) return;
    try {
      await deleteAdminCategory(cat.id);
      load();
    } catch {
      alert("Không thể xóa — danh mục còn sản phẩm đang active.");
    }
  };

  if (loading) return <p className="text-gray-500">Đang tải...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left whitespace-nowrap">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên danh mục</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 whitespace-nowrap">
                  <td className="px-4 py-3 text-gray-400">#{cat.id}</td>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cat.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="font-semibold text-lg">
              {editTarget ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h2>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="active" className="text-sm">
                Hiển thị (Active)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
              >
                {submitting
                  ? "Đang lưu..."
                  : editTarget
                    ? "Cập nhật"
                    : "Tạo danh mục"}
              </button>
              <button
                onClick={closeModal}
                className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
