import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequestOTP, registerVerifyOTP, resendOTP } from "../redux/slices/authSlice";
import { mergeCart } from '../redux/slices/cartSlice';
import { FiMail, FiUser, FiLock, FiArrowRight, FiShield, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const guestId = useSelector((state) => state.auth.guestId);
    const cart = useSelector((state) => state.cart.cart);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : redirect, { replace: true });
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : redirect, { replace: true });
            }
        }
    }, [user, cart?.products?.length, guestId, dispatch, navigate, redirect, isCheckoutRedirect]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Step 1: Request OTP
    const handleRequestOTP = (e) => {
        e.preventDefault();
        dispatch(registerRequestOTP({ email }))
            .then((response) => {
                if (response.payload) {
                    setOtpSent(true);
                    setStep(2);
                    setCountdown(60);
                }
            });
    };

    // Step 2: Verify OTP and complete registration
    const handleVerifyOTP = (e) => {
        e.preventDefault();
        dispatch(registerVerifyOTP({ email, otp, name, password }));
    };

    // Handle Resend OTP
    const handleResendOTP = () => {
        dispatch(resendOTP({ email }))
            .then((response) => {
                if (response.payload) {
                    setCountdown(60);
                }
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with logo and progress indicator */}
                    <div className="bg-black text-white p-6 relative">
                        <h2 className="text-2xl font-bold text-center">Talentz Store</h2>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-500" 
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            ></div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={step === 1 ? handleRequestOTP : handleVerifyOTP}>
                            {step === 1 ? (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                                    <p className="text-gray-600 mb-6">Get started with your shopping journey</p>
                                    
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <FiMail size={20} />
                                            </div>
                                            <input 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="example@email.com" 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 flex items-center">
                                            <FiAlertCircle className="mr-2" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending OTP
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                Continue with Email
                                                <FiArrowRight className="ml-2" />
                                            </span>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4 flex justify-center">
                                        <div className="rounded-full bg-blue-50 p-3">
                                            <FiMail className="text-blue-500" size={24} />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify Your Email</h2>
                                    <p className="text-center text-gray-600 mb-6">
                                        We've sent a code to <span className="font-medium">{email}</span>
                                    </p>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <FiUser size={20} />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="Your name" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <FiLock size={20} />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    value={password} 
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="Create a password" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-gray-400">
                                                    <FiShield size={20} />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={otp} 
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="6-digit code" 
                                                    required 
                                                    maxLength={6}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {error && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 flex items-center">
                                            <FiAlertCircle className="mr-2" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center mb-4"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                Complete Registration
                                                <FiCheckCircle className="ml-2" />
                                            </span>
                                        )}
                                    </button>
                                    
                                    <div className="text-center mb-4">
                                        {countdown > 0 ? (
                                            <p className="text-sm text-gray-500 flex items-center justify-center">
                                                <svg className="animate-spin mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Resend code in {countdown}s
                                            </p>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={handleResendOTP} 
                                                disabled={loading}
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                Resend verification code
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </form>

                        <div className="mt-6 py-4 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to={`/login?redirect=${encodeURIComponent(redirect)}`} 
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;