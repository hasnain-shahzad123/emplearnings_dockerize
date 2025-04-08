
import fetchAllTutorsFromDB from '@/firebase/firebase_admin/tutor/fetchAllTutorsFromDB'
import TutorDashboardClient from './TutorDashboardClient'
export const revalidate = 518400;
export async function generateStaticParams() {
  // Fetch your tutor IDs from your data source
  const response = await fetchAllTutorsFromDB() 
  
  const TutorsData = response.data;
  return TutorsData.map((tutorId) => ({
    uid: tutorId,
  }))
}

// Your server component
export default async function TutorDashboard({ params }: { params: { uid: string } }) {
  const { uid } = await params
  return <TutorDashboardClient uid={uid} />
}