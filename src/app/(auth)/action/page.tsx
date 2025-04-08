import { Suspense } from "react"
import ActionContent from "@/components/tutorAuth/ActionContent"

export default function ActionPage() {
  return (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense fallback={<LoadingState />}>
        <ActionContent />
      </Suspense>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="text-center mb-8 w-full max-w-lg">
      <div className="flex items-center justify-center mb-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 rounded ml-2 animate-pulse"></div>
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 w-48 bg-gray-200 rounded mx-auto animate-pulse"></div>
    </div>
  )
}

