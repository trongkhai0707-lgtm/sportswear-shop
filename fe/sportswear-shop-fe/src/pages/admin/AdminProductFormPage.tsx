import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAdminProduct,
  updateAdminProduct,
  fetchAdminProductById,
  uploadProductImages,
  fetchAdminVariants,
  createAdminVariant,
  updateAdminVariant,
  deleteAdminVariant,
  fetchSizes,
} from "../../services/AdminService";
import type {
  ProductRequest,
  ProductVariant,
  ProductVariantRequest,
  Size,
} from "../../services/AdminService";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [deletingVariant, setDeletingVariant] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantSubmitting, setVariantSubmitting] = useState(false);

  const EMPTY_VARIANT: ProductVariantRequest = {
    color: "",
    sizeId: 0,
    price: 0,
    stock: 0,
  };
  const [variantForm, setVariantForm] =
    useState<ProductVariantRequest>(EMPTY_VARIANT);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchSizes().then(setSizes);

    if (isEdit) {
      Promise.all([
        fetchAdminProductById(Number(id)),
        fetchAdminVariants(Number(id)),
      ])
        .then(([p, v]) => {
          setForm({
            name: p.name,
            description: p.description ?? "",
            categoryId: p.categoryId,
            brand: p.brand ?? "",
            imageUrl: p.imageUrl ?? "",
            active: p.active,
          });
          setVariants(v);
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const result = await uploadProductImages([file]);
      if (result.imageUrls.length > 0) {
        setForm((prev) => ({ ...prev, imageUrl: result.imageUrls[0] }));
      }
    } catch {
      setError("Upload ảnh thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
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

  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm("Xác nhận xoá variant này?")) return;
    setDeletingVariant(variantId);
    try {
      await deleteAdminVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch {
      setError("Xoá variant thất bại, vui lòng thử lại.");
    } finally {
      setDeletingVariant(null);
    }
  };

  const handleOpenAddVariant = () => {
    setEditingVariant(null);
    setVariantForm(EMPTY_VARIANT);
    setShowVariantForm(true);
  };

  const handleOpenEditVariant = (v: ProductVariant) => {
    setEditingVariant(v);
    setVariantForm({
      color: v.color,
      sizeId: sizes.find((s) => s.name === v.sizeName)?.id ?? 0,
      price: v.price,
      stock: v.stock,
    });
    setShowVariantForm(true);
  };

  const handleCancelVariantForm = () => {
    setShowVariantForm(false);
    setEditingVariant(null);
    setVariantForm(EMPTY_VARIANT);
  };

  const handleVariantFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]:
        name === "sizeId" || name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmitVariant = async () => {
    if (!variantForm.color.trim()) {
      setError("Màu không được để trống");
      return;
    }
    if (!variantForm.sizeId) {
      setError("Vui lòng chọn size");
      return;
    }
    if (variantForm.price <= 0) {
      setError("Giá phải lớn hơn 0");
      return;
    }
    if (variantForm.stock < 0) {
      setError("Tồn kho không được âm");
      return;
    }

    setError("");
    setVariantSubmitting(true);
    try {
      if (editingVariant) {
        await updateAdminVariant(editingVariant.id, variantForm);
      } else {
        await createAdminVariant(Number(id), variantForm);
      }
      // Reload lại danh sách variant sau khi thêm/sửa
      const updated = await fetchAdminVariants(Number(id));
      setVariants(updated);
      handleCancelVariantForm();
    } catch {
      setError("Lưu variant thất bại, vui lòng thử lại.");
    } finally {
      setVariantSubmitting(false);
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

        {/* Ảnh sản phẩm */}
        <div>
          <label className="block text-sm font-medium mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={uploading}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
          />

          {uploading && (
            <p className="mt-2 text-sm text-gray-500">Đang upload ảnh...</p>
          )}

          {form.imageUrl && !uploading && (
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

      {/* Variants — chỉ hiện khi đang sửa sản phẩm đã tồn tại */}
      {isEdit && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Phiên bản (Variants)</h2>
            {!showVariantForm && (
              <button
                onClick={handleOpenAddVariant}
                className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-700"
              >
                + Thêm variant
              </button>
            )}
          </div>

          {/* Table danh sách variant */}
          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có variant nào.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4">Màu</th>
                  <th className="py-2 pr-4">Size</th>
                  <th className="py-2 pr-4">Giá</th>
                  <th className="py-2 pr-4">Tồn kho</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{v.color}</td>
                    <td className="py-2 pr-4">{v.sizeName}</td>
                    <td className="py-2 pr-4">
                      {v.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-2 pr-4">{v.stock}</td>
                    <td className="py-2 flex gap-3">
                      <button
                        onClick={() => handleOpenEditVariant(v)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(v.id)}
                        disabled={deletingVariant === v.id}
                        className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                      >
                        {deletingVariant === v.id ? "Đang xoá..." : "Xoá"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Form thêm/sửa variant — hiện khi bấm "+ Thêm variant" hoặc "Sửa" */}
          {showVariantForm && (
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <h3 className="text-sm font-medium">
                {editingVariant ? "Sửa variant" : "Thêm variant mới"}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Màu */}
                <div>
                  <label className="block text-xs font-medium mb-1">Màu</label>
                  <input
                    name="color"
                    value={variantForm.color}
                    onChange={handleVariantFormChange}
                    placeholder="VD: Đen, Trắng, Xanh..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-medium mb-1">Size</label>
                  <select
                    name="sizeId"
                    value={variantForm.sizeId}
                    onChange={handleVariantFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value={0}>-- Chọn size --</option>
                    {sizes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Giá */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Giá (VND)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min={0}
                    value={variantForm.price}
                    onChange={handleVariantFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                {/* Tồn kho */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Tồn kho
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    value={variantForm.stock}
                    onChange={handleVariantFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSubmitVariant}
                  disabled={variantSubmitting}
                  className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                >
                  {variantSubmitting
                    ? "Đang lưu..."
                    : editingVariant
                      ? "Cập nhật"
                      : "Thêm"}
                </button>
                <button
                  onClick={handleCancelVariantForm}
                  className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting || uploading}
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
