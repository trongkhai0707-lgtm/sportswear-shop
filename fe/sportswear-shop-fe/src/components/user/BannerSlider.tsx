import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const banners = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b",
];

export default function BannerSlider() {
  return (
    <div className="mx-auto mt-6 max-w-7xl">
      <Swiper spaceBetween={20} slidesPerView={1}>
        {banners.map((banner) => (
          <SwiperSlide key={banner}>
            <img
              src={banner}
              className="h-[500px] w-full rounded object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
