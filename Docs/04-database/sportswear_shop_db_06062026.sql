-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7023
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for sportswear_shop_db
CREATE DATABASE IF NOT EXISTS `sportswear_shop_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `sportswear_shop_db`;

-- Dumping structure for table sportswear_shop_db.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoce3937d2f4mpfqrycbr0l93m` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.brands: ~5 rows (approximately)
INSERT INTO `brands` (`id`, `active`, `created_at`, `description`, `logo_url`, `name`, `updated_at`) VALUES
	(1, b'1', '2026-05-30 19:05:28.888138', 'Thương hiệu Nike', NULL, 'Nike', '2026-05-30 19:05:28.888138'),
	(2, b'1', '2026-05-30 19:05:28.975296', 'Thương hiệu Adidas', NULL, 'Adidas', '2026-05-30 19:05:28.975296'),
	(3, b'1', '2026-05-30 19:05:28.986915', 'Thương hiệu Puma', NULL, 'Puma', '2026-05-30 19:05:28.986915'),
	(4, b'1', '2026-05-30 19:05:28.998474', 'Thương hiệu Under Armour', NULL, 'Under Armour', '2026-05-30 19:05:28.998474'),
	(5, b'1', '2026-05-30 19:05:29.012536', 'Thương hiệu Reebok', NULL, 'Reebok', '2026-05-30 19:05:29.012536');

-- Dumping structure for table sportswear_shop_db.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.carts: ~3 rows (approximately)
INSERT INTO `carts` (`id`, `user_id`, `updated_at`) VALUES
	(6, 4, '2026-05-28 12:07:00'),
	(7, 6, '2026-06-06 06:02:50'),
	(8, 8, '2026-06-06 11:36:11');

-- Dumping structure for table sportswear_shop_db.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_chk_1` CHECK (`quantity` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.cart_items: ~1 rows (approximately)
INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `variant_id`, `quantity`, `price_at_time`, `created_at`, `updated_at`) VALUES
	(17, 7, 5, 4, 1, 500000.00, '2026-06-06 10:58:15', '2026-06-06 10:58:15');

-- Dumping structure for table sportswear_shop_db.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.categories: ~6 rows (approximately)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `active`, `created_at`, `updated_at`) VALUES
	(1, 'Áo thun', 'ao-thun', 'Áo thun', 1, '2026-06-06 06:46:44', '2026-06-06 06:46:46'),
	(2, 'Quần thể thao', 'quan-the-thao', 'Quần thể thao', 1, '2026-06-06 06:47:07', '2026-06-06 06:47:08'),
	(3, 'Giày thể thao', 'giay-the-thao', 'Giày thể thao', 1, '2026-06-06 06:47:28', '2026-06-06 06:47:29'),
	(4, 'Phụ kiện', 'phu-kien', 'Phụ kiện', 1, '2026-06-06 06:47:46', '2026-06-06 06:47:50'),
	(6, 'Áo Thun Thể Thao', 'o-thun-th-thao', 'Áo thun cao cấp', 1, '2026-05-27 12:40:01', '2026-05-27 12:40:01'),
	(8, 'Áo Thun Nike Dri-FIT', 'o-thun-nike-dri-fit', 'Áo thun thể thao cao cấp', 1, '2026-05-31 12:35:46', '2026-05-31 12:35:46');

-- Dumping structure for table sportswear_shop_db.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `shipping_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shipping_info`)),
  `order_status_id` bigint(20) NOT NULL,
  `payment_method_id` bigint(20) NOT NULL,
  `payment_status_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_status_id` (`order_status_id`),
  KEY `payment_method_id` (`payment_method_id`),
  KEY `payment_status_id` (`payment_status_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`order_status_id`) REFERENCES `order_statuses` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.orders: ~4 rows (approximately)
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `shipping_info`, `order_status_id`, `payment_method_id`, `payment_status_id`, `created_at`, `updated_at`) VALUES
	(3, 4, 598000.00, '{"note": "Giao giờ hành chính", "phone": "0123456789", "address": "123 Đường Lê Lợi, Quận 1, TP.HCM", "fullName": "Nguyễn Văn Khải"}', 5, 1, 1, '2026-05-28 15:40:20', '2026-05-31 12:48:12'),
	(6, 6, 4550000.00, '{"fullName":"Trần Quân","phone":"0328109231","address":"Phường Linh Xuân, TPHCM","note":""}', 1, 1, 1, '2026-06-06 09:30:58', '2026-06-06 09:30:58'),
	(7, 8, 3175000.00, '{"fullName":"Tran Quan","phone":"0328109231","address":"Linh Xuân TPHCM","note":""}', 1, 1, 1, '2026-06-06 11:37:29', '2026-06-06 11:37:29'),
	(8, 8, 2700000.00, '{"fullName":"Tran Quan","phone":"0328109231","address":"Linh Xuân TPHCM","note":""}', 1, 1, 1, '2026-06-06 14:34:00', '2026-06-06 14:34:00');

