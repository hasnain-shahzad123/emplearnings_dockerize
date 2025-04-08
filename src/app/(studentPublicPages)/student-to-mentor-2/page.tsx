import StudentToMentor2 from "@/components/studentPublicPages/studentToMentor2/StudentToMentor2";
import { StudentFormProvider } from "@/contexts/studentFormContext";

import React from "react";

const studentToMentor2 = () => {
  return (
    <div>
      <StudentFormProvider>
        <StudentToMentor2 />
      </StudentFormProvider>
    </div>
  );
};

export default studentToMentor2;
