import { useEffect, useState } from "react";

interface ProfileData {
    _id: string;
    name: string;
    email: string;
    accountId: string;
    accountActive: boolean;
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/users/profile", {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success && data.data && data.data.length > 0) {
                    setProfile(data.data[0]);
                } else {
                    setError(data.message || "Profile not found");
                }
            } catch (err) {
                setError("Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!profile) return <div style={{ color: "red" }}>Profile not found</div>;

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "2rem auto",
                padding: 24,
                border: "1px solid #eee",
                borderRadius: 8,
                boxShadow: "0 2px 8px #eee",
            }}
        >
            <h2 style={{ textAlign: "center" }}>Profile</h2>
            <table style={{ width: "100%", fontSize: 16 }}>
                <tbody>
                    <tr>
                        <td style={{ fontWeight: 600 }}>ID:</td>
                        <td>{profile._id}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: 600 }}>Name:</td>
                        <td>{profile.name}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: 600 }}>Email:</td>
                        <td>{profile.email}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: 600 }}>Account ID:</td>
                        <td>{profile.accountId}</td>
                    </tr>
                    <tr>
                        <td style={{ fontWeight: 600 }}>Account Active:</td>
                        <td>{profile.accountActive ? "Active" : "Inactive"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Profile;
