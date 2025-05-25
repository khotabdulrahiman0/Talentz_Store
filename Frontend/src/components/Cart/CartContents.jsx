import React, { useEffect } from 'react';
import { RiDeleteBin3Fill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
    const dispatch = useDispatch();

    // Handle increasing/decreasing quantity
    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(updateCartItemQuantity({
                productId,
                quantity: newQuantity,
                guestId,
                userId,
                size,
                color
            }));
        }
    };

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(removeFromCart({ productId, guestId, userId, size, color }));
    };
    useEffect(() => {
        console.log("Cart Data:", cart);
    }, [cart]);
    

    return (
        <div>
            {cart.products.map((product, index) => (
                <div className="flex items-start justify-between py-4 border-b" key={index}>
                    <div className="flex items-center">
                        <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded-lg" />
                        <div>
                            <h3>{product.name}</h3>
                            <p className="text-sm text-gray-500">
                                Size: {product.size} | Color: {product.color}
                            </p>
                            <div className="flex items-center mt-2">
                                <button onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)} className="border rounded px-2 py-1 text-xl font-medium">
                                    -
                                </button>
                                <span className="mx-4">{product.quantity}</span>
                                <button onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)} className="border rounded px-2 py-1 text-xl font-medium">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>₹{product.price.toLocaleString()}</p>
                        <button onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}>
                            <RiDeleteBin3Fill className="h-5 w-5 bg-gray-200 mt-2" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartContents;
