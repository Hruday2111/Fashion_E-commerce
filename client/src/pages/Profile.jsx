import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
            <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Left - User Info */}
                <div className="p-4 bg-white shadow-md rounded-lg">
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-700 text-sm font-bold mb-1">Address</label>
                                <textarea
                                    name="Address"  // Note: matches capitalization in your original code
                                    value={formData.Address || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                ></textarea>
                            </div>
                            
                            {/* Password Change Section */}
                            <div className="mt-6 mb-3">
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="changePassword" 
                                        checked={changePassword}
                                        onChange={handlePasswordToggle}
                                        className="mr-2"
                                    />
                                    <label htmlFor="changePassword" className="text-gray-700 font-bold">
                                        Change Password
                                    </label>
                                </div>
                            </div>

                            {changePassword && (
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-bold text-lg mb-3">Change Password</h4>
                                    {passwordError && (
                                        <p className="text-red-500 mb-3">{passwordError}</p>
                                    )}
                                    <div className="mb-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={changePassword}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-1">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={changePassword}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-700 text-sm font-bold mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required={changePassword}
                                        />
                                    </div>
                                </div>
                            )}
                        </form>
                    ) : (
                        <>
                            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-gray-700"><b>Email:</b> {user.email}</p>
                            <p className="text-gray-700"><b>Phone:</b> {user.phoneNumber || "N/A"}</p>
                            <p className="text-gray-700"><b>Gender:</b> {user.gender}</p>
                            <p className="text-gray-700"><b>Date of Birth:</b> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                            <p className="text-gray-700"><b>Address:</b> {user.Address || "N/A"}</p>
                            <p className="text-gray-700"><b>Joined At:</b> {new Date(user.joinedAt).toLocaleDateString()}</p>
                        </>
                    )}
                </div>

                {/* Right - Actions */}
                <div className="flex flex-col justify-center gap-4">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={handleSubmit}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleEditToggle}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                            >
                                Log Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;