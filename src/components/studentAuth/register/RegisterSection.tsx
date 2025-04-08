"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { student_Auth } from "@/assets/index";
import { useRouter } from "next/navigation";
import { facebook_icon } from "@/assets/index";
import { Logo } from "@/assets/index";
import { email_icon } from "@/assets/index";
import registerUserWithGoogleService from "@/services/auth/register_user/registerUserWithGoogleService";
import registerUserWithFacebookService from "@/services/auth/register_user/registerUserWithFacebookService";
import { auth } from "@/firebase/firebaseConfig";
import { useAlert } from "@/contexts/AlertContext";  // Add this import

const RegisterSection = () => {
  const router = useRouter();
  const { showAlert } = useAlert();  // Add this

  const handleRegisterWithGoogle = async () => {
    const response = await registerUserWithGoogleService("student");
    if (response.type === "success") {
      router.push("/student-dashboard");
      showAlert("Successfully registered with Google", "SUCCESS");
    } else {
      if (response.needsSignOut) {
        await auth.signOut();
        window.localStorage.removeItem('firebase:authUser:' + auth.config.apiKey + ':[DEFAULT]');
      }
      showAlert(response.message, "ERROR");
      if (response.existingUserType) {
        setTimeout(() => {
          router.push(`/${response.existingUserType}-login`);
        }, 3000);
      }
    }
  };

  const handleRegisterWithFacebook = async () => {
    const response = await registerUserWithFacebookService("student");
    if (response.type === "success") {
      router.push("/student-dashboard");
      showAlert("Successfully registered with Facebook", "SUCCESS");
    } else {
      showAlert(response.message, "ERROR");
      if (response.existingUserType) {
        setTimeout(() => {
          router.push(`/${response.existingUserType}-login`);
        }, 3000);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full md:w-1/2 flex flex-col mt-[50px]  justify-center items-center bg-white p-10">
        <div className="text-center mb-2">
          <div className="flex justify-center items-center">
            <Image
              src={Logo}
              alt="Logo Image"
              height={40}
              width={40}
              className="h-15 w-15"
            />
            <h1 className="text-lg  font-bold  inline">
              Empower<span className="text-[#4A148C]">Ed</span> Learnings
            </h1>
          </div>

          <h1 className="font-bold text-2xl mt-4">Create an account</h1>
          <p className="text-sm text-[#4A148C] pt-1">
            Empower Your Journey Learn, Teach, Transform.
          </p>
        </div>

        {/*Three Buttons */}
        <div className="w-full max-w-sm pt-2 p-5 mt-10 rounded-3xl">
          <button
            className="w-full flex items-center justify-center border border-black rounded-3xl py-2 mt-5"
            onClick={() => {
              router.push("/student-email-register");
            }}
          >
            <div>
              <Image
                src={email_icon.src}
                width={28}
                height={35}
                alt="email_icon"
              />
            </div>

            <span className="ml-2">Continue with Email</span>
          </button>

          <button
            className="w-full flex items-center justify-center border border-black rounded-3xl py-2 mb-2 mt-3"
            onClick={handleRegisterWithGoogle}
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
            onClick={handleRegisterWithFacebook}
          >
            <div>
              <Image
                src={facebook_icon.src}
                height={25}
                width={29}
                alt="face_book"
                className="mr-3"
              />
            </div>
            Continue with Facebook
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-[#4A148C]">
          Already have an account?{" "}
          <Link
            href="/student-login"
            className="text-white py-2 ml-5 px-6 rounded-3xl bg-black"
          >
            Log in
          </Link>
        </div>
      </div>

      <div className="md:w-1/2  md:flex justify-center items-center hidden absolute top-10 right-10">
        <Image
          src={student_Auth.src}
          alt="Girl with headphones"
          height={800}
          width={800}
          className="w-[500px] h-[500px]  object-cover"
          priority={true}
        />
      </div>
    </div>
  );
};
export default RegisterSection;
