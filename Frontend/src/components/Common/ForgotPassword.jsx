import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiKey, FiArrowLeft, FiAlertCircle, FiCheck } from "react-icons/fi";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP & Reset Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = new URLSearchParams(location.search).get("redirect") || "/login";

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const response = await axios.post("/api/users/forgot-password/request-otp", { email });
            setSuccess(response.data.msg);
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.msg || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        setLoading(true);
        setError("");
        
        try {
            const response = await axios.post("/api/users/forgot-password/reset", {
                email,
                otp,
                newPassword
            });
            
            setSuccess(response.data.msg);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
            
        } catch (error) {
            setError(error.response?.data?.msg || "Password reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const response = await axios.post("/api/users/forgot-password/request-otp", { email });
            setSuccess("New OTP sent to your email");
        } catch (error) {
            setError(error.response?.data?.msg || "Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with logo */}
                    <div className="bg-black text-white p-6">
                        <h2 className="text-2xl font-bold text-center">ARMK</h2>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 md:p-8">
                        <div className="mb-6">
                            <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-800">
                                <FiArrowLeft className="mr-2" />
                                Back to Login
                            </Link>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            {step === 1 ? "Forgot Password" : "Reset Password"}
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            {step === 1 
                                ? "Enter your email address to request a password reset OTP" 
                                : "Enter the OTP sent to your email and set a new password"}
                        </p>
                        
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 flex items-center">
                                <FiAlertCircle className="mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {success && (
                            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 flex items-center">
                                <FiCheck className="mr-2" />
                                <span>{success}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleRequestOTP}>
                                <div className="space-y-4 mb-6">
                                    <div>
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
                                </div>
                                
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
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        "Request OTP"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <FiKey size={20} />
                                            </div>
                                            <input 
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter OTP code"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <FiKey size={20} />
                                            </div>
                                            <input 
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="New password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <FiKey size={20} />
                                            </div>
                                            <input 
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Confirm new password"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-6 flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={handleResendOTP}
                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                                
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
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;