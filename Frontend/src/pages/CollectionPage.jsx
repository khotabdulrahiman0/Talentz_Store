import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';

const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    }, [dispatch, collection, JSON.stringify(queryParams)]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // For closing sidebar when clicking outside on mobile
    useEffect(() => {
        if (!isSidebarOpen) return;
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen]);

    return (
        <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-gray-50 min-h-screen">
            {/* Mobile filter toggle button */}
            <div className="block md:hidden sticky top-0 z-40 bg-white border-b">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center gap-2 text-indigo-600 font-semibold px-4 py-3 w-full border-b">
                    <FaFilter className="inline-block" /> Filters
                </button>
            </div>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`
                    fixed inset-0 z-50 transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0 md:flex-shrink-0 md:w-64
                    bg-white md:bg-transparent shadow-lg md:shadow-none
                    md:static md:block
                `}
                style={{ minWidth: '16rem', maxWidth: '18rem' }}
            >
                <div className="h-full md:sticky md:top-4">
                    <FilterSidebar />
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        {collection ? collection.replace(/-/g, " ").toUpperCase() : "ALL COLLECTION"}
                    </h2>
                    <SortOptions />
                </div>
                <ProductGrid products={products} loading={loading} error={error} />
            </main>
        </div>
    );
};

export default CollectionPage;