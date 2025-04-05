import { useEffect, useState } from "react";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.log("Fetched data:", user); // Logs the fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

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
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-700"><b>Email:</b> {user.email}</p>
                    <p className="text-gray-700"><b>Phone:</b> {user.phoneNumber || "N/A"}</p>
                    <p className="text-gray-700"><b>Gender:</b> {user.gender}</p>
                    <p className="text-gray-700"><b>Date of Birth:</b> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                    <p className="text-gray-700"><b>Address:</b> {user.Address || "N/A"}</p>
                    <p className="text-gray-700"><b>Joined At:</b> {new Date(user.joinedAt).toLocaleDateString()}</p>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-col justify-center gap-4">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md">
                        Edit Profile
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
