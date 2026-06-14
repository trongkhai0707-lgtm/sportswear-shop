import type { CartItem as CartItemType } from "../../services/CartService";

interface Props {
  item: CartItemType;
  onQuantityChange: (itemId: number, qty: number) => void;
  onDelete: (itemId: number) => void;
  updating?: number | null;
}

export default function CartItem({
  item,
  onQuantityChange,
  onDelete,
  updating,
}: Props) {
  const image =
    item.imageUrl ?? "https://via.placeholder.com/120x90?text=No+Image";

  return (
    <div className="relative flex items-center justify-between rounded-lg border bg-white p-4">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={item.productName}
          className="h-20 w-28 rounded object-cover"
        />

        <div>
          <div className="font-semibold">{item.productName}</div>
          <div className="text-sm text-gray-500">
            {item.color} - {item.sizeName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-500">Giá</div>
          <div className="font-semibold text-red-600">
            {item.price.toLocaleString("vi-VN")}đ
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onQuantityChange(item.itemId, Math.max(1, item.quantity - 1))
            }
            className="h-8 w-8 rounded bg-gray-100"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              onQuantityChange(
                item.itemId,
                Math.max(1, Number(e.target.value) || 1),
              )
            }
            className="w-16 text-center border rounded px-2 py-1"
          />
          <button
            onClick={() => onQuantityChange(item.itemId, item.quantity + 1)}
            className="h-8 w-8 rounded bg-gray-100"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Tổng</div>
          <div className="font-semibold">
            {item.subtotal.toLocaleString("vi-VN")}đ
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onDelete(item.itemId)}
            disabled={updating === item.itemId}
            className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-60"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
