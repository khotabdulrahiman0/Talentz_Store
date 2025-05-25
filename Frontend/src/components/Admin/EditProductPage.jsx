import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { upadateProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Hash, 
  Layers, 
  Coffee, 
  Tag, 
  Grid, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Save
} from 'react-feather';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: []
  });

  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(upadateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto max-w-5xl mt-8">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white mx-auto max-w-5xl p-8 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Edit Product</h2>
          <Link 
            to="/admin/products" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Package size={18} className="mr-2" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Describe your product in detail"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <DollarSign size={18} className="mr-2" />
                Pricing & Inventory
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Count in Stock</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                    name="countInStock"
                    value={productData.countInStock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      name="sku"
                      value={productData.sku}
                      onChange={handleChange}
                      placeholder="SKU-12345"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Tag size={18} className="mr-2" />
                Product Attributes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Layers size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      name="sizes"
                      value={productData.sizes.join(", ")}
                      onChange={(e) => setProductData({
                        ...productData,
                        sizes: e.target.value.split(",").map((size) => size.trim())
                      })}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Coffee size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      name="colors"
                      value={productData.colors.join(", ")}
                      onChange={(e) => setProductData({
                        ...productData,
                        colors: e.target.value.split(",").map((color) => color.trim())
                      })}
                      placeholder="Red, Blue, Green"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <ImageIcon size={18} className="mr-2" />
                Product Images
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="inline-flex items-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2 px-4 rounded-lg cursor-pointer">
                    <Upload size={18} className="mr-2" />
                    Upload Image
                    <input 
                      type="file" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </label>
                  {uploading && (
                    <div className="ml-4 flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>
                
                {productData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {productData.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative group border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <img 
                          src={image.url} 
                          alt={`Product image ${index + 1}`} 
                          className="w-full h-24 object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {productData.images.length === 0 && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                    <Grid size={40} className="mx-auto mb-2" />
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 transition-colors text-white font-medium py-3 px-4 rounded-lg"
            >
              <Save size={18} className="mr-2" />
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;