-- Dumping structure for table sportswear_shop_db.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(12,2) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `size` varchar(20) NOT NULL,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.order_items: ~8 rows (approximately)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `quantity`, `price_at_time`, `product_name`, `size`, `color`) VALUES
	(3, 3, 3, 2, 2, 299000.00, 'Áo Thun Nike', 'S', 'Đen'),
	(6, 6, 5, 5, 5, 400000.00, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'S', 'Xanh'),
	(7, 6, 5, 4, 3, 500000.00, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'XL', 'Xanh'),
	(8, 6, 9, 8, 2, 525000.00, 'Áo Thun Chạy Bộ Adizero Archive', 'XL', 'Xám'),
	(9, 7, 5, 5, 4, 400000.00, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'S', 'Xanh'),
	(10, 7, 9, 8, 3, 525000.00, 'Áo Thun Chạy Bộ Adizero Archive', 'XL', 'Xám'),
	(11, 8, 5, 4, 3, 500000.00, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'XL', 'Xanh'),
	(12, 8, 5, 5, 3, 400000.00, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'S', 'Xanh');

-- Dumping structure for table sportswear_shop_db.order_statuses
CREATE TABLE IF NOT EXISTS `order_statuses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.order_statuses: ~7 rows (approximately)
INSERT INTO `order_statuses` (`id`, `name`, `description`) VALUES
	(1, 'PENDING', 'Trạng thái đơn hàng: PENDING'),
	(2, 'CONFIRMED', 'Trạng thái đơn hàng: CONFIRMED'),
	(3, 'PROCESSING', 'Trạng thái đơn hàng: PROCESSING'),
	(4, 'SHIPPED', 'Trạng thái đơn hàng: SHIPPED'),
	(5, 'DELIVERED', 'Trạng thái đơn hàng: DELIVERED'),
	(6, 'CANCELLED', 'Trạng thái đơn hàng: CANCELLED'),
	(7, 'REFUNDED', 'Trạng thái đơn hàng: REFUNDED');

-- Dumping structure for table sportswear_shop_db.payment_methods
CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.payment_methods: ~4 rows (approximately)
INSERT INTO `payment_methods` (`id`, `name`, `description`) VALUES
	(1, 'COD', 'Phương thức thanh toán: COD'),
	(2, 'MOMO', 'Phương thức thanh toán: MOMO'),
	(3, 'VNPAY', 'Phương thức thanh toán: VNPAY'),
	(4, 'BANK_TRANSFER', 'Phương thức thanh toán: BANK_TRANSFER');

-- Dumping structure for table sportswear_shop_db.payment_statuses
CREATE TABLE IF NOT EXISTS `payment_statuses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.payment_statuses: ~4 rows (approximately)
INSERT INTO `payment_statuses` (`id`, `name`, `description`) VALUES
	(1, 'PENDING', 'Trạng thái thanh toán: PENDING'),
	(2, 'PAID', 'Trạng thái thanh toán: PAID'),
	(3, 'FAILED', 'Trạng thái thanh toán: FAILED'),
	(4, 'REFUNDED', 'Trạng thái thanh toán: REFUNDED');

