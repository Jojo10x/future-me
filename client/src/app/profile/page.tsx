"use client";

import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "@/types/user";
import { getUser } from "@/utils/api";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const Profile = () => {
  const [userr, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUser(userData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user");
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {<Loader/>}

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen classit">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Profile
            </h1>

            {/* Profile Info */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userr?.full_name || "Loading..."}
                </h2>
                <p className="text-sm text-gray-500">{userr?.email}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;