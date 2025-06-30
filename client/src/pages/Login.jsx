import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext"; // Import it
import GoogleSignIn from "../components/GoogleSignIn"; // Import GoogleSignIn component

export default function LoginPage() {
  const { setUser, setIsLoggedIn } = useAuth(); // Get the setter for user data and login state
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/profile/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();
      console.log("Login result:", result); // Debug log
      if (response.ok && result.success) {
        alert(`Logged in as ${data.email}`);
        setUser(result.user); // Store user data in context
        setIsLoggedIn(true); // Set login state
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#8b5a41] to-[#8b5a41] items-center justify-center overflow-hidden">
      <div className="flex w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-800">SHOP EASE</h2>

          <h3 className="text-xl font-semibold mt-8 text-gray-800">Login</h3>
          <p className="text-gray-600 text-sm mb-6">Let's get your fashion journey started.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* <Input
              type="text"
              placeholder="Name"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>} */}

            <Input
              type="email"
              placeholder="Email"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <Input
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-black"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <Button
              type="submit"
              className="w-full bg-[#8b4b2d] hover:bg-[#7a3e22] text-white font-semibold py-2 rounded-md transition"
              disabled={loading}
            >
              {loading ? "Diving In..." : "Login"}
            </Button>
          </form>

          <GoogleSignIn text="Sign in with Google" />

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <a href="/signup" className="font-semibold text-[#8b4b2d] hover:text-[#7a3e22] ml-1 transition-colors">
                Sign up here
              </a>
            </p>
          </div>
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