-- Dumping structure for table sportswear_shop_db.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `category_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.products: ~12 rows (approximately)
INSERT INTO `products` (`id`, `name`, `slug`, `description`, `brand`, `is_active`, `category_id`, `created_at`, `updated_at`, `image_url`) VALUES
	(3, 'Áo Thun Nike', 'o-thun-nike', 'Áo thun thể thao cao cấp', NULL, 1, 6, '2026-05-27 12:41:52', '2026-06-06 07:37:15', 'aothun01.avif'),
	(4, 'Áo Thun Nike Dri-FIT Pro', 'o-thun-nike-dri-fit-pro', 'Phiên bản nâng cấp', 'Nike', 1, 8, '2026-05-31 12:36:44', '2026-06-06 07:37:20', 'aothun01.avif'),
	(5, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'ao-thun-01', 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'Adidas', 1, 1, '2026-06-06 06:57:23', '2026-06-06 06:57:45', 'aothun01.avif'),
	(7, 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'ao-thun-02', 'ÁO THUN GRAPHIC CLUB TENNIS CLIMACOOL', 'Adidas', 1, 1, '2026-06-06 06:57:23', '2026-06-06 06:57:45', 'aothun02.avif'),
	(8, 'Áo Thun adi365 Climacool', 'ao-thun-03', 'Áo Thun adi365 Climacool', 'Adidas', 1, 1, '2026-06-06 06:57:23', '2026-06-06 07:00:06', 'aothun03.avif'),
	(9, 'Áo Thun Chạy Bộ Adizero Archive', 'ao-thun-04', 'Áo Thun Chạy Bộ Adizero Archive', 'Adidas', 1, 1, '2026-06-06 06:57:23', '2026-06-06 07:00:56', 'aothun04.avif'),
	(10, 'Áo Thun Dài Tay adi365 Running Community Culture', 'ao-thun-05', 'Áo Thun Dài Tay adi365 Running Community Culture', 'Adidas', 1, 1, '2026-06-06 12:00:54', '2026-06-06 12:02:04', 'aothun05.avif'),
	(12, 'Giày Adidas Samba OG', 'giay-the-thao-01', 'Giày Adidas Samba OG', 'Adidas', 1, 3, '2026-06-06 12:21:10', '2026-06-06 12:21:10', 'giaythethao01.avif'),
	(14, 'Giày Adidas Adizero Pacer', 'giay-the-thao-02', 'Giày Adidas Adizero Pacer', 'Adidas', 1, 3, '2026-06-06 12:23:00', '2026-06-06 12:23:00', 'giaythethao02.avif'),
	(15, 'Giày Adidas Stan Smith 80s', 'giay-the-thao-03', 'Giày Adidas Stan Smith 80s', 'Adidas', 1, 3, '2026-06-06 12:24:39', '2026-06-06 12:24:39', 'giaythethao03.avif'),
	(17, 'Giày Adidas Tập Dropset 4', 'giay-the-thao-04', 'Giày Adidas Tập Dropset 4', 'Adidas', 1, 3, '2026-06-06 12:25:48', '2026-06-06 12:25:48', 'giaythethao04.avif'),
	(18, 'Giày Adidas Chạy Bộ Duramo SL 2', 'giay-the-thao-05', 'Giày Adidas Chạy Bộ Duramo SL 2', 'Adidas', 1, 3, '2026-06-06 12:26:56', '2026-06-06 12:26:56', 'giaythethao05.avif');

-- Dumping structure for table sportswear_shop_db.product_variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `size_id` bigint(20) NOT NULL,
  `color` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `size_id` (`size_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_variants_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.product_variants: ~9 rows (approximately)
INSERT INTO `product_variants` (`id`, `product_id`, `size_id`, `color`, `stock`, `price`, `created_at`, `updated_at`) VALUES
	(2, 3, 1, 'Đen', 98, 299000.00, '2026-05-28 11:18:18', '2026-05-28 15:40:20'),
	(3, 3, 1, 'Đen', 100, 299000.00, '2026-05-28 11:31:39', '2026-05-28 11:31:39'),
	(4, 5, 4, 'Xanh', 44, 500000.00, '2026-06-06 07:02:38', '2026-06-06 14:34:00'),
	(5, 5, 1, 'Xanh', 37, 400000.00, '2026-06-06 07:03:05', '2026-06-06 14:34:00'),
	(6, 7, 4, 'Trắng', 0, 500000.00, '2026-06-06 07:03:27', '2026-06-06 07:03:39'),
	(7, 8, 4, 'Xanh dương', 21, 550000.00, '2026-06-06 07:04:15', '2026-06-06 09:11:50'),
	(8, 9, 4, 'Xám', 5, 525000.00, '2026-06-06 07:04:39', '2026-06-06 11:37:29'),
	(9, 10, 4, 'Trắng', 20, 550000.00, '2026-06-06 12:01:24', '2026-06-06 12:01:24'),
	(10, 10, 4, 'Đen', 10, 550000.00, '2026-06-06 12:01:44', '2026-06-06 12:01:44');

