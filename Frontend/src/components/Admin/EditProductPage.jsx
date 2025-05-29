import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { upadateProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';

const categories = ['Purse', 'Bracelet', 'Necklace'];

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: "",
    stock: 0,
    sku: "",
    category: "",
    colors: [],
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: [],
    dimensions: { length: '', width: '', height: '' },
    weight: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  // Set product data from backend
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        stock: selectedProduct.stock ?? 0,
        discountPrice: selectedProduct.discountPrice ?? '',
        colors: selectedProduct.colors ?? [],
        images: selectedProduct.images ?? [],
        isFeatured: selectedProduct.isFeatured ?? false,
        isPublished: selectedProduct.isPublished ?? false,
        tags: selectedProduct.tags ?? [],
        dimensions: selectedProduct.dimensions
          ? {
              length: selectedProduct.dimensions.length ?? '',
              width: selectedProduct.dimensions.width ?? '',
              height: selectedProduct.dimensions.height ?? ''
            }
          : { length: '', width: '', height: '' },
        weight: selectedProduct.weight ?? '',
        metaTitle: selectedProduct.metaTitle ?? '',
        metaDescription: selectedProduct.metaDescription ?? '',
        metaKeywords: selectedProduct.metaKeywords ?? ''
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['length', 'width', 'height'].includes(name)) {
      setProductData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [name]: value
        }
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setProductData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: uploadData
      });

      const data = await response.json();

      if (data.imageUrl) {
        setProductData(prev => ({
          ...prev,
          images: [...prev.images, { url: data.imageUrl }]
        }));
      }
    } catch (err) {
      setUpdateError('Failed to upload image');
    }
    setUploadingImage(false);
  };

  const removeImage = (indexToRemove) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    const payload = {
      ...productData,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
      stock: Number(productData.stock),
      dimensions: {
        length: productData.dimensions.length ? Number(productData.dimensions.length) : undefined,
        width: productData.dimensions.width ? Number(productData.dimensions.width) : undefined,
        height: productData.dimensions.height ? Number(productData.dimensions.height) : undefined
      },
      weight: productData.weight ? Number(productData.weight) : undefined
    };

    try {
      await dispatch(upadateProduct({ id, productData: payload }));
      setUpdateSuccess('Product updated successfully!');
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setUpdateError('Failed to update product');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Error loading product</p>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Edit Product</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Update product details and save changes</p>
          </div>
          <Link 
            to="/admin/products" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {updateError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex">
                  <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">{updateError}</p>
                  </div>
                </div>
              </div>
            )}

            {updateSuccess && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r">
                <div className="flex">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">{updateSuccess}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      value={productData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      placeholder="Enter SKU"
                      value={productData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Pricing & Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={productData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      placeholder="0.00"
                      value={productData.discountPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={productData.stock}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Product Details</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter product description"
                      value={productData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Colors
                      </label>
                      <input
                        type="text"
                        name="colors"
                        placeholder="Red, Blue, Green (comma-separated)"
                        value={productData.colors.join(', ')}
                        onChange={(e) => handleArrayInput(e, 'colors')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        placeholder="Gift, Festival, Ethnic (comma-separated)"
                        value={productData.tags.join(', ')}
                        onChange={(e) => handleArrayInput(e, 'tags')}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Product Images</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Images
                      </label>
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                          <span className="text-indigo-600 dark:text-indigo-400 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Choose Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        {uploadingImage && (
                          <div className="ml-4 flex items-center text-gray-600 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Product Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={productData.isPublished}
                        onChange={(e) => setProductData(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Published</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={productData.isFeatured}
                        onChange={(e) => setProductData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                type="submit"
                disabled={updating || uploadingImage}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(updating || uploadingImage) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {updating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Product...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;