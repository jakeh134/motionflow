import { MobileUpload } from "@/components/mobile-upload"

export default function MobileUploadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      <header className="py-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="font-bold text-xl">MotionFlow</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <MobileUpload />
        </div>
      </main>
    </div>
  )
}

