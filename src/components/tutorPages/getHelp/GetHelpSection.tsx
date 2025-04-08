"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useAlert } from "@/contexts/AlertContext";
import addContactInfoToDB from "@/firebase/contact-us/addContactInfoToDB";
import BackBtn from "../personel_info/Commonlayout/BackBtn";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const GetHelpSection = () => {
  const { showAlert } = useAlert();

  const initialValues: FormValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    console.warn(values);
    const response = await addContactInfoToDB(values);
    if (response.type === "error") {
      showAlert("Error sending the help try it later", "ERROR");
    } else {
      showAlert("Your Message Sent Successfully", "SUCCESS");
    }
    resetForm();
    setSubmitting(false);
  };

  return (
    <div className="py-10">
      <div className="flex justify-start ml-5">
        <BackBtn />
      </div>
      <h1 className="text-center text-empoweredFlag font-semibold text-3xl sm:text-5xl mb-10">
        Help and Support
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col bg-white py-10 shadow-even-xl rounded-lg w-[80%] mx-auto items-center justify-center">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full md:w-[90%] ml-[15%] md:ml-[17%] mt-10 mx-auto relative">
                {/* Name Input */}
                <div className="w-full mx-auto relative mt-10">
                  <label className="absolute md:block hidden p-1 -top-3 left-2 text-xs bg-white transition-all duration-300">
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Email Input */}
                <div className="w-full mx-auto relative mt-10">
                  <label className="absolute md:block hidden p-1 -top-3 left-2 text-xs bg-white transition-all duration-300">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Subject Input */}
                <div className="w-full mx-auto relative mt-10">
                  <label className="absolute md:block hidden p-1 -top-3 left-2 text-xs bg-white transition-all duration-300">
                    Subject
                  </label>
                  <Field
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Message Textarea */}
                <div className="w-full mx-auto relative mt-10">
                  <label className="absolute md:block hidden p-1 -top-3 left-2 text-xs bg-white transition-all duration-300">
                    Message
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    rows={7}
                    placeholder="Message"
                    className="p-3 mx-auto border-empoweredFlag border-[1px] text-[#4A148C] transition-all duration-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 w-[70%]"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Send Button */}
                <div className="flex justify-center p-0 mt-10">
                  <CustomButton
                    text="Send Message"
                    className="bg-empoweredFlag md:text-base text-sm md:px-8 px-6 py-2 rounded-full md:py-2 text-white"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default GetHelpSection;
