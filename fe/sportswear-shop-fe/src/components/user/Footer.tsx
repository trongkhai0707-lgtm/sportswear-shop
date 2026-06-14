import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white text-gray-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:justify-between lg:gap-0">
        <div className="space-y-4 lg:w-1/3">
          <div className="text-2xl font-bold text-red-600">Sportswear</div>
          <p className="max-w-md text-sm text-gray-600">
            Cửa hàng đồ thể thao chuyên nghiệp với sản phẩm chất lượng, giao
            hàng nhanh và dịch vụ khách hàng tận tâm.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-900">
              Khám phá
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-red-600">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/san-pham/tat-ca" className="hover:text-red-600">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/gio-hang" className="hover:text-red-600">
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-900">
              Hỗ trợ
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="mailto:support@sportswear.com"
                  className="hover:text-red-600"
                >
                  support@sportswear.com
                </a>
              </li>
              <li>
                <a href="tel:0328109231" className="hover:text-red-600">
                  0328 109 231
                </a>
              </li>
              <li>
                <span>Hỗ trợ 24/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-900">
              Địa chỉ
            </h3>
            <p className="text-sm text-gray-600">
              123 Đường Thể Thao, Phường Linh Xuân, TP. Thủ Đức, TP. HCM
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
        © 2026 Sportswear. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}