-- Dumping structure for table sportswear_shop_db.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `revoked` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.refresh_tokens: ~5 rows (approximately)
INSERT INTO `refresh_tokens` (`id`, `token`, `expiry_date`, `user_id`, `revoked`) VALUES
	(25, '452deb32-b36c-4800-b140-9598e075a9f9', '2026-06-06 13:01:03', 4, 0),
	(32, '455e6fac-8422-40da-b85c-cb82b5ebb8fa', '2026-06-07 12:35:12', 3, 0),
	(41, 'e7e9c77d-2fc2-4c8b-87da-a0702481c6ff', '2026-06-13 10:49:50', 7, 0),
	(44, 'f31a90b8-2fa1-41cb-99c1-0d6c56a81856', '2026-06-13 10:59:50', 6, 0),
	(46, 'c3cbb0fc-e80d-4d36-9b6f-3d343f8aebd3', '2026-06-13 11:35:28', 8, 0);

-- Dumping structure for table sportswear_shop_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
	(1, 'ROLE_CUSTOMER', 'Default role: ROLE_CUSTOMER'),
	(2, 'ROLE_ADMIN', 'Default role: ROLE_ADMIN'),
	(3, 'ROLE_STAFF', 'Default role: ROLE_STAFF');

-- Dumping structure for table sportswear_shop_db.sizes
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.sizes: ~6 rows (approximately)
INSERT INTO `sizes` (`id`, `name`, `description`) VALUES
	(1, 'S', 'Kích cỡ S'),
	(2, 'M', 'Kích cỡ M'),
	(3, 'L', 'Kích cỡ L'),
	(4, 'XL', 'Kích cỡ XL'),
	(5, 'XXL', 'Kích cỡ XXL'),
	(6, 'FreeSize', 'Kích cỡ FreeSize');

-- Dumping structure for table sportswear_shop_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `address` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.users: ~6 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `created_at`, `address`, `enabled`, `full_name`) VALUES
	(3, 'admin2', 'admin2@sportswear.com', '$2a$12$cjj4wn.3erkTxQmFGXdjMuo7w8vgCqimbkXrqGglkEpglatDOGqbi', '0999999999', '2026-05-26 08:31:03', 'TP.HCM', b'1', 'Admin Sportswear'),
	(4, 'khai123', 'khai@gmail.com', '$2a$12$Pg3AJvsxUZt1NZFlBVq4TeQ41c28i7UmGU..5gWc7gAtwELFSRucm', '0987654321', '2026-05-27 12:17:10', 'Quận 3, TP.HCM Updated', b'1', 'Huỳnh Trọng Khải '),
	(5, 'admin', 'admin@sportswear.com', '$2a$12$jLDgL3oy.QNCWYy0GNja1.6C4b2C4G6EO10Dotf.wP24.rJ4auL7O', NULL, '2026-06-04 12:08:54', NULL, b'1', 'System Admin'),
	(6, 'quan', 'tranquan21122003@gmail.com', '$2a$12$7tSX.BI8uJG6GnP6uFae0eQPFomUVvwMEht8BiJMPvN0dQYDLvV5C', '0328109231', '2026-06-06 06:01:16', 'Phường Linh Xuân, TPHCM', b'1', 'Trần Quân'),
	(7, 'qqqq', 'a@b.com', '$2a$12$sPLISXvv9dhw7b1tvE2WT.wytNKCVspjoRhGb6uVlJjUgqK6z3gtu', '0123456789', '2026-06-06 10:49:44', 'Gia Viễn Ninh Bình', b'1', 'Quân Trần'),
	(8, 'quantran', 'quan@gmail.com', '$2a$12$61dzUqyiQrm9OPCmWZl6cuCBG6F8q6eHcl7CLImTpRp2i0y9H85Gq', '0123456789', '2026-06-06 11:35:23', 'Linh Xuân TPHCM', b'1', 'Tran Quan');

-- Dumping structure for table sportswear_shop_db.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sportswear_shop_db.user_roles: ~6 rows (approximately)
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
	(3, 2),
	(4, 1),
	(5, 2),
	(6, 1),
	(7, 1),
	(8, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
