"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  checkActionCode,
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
  User,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useAlert } from "@/contexts/AlertContext";
import Image from "next/image";
import { Logo } from "@/assets/index";
import { z } from "zod";
import { useFormik } from "formik";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import getUserRoleService from "@/services/auth/get_user_role/GetUserRoleService";
import updateEmailVerificationService from "@/services/auth/update_email_verification/UpdateEmailVerificationService";
import updateEmailInDb from "@/firebase/auth/updateEmailInDb";
import logoutTutorFromDashboard from "@/firebase/tutor/logoutTutorFromDashboard";
import logoutStudentFromDashboard from "@/firebase/student/logoutStudentFromDashboard";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function Loading() {
  return null;
}

export default function ActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");
  const verifyEmailProcessed = useRef(false);
  const verifyAndChangeEmailProcessed = useRef(false);

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [previousEmail, setPreviousEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle password reset
  useEffect(() => {
    if (mode === "resetPassword" && oobCode && !isRedirecting) {
      const getEmailFromCode = async () => {
        try {
          const email = await verifyPasswordResetCode(auth, oobCode);
          setUserEmail(email);
        } catch (error) {
          console.error("Error getting email from reset code:", error);
          if (!isRedirecting) {
            showAlert("Invalid or expired password reset link", "ERROR");
          }
        }
      };

      getEmailFromCode();
    }
  }, [mode, oobCode, showAlert, isRedirecting]);

  // Handle email verification only (not change)
  useEffect(() => {
    if (mode === "verifyEmail" && oobCode && !verifyEmailProcessed.current) {
      verifyEmailProcessed.current = true;

      const verifyEmail = async () => {
        if (!oobCode) {
          setVerificationStatus("error");
          showAlert("Invalid verification link", "ERROR");
          return;
        }

        try {
          const actionCodeInfo = await checkActionCode(auth, oobCode);

          const email = actionCodeInfo.data.email;
          setUserEmail(email || null);

          await applyActionCode(auth, oobCode);

          if (email) {
            await updateEmailVerificationService(email);
          }

          setVerificationStatus("success");
          showAlert("Email verified successfully!", "SUCCESS");
        } catch (error: any) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
          if (error.code === "auth/invalid-action-code") {
            showAlert("Invalid or expired verification link", "ERROR");
          } else {
            showAlert(error.message || "Failed to verify email", "ERROR");
          }
        }
      };

      verifyEmail();
    }
  }, [mode, oobCode, showAlert]);

  // Handle email change and verification
  useEffect(() => {
    if (
      (mode === "verifyAndChangeEmail" || mode === "action") &&
      oobCode &&
      !verifyAndChangeEmailProcessed.current
    ) {
      verifyAndChangeEmailProcessed.current = true;

      const verifyAndChangeEmail = async () => {
        if (!oobCode) {
          setVerificationStatus("error");
          showAlert("Invalid verification link", "ERROR");
          return;
        }

        try {
          const actionCodeInfo = await checkActionCode(auth, oobCode);

          // Extract email information
          if (actionCodeInfo.data.previousEmail) {
            setPreviousEmail(actionCodeInfo.data.previousEmail);
          }

          if (actionCodeInfo.data.email) {
            setNewEmail(actionCodeInfo.data.email);
            setUserEmail(actionCodeInfo.data.email);
          }

          // Apply the verification code
          await applyActionCode(auth, oobCode);

          // Add a delay to allow Firebase to process the email change
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Step 1: Update email verification status
          if (actionCodeInfo.data.email) {
            await updateEmailVerificationService(actionCodeInfo.data.email);
          }

          // Step 2: Attempt to update email in the database
          if (actionCodeInfo.data.previousEmail && actionCodeInfo.data.email) {
            try {
              // Get user role using the service
              const { role } = await getUserRoleService(
                actionCodeInfo.data.email
              );

              // Get the current user
              const currentUser = user || auth.currentUser;

              if (currentUser && role) {
                // Update email in DB
                const result = await updateEmailInDb({
                  uid: currentUser.uid,
                  email: actionCodeInfo.data.email,
                  role: role as "tutor" | "student",
                });

                if (result.type !== "success") {
                  console.error(
                    "Failed to update email in database:",
                    result.message
                  );
                }
              }
            } catch (roleError) {
              console.error("Error retrieving user role:", roleError);
            }
          }

          // Mark verification as successful
          setVerificationStatus("success");

          // Show appropriate success message
          if (actionCodeInfo.data.previousEmail && actionCodeInfo.data.email) {
            const { role } = await getUserRoleService(
              actionCodeInfo.data.email
            );

            if (role === "tutor") {
              await logoutTutorFromDashboard();
            } else if (role === "student") {
              await logoutStudentFromDashboard;
            }

            setUser(null);

            showAlert(
              "Email changed successfully! Please login again with your new email.",
              "SUCCESS"
            );
          } else {
            showAlert("Email verified successfully!", "SUCCESS");
          }
        } catch (error) {
          // Handle errors
          console.error("Verification error:", error);
          setVerificationStatus("error");

          if ((error as { code: string }).code === "auth/invalid-action-code") {
            showAlert("Invalid or expired verification link", "ERROR");
          } else if (
            (error as { code: string }).code === "auth/user-token-expired"
          ) {
            // Specific handling for token expiration
            showAlert(
              "Your session has expired. Please log in again with your new email address.",
              "WARNING"
            );
          } else {
            showAlert(
              (error as Error).message || "Failed to verify email",
              "ERROR"
            );
          }
        }
      };

      verifyAndChangeEmail();
    }
  }, [mode, oobCode, showAlert, user]);

  // Password reset form
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      try {
        passwordSchema.parse(values);
      } catch (err) {
        const formErrors: Record<string, string> = {};
        if (err instanceof z.ZodError) {
          err.errors.forEach((err) => {
            formErrors[err.path[0]] = err.message;
          });
        }
        return formErrors;
      }
    },
    onSubmit: async (values) => {
      if (!oobCode) {
        showAlert("Invalid password reset link", "ERROR");
        return;
      }

      try {
        setIsRedirecting(true);
        await confirmPasswordReset(auth, oobCode, values.password);

        if (userEmail) {
          const { redirectTo } = await getUserRoleService(userEmail);
          showAlert("Password reset successful!", "SUCCESS");
          router.push(redirectTo);
        } else {
          showAlert("Password reset successful!", "SUCCESS");
          router.push("/select-user-type");
        }
      } catch (error: any) {
        setIsRedirecting(false);
        showAlert(error.message || "Failed to reset password", "ERROR");
      }
    },
  });

  if (!oobCode) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-red-500">Invalid Link</h2>
        <p className="text-gray-600">This link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="text-center mb-8 w-full max-w-lg">
      <div className="flex items-center justify-center mb-4">
        <Image
          src={Logo || "/placeholder.svg"}
          alt="Logo"
          height={40}
          width={40}
          className="h-15 w-15"
        />
        <h1 className="text-lg font-bold inline-block">
          Empower<span className="text-[#4A148C]">Ed</span> Learnings
        </h1>
      </div>

      {mode === "verifyEmail" ||
      mode === "verifyAndChangeEmail" ||
      mode === "action" ? (
        <>
          {verificationStatus === "verifying" && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {previousEmail && newEmail
                  ? "Verifying Your Email Change"
                  : "Verifying Your Email"}
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                {previousEmail && newEmail
                  ? "Email Changed Successfully!"
                  : "Email Verified Successfully!"}
              </h2>
              <div className="bg-green-50 p-6 rounded-lg max-w-md mx-auto">
                {previousEmail && newEmail ? (
                  <p className="text-gray-700 mb-4">
                    Your email has been changed from{" "}
                    <strong>{previousEmail}</strong> to{" "}
                    <strong>{newEmail}</strong> and verified successfully.
                  </p>
                ) : (
                  <p className="text-gray-700 mb-4">
                    Your email has been verified. You can now enjoy all features
                    of the platform.
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-2">
                  You can close this tab and continue in your original window.
                </p>
                <button
                  onClick={() => router.push(user ? "/dashboard" : "/login")}
                  className="mt-4 bg-[#4A148C] text-white px-6 py-2 rounded-3xl"
                >
                  {user ? "Go to Dashboard" : "Go to Login"}
                </button>
              </div>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                Verification Failed
              </h2>
              <p className="text-gray-600">
                The verification link is invalid or has expired.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 bg-[#4A148C] text-white px-6 py-2 rounded-3xl"
              >
                Return to Login
              </button>
            </>
          )}
        </>
      ) : mode === "resetPassword" ? (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
          <p className="text-sm text-gray-600">
            Please enter your new password
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="w-full border-2 p-8 rounded-3xl mt-4"
          >
            <div className="mb-6">
              <label className="text-sm font-medium" htmlFor="password">
                New Password
              </label>
              <div className="relative mt-2">
                <input
                  type={isPasswordHidden ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="border-2 rounded-lg p-3 w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                  onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                >
                  {isPasswordHidden ? (
                    <FaRegEyeSlash className="w-5" />
                  ) : (
                    <FaRegEye className="w-5" />
                  )}
                </button>
              </div>
              {formik.errors.password && (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="text-sm font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <input
                  type={isConfirmPasswordHidden ? "password" : "text"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  className="border-2 rounded-lg p-3 w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                  onClick={() =>
                    setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                  }
                >
                  {isConfirmPasswordHidden ? (
                    <FaRegEyeSlash className="w-5" />
                  ) : (
                    <FaRegEye className="w-5" />
                  )}
                </button>
              </div>
              {formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A148C] text-white rounded-3xl py-3 font-semibold text-base"
            >
              Reset Password
            </button>
          </form>
        </div>
      ) : (
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Unknown Action Type
        </h2>
      )}
    </div>
  );
}
