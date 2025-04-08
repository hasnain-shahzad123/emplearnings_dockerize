import ApprovedCategories from "@/components/tutorPages/category/ApprovedCategories"
import PendingCategories from "@/components/tutorPages/category/PendingCategories"
import CategoryHead from "@/components/tutorPages/personel_info/my-category/CategoryHead"
import PreviousCategories from "@/components/tutorPages/personel_info/my-category/PreviousCategories"

interface MyPageProps {
  params: { uid: string }
}

const MyCategory = ({ params }: MyPageProps) => {
  const { uid } = params

  return (
    <div className="flex flex-col gap-5 w-full">
      <CategoryHead />
      <PreviousCategories tutor_uid={uid}/>
    </div>
  )
}

export default MyCategory

