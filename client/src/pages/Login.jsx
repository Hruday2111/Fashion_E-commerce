// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// export default function LoginPage() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);

//   const onSubmit = (data) => {
//     setLoading(true);
//     setTimeout(() => {
//       alert(`Logged in as ${data.email}`);
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-200 p-6">
//       <Card className="w-96 bg-white/30 backdrop-blur-lg shadow-xl rounded-lg border border-white/40">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-semibold text-gray-800">Login</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Email Input */}
//             <div>
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 {...register("email", { required: "Email is required" })}
//               />
//               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </div>

//             {/* Password Input */}
//             <div>
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 {...register("password", { required: "Password is required" })}
//               />
//               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//             </div>

//             {/* Login Button */}
//             <Button 
//               type="submit" 
//               className="w-full bg-blue-600 text-white font-medium py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>

//             {/* Forgot Password & Signup */}
//             <div className="text-center text-sm text-gray-600 mt-2">
//               <a href="/forgot-password" className="hover:underline text-blue-700">Forgot Password?</a> |  
//               <a href="/signup" className="hover:underline text-blue-700 ml-1">Sign Up</a>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext"; // Import it

export default function LoginPage() {
  const { setIsLoggedIn } = useAuth(); // Get the setter
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
      if (response.ok && result.success) {
        alert(`Logged in as ${data.email}`);
        setIsLoggedIn(true); // Update global login state
        navigate("/");
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-200 p-6">
  //       <Card className="w-96 bg-white/30 backdrop-blur-lg shadow-xl rounded-lg border border-white/40">
  //         <CardHeader>
  //           <CardTitle className="text-center text-2xl font-semibold text-gray-800">Login</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
  //             {/* Email Input */}
  //             <div>
  //               <Input
  //                 type="email"
  //                 placeholder="Email"
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
  //                 {...register("email", { required: "Email is required" })}
  //               />
  //               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
  //             </div>

  //             {/* Password Input */}
  //             <div>
  //               <Input
  //                 type="password"
  //                 placeholder="Password"
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
  //                 {...register("password", { required: "Password is required" })}
  //               />
  //               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
  //             </div>

  //             {/* Login Button */}
  //             <Button 
  //               type="submit" 
  //               className="w-full bg-blue-600 text-white font-medium py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
  //               disabled={loading}
  //             >
  //               {loading ? "Logging in..." : "Login"}
  //             </Button>

  //             {/* Forgot Password & Signup */}
  //             <div className="text-center text-sm text-gray-600 mt-2">
  //               <a href="/forgot-password" className="hover:underline text-blue-700">Forgot Password?</a> |  
  //               <a href="/signup" className="hover:underline text-blue-700 ml-1">Sign Up</a>
  //             </div>
  //           </form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }  

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

          <div className="my-4 space-y-3">
            <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>
            {/* <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
            <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5 mr-2" />
            Sign up with Facebook
          </button> */}
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            <a href="/login" className="font-medium underline">Sign Up</a>
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
