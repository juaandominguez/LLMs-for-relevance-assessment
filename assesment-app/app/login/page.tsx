"use client"
import LoginCard from "./components/login-card"
import { useState } from "react"

const Page = () => {
    const [register, setRegister] = useState(false)
    return (
        // <form
        //     action={async () => {
        //         "use server"
        //         await signIn("github")
        //     }}
        // >
        //     <button type="submit">Signin with GitHub</button>
        // </form>
        <>
            {
                register ? (<></>) : (
                    <section className="min-w-[100dvw] min-h-[100dvh] flex items-center justify-center">
                        <LoginCard setRegister={setRegister} />
                    </section >
                )}
        </>
    )
}

export default Page