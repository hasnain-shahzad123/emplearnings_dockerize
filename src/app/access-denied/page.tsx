"use client";
import { useRouter } from "next/navigation";
import deleteSession from "../api/serverUtilityFunctions/deleteSession";
export default function AccessDenied() {
    const router = useRouter();

    // Redirect to home screen if user is not authenticated
    const handleLoginRedirect = async () => {
        await deleteSession();
        router.push("/login");
    }

    const handleHomeRedirect = () => {
        router.push("/");
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-4xl font-bold text-[#4A148C] mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 mb-6">
                Oh no! You are not authorized to view this page.
            </p>
            <div className="space-x-4">

                <button
                    onClick={handleHomeRedirect}
                    className="px-6 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition duration-300"
                >
                    Go to Home Screen
                </button>
                <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-2 bg-[#4A146C] text-white rounded-lg shadow hover:bg-[#4A148C] transition duration-300"
                >
                    Go to Login Page
                </button>
            </div>
        </div>
    );
}
