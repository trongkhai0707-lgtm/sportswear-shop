import { Link } from "react-router-dom";

type Props = {
  id: number;
  name: string;
  image: string;
  categoryName: string;
  price: string;
};

export default function SearchResultCard({
  id,
  name,
  image,
  categoryName,
  price,
}: Props) {
  return (
    <Link to={`/san-pham/${id}`} className="block">
      <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 text-black transition hover:border-red-500 hover:shadow-lg">
        <img
          src={image}
          alt={name}
          className="h-20 w-20 rounded-lg object-cover"
        />

        <div className="min-w-0 overflow-hidden">
          <h3 className="truncate font-semibold text-sm text-gray-900">
            {name}
          </h3>
          <p className="mt-1 truncate text-xs text-gray-500">{categoryName}</p>
          <p className="mt-3 text-sm font-bold text-red-600">{price}</p>
        </div>
      </div>
    </Link>
  );
}
