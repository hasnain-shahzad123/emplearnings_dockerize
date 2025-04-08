"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StudentQuestion from "@/components/studentPublicPages/studentQuestions/StudentQuestion";
import {
  academic_tutoring_questions,
  life_coaching_questions,
  skill_development_questions,
} from "@/components/studentPublicPages/studentQuestions/questions";
import { StudentFormProvider } from "@/contexts/studentFormContext";

function StudentQuestionFallback() {
  return <>Loading questions...</>;
}

const StudentQuestionPage = () => {
  return (
    <div>
      <Suspense fallback={<StudentQuestionFallback />}>
        <StudentFormProvider>
          <StudentQuestionContent />
        </StudentFormProvider>
      </Suspense>
    </div>
  );
};

const StudentQuestionContent = () => {
  const searchParams = useSearchParams();
  const data = searchParams?.get("data") || "academic_tutoring"; // Default value

  let student_questions = academic_tutoring_questions;

  if (data === "life_coaching") {
    student_questions = life_coaching_questions;
  } else if (data === "skill_development") {
    student_questions = skill_development_questions;
  }

  return <StudentQuestion student_questions={student_questions} title={data} />;
};

export default StudentQuestionPage;
