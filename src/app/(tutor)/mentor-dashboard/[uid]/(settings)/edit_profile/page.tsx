"use client";
import EditProfile from "@/components/tutorPages/settings/EditProfile";
import updateUserService from "@/services/auth/update_user_info/update_user_info_service";
import { useAlert } from "@/contexts/AlertContext";
import { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

const EditProfilePage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (formData: {
    username?: string;
    email?: string;
    password?: string;
    currentPassword: string;
  }) => {
    try {
      setIsLoading(true);

      if (!auth.currentUser) {
        showAlert("You must be logged in to update your profile", "ERROR");
        return;
      }

      const result = await updateUserService({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        currentPassword: formData.currentPassword,
      });

      if (result.type === "success") {
        if (formData.email && formData.email !== auth.currentUser.email) {
          showAlert(
            "Email verification link has been sent to your new email address. Please check your inbox.",
            "SUCCESS"
          );
        } else {
          showAlert("Profile updated successfully!", "SUCCESS");
        }

        router.refresh();
      } else {
        showAlert(result.message, "ERROR");
      }
    } catch (error: any) {
      showAlert(error.message || "Failed to update profile", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <EditProfile
        userRole="tutor"
        onSubmit={handleUpdateProfile}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditProfilePage;
