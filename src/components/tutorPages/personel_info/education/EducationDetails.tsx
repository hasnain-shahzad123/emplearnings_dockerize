"use client";

import { useEffect, useState } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { TutorEducationDataType } from "@/types";
import Spinner from "@/components/shared/spinner/Spinner";
import { FaChevronDown } from "react-icons/fa";
import addTutorEducationToDB from "@/firebase/tutor/dashboard/education_and_expertise/addEducationToDb";
import getTutorEducationDetailsFromDB from "@/firebase/tutor/dashboard/education_and_expertise/getTutorEducationDetailsFromDB";
import { useAlert } from "@/contexts/AlertContext";
const EducationDetails = ({ uid }: { uid: string }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<TutorEducationDataType>({
    highest_degree: "",
    field_of_study: "",
    institution_name: "",
    graduation_year: 0,
    is_verified: false,
  });

  const [error, setError] = useState<string>("");
  const [updateEducation, setUpdateEducation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState<boolean>(true);
  const [showSave, setShowSave] = useState<boolean>(false);
  useEffect(() => {
    const fetchTutorEducationDetails = async () => {
      const response = await getTutorEducationDetailsFromDB({ uid });
      if (response.type === "error") {
        console.error("Error while fetching tutor education details:", response.message);
        setIsSpinnerLoading(false);
        return;
      }
      setFormData(response.educationData as TutorEducationDataType);
      setIsSpinnerLoading(false);
    };
    fetchTutorEducationDetails();
  }, [uid]);

  const handleInputChange = (field: keyof TutorEducationDataType, value: string | number) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.highest_degree.trim()) {
      setError("Highest degree is required");
      return false;
    }
    if (!formData.field_of_study.trim()) {
      setError("Field of study is required");
      return false;
    }
    if (!formData.institution_name.trim()) {
      setError("Institution name is required");
      return false;
    }

    const yearNum = parseInt(formData.graduation_year.toString(), 10);
    const currentYear = new Date().getFullYear();

    if (!yearNum) {
      setError("Graduation year is required");
      return false;
    }
    if (yearNum < 1900 || yearNum > currentYear) {
      setError(`Graduation year must be between 1900 and ${currentYear}`);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    // if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await addTutorEducationToDB({
        uid,
        ...formData,
        graduation_year: parseInt(formData.graduation_year.toString(), 10),
      });
      if (response.type === "error") {
        setError(response.message);
      } else {
        //alert("Education details saved successfully");
        showAlert("Education details saved successfully", "SUCCESS");
        setError("");
        setUpdateEducation(false);
      }
    } catch (e) {
      console.error("Error during saving education details:", e);
      setError("An error occurred while saving education details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl  custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="md:text-xl font-semibold mb-7">Educational Details</h1>
      {isSpinnerLoading && <Spinner size="lg" />}
      <div className={`${isSpinnerLoading ? "hidden" : "block"} flex flex-col gap-5`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="relative w-full md:w-[48%]">
            <select
              className="border-[1px] rounded-lg text-base w-full border-gray-300   p-3 outline-empoweredFlag text-empoweredFlag bg-white appearance-none pr-12"
              value={formData?.highest_degree || ""}
              onChange={(e) =>
                handleInputChange("highest_degree", e.target.value)
              }
              onClick={() => setShowSave(true)}
            >
              <option value="" disabled>
                Select your degree
              </option>
              <option value="High School">High School</option>
              <option value="Associate's Degree">Associate's Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
            </select>

            {/* Custom Dropdown Icon */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
              <FaChevronDown className="w-4 h-4 text-empoweredFlag" />
            </div>
          </div>
          <InputField
            label="Field of Study (Major)*"
            value={formData?.field_of_study}
            onChange={(value) => handleInputChange("field_of_study", value)}
            placeholder="Computer Science"
            disabled={false}
            setShowSave={() => setShowSave(true)}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 my-10">
          <InputField
            label="Institution Name*"
            value={formData?.institution_name}
            onChange={(value) => handleInputChange("institution_name", value)}
            placeholder="University of London"
            // disabled={!updateEducation}
            disabled={false}
            setShowSave={() => setShowSave(true)}
          />
          <InputField
            label="Graduation Year*"
            value={formData?.graduation_year?.toString()}
            onChange={(value) => handleInputChange("graduation_year", value)}
            placeholder="2024"
            disabled={false}
            type="number"
            setShowSave={() => setShowSave(true)}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {showSave && 
        <div className="flex justify-end">
        <div>
        <CustomButton
            text="Cancel"
            className="bg-[#4A148C] text-white px-5 md:px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            onclickEvent={() => setShowSave(false)}
            disabled={false}
          />
        </div>
        <div>
        <CustomButton
            text="Save"
            className="bg-[#4A148C] text-white px-5 md:px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            onclickEvent={handleSave}
            disabled={false}
          />
        </div>
        </div>
        }
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  type?: string | "select";
  options?: string[];
  className?:string;
  setShowSave?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
  setShowSave
}) => 
  (
  <div className="flex-1 w-full relative">
    <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
      {label}
    </label>
    <input
      type={type}
      value={value?.toString() ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onClick={setShowSave}
      className="w-full p-3 border border-gray-300 text-[#4A148C]  rounded-md outline-none focus:ring-2 focus:ring-purple-800"
    />
  </div>
);

export default EducationDetails;

