"use client";
import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";

import { set, z } from "zod";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useFormik } from "formik";
import { ValidationSchema } from "./ValidationSchema";
import { useRouter, useSearchParams } from "next/navigation";
import { facebook_icon } from "@/assets/index";
import Link from "next/link";
import { createSubscriptionService } from "@/services/payment/createSubscriptionService";
import { auth } from "@/firebase/firebaseConfig";
import { Logo } from "@/assets/index";
import Spinner from "@/components/shared/spinner/Spinner";
import loginUserWithGoogleService from "@/services/auth/login_user/loginUserWithGoogleService";
import loginUserWithFacebookService from "@/services/auth/login_user/loginUserWithFacebookService";
import loginUserWithEmailAndPasswordService from "@/services/auth/login_user/loginUserWithEmailAndPasswordService";
import { sendPasswordResetEmail } from "firebase/auth";

const AuthImage = "/images/Hello.svg";

const LoginFormContent = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [loginLoader, setLoginLoader] = useState(false);
  const params = useSearchParams();
  const uid = auth.currentUser?.uid;
  const [resetEmail, setResetEmail] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  //redirects user to base url on successful login
  //if user came from work-with-us with the intent of subscribing
  //then redirects user to the checkout page to continue subscription flow
  const handleSuccessRedirect = () => {
    const planId = params.get("planId"); //from search params
    //user came from work with us page
    if (planId !== null) {
      if (auth.currentUser !== null && auth.currentUser.email !== null)
        createSubscriptionService({
          planId: planId,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        });
    }
    router.push(`/mentor-dashboard/${uid}`);
  };
  // Update the handleForgotPassword function
  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showAlert("Please enter your email address", "ERROR");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: `${window.location.origin}/login`, // Redirect URL after password reset
      });
      showAlert("Password reset email sent! Check your inbox.", "SUCCESS");
    } catch (error: any) {
      showAlert(error.message || "Failed to send reset email", "ERROR");
    }
  };
  // Google Login
  const handleLoginWithGoogle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const serviceResponse = await loginUserWithGoogleService("tutor");

    if (serviceResponse.type === "error") {
      //TODO: show custom alert
      // alert(serviceResponse.message);
      showAlert(serviceResponse.message, "ERROR");
      return;
    } else if (serviceResponse.type === "success") {
      handleSuccessRedirect();
    }
  };

  // Facebook Login
  const handleLoginWithFacebook = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const serviceResponse = await loginUserWithFacebookService({
      userType: "tutor",
    });
    if (serviceResponse.type === "error") {
      //TODO: show custom alert
      // alert(serviceResponse.message);
      showAlert(serviceResponse.message, "ERROR");
      return;
    } else if (serviceResponse.type === "success") {
      handleSuccessRedirect();
    }
  };

  // Custom validation function using Zod
  const validate = (values: { email: string; password: string }) => {
    try {
      ValidationSchema.parse(values);
    } catch (err) {
      const formErrors: Record<string, string> = {};
      if (err instanceof z.ZodError) {
        err.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
      }
      return formErrors;
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setLoginLoader(true); // Add loading state
      try {
        const { email, password } = values;
        const serviceResponse = await loginUserWithEmailAndPasswordService({
          email,
          password,
          userType: "tutor",
        });

        if (serviceResponse.type === "error") {
          showAlert(serviceResponse.message, "ERROR");
          // Don't reset form on error - let user correct the input
        } else if (serviceResponse.type === "success") {
          showAlert(serviceResponse.message, "SUCCESS");
          handleSuccessRedirect();
        }
      } catch (error: any) {
        showAlert("Login failed. Please try again.", "ERROR");
      } finally {
        setLoginLoader(false); // Reset loading state
      }
    },
  });

  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const handlePasswordShow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPasswordHidden(!isPasswordHidden);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex md:min-h-screen">
        {/* Left section: Form */}
        <div className="w-full md:w-1/2 flex mt-10 md:mt-0 flex-col justify-center items-center mb-5 md:mb-0 bg-white p-3">
          {/* Logo and Heading */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center">
              {/* <div className="rounded-full w-5 h-5 bg-[#4A148C] inline-block mr-4"></div> */}
              <Image
                src={Logo}
                alt="Logo Image"
                height={40}
                width={40}
                className="h-15 w-15"
              />
              <h1 className="text-lg font-bold inline-block">
                Empower<span className="text-[#4A148C]">Ed</span> Learnings
              </h1>
            </div>
            <p className="text-sm text-[#4A148C] pt-2">
              Empower Your Journey Learn, Teach, Transform.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-sm border-2 p-7 rounded-3xl"
          >
            <div className="flex flex-col mb-4">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                className="border-2 rounded-lg p-2 mt-1"
              />
            </div>

            <div className="flex flex-col mb-2">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordHidden ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="border-2 rounded-lg p-2 w-full mt-1"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
                  onClick={handlePasswordShow}
                >
                  {isPasswordHidden ? (
                    <FaRegEyeSlash className="inline w-6" />
                  ) : (
                    <FaRegEye className="inline w-6" />
                  )}
                  <span className="pl-2">
                    {isPasswordHidden ? "Hidden" : "Show"}
                  </span>
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center underline mb-4">
              <button
                onClick={async (e) => {
                  await handleForgotPassword(e);
                }}
                className="text-sm text-gray-500"
              >
                I forgot my password
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#4A148C] text-white rounded-3xl py-2 font-semibold"
            >
              Log in
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Social Logins */}
            <button
              className="w-full flex items-center justify-center border border-black rounded-3xl py-2 mb-2 mt-3"
              onClick={(e) => handleLoginWithGoogle(e)}
            >
              <svg
                width="22"
                height="29"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3"
              >
                <path
                  d="M22.501 12.7332C22.501 11.8699 22.4296 11.2399 22.2748 10.5865H12.2153V14.4832H18.12C18.001 15.4515 17.3582 16.9099 15.9296 17.8898L15.9096 18.0203L19.0902 20.435L19.3106 20.4565C21.3343 18.6249 22.501 15.9298 22.501 12.7332Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.214 23C15.1068 23 17.5353 22.0666 19.3092 20.4567L15.9282 17.8899C15.0235 18.5083 13.8092 18.9399 12.214 18.9399C9.38069 18.9399 6.97596 17.1083 6.11874 14.5766L5.99309 14.5871L2.68583 17.0954L2.64258 17.2132C4.40446 20.6433 8.0235 23 12.214 23Z"
                  fill="#34A853"
                />
                <path
                  d="M6.12046 14.5767C5.89428 13.9234 5.76337 13.2233 5.76337 12.5C5.76337 11.7767 5.89428 11.0767 6.10856 10.4234L6.10257 10.2842L2.75386 7.7356L2.64429 7.78667C1.91814 9.21002 1.50146 10.8084 1.50146 12.5C1.50146 14.1917 1.91814 15.79 2.64429 17.2133L6.12046 14.5767Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.2141 6.05997C14.2259 6.05997 15.583 6.91163 16.3569 7.62335L19.3807 4.73C17.5236 3.03834 15.1069 2 12.2141 2C8.02353 2 4.40447 4.35665 2.64258 7.78662L6.10686 10.4233C6.97598 7.89166 9.38073 6.05997 12.2141 6.05997Z"
                  fill="#EB4335"
                />
              </svg>{" "}
              <span className="ml-3"> Continue with Google</span>
            </button>

            <button
              className="w-full flex items-center justify-center border border-black rounded-3xl py-2 mt-3"
              onClick={(e) => handleLoginWithFacebook(e)}
            >
              <div>
                <Image
                  layout="intrinsic"
                  src={facebook_icon.src}
                  height={25}
                  width={29}
                  alt="face_book"
                  className="mr-3"
                />
              </div>
              Continue with Facebook
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4 text-sm text-[#4A148C]">
            Dont have an account?{" "}
            <Link
              href="/register"
              prefetch={true}
              className="text-white py-2 ml-5 px-6 rounded-3xl bg-black"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Right section: Image */}
        <div className="md:w-1/2  md:flex justify-center items-center hidden">
          <Image
            src={AuthImage}
            alt="Phone with Password"
            height={800}
            width={800}
            className="w-[500px] h-[500px]  object-cover"
            priority={true}
          />
        </div>
      </div>
      {loginLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};
export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
