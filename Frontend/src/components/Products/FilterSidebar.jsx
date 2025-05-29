import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const categories = ['Purse', 'Bracelet', 'Necklace'];
const colors = [
  'Red', 'Blue', 'Black', 'Green', 'Yellow', 'Gray', 'White', 'Pink', 'Beige', 'Navy'
];

const FilterSidebar = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    category: '',
    color: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || '',
      color: params.color || '',
      minPrice: params.minPrice || '',
      maxPrice: params.maxPrice || ''
    });
  }, [searchParams]);

  const handleSelect = (type, value) => {
    const newFilter = { ...filter, [type]: filter[type] === value ? '' : value };
    setFilter(newFilter);
    updateURLParams(newFilter);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
  };

  const handlePriceApply = () => {
    updateURLParams(filter);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params.append(key, newFilters[key]);
    });
    setSearchParam(params);
    navigate(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      color: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchParam({});
    navigate(window.location.pathname);
  };

  return (
    <aside className="w-full md:w-64 bg-white border rounded-xl md:sticky md:top-4 shadow-sm p-6 mb-6 md:mb-0 md:mr-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear All</button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelect('category', cat)}
              className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                filter.category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              title={color}
              onClick={() => handleSelect('color', color)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                ${filter.color === color ? 'ring-2 ring-indigo-500 border-indigo-500' : color === 'White' ? 'border-gray-300' : 'border-transparent'}`}
              style={{ backgroundColor: color.toLowerCase() }}
            >
              {filter.color === color && (
                <span className="block w-3 h-3 rounded-full bg-white border border-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            min={0}
            step={1}
            value={filter.minPrice}
            onChange={handlePriceChange}
            placeholder="Min"
            className="w-16 px-2 py-1 border rounded text-xs"
          />
          <span className="mx-1 text-gray-400">-</span>
          <input
            type="number"
            name="maxPrice"
            min={0}
            step={1}
            value={filter.maxPrice}
            onChange={handlePriceChange}
            placeholder="Max"
            className="w-16 px-2 py-1 border rounded text-xs"
          />
          <button
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold"
            onClick={handlePriceApply}
            type="button"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;