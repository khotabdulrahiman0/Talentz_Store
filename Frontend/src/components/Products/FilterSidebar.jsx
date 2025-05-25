import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
    const [searchParams, setSearchParam] = useSearchParams();
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        category: '',
        gender: '',
        color: '',
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });
    const [priceRange, setPriceRange] = useState([0, 100]);

    const categories = ['Top Wear', 'Bottom Wear'];
    const colors = ['Red', 'Blue', 'Black', 'Green', 'Yellow', 'Gray', 'White', 'Pink', 'Beige', 'Navy'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const materials = ['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece'];
    const brands = ['Urban Threads', 'Modern Fit', 'Gucci', 'Street Style', 'Beach Breeze', 'Fashion Insta'];
    const genders = ['Men', 'Women'];

    const clearFilters = () => {
        setFilter({
            category: '',
            gender: '',
            color: '',
            size: [],
            material: [],
            brand: [],
            minPrice: 0,
            maxPrice: 100,
        });
        setPriceRange([0, 100]);
        setSearchParam({});
        navigate(window.location.pathname); // Reset URL to remove filters
    };
    

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        setFilter({
            category: params.category || '',
            gender: params.gender || '',
            color: params.color || '',
            size: params.size ? params.size.split(',') : [],
            material: params.material ? params.material.split(',') : [],
            brand: params.brand ? params.brand.split(',') : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams]);

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filter };

        if (type === 'checkbox') {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            newFilters[name] = value;
        }

        setFilter(newFilters);
        updateURLParams(newFilters);
    };

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(','));
            } else if (newFilters[key]) {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParam(params);
        navigate(`?${params.toString()}`);
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Category</h4>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-2">
                        <input
                            type="radio"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filter.category === category}
                            name="category"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Gender</h4>
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-2">
                        <input
                            type="radio"
                            value={gender}
                            onChange={handleFilterChange}
                            checked={filter.gender === gender}
                            name="gender"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            value={color}
                            onClick={handleFilterChange}
                            name="color"
                            className={`w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all ${filter.color == color ? "ring-2 ring-blue-500" : ""}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <div key={size} className="flex items-center">
                            <input
                                type="checkbox"
                                value={size}
                                onChange={handleFilterChange}
                                checked={filter.size.includes(size)}
                                name="size"
                                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                            />
                            <span className="text-gray-700">{size}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Material Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Material</h4>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filter.material.includes(material)}
                            name="material"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Brand</h4>
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            value={brand}
                            onChange={handleFilterChange}
                            checked={filter.brand.includes(brand)}
                            name="brand"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Price Range</h4>
                <input
                    type="range"
                    name="maxPrice"
                    min={0}
                    max={100}
                    value={filter.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${filter.maxPrice}</span>
                </div>
            </div>
            <button
                onClick={clearFilters}
                className="w-full mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all">
                Clear Filters
            </button>
        </div>
    );
};

export default FilterSidebar;