"use client"

import { useEffect, useState } from "react"
import { auth } from "@/firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"

export default function UserClaims() {
    const [claims, setClaims] = useState<Record<string, any> | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult(true)
                setClaims(idTokenResult.claims)
            } else {
                setClaims(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const refreshClaims = async () => {
        try {
            setLoading(true)
            const user = auth.currentUser
            if (user) {
                await user.getIdToken(true)
                const idTokenResult = await user.getIdTokenResult()
                setClaims(idTokenResult.claims)
            }
        } catch (error) {
            console.error("Error refreshing claims:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center p-4">Loading claims...</div>
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h2 className="text-xl font-bold">User Claims</h2>
                {claims ? (
                    <pre className="p-4 rounded-lg overflow-auto max-h-96">
                        {JSON.stringify(claims, null, 2)}
                    </pre>
                ) : (
                    <p>No user claims found. Please sign in.</p>
                )}
            </div>

            <button
                onClick={refreshClaims}
                disabled={!auth.currentUser}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Refresh Claims
            </button>
        </div>
    )
}

