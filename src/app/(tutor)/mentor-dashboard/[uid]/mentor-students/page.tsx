import SearchSection from "@/components/tutorPages/studentList/SearchSection";

const StudentList = ({ params }: { params: { uid: string } }) => {


 return (
    <>
      <SearchSection tutor_uid={params.uid} />
    </>
  );
};
export default StudentList;
