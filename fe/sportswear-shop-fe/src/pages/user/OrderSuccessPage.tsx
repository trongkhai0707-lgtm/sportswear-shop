import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Đặt hàng thành công!
        </h1>

        <p className="mb-6 text-gray-500">
          Cảm ơn bạn đã mua hàng.{" "}
          {orderId && (
            <span>
              Mã đơn hàng của bạn là{" "}
              <span className="font-semibold text-red-600">#{orderId}</span>
            </span>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/tai-khoan")}
            className="w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Xem đơn hàng của tôi
          </button>
        </div>
      </div>
    </main>
  );
}
