"use client"
import HeroSection from "@/components/tutorPages/dashboard/HeroSection"
import type { NotificationType, TutorDashboardDataType, TutorDocumentDataType } from "@/types"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { firestore } from "@/firebase/firebaseConfig"
import { useTutor } from "@/contexts/TutorContext"
const TutorDashboardClient = ({ uid }: { uid: string }) => {
    const [tutorData, setTutorData] = useState<TutorDashboardDataType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { tutor } = useTutor();
    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                setIsLoading(true)
                const notificationsRef = collection(firestore, "TUTORS", uid, "TUTOR_NOTIFICATIONS")

                const notificationsDoc = await getDocs(notificationsRef)
                const notificationsArray: NotificationType[] = []
                notificationsDoc.forEach((doc) => {
                    notificationsArray.push(doc.data() as NotificationType)
                })
                let dashBoardCompleteData: TutorDashboardDataType = {
                    tutorDocumentData: tutor as TutorDocumentDataType,
                    notifications: notificationsArray
                }
                setTutorData(dashBoardCompleteData)

            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
                console.error("Error fetching tutor data:", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (uid) {
            fetchTutorData()
        }
    }, [uid, tutor])

    return (
        <div>
            {<HeroSection uid={uid} tutorData={tutorData as TutorDashboardDataType} />}
        </div>
    )
}

export default TutorDashboardClient

