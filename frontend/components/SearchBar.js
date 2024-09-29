import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    onSearch(searchTerm);
  }, [searchTerm, onSearch]); 

  return (
    <div className="relative flex items-center bg min-w-[320px]">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered w-full  pl-10" // Add padding for the icon
      />
      <FaSearch className="absolute left-3 text-gray-500" />{" "}
      {/* Search icon inside input */}
    </div>
  );
}
