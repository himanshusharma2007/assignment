export default function CategorySelector({ categories, onCategoryChange }) {
  return (
    <select
      onChange={(e) => onCategoryChange(e.target.value)}
      className="select select-bordered w-full max-w-xs"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
