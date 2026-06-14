import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAdminProduct,
  updateAdminProduct,
  fetchAdminProductById,
} from "../../services/AdminService";
import type { ProductRequest } from "../../services/AdminService";
import { fetchCategories } from "../../services/CategoryService";
import type { Category } from "../../services/CategoryService";

const EMPTY_FORM: ProductRequest = {
  name: "",
  description: "",
  categoryId: 0,
  brand: "",
  imageUrl: "",
  active: true,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<ProductRequest>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories);

    if (isEdit) {
      fetchAdminProductById(Number(id))
        .then((p) => {
          setForm({
            name: p.name,
            description: p.description ?? "",
            categoryId: p.categoryId,
            brand: p.brand ?? "",
            imageUrl: p.imageUrl ?? "",
            active: p.active,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "categoryId"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Tên sản phẩm không được để trống");
      return;
    }
    if (!form.categoryId) {
      setError("Vui lòng chọn danh mục");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateAdminProduct(Number(id), form);
      } else {
        await createAdminProduct(form);
      }
      navigate("/admin/products");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-gray-500">Đang tải...</p>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">
        {isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
      </h1>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="bg-white rounded-lg border p-6 space-y-4">
        {/* Tên */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value={0}>-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block text-sm font-medium mb-1">Thương hiệu</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            URL ảnh{" "}
            <span className="text-gray-400 font-normal">(tạm thời)</span>
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="mt-2 h-32 w-32 object-cover rounded-lg border"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          />
        </div>

        {/* Active */}
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
            Hiển thị sản phẩm (Active)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo sản phẩm"}
        </button>
        <button
          onClick={() => navigate("/admin/products")}
          className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
