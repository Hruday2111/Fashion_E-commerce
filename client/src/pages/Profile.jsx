import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import profileIcon from "../components/profile.svg";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [changePassword, setChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth(); // Get the setter

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/profile/", {
                    method: "GET",
                    credentials: "include", // Ensures cookies (JWT) are sent with the request
                });
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUser(data.user);
                setFormData(data.user); // Initialize form data with user data
                console.log("Fetched data:", data.user); // Logs the fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/Profile/logout", {
                method: "POST",
                credentials: "include", // Important: sends the cookie
            });
            if (res.ok) {
                setIsLoggedIn(false)
                navigate("/"); // Redirect to home
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset form data to current user data when entering edit mode
        if (!isEditing) {
            setFormData({...user});
            setChangePassword(false);
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setPasswordError("");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handlePasswordToggle = () => {
        setChangePassword(!changePassword);
        if (!changePassword) {
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setPasswordError("");
        }
    };

    const validatePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return false;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // If changing password, validate first
            if (changePassword) {
                if (!validatePassword()) return;
            }

            // Prepare data to send
            const dataToUpdate = { ...formData };
            
            // Add password data if changing password
            if (changePassword) {
                dataToUpdate.oldPassword = passwordData.oldPassword;
                dataToUpdate.newPassword = passwordData.newPassword;
            }

            const response = await fetch("http://localhost:4000/api/profile/update", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            const updatedData = await response.json();
            setUser(updatedData.user);
            setIsEditing(false);
            setChangePassword(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setChangePassword(false);
        setFormData({...user}); // Reset form data
        setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setPasswordError("");
    };

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

    // Render only if user data is available
    if (!user) return <p className="text-center text-gray-500 text-lg">No user data available</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center w-full max-w-xl">
                <img
                    src={profileIcon}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-6 shadow-lg border-4 border-indigo-100"
                />
                <h2 className="text-3xl font-bold text-indigo-700 mb-2">{user.firstName} {user.lastName}</h2>
                <p className="text-lg text-gray-600 mb-4">{user.email}</p>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {/* Phone */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {/* Gender */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Gender</label>
                            <select name="gender" value={formData.gender || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/* Date of Birth */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {/* Address */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Address</label>
                            <textarea name="Address" value={formData.Address || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                        </div>
                        {/* Password Change Section (optional, as before) */}
                        {/* ...password change fields if needed... */}
                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg text-lg">Save Changes</button>
                            <button type="button" onClick={handleCancel} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg text-lg">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full max-w-md space-y-3 mb-8">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Full Name:</span>
                            <span className="text-gray-900">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="text-gray-900">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Phone:</span>
                            <span className="text-gray-900">{user.phoneNumber || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Gender:</span>
                            <span className="text-gray-900 capitalize">{user.gender}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Date of Birth:</span>
                            <span className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Address:</span>
                            <span className="text-gray-900">{user.Address || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Joined At:</span>
                            <span className="text-gray-900">{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "N/A"}</span>
                        </div>
                    </div>
                )}
                {/* Action Buttons */}
                {!isEditing && (
                    <div className="flex gap-4 mt-2">
                        <button onClick={handleEditToggle} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg text-lg">Edit Profile</button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg text-lg">Log Out</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;