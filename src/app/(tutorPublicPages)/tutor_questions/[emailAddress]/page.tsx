import QuestionSection from "@/components/tutorPublicPages/tutorQuestions/QuestionSection";

const TutorQuestionsPage = ({
  params,
}: {
  params: { emailAddress: string };
}) => {
  const decodedEmail = decodeURIComponent(params.emailAddress);
  return (
    <>
      <QuestionSection emailAddress={decodedEmail} />
    </>
  );
};
export default TutorQuestionsPage;
