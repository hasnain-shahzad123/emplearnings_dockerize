import Student_to_Mentor from "@/components/studentPublicPages/studentToMentor1/StudentToMentor1";
import { StudentFormProvider } from "@/contexts/studentFormContext";
const page = () => {
  return (
    <>
      <StudentFormProvider>
        <Student_to_Mentor />
      </StudentFormProvider>
    </>
  );
};
export default page;
