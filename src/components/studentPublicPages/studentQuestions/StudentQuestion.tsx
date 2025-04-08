"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { group_svg, arrow_svg, Logo } from "@/assets/index";
import { desclaimer } from "@/assets/index";
import { useAlert } from "@/contexts/AlertContext";
import { useForm } from "@/contexts/studentFormContext";
import { saveStudentToMentorForm } from "@/services/studentToMentor/saveStudentFormService";
import { useRouter } from "next/navigation";
import Link from "next/link";

type StudentQuestionType = {
  question: string;
  pleaseSpecify: boolean;
  SelectMultiple: boolean;
  answers: string[];
};

interface StudentQuestionProp {
  student_questions: StudentQuestionType[];
  title: string | null;
}

const StudentQuestion = ({ student_questions, title }: StudentQuestionProp) => {
  const {showAlert} = useAlert();
  const router = useRouter();
  const { state, dispatch } = useForm();
  const [selections, setSelections] = useState<{ [key: number]: string[] }>(
    () => {
      return state.formData.step3 || {};
    }
  );
  const [otherInputs, setOtherInputs] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    const formattedResults = student_questions.reduce(
      (acc, question, index) => {
        const selections_with_other = [...(selections[index] || [])];
        if (question.pleaseSpecify && otherInputs[index]) {
          selections_with_other.push(`Other: ${otherInputs[index]}`);
        }
        acc[`question${index + 1}`] = selections_with_other;
        return acc;
      },
      {} as Record<string, string[]>
    );

    dispatch({ type: "SET_STEP3", payload: formattedResults });
  }, [selections, otherInputs, student_questions, dispatch]);

  const handleOtherInputChange = (value: string) => {
    setOtherInputs((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleCheckboxChange = (option: string) => {
    setSelections((prev) => {
      const currentSelections = prev[currentQuestionIndex] || [];
      let newSelections;

      if (
        currentQuestion?.SelectMultiple &&
        !currentSelections.includes("All of the above") &&
        option !== "All of the above"
      ) {
        // For multiple selection questions
        if (currentSelections.includes(option)) {
          //when option is already selected
          newSelections = currentSelections.filter((item) => item !== option);
        } else {
          //here new selection is added
          newSelections = [...currentSelections, option];
        }
      }
      else if(option === "All of the above"){
        //when all of the above is selected
        newSelections = currentQuestion.answers.filter((item) => true);
      }
       else {
        // For single selection questions
        newSelections = [option];
      }

      return {
        ...prev,
        [currentQuestionIndex]: newSelections,
      };
    });
  };

  const handleContinue = async () => {
    const currentSelections = selections[currentQuestionIndex] || [];
    const hasOtherInput =
      student_questions[currentQuestionIndex].pleaseSpecify &&
      otherInputs[currentQuestionIndex];

    if (currentSelections.length === 0 && !hasOtherInput) {
     
      showAlert("Please select at least one option before continuing.", "INFO");
      return;
    }

    if (currentQuestionIndex < student_questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        const studentToMentorFormData = {
          firstName: state.formData.step1.firstName,
          lastName: state.formData.step1.lastName,
          email: state.formData.step1.email,
          category: state.formData.step2.category,
          answers: state.formData.step3,
        };
        await saveStudentToMentorForm(studentToMentorFormData);
        showAlert("Form submitted successfully", "SUCCESS");
        dispatch({ type: "RESET" });
        router.push("/");
      } catch (e) {
        showAlert("Error submitting the form", "ERROR");
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isOptionSelected = (option: string) => {
    return (selections[currentQuestionIndex] || []).includes(option);
  };

  const currentQuestion = student_questions[currentQuestionIndex];

  return (
    <section className="flex flex-col h-screen bg-[#F9F9F9]">
      {/* Decorative Background Elements */}
      <div className="absolute hidden md:block bg-[#4A148C] h-[200px] w-[200px] rounded-2xl rotate-[13deg] top-[-90px] left-[-30px] z-10"></div>
      <div className="absolute hidden md:block bg-[#8B55CC] h-[200px] w-[200px] rounded-2xl rotate-[12deg] top-[-50px] left-[-80px] z-0"></div>

      {/* Header Section */}
      <Link
        href="/"
        prefetch={true}
        className="flex justify-center items-center gap-3 mt-8"
      >
        <Image src={Logo.src} alt="Logo" width={40} height={40} />
        <h1 className="text-lg md:text-xl font-bold">
          Empowered<span className="text-[#4A148C]">Ed</span> Learnings
        </h1>
      </Link>

      {/* Question Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 custom-scrollbar overflow-hidden">
        {currentQuestion ? (
          <>
            {title === "life_coaching" && currentQuestionIndex === 0 && (
              <div className="bg-[#EAEAF9] items-center flex gap-3 w-[70%] p-5 my-3 text-[14px] rounded-xl mx-auto border-[#4A148C] border-[2px]">
                <Image
                  src={desclaimer.src}
                  alt="desclaimer"
                  width={50}
                  height={50}
                  className="h-7 w-7 mx-auto"
                />
                <h1>
                  Life coaching is not therapy. It focuses on mentoring to
                  unlock potential by developing essential soft skills like
                  confidence, emotional intelligence, and time management.
                </h1>
              </div>
            )}
            <h2 className="text-xl md:text-2xl lg:text-3xl text-center font-semibold mb-6">
              {currentQuestion.question}
            </h2>
            <div className="overflow-y-auto h-[calc(100%-200px)] w-full max-w-xl custom-scrollbar">
              {currentQuestion.answers.map((option, idx) => (
                <label
                  key={`${currentQuestionIndex}-${idx}`}
                  id={`option-${currentQuestionIndex}-${idx}`}
                  className="flex gap-4 items-center cursor-pointer mb-4"
                >
                  <input
                    name={`option-${currentQuestionIndex}`}
                    type="checkbox"
                    className="h-5 w-5 accent-[#4A148C]"
                    checked={isOptionSelected(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  <span className="text-md md:text-lg">{option}</span>
                </label>
              ))}
            </div>

            {currentQuestion.pleaseSpecify && (
              <div className="mt-4 w-full max-w-xl">
                <label htmlFor="specifyOther" className="text-lg font-semibold">
                  Any other: (Please Specify)
                </label>
                <input
                  id="specifyOther"
                  value={otherInputs[currentQuestionIndex] || ""}
                  onChange={(e) => handleOtherInputChange(e.target.value)}
                  className="w-full text-md md:text-lg border-b-2 border-[#4A148C] pl-2 bg-transparent focus:outline-none mt-4"
                />
              </div>
            )}
          </>
        ) : (
          <h2 className="text-xl text-center font-semibold">
            No Questions Available
          </h2>
        )}
      </div>

      <div className="flex items-center justify-center gap-8 py-2 shadow-lg">
        {currentQuestionIndex > 0 && (
          <button
            onClick={handleBack}
            className="cursor-pointer"
            disabled={currentQuestionIndex === 0}
          >
            <Image
              src={arrow_svg.src}
              alt="Back"
              width={24}
              height={24}
              className="h-[50px] w-[50px] hover:scale-110 hover:opacity-80 transition-transform duration-200"
            />
          </button>
        )}

        <button
          onClick={handleContinue}
          className="bg-[#4A148C] text-white px-[55px] py-3 rounded-full border-2 border-transparent 
             hover:bg-white hover:text-black hover:border-black transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </section>
  );
};

export default StudentQuestion;
