"use client"
import React from 'react'
// import { useTheme } from "next-themes";

const BackgroundTheme = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    // const { resolvedTheme } = useTheme();
    return (
        // <>
        //     {resolvedTheme === "dark" ? (
        //         <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
        //             {children}
        //         </div>
        //     ) : (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            {children}
        </div>
        //     )}
        // </>
    )
}

export default BackgroundTheme