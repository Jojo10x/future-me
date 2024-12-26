"use client"
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { LogOut ,StepBackIcon } from "lucide-react";

const Profile = () => {
    const router = useRouter();

    const goBack = () => {
        router.push("/")
    }
    return (
        <div>
            <h1>Profile</h1>
            <h1>Logout</h1>
            <StepBackIcon onClick={goBack}/>
            <LogOut />
            <Footer/>
        </div>
    );  
}

export default Profile