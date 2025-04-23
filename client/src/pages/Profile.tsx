import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ComponentLoader from "../components/ComponentLoader";
import RootLayout from "./RootLayout";
import { statusType } from "../types";

interface ProfileData {
    _id: string;
    name: string;
    email: string;
    accountId: string;
    accountActive: boolean;
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [status, setStatus] = useState<statusType>({
        loading: true,
        error: null,
    });
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosPrivate.get("/users/profile");
                setProfile(response.data.data.user);
            } catch (error: any) {
                console.log(error);
            } finally {
                setStatus({
                    loading: false,
                    error: null,
                });
            }
        };
        fetchProfile();
    }, []);

    return (
        <ComponentLoader
            status={status}
            component={
                <RootLayout>
                    {profile && (
                        <div className="max-w-md mx-auto mt-10 rounded-2xl shadow-2xl bg-white overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-blue-600 font-bold shadow-lg mb-3">
                                    {profile.name
                                        ? profile.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <div className="text-white text-2xl font-semibold mb-1">
                                    {profile.name}
                                </div>
                                <div className="text-blue-100 text-base mb-2">
                                    {profile.email}
                                </div>
                            </div>
                            <div className="px-8 py-8">
                                <div className="text-blue-600 font-semibold text-base mb-4 tracking-wide">
                                    Account Details
                                </div>
                                <table className="w-full text-base">
                                    <tbody>
                                        <tr className="hover:bg-blue-50 rounded-lg transition">
                                            <td className="font-medium text-gray-600 py-2">
                                                Account ID
                                            </td>
                                            <td className="text-gray-800 py-2 text-right font-mono">
                                                {profile.accountId}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-blue-50 rounded-lg transition">
                                            <td className="font-medium text-gray-600 py-2">
                                                Account Status
                                            </td>
                                            <td
                                                className={`py-2 text-right font-semibold ${
                                                    profile.accountActive
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {profile.accountActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </RootLayout>
            }
        />
    );
};

export default Profile;
