import Link from "next/link";
import { FaHeart, FaShare, FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < Math.round(product.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              } mr-1`}
            />
          ))}
          <span className="text-sm ml-1">{product.rating}</span>
        </div>
        <div className="flex flex-wrap  justify-between items-center mt-4">
          <span className="text-xl font-bold">${product.price}</span>
           <Link href={`/products/${product.id}`}>
           
          <button className="btn btn-primary">view Details</button>
           </Link>
        </div>
       
      </div>
    </div>
  );
}
