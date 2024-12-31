"use client";

import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "@/types/user";
import { Goal } from "@/types/types"; 
import { getUser, updateUser } from "@/utils/api";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useGoals } from "@/hooks/useGoals";
import GoalDashboard from "@/components/ProfileViews/GoalDashboard";
import EditableProfileCard from "@/components/Profile/EditableProfileCard";
interface ExtendedUser extends User {
  goals: Goal[];
}

const Profile = () => {
  const [userr, setUser] = useState<ExtendedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { goals } = useGoals();

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
          setUser(userData as ExtendedUser);
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

  const handleProfileUpdate = async (updatedData: { full_name?: string; email?: string }) => {
    try {
      const updatedUser = await updateUser(updatedData);
      setUser(updatedUser as ExtendedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error; 
    }
  };


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

  if (loading) return <Loader />;

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
    <div className="min-x-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
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

        <EditableProfileCard 
          user={userr} 
          onSave={handleProfileUpdate}
        />

        <GoalDashboard goals={goals} />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
