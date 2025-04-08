"use client";
import { useState } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { set } from "zod";
import {useAlert} from "@/contexts/AlertContext"
import addContactInfoToDB from "@/firebase/contact-us/addContactInfoToDB";

const Form = () => {
  const {showAlert} = useAlert();
  // Track focus states for each field
  const [focusStates, setFocusStates] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle focus and blur for each input field
  const handleFocus = (field: string) => {
    setFocusStates((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusStates((prev) => ({ ...prev, [field]: false }));
  };

  // Handle input changes and update form data
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  };

  // Handle form submission
  const handleSubmit = async () => {
    // e.preventDefault();
    console.warn(formData);
    // Add your logic to send the form data to the server

    const response = await addContactInfoToDB(formData);
    if (response.type === "error") {
      showAlert(response.message, "ERROR");
    } else {
      showAlert(response.message, "SUCCESS");
    }
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="bg-[#F1E5FF] py-10">
      <h1 className="text-center text-empoweredFlag font-semibold text-3xl  sm:text-5xl mb-10">
        Contact Us
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col bg-white py-10 shadow-even-xl rounded-lg w-[80%] mx-auto items-center justify-center">
          {/* Name Input */}
          <div className="w-full md:w-[90%] ml-[15%] md:ml-[17%] mt-10 mx-auto relative">
            <label
              className={`absolute p-1 left-2 text-xs bg-white transition-all duration-300 
                ${focusStates.name ? "-top-3 opacity-100" : "top-3 opacity-0"}`}
            >
              Name
            </label>
            <input
              type="text"
              required
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={!focusStates.name ? "Name" : ""}
              className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
            />
          </div>

          {/* Email Input */}
          <div className="w-full md:w-[90%] ml-[15%] md:ml-[17%] mx-auto relative mt-10">
            <label
              className={`absolute p-1 left-2 text-xs bg-white transition-all duration-300 
                ${focusStates.email ? "-top-3 opacity-100" : "top-3 opacity-0"
                }`}
            >
              Email
            </label>
            <input
              type="email"
              required
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={!focusStates.email ? "Email" : ""}
              className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
            />
          </div>

          {/* Subject Input */}
          <div className="w-full md:w-[90%] ml-[15%] md:ml-[17%] mx-auto relative mt-10">
            <label
              className={`absolute p-1 left-2 text-xs bg-white transition-all duration-300 
                ${focusStates.subject ? "-top-3 opacity-100" : "top-3 opacity-0"
                }`}
            >
              Subject
            </label>
            <input
              type="text"
              required
              onFocus={() => handleFocus("subject")}
              onBlur={() => handleBlur("subject")}
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder={!focusStates.subject ? "Subject" : ""}
              className="p-3 mx-auto border-[1px] border-empoweredFlag text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
            />
          </div>

          {/* Message Textarea */}
          <div className="w-full md:w-[90%] ml-[15%] md:ml-[17%] mx-auto relative mt-10">
            <label
              className={`absolute p-1 left-2 text-xs bg-white transition-all duration-300 
                ${focusStates.message ? "-top-3 opacity-100" : "top-3 opacity-0"
                }`}
            >
              Message
            </label>
            <textarea
              rows={7}
              required
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder={!focusStates.message ? "Message" : ""}
              className="p-3 mx-auto border-[1px] border-empoweredFlag text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end p-0  md:ml-[45%]">
            <CustomButton
              text="Send Message"
              className="mt-10 bg-empoweredFlag md:text-base text-sm md:px-8 px-6 py-2 rounded-full md:py-2 text-white"
              onclickEvent={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
