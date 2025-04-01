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

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/profile/signin', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent and stored
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
        
        // Redirect to home page
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-200 p-6">
      <Card className="w-96 bg-white/30 backdrop-blur-lg shadow-xl rounded-lg border border-white/40">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <Input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Forgot Password & Signup */}
            <div className="text-center text-sm text-gray-600 mt-2">
              <a href="/forgot-password" className="hover:underline text-blue-700">Forgot Password?</a> |  
              <a href="/signup" className="hover:underline text-blue-700 ml-1">Sign Up</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
