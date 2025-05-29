// 1. UPDATED CartContents Component (No Size)
import React, { useEffect } from 'react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
    const dispatch = useDispatch();

    // Handle increasing/decreasing quantity
    const handleAddToCart = (productId, delta, quantity, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(updateCartItemQuantity({
                productId,
                quantity: newQuantity,
                guestId,
                userId,
                color
            }));
        }
    };

    const handleRemoveFromCart = (productId, color) => {
        dispatch(removeFromCart({ productId, guestId, userId, color }));
    };

    useEffect(() => {
        console.log("Cart Data:", cart);
    }, [cart]);

    // Safety check for cart structure
    if (!cart || !cart.products || !Array.isArray(cart.products)) {
        return <div>No items in cart</div>;
    }

    return (
        <div>
            {cart.products.map((product, index) => (
                <div className="flex items-start justify-between py-4 border-b" key={`${product.product || product._id}-${product.color}-${index}`}>
                    <div className="flex items-center">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-20 h-24 object-cover mr-4 rounded-lg" 
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'; // Add fallback image
                            }}
                        />
                        <div>
                            <h3>{product.name}</h3>
                            {product.color && (
                                <p className="text-sm text-gray-500">
                                    Color: {product.color}
                                </p>
                            )}
                            <div className="flex items-center mt-2">
                                <button 
                                    onClick={() => handleAddToCart(
                                        product.product || product.productId, // Handle both field names
                                        -1, 
                                        product.quantity, 
                                        product.color
                                    )} 
                                    className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                                    disabled={product.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="mx-4">{product.quantity}</span>
                                <button 
                                    onClick={() => handleAddToCart(
                                        product.product || product.productId, // Handle both field names
                                        1, 
                                        product.quantity, 
                                        product.color
                                    )} 
                                    className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">₹{(product.price * product.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">₹{product.price.toLocaleString()} each</p>
                        <button 
                            onClick={() => handleRemoveFromCart(
                                product.product || product.productId, // Handle both field names
                                product.color
                            )}
                            className="mt-2 p-1 hover:bg-red-100 rounded"
                        >
                            <RiDeleteBin3Fill className="h-5 w-5 text-red-500" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartContents;
