# Sportswear Shop

Ứng dụng thương mại điện tử bán đồ thể thao (sportswear) full-stack, gồm trang mua sắm cho khách hàng và trang quản trị (Admin Panel) cho quản lý sản phẩm, đơn hàng, người dùng.

Dự án được xây dựng theo mô hình **monorepo**, gồm 2 phần tách biệt:

- **Backend**: RESTful API bằng Spring Boot (Java)
- **Frontend**: Single Page Application bằng React + TypeScript

> Đồ án được thực hiện bởi 2 thành viên — Backend & Admin Panel logic (Huỳnh Trọng Khải), Frontend UI (Trần Minh Quân).

---

## Demo

|                        | Link                                           |
| ---------------------- | ---------------------------------------------- |
| **Frontend (live)**    | https://sportswear-shop-three.vercel.app       |
| **Backend API (live)** | https://sportswear-backend.onrender.com/api/v1 |

### Tài khoản test

| Vai trò   | Username                          | Password       |
| --------- | --------------------------------- | -------------- |
| **Admin** | `admin`                           | `Admin@123456` |
| **User**  | _(đăng ký mới qua trang Sign Up)_ |                |

---

## Tech Stack

### Backend (`be/backend`)

- **Java 21**
- **Spring Boot** (Web, Security, Data JPA)
- **Spring Security + JWT** — xác thực & phân quyền (`ROLE_ADMIN`, `ROLE_USER`)
- **Hibernate / JPA** — ORM
- **Lombok** — giảm boilerplate code
- **MySQL 8.0** — cơ sở dữ liệu
- **Cloudinary** — lưu trữ & xử lý ảnh sản phẩm
- **Maven** (`mvnw`) — build tool

### Frontend (`fe/sportswear-shop-fe`)

- **React 19 + TypeScript**
- **Vite** — build tool / dev server
- **Tailwind CSS** — styling
- **Axios** — gọi API (kèm interceptor tự động gắn JWT)

### Hạ tầng triển khai (Production)

- **Backend**: [Render](https://render.com) (Web Service, Dockerized)
- **Frontend**: [Vercel](https://vercel.com)
- **Database**: MySQL trên [Railway](https://railway.app)
- **Ảnh sản phẩm**: [Cloudinary](https://cloudinary.com)

---

## Cấu trúc thư mục

```
sportswear-shop/
├── be/
│   └── backend/                  # Spring Boot API
│       ├── src/main/java/...
│       ├── src/main/resources/
│       │   ├── application.yml         # chọn profile qua SPRING_PROFILES_ACTIVE
│       │   ├── application-dev.yml     # config local (gitignored)
│       │   └── application-prod.yml    # đọc secrets từ biến môi trường
│       └── mvnw
└── fe/
    └── sportswear-shop-fe/        # React + Vite app
        ├── src/
        ├── vercel.json             # rewrite rule cho SPA
        └── package.json
```

---

## Hướng dẫn chạy local

### Yêu cầu môi trường

- Java 21 (JDK)
- Node.js 18+ / npm
- MySQL Server 8.0
- (Tuỳ chọn) Postman để test API

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/sportswear-shop.git
cd sportswear-shop
```

### 2. Thiết lập Database (MySQL local)

```sql
CREATE DATABASE sportswear_shop_db;
```

Import dữ liệu mẫu (nếu có file dump `.sql`):

```powershell
# PowerShell — dùng cmd /c vì < redirection không hoạt động trực tiếp
cmd /c "mysql -u root -p sportswear_shop_db < path\to\dump.sql"
```

### 3. Cấu hình & chạy Backend

Trong `be/backend/src/main/resources/`, tạo file `application-dev.yml` (đã gitignore) với nội dung tương tự:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sportswear_shop_db
    username: root
    password: <your_local_password>

cloudinary:
  cloud-name: <your_cloudinary_cloud_name>
  api-key: <your_api_key>
  api-secret: <your_api_secret>

jwt:
  secret: <your_jwt_secret>
```

Chạy backend (mặc định dùng profile `dev`):

```powershell
cd be/backend
./mvnw spring-boot:run
```

Backend chạy tại: **http://localhost:8080/api/v1**

### 4. Cấu hình & chạy Frontend

Tạo file `.env` trong `fe/sportswear-shop-fe/`:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Cài đặt & chạy:

```powershell
cd fe/sportswear-shop-fe
npm install
npm run dev
```

Frontend chạy tại: **http://localhost:3000**

### 5. Đăng nhập thử

Tài khoản admin mặc định (được tạo tự động bởi `DataInitializer` khi khởi động backend lần đầu):

```
username: admin
password: Admin@123456
```

---

## Tính năng chính

**Phía khách hàng:**

- Duyệt sản phẩm theo danh mục, tìm kiếm, lọc
- Xem chi tiết sản phẩm, chọn size/màu (variant)
- Giỏ hàng, thanh toán (checkout)
- Quản lý tài khoản cá nhân, lịch sử đơn hàng

**Phía Admin:**

- Quản lý sản phẩm (CRUD) kèm upload ảnh qua Cloudinary
- Quản lý danh mục, size, variant
- Quản lý đơn hàng (cập nhật trạng thái)
- Quản lý người dùng & phân quyền

---

## Bảo mật & phân quyền

- Xác thực bằng **JWT**, lưu tại `localStorage` (`accessToken`, `currentUser`)
- Phân quyền bằng `hasAuthority("ROLE_ADMIN")` (khớp định dạng token, tránh lỗi double-prefix)
- CORS được cấu hình qua biến môi trường `FRONTEND_URL` (không hardcode localhost ở môi trường production)

---

## Ghi chú triển khai (Deployment notes)

- Backend đóng gói bằng Docker, deploy dưới dạng Web Service trên Render
- Database MySQL host trên Railway — dùng **public proxy hostname** (không dùng internal hostname vì Render không truy cập được)
- Biến môi trường production được cấu hình trực tiếp trên Render/Vercel dashboard, không commit vào repo

---

## Tác giả

| Thành viên       | Phụ trách                                                |
| ---------------- | -------------------------------------------------------- |
| Huỳnh Trọng Khải | Backend (Spring Boot API), Admin Panel logic, Deployment |
| Trần Minh Quân   | Frontend UI/UX (React)                                   |

---

## License

Dự án phục vụ mục đích học tập.
