"use client"

import { useState } from "react"
import { auth } from "@/firebase/firebaseConfig"

export default function SetClaimsButton() {
    const [loading, setLoading] = useState(false)

    const setClaims = async () => {
        try {
            setLoading(true)
            const user = auth.currentUser

            if (!user) {
                alert("No user logged in")
                return
            }

            const response = await fetch("/api/set-claims", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid: user.uid }),
            })

            if (!response.ok) throw new Error("Failed to set claims")

            // Force token refresh
            await auth.currentUser?.getIdToken(true)

            // Get the new token result to display updated claims
            const idTokenResult = await auth.currentUser?.getIdTokenResult()
            console.log("New claims:", idTokenResult?.claims)

            alert("Claims updated successfully! You should now see the new claims.")

            // Optional: Reload the page to refresh all components
            window.location.reload()
        } catch (error) {
            console.error("Error:", error)
            alert("Error setting claims: " + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={setClaims} disabled={loading || !auth.currentUser}>
            {loading ? "Setting Claims..." : "Set Custom Claims"}
        </button>
    )
}

