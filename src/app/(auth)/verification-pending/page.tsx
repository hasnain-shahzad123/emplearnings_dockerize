"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import Image from "next/image";
import { Logo } from "@/assets/index";
import { useAlert } from "@/contexts/AlertContext";
import getUserRoleService from "@/services/auth/get_user_role/GetUserRoleService";
import { sendEmailVerification, User } from "firebase/auth";

export default function VerificationPending() {
  const router = useRouter();
  const [allowResend, setAllowResend] = useState<boolean>(false);

  const { showAlert } = useAlert();
  const [userEmail, setUserEmail] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.currentUser?.email) {
      setUserEmail(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (!user.emailVerified) {
        setAllowResend(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleGoBack = async () => {
    await auth.signOut();
    router.push("/");
  };
  const handleResendEmail = async () => {
    if (user) {
      await sendEmailVerification(user, {
        url: `https://emplearnings.com/verify-email`,
        handleCodeInApp: true,
      });
      showAlert("Verification email sent!", "SUCCESS");
      setAllowResend(false);
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      setUser(user);
      setUserEmail(user.email || "");

      // If the user just logged in, start checking verification
      if (!interval) {
        checkVerificationAndRedirect(user);
        interval = setInterval(() => checkVerificationAndRedirect(user), 3000);
      }
    });

    async function checkVerificationAndRedirect(user: User) {
      if (!user) return;

      try {
        // Reload the user to get fresh data
        await user.reload();

        if (user.emailVerified) {
          // Force refresh token to get latest claims
          const idTokenResult = await user.getIdTokenResult(true);
          const isVerifiedClaim = idTokenResult.claims.isVerified;

          // If claim isn't set, check role from service
          if (!isVerifiedClaim) {
            return;
          }

          let role = idTokenResult.claims.role;

          // If role not in claims, try to get it from service
          if (!role && user.email) {
            const roleResult = await getUserRoleService(user.email);
            role = roleResult.role;
          }

          if (!role) {
            return;
          }

          // Determine dashboard URL
          const dashboardUrl =
            role === "tutor"
              ? `/mentor-dashboard/${user.uid}`
              : `/student-dashboard/${user.uid}`;

          showAlert("Email verified successfully!", "SUCCESS");

          // Clear interval before redirecting
          if (interval) {
            clearInterval(interval);
          }

          router.push(dashboardUrl);
        } else {
        }
      } catch (error) {
        console.error("Error checking verification:", error);
        showAlert("Error checking verification status", "ERROR");
      }
    }

    // Cleanup
    return () => {
      unsubscribe();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [router, showAlert]);

  return (
    <div className="max-w-7xl mx-auto  h-screen min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center flex flex-col  gap-y-4 h-1/2  ">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={Logo}
            alt="Logo"
            height={40}
            width={40}
            className="h-15 w-15"
          />
          <h1 className="text-lg font-bold inline-block">
            Empower<span className="text-[#4A148C]">Ed</span> Learnings
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 mb-4">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium">{userEmail}</span>. Please check your
            inbox and click the link to verify your account.
          </p>
          <p className="text-sm text-gray-500">
            Once verified, you'll be automatically redirected to your dashboard
          </p>
        </div>
        <div className="flex flex-col w-full gap-y-8 items-center ">
          <div className="flex flex-row w-full  justify-around text-sm">
            <button
              disabled={!allowResend}
              onClick={async () => {
                await handleResendEmail();
              }}
              className="rounded-2xl disabled:bg-empoweredFlag/50 disabled:hover:scale-100 disabled:transition-none  h-10 w-44  transition-all duration-100 ease-in-out bg-empoweredFlag text-white hover:scale-105"
            >
              Resend Email
            </button>
            <button
              onClick={async () => {
                await handleGoBack();
              }}
              className="rounded-2xl h-10 w-44  transition-all duration-100 ease-in-out bg-empoweredFlag text-white hover:scale-105"
            >
              Go Back
            </button>
          </div>
          <p className="text-gray-600 text-xs">
            You can try to resend the email after 60 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
