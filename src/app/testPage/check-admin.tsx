"use client"

import { useEffect, useState } from "react"
import { auth} from "@/firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"

export function useIsAdmin() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const tokenResult = await user.getIdTokenResult()
                setIsAdmin(!!tokenResult.claims.admin) // Check for admin claim
            } else {
                setIsAdmin(false)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return { isAdmin, loading }
}

