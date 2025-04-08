import ScheduleHead from "@/components/tutorPages/personel_info/classSchedule/ScheduleHead";
import AddTimeSlot from "@/components/tutorPages/personel_info/classSchedule/AddTimeSlot";

interface MyPageProps {
  params: { uid: string }
}

const ClassSchedule = ({ params }: MyPageProps) => {
  return (
    <div className="flex flex-col max-w-7xl w-full gap-5">
      <ScheduleHead />
      <AddTimeSlot uid={params.uid} />
    </div>
  );
};

export default ClassSchedule;
