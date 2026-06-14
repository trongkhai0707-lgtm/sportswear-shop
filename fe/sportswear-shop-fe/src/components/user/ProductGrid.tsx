import ProductCard from "./ProductCard";

import type { ProductItem } from "../../services/ProductService";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay } from "swiper/modules";

import "swiper/css";

type ProductGridProps = {
  title: string;
  products: ProductItem[];
};

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="mx-auto mt-10 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold uppercase">{title}</h2>

        <button className="font-semibold hover:text-red-600">Xem tất cả</button>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },

          640: {
            slidesPerView: 2,
          },

          1024: {
            slidesPerView: 4,
          },
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Link to={`/san-pham/${product.id}`}>
              <ProductCard
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
