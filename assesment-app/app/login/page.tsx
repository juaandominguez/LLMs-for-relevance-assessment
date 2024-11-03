"use client"
import LoginCard from "./components/login-card"
import { useState } from "react"
import { loginAsGuest } from "@/utils/server-actions"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

const MainPage = () => {
    const { data: session } = useSession()
    const [register, setRegister] = useState(false)
    const onGuestLogin = async () => {
        try {
            await loginAsGuest()
        }
        catch (error) {
            if (error.message === 'NEXT_REDIRECT') {
                toast.success("Logged in as a Guest")
                return
            }
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            toast.error("Could not login as a Guest. Please try again.")
        }
    }
    if (session) {
        return <></>
    }
    return (
        <>
            {
                register ? (<></>) : (
                    <section className="min-w-[100dvw] min-h-[100dvh] flex flex-col items-center justify-center gap-y-4">
                        <LoginCard setRegister={setRegister} />
                        <button className="text-xl text-muted-foreground cursor-pointer transition-all duration-100 hover:border-b p-1 h-8"
                            onClick={onGuestLogin}>
                            Or login as a Guest
                        </button>
                    </section >
                )}
        </>
    )
}

export default MainPage