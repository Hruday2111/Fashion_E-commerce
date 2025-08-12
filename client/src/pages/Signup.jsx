import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import API_BASE from "../config/api";

export default function SignupPage() {
  const { setIsLoggedIn } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          dateOfBirth: data.dateOfBirth || null,
          gender: data.gender || 'other',
          Address: data.address || '',
          phoneNumber: data.phoneNumber || ''
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Account created successfully! Please login.');
        navigate("/login");
      } else {
        alert(result.message || 'Sign up failed');
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#8b5a41] to-[#8b5a41] items-center justify-center overflow-hidden">
      <div className="flex w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-10 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800">SHOP EASE</h2>

          <h3 className="text-xl font-semibold mt-8 text-gray-800">Create Account</h3>
          <p className="text-gray-600 text-sm mb-6">Join us for the ultimate fashion experience.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input
                type="text"
                placeholder="Enter your first name"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <Input
                type="text"
                placeholder="Enter your last name"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <Input
                type="password"
                placeholder="Create a password (min 6 characters)"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <Input
                type="password"
                placeholder="Confirm your password"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (val) => {
                    if (watch('password') != val) {
                      return "Passwords do not match";
                    }
                  }
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <Input
                type="date"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("dateOfBirth")}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black bg-transparent py-2"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
                {...register("phoneNumber")}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                placeholder="Enter your address"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black resize-none"
                rows="2"
                {...register("address")}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8b4b2d] hover:bg-[#7a3e22] text-white font-semibold py-3 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <GoogleSignIn text="Sign up with Google" />

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account? <a href="/login" className="font-medium underline">Login</a>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 h-full">
          <img
            src="/model_login.jpg"
            alt="Fashion Model"
            className="object-contain w-full h-full"
          />
        </div>

      </div>
    </div>
  );
} 