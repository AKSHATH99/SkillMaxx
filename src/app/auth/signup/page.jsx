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

  const [otpValue, setOtpValue] = useState();

  const [loading, setLoading] = useState(false);
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

  useEffect(()=>{
    console.log(otpValue)
  },[otpValue])

  const handleVerifyMailID = async (e) => {
    e.preventDefault();
    console.log("executign");
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
        notify(data.message) 
        throw new Error(data.message || "Login failed");
      }
      setIsSendOtp(true)

    } catch (error) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleverifyOtp = async (e) => {
    e.preventDefault();

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
      notify("Email verified");
      setIsSendOtp(false);
      setVerifiedEmail(true);

    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
      notify("Account created successFully");
      router.push("/");

      // Handle successful login
      // For example: router.push('/dashboard');
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to PeerPay
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your PeerPay Account
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
              {!verifiedEmail && (
                <button
                  className=" "
                  onClick={(e) => {
                    handleVerifyMailID(e);
                  }}
                >
                  Verify email
                </button>
              )}

              {isSendOtp && (
                <>
                  <p className="text-sm text-gray-400 ">
                    An OTP has been sent into your mail ID . Please fill it in
                    here to verify your mailID
                  </p>
                  <input
                    className="border border-gray-500 p-1  mt-5 "
                    type="number"
                    onChange={(e)=>setOtpValue(e.target.value)}
                    value={otpValue}
                  />
                  <button
                    className="border border-gray-500 p-1 "
                    onClick={(e) => {
                      handleverifyOtp(e);
                    }}
                  >
                    Verify Otp
                  </button>
                </>
              )}

              {verifiedEmail && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="mb-4 mt-10">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="mb-4 mt-10">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="John123"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="98484949"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Signing in...
                        </span>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
