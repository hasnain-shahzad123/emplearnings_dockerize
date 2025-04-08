"use client";
import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Logo } from "@/assets/index";
import Link from "next/link";
import registerUserWithEmailAndPasswordService from "@/services/auth/register_user/registerUserWithEmailAndPasswordService";
import { ValidationSchema } from "@/components/studentAuth/login/ValidationSchema";

const AuthImage = "/images/Hello.svg";

// Define types for form values
interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EmailRegisterForm: React.FC<{ userType: string }> = ({ userType }) => {
  const [policyChecked, setPolicyChecked] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState({
    password: true,
    confirmPassword: true,
  });
  const router = useRouter();

  const validate = (values: FormValues) => {
    try {
      ValidationSchema.parse(values);
    } catch (err) {
      const formErrors: Record<string, string> = {};
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          formErrors[error.path[0]] = error.message;
        });
      }
      return formErrors;
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      if (!policyChecked) {
        alert("Please accept the terms and conditions");
        return;
      }

      const serviceResponse = await registerUserWithEmailAndPasswordService({
        email: values.email,
        password: values.password,
        username: values.username,
        userType: userType,
      });

      if (serviceResponse.type === "error") {
        alert(serviceResponse.message);
        resetForm();
        return;
      } else if (serviceResponse.type === "success") {

        if (serviceResponse.redirectTo)
          router.push(serviceResponse.redirectTo);
      }
    },
  });

  const handlePasswordShow = (
    e: React.MouseEvent<HTMLButtonElement>,
    field: "password" | "confirmPassword"
  ) => {
    e.preventDefault();
    setIsPasswordHidden((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex min-h-screen">
        {/* Left section: Form */}
        <div className="w-full md:w-1/2 flex  md:mt-0 flex-col justify-center items-center bg-white p-3 pt-3">
          {/* Logo and Heading */}
          <div className="text-center mb-2">
            <div className="flex justify-center items-center">
              <Image
                src={Logo}
                alt="Logo Image"
                height={40}
                width={40}
                className="h-15 w-15"
              />
              <h1 className="text-lg font-bold inline">
                Empower<span className="text-[#4A148C]">Ed</span> Learnings
              </h1>
            </div>
            <h1 className="font-bold text-2xl mt-1">Create an account</h1>
            <p className="text-sm text-[#4A148C] pt-1">
              Empower Your Journey Learn, Teach, Transform.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-sm border-2 pt-2 p-5 rounded-3xl"
          >
            <div className="flex flex-col mb-3">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // Add this line
                className="border-2 rounded-lg p-2 mt-1"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
                </div>
              )}
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 rounded-lg p-2 mt-1"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 pt-1 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordHidden.password ? "password" : "text"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur} // Add this line
                  className="border-2 rounded-lg p-2 w-full mt-1"
                />
                <button
                  onClick={(e) => handlePasswordShow(e, "password")}
                  className="absolute right-2 transform -translate-y-4 text-sm text-gray-400"
                >
                  {isPasswordHidden.password ? (
                    <FaRegEyeSlash className="inline w-6 mb-1" />
                  ) : (
                    <FaRegEye className="inline w-6 mb-1" />
                  )}
                  <span className="pl-2">
                    {isPasswordHidden.password ? "hidden" : "Show"}
                  </span>
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 pt-1 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <label className="text-sm" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordHidden.confirmPassword ? "password" : "text"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur} // Add this line
                  className="border-2 rounded-lg p-2 w-full mt-1"
                />
                <button
                  className="absolute right-2 transform -translate-y-4 text-sm text-gray-400"
                  onClick={(e) => handlePasswordShow(e, "confirmPassword")}
                >
                  {isPasswordHidden.confirmPassword ? (
                    <FaRegEyeSlash className="inline w-6 mb-1" />
                  ) : (
                    <FaRegEye className="inline w-6 mb-1" />
                  )}
                  <span className="pl-2">
                    {isPasswordHidden.confirmPassword ? "hidden" : "Show"}
                  </span>
                </button>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-red-500 pt-1 text-sm">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
            </div>

            {/* Terms of Use */}
            <div className="text-center mb-3 no-underline text-sm">
              <input
                type="checkbox"
                onClick={() => setPolicyChecked(!policyChecked)}
                className="mr-4 cursor-pointer"
              />
              By creating an account, I agree to our{" "}
              <span className="underline">
                <Link href="">Terms of use</Link>
              </span>{" "}
              and{" "}
              <span className="underline">
                <Link href="#" prefetch={true}>
                  Privacy Policy
                </Link>
              </span>
            </div>
            <button
              className="w-full bg-[#4A148C] text-white rounded-3xl py-2 font-semibold"
              type="submit"
            >
              Register
            </button>
          </form>

          <div className="text-center mt-3 text-sm text-[#4A148C]">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={true}
              className="text-white py-2 ml-5 px-6 rounded-3xl bg-black"
            >
              Login
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
    </div>
  );
};

export default EmailRegisterForm;
