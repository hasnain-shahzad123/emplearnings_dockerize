"use client"

import SetClaimsButton from "./set-claims-button"
import UserClaims from "./userClaims"
import { getDoc, doc, getDocs, collection } from "firebase/firestore"
import { firestore } from "@/firebase/firebaseConfig"
import { useState } from "react"
import { DocumentData } from "firebase/firestore"

export default function Page() {
    const [data, setData] = useState<DocumentData>();
    const [notData, setNotData] = useState<DocumentData>();
    const getData = async () => {
        const docData = await getDoc(doc(firestore, "TUTORS", "nsOzlHLgayUhl2wnk3g4le6aVx92"))
        console.log(docData.data())
        setData(docData.data() as DocumentData)
    }

    const getNotifications = async () => {
        const docData = await getDocs(collection(firestore, "TUTORS", "nsOzlHLgayUhl2wnk3g4le6aVx92", "TUTOR_NOTIFICATIONS"))
        console.log(docData.docs.map(doc => doc.data()))
        setNotData(docData.docs.map(doc => doc.data()) as DocumentData)
    }
    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="space-y-6">
                <UserClaims />
                <div className="flex justify-center pt-4 border-t">
                    <SetClaimsButton />
                </div>
                <button onClick={getData}>Get Data</button>
                <button onClick={getNotifications}>Get Not Data</button>
                <div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
                <div>
                    <pre>{JSON.stringify(notData, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}

