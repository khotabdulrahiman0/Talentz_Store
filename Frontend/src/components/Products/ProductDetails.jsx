import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Heart, Minus, Plus, ShoppingBag } from 'react-feather';
import tinycolor from 'tinycolor2';

const DELIVERY_CHARGE = 50;

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProduct({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setIsButtonDisabled(!selectedColor);
  }, [selectedColor]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error('Please select a color before adding to cart.', { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => toast.success('Product added to the cart', { duration: 1000 }))
      .finally(() => setIsButtonDisabled(false));
  };

  const getValidColor = (color) => {
    const normalizedColor = tinycolor(color);
    return normalizedColor.isValid() ? normalizedColor.toHexString() : '#cccccc';
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (error) return <p className="text-red-500 text-center p-6">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {selectedProduct && (
        <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row p-8 gap-8">
          {/* Left: Image Gallery */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="relative group">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-[500px] object-cover rounded-lg"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Heart className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image.url)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border ${
                    mainImage === image.url ? 'border-black' : 'hover:border-gray-400'
                  }`}
                >
                  <img src={image.url} alt={image.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
            <div className="text-xl font-semibold text-gray-900">
              <p>Price: ₹{selectedProduct.price}</p>
              <p className="text-gray-600 text-sm">+ Delivery Charge: ₹{DELIVERY_CHARGE}</p>
            </div>
            <p className="text-gray-600">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
              <div className="flex gap-3">
                {selectedProduct.colors.map((color) => {
                  const validColor = getValidColor(color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full ${
                        selectedColor === color ? 'ring-2 ring-black' : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                      style={{ backgroundColor: validColor }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <button onClick={decreaseQuantity} className="p-2 bg-gray-200 rounded-full">
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button onClick={increaseQuantity} className="p-2 bg-gray-200 rounded-full">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="w-full py-4 bg-black text-white rounded-lg"
            >
              <ShoppingBag className="w-5 h-5 inline" /> Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
