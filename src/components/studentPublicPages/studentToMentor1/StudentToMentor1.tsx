"use client";
import Image from "next/image";
import Link from "next/link";
import { mentor_student } from "@/assets/index";
import { SvgStep1, SvgStep2, SvgStep3 } from "@/assets/index";
import { arrow_svg } from "@/assets/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@/contexts/studentFormContext";

function Student_to_Mentor() {
  const router = useRouter();
  const { state, dispatch } = useForm();
  const [formData, setFormData] = useState(state.formData.step1);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleFormSubmission(e: React.FormEvent) {
    e.preventDefault();
    const { firstName, lastName, email } = formData;
    const newErrors: string[] = [];

    if (!firstName.trim()) newErrors.push("First Name is required.");
    if (!lastName.trim()) newErrors.push("Last Name is required.");
    if (!email.trim()) {
      newErrors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.push("Invalid email format.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      dispatch({
        type: "SET_STEP1",
        payload: {
          firstName,
          lastName,
          email,
        },
      });

      setErrors([]);
      router.push("/student-to-mentor-2");
    } catch (e) {
      setErrors(["An error occurred. Please try again."]);
      console.error("Form submission error:", e);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side (Form Section) */}
        <div className="flex-1 p-8 bg-white">
          {/* Progress Indicator */}
          <div className="flex items-center mt-4 space-x-4">
            <div className="text-center flex flex-col items-center">
              <div className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                <Image
                  src={SvgStep1.src}
                  alt="Mentor session"
                  width={100}
                  height={100}
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm mt-1">Start Your Search</p>
            </div>
            <span className="text-black text-lg font-bold ">→</span>
            <div className="text-center flex flex-col items-center">
              <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                <Image
                  src={SvgStep2.src}
                  alt="Mentor session"
                  width={100}
                  height={100}
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm mt-1">Choose Your Mentor</p>
            </div>
            <span className="text-black text-lg font-bold">→</span>
            <div className="text-center flex flex-col items-center">
              <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
                <Image
                  src={SvgStep3.src}
                  alt="Mentor session"
                  width={100}
                  height={100}
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm mt-1">Book & Begin</p>
            </div>
          </div>

          {/* Form */}
          <h2 className="mt-8 text-2xl font-bold text-[#4A148C]">
            To get started, please provide your name and email address
          </h2>
          <form className="mt-6 space-y-4" onSubmit={handleFormSubmission}>
            <input
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              className="w-full px-4 py-2 outline-none border-b border-[#4A148C] rounded"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              className="w-full px-4 py-2 outline-none border-b border-[#4A148C] rounded"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full px-4 py-2 outline-none border-b border-[#4A148C] rounded"
              value={formData.email}
              onChange={handleInputChange}
            />

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
              >
                Find Your Perfect Mentor
              </button>
            </div>
          </form>

          {/* Back Button */}
          <Link
            href={"/"}
            className="mt-4 text-purple-500 hover:text-purple-700 flex items-center"
          >
            <span className="material-icons">
              <Image
                src={arrow_svg.src}
                alt="Mentor session"
                width={100}
                height={100}
                className="h-10 w-10"
              />
            </span>
          </Link>
        </div>

        {/* Right Side (Image Section) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Image
            src={mentor_student.src}
            alt="Mentor session"
            width={500}
            height={500}
            priority={true}
            className="object-cover h-full"
          />
        </div>
      </div>
    </div>
  );
}
export default Student_to_Mentor;
