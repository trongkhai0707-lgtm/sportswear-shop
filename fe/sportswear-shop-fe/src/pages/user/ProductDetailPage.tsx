import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  fetchProductVariants,
  type ProductApiResponse,
  type ProductVariantResponse,
} from "../../services/ProductService";
import { addToCart } from "../../services/CartService";
import NotificationDialog from "../../components/util/NotificationDialog";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductApiResponse | null>(null);
  const [variants, setVariants] = useState<ProductVariantResponse[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success",
  );
  const [error, setError] = useState("");

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => variant.id === selectedVariantId) ??
      variants[0] ??
      null,
    [selectedVariantId, variants],
  );

  useEffect(() => {
    const loadData = async () => {
      if (!productId) {
        setError("Sản phẩm không hợp lệ.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const id = Number(productId);
        const [productData, variantData] = await Promise.all([
          fetchProductById(id),
          fetchProductVariants(id),
        ]);

        setProduct(productData);
        setVariants(variantData);
        setSelectedVariantId(variantData[0]?.id ?? null);
        setQuantity(1);
      } catch {
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      return;
    }

    if (quantity < 1 || quantity > selectedVariant.stock) {
      setNotificationType("error");
      setNotificationMessage(
        `Số lượng phải trong khoảng 1 đến ${selectedVariant.stock}.`,
      );
      setNotificationOpen(true);
      return;
    }

    setSaving(true);
    setNotificationMessage("");

    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });
      setNotificationType("success");
      setNotificationMessage("Đã thêm vào giỏ hàng.");
      setNotificationOpen(true);
    } catch {
      setNotificationType("error");
      setNotificationMessage("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
      setNotificationOpen(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded border border-gray-200 bg-white p-10 text-center text-gray-600">
          Đang tải thông tin sản phẩm...
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-6">
        <div className="rounded border border-red-200 bg-red-50 p-10 text-center text-red-700">
          {error || "Sản phẩm không tồn tại."}
        </div>
      </main>
    );
  }

  const imageSrc = product.imageUrl?.trim()
    ? product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `http://localhost:8080/images/${product.imageUrl}`
    : "https://via.placeholder.com/800x600?text=No+Image";

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="w-full md:w-1/2">
            <div className="overflow-hidden rounded-3xl bg-gray-100">
              <img
                src={imageSrc}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6 rounded-3xl bg-white p-8 shadow-sm">
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-widest text-gray-500">
                {product.categoryName}
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-base text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 text-3xl font-bold text-red-600">
                {selectedVariant
                  ? selectedVariant.price.toLocaleString("vi-VN") + "đ"
                  : "Giá chưa rõ"}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700">
                  Phiên bản
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        variant.id === selectedVariant?.id
                          ? "border-red-600 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-red-600"
                      }`}
                    >
                      {variant.color} - {variant.sizeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                <div className="text-xs uppercase tracking-widest text-gray-500">
                  Tình trạng
                </div>
                <div className="mt-2 text-lg font-semibold text-gray-900">
                  {selectedVariant
                    ? `${selectedVariant.stock} có sẵn`
                    : "Không có"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Số lượng
                  </label>
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-2 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity((prev) => Math.max(1, prev - 1));
                      }}
                      className="h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 transition hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={selectedVariant?.stock ?? 1}
                      value={quantity}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        if (Number.isNaN(value)) {
                          return;
                        }
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(value, selectedVariant?.stock ?? value),
                          ),
                        );
                      }}
                      className="w-full text-center text-lg font-semibold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedVariant) {
                          return;
                        }
                        setQuantity((prev) =>
                          Math.min(prev + 1, selectedVariant.stock),
                        );
                      }}
                      className="h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 transition hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={!selectedVariant || saving}
                    onClick={handleAddToCart}
                    className="w-full rounded-2xl bg-red-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                  </button>
                </div>
              </div>

              <NotificationDialog
                open={notificationOpen}
                type={notificationType}
                message={notificationMessage}
                onClose={() => {
                  setNotificationOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
