"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    phone: "",
  });

  const notify = (message) => {
    toast(message);
  };

  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [isSendOtp, setIsSendOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(otpValue);
  }, [otpValue]);

  const handleVerifyMailID = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/user/auth/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();

      if (!response.ok) {
        notify(data.message);
        throw new Error(data.message || "Login failed");
      }
      setIsSendOtp(true);
      notify("OTP sent successfully!");
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleverifyOtp = async (e) => {
    e.preventDefault();
    setVerifyOtpLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/auth/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.message);
        throw new Error(data.message || "Login failed");
      }
      notify("Email verified successfully!");
      setIsSendOtp(false);
      setVerifiedEmail(true);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.message);
        throw new Error(data.message || "Login failed");
      }
      notify("Account created successfully");
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Spinner Component
  const Spinner = ({ size = "small" }) => (
    <svg
      className={`animate-spin ${size === "small" ? "h-4 w-4" : "h-5 w-5"} text-white`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-lg shadow-2xl border border-gray-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-6">
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join SkillMAXX today
          </p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-700 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="space-y-5">
            {/* Email Section */}
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={verifiedEmail || otpLoading}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
                {verifiedEmail && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {!verifiedEmail && !isSendOtp && (
                <button
                  type="button"
                  onClick={handleVerifyMailID}
                  disabled={otpLoading || !formData.email}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
                    <>
                      <Spinner size="small" />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              )}
            </div>

            {/* OTP Verification Section */}
            {isSendOtp && (
              <div className="bg-gray-800 border border-gray-700 p-4 rounded-md space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">
                      Verification code sent to{" "}
                      <span className="font-medium text-white">{formData.email}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the 6-digit code below
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    onChange={(e) => setOtpValue(e.target.value)}
                    value={otpValue}
                    placeholder="000000"
                    className="block w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md text-center text-lg font-mono tracking-wider text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={handleverifyOtp}
                    disabled={verifyOtpLoading || otpValue.length < 4}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyOtpLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyMailID}
                  disabled={otpLoading}
                  className="text-sm text-gray-400 hover:text-white underline focus:outline-none transition-colors duration-200"
                >
                  Resend code
                </button>
              </div>
            )}

            {/* Additional Form Fields */}
            {verifiedEmail && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                    placeholder="Choose a strong password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/auth/signin"
              className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default page;