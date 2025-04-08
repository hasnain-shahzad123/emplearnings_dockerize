"use client";
import HeroSection from "@/components/studentPages/dashboard/HeroSection";
import { useStudent } from "@/contexts/StudentContext";
import { StudentDashboardDataType } from "@/types";
import { useEffect, useState } from "react";
import getStudentDocumentData from "@/firebase/student/dashboard/getStudentDocumentData";
import { auth } from "@/firebase/firebaseConfig";
import getStudentNotificationsFromDB from "@/firebase/student/dashboard/notifications/getStudentNotificationsFromDB";
import Spinner from "@/components/shared/spinner/Spinner";


const StudentDashboardClient = ({ uid }: { uid: string }) => {
    const { student } = useStudent();
    const [studentData, setStudentData] = useState<StudentDashboardDataType>();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Ensure token is fresh
                await auth.currentUser?.getIdToken(true);

                // Fetch student document data
                const docResponse = await getStudentDocumentData({ uid });
                
                // Fetch notifications
                const notificationsResponse = await getStudentNotificationsFromDB({ uid });

                if (docResponse.type === "success" && docResponse.data && 
                    notificationsResponse.type === "success" && notificationsResponse.notifications) {
                    setStudentData({
                        studentDocumentData: docResponse.data,
                        notifications: notificationsResponse.notifications,
                    });
                } else {
                    console.error("Error fetching student data", 
                        docResponse.type === "error" ? docResponse.message : notificationsResponse.message);
                }
            } catch (error) {
                console.error("Error in fetchStudentData:", error);
            }
        };

        if (auth.currentUser) {
            fetchStudentData();
        }
    }, [uid]);

    if (!studentData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <HeroSection uid={uid} studentData={studentData} />
        </>
    );
};

export default StudentDashboardClient;

