type Props = {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
};

export default function ProductCard({
  name,
  price,
  oldPrice,
  image,
}: Props) {
  return (
    <div className="group cursor-pointer">

      <div className="overflow-hidden rounded bg-gray-100">
        <img
          src={image}
          className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3">
        <h3 className="font-semibold uppercase">
          {name}
        </h3>

        <div className="mt-2 flex gap-2 items-center">
          <span className="font-bold text-red-600">
            {price}
          </span>

          {oldPrice ? (
            <span className="text-gray-400 line-through">
              {oldPrice}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}