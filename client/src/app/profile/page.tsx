"use client"
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { LogOut ,StepBackIcon } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const router = useRouter();
    const { user, loading, logout } = useAuth()
    useEffect(() => {
        if (!loading && !user) {
          router.push('/login')
        }
      }, [user, loading, router])
    
      if (loading) {
        return <div>Loading...</div>
      }
    
      if (!user) {
        return null
      }

    const goBack = () => {
        router.push("/")
    }
    return (
        <div>
            <h1>Profile</h1>
            <h1>Logout</h1>
            <h1>Data</h1>
            <StepBackIcon onClick={goBack}/>
            <LogOut onClick={logout} />
            <Footer/>
        </div>
    );  
}

export default Profile