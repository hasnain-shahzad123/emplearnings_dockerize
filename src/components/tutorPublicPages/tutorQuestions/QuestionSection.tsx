"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { arrow_svg, Logo } from "@/assets/index";
import tutor_questions from "./questions";
import { submitDemoRequestForm } from "@/services/tutorDemo/submitDemoRequestFormService";
import Link from "next/link";
import { useAlert } from "@/contexts/AlertContext";
import { sendDemoAcknowledgementMail } from "@/services/tutorDemo/sendDemoAcknowledgementMailService";
const QuestionSection = ({ emailAddress }: { emailAddress: string }) => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [selections, setSelections] = useState<string[][]>([[]]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const currentQuestion = tutor_questions[currentQuestionIndex];
  const handleRadioChange = (option: string) => {
    setSelections((prev) => {
      const newSelections = [...prev];

      // Ensure array initialization for current question
      if (!newSelections[currentQuestionIndex]) {
        newSelections[currentQuestionIndex] = [];
      }

      // Multi-select behavior for question 2
      if (currentQuestionIndex === 2) {
        const currentSelections = [...newSelections[currentQuestionIndex]];

        // Handle "All of the above" option
        if (option === "All of the above") {
          if (currentSelections.includes("All of the above")) {
            // If already selected, deselect everything
            newSelections[currentQuestionIndex] = [];
          } else {
            // When "All of the above" is selected, select all options
            newSelections[currentQuestionIndex] = [
              ...currentQuestion.answers.slice(0, -1),
              "All of the above",
            ];
          }
        } else {
          // Toggle the selected option
          if (currentSelections.includes(option)) {
            // Remove if already selected
            const filtered = currentSelections.filter(
              (item) => item !== option
            );

            // Also remove "All of the above" if it was previously selected
            newSelections[currentQuestionIndex] = filtered.filter(
              (item) => item !== "All of the above"
            );
          } else {
            // Add if not selected
            const withoutAllOption = currentSelections.filter(
              (item) => item !== "All of the above"
            );
            withoutAllOption.push(option);

            // Check if all options except "All of the above" are now selected
            const allOptionsExceptLast = currentQuestion.answers.slice(0, -1);
            const allSelected = allOptionsExceptLast.every((opt) =>
              withoutAllOption.includes(opt)
            );

            if (allSelected) {
              // If all individual options are selected, also select "All of the above"
              newSelections[currentQuestionIndex] = [
                ...allOptionsExceptLast,
                "All of the above",
              ];
            } else {
              newSelections[currentQuestionIndex] = withoutAllOption;
            }
          }
        }
      } else {
        // Single selection for other questions
        newSelections[currentQuestionIndex] = [option];
      }

      return newSelections;
    });
  };

  async function submitRequest(formattedResults: any) {
    const response = await submitDemoRequestForm({
      email: emailAddress,
      answers: formattedResults,
    });
    if (response.type === "error") {
      // alert(response.message);
      showAlert("Error submitting the questions", "ERROR");
    } else {
      await sendDemoAcknowledgementMail(emailAddress);
    }
  }

  const handleContinue = (btnName: string) => {
    if (btnName === "Continue") {
      if (currentQuestionIndex < tutor_questions.length - 1) {
        // Check if there are any selections for the current question
        if (
          selections[currentQuestionIndex] &&
          selections[currentQuestionIndex].length > 0
        ) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          showAlert("Please select an option before moving forward", "INFO");
        }
      }
    } else if (btnName === "Submit") {
      // Check if there are any selections for the current question
      if (
        selections[currentQuestionIndex] &&
        selections[currentQuestionIndex].length > 0
      ) {
        submitRequest(selections);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        showAlert("Please select an option before moving forward", "INFO");
      }
    } else {
      router.push("/work-with-us");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isOptionSelected = (option: string) => {
    const currentSelections = selections[currentQuestionIndex] || [];

    // For question 2 (multi-select)
    if (currentQuestionIndex === 2) {
      return currentSelections.includes(option);
    }

    // For all other questions (single-select)
    return currentSelections.length === 1 && currentSelections[0] === option;
  };
  return (
    <section className="flex items-center justify-center">
      <div className="w-full mx-auto">
        <div className="font-poppins h-screen border-[1px] overflow-hidden bg-[#F9F9F9] rounded-3xl border-black relative">
          <div className="h-[200px] absolute overflow-hidden -top-[90px] left-[-30] hidden md:block rotate-[13deg] rounded-2xl z-10 w-[200px] bg-[#4A148C]"></div>
          <div className="h-[200px] absolute overflow-hidden -top-[50px] -left-[80px] hidden md:block rotate-[12deg] rounded-2xl w-[200px] bg-[#8B55CC] z-0"></div>

          <Link
            href="/"
            prefetch={true}
            className="flex cursor-pointer text-center mt-10 items-center gap-3 justify-center"
          >
            <Image
              src={Logo.src}
              alt="Logo"
              height={100}
              width={100}
              className="h-10 w-10"
            />
            <h1 className="text-lg sm:text-base md:text-lg font-bold inline-block">
              Empowered<span className="text-[#4A148C]">Ed</span> Learnings
            </h1>
          </Link>

          <div className="flex flex-col mt-10 px-5 md:px-0 py-10">
            {/* Logo Section */}

            {/* Question Section */}
            <div className="max-w-3xl mx-auto w-full mb-20 custom-scrollbar">
              <h2
                className={`text-xl  mx-auto max-w-xl font-semibold z-30 text-center`}
              >
                {currentQuestion?.question}
              </h2>
              {currentQuestionIndex === tutor_questions.length - 1 && (
                <div
                  className="absolute top-30 px-5 left-0 w-full h-[300px] flex flex-col justify-center items-center bg-center bg-no-repeat"
                  // style={{ backgroundImage: `url(${bg_thankyou.src})` }}
                >
                  <h3 className="text-[18px] text-center mt-4 ">
                    🎉 Woohoo! We’re thrilled to meet you on the call and help
                    you kickstart your successful journey with EmpowerEd
                    Learnings. Check your email for confirmation and call
                    details. See you soon!
                  </h3>
                </div>
              )}

              {/* Options Section */}
              <div className="mt-4 space-y-4 h-[200px]  overflow-y-auto">
                {currentQuestion?.answers?.map((option, idx) => (
                  <label
                    key={idx}
                    id={`option-${currentQuestionIndex}-${idx}`}
                    className="flex gap-4 items-center cursor-pointer max-w-xl mx-auto"
                  >
                    <div className="h-6 w-6">
                      <input
                        type={
                          currentQuestion.answers.includes("All of the above")
                            ? "checkbox"
                            : "radio"
                        }
                        name={`question-${currentQuestionIndex}`}
                        className="h-4 w-4 md:h-5 md:w-5 checked:bg-[#4A148C] accent-[#4A148C] cursor-pointer relative"
                        checked={isOptionSelected(option)}
                        onChange={() => handleRadioChange(option)}
                      />
                    </div>

                    <span className="text-md md:text-lg text-left">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Navigation Buttons */}
          <div className="fixed bottom-0 left-0 right-0 flex items-center gap-8 justify-center z-30 py-4 ">
            {currentQuestionIndex > 0 && (
              <button onClick={handleBack} className="cursor-pointer">
                <Image
                  src={arrow_svg.src}
                  alt="Back Arrow"
                  height={100}
                  width={100}
                  className="h-[50px] w-[50px] hover:scale-110 hover:opacity-80 transition-transform duration-200"
                />
              </button>
            )}

            <button
              onClick={() =>
                handleContinue(
                  currentQuestionIndex === tutor_questions.length - 2
                    ? "Submit"
                    : currentQuestionIndex === tutor_questions.length - 1
                    ? "Work with us"
                    : "Continue"
                )
              }
              className="bg-[#4A148C] px-[55px] py-3 rounded-full text-white border-2 border-transparent 
             hover:bg-white hover:text-black hover:border-black transition-all duration-300"
            >
              {currentQuestionIndex === tutor_questions.length - 1
                ? "Work with us"
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionSection;
