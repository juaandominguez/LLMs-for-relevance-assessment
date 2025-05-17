import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(80vh-4rem)]">
            <h1 className="text-3xl font-bold">Thank you for your assessments!</h1>
            <p className="mt-4 text-lg">Your feedback is valuable to us.</p>
            <p className="mt-2 text-lg">We appreciate your time and effort.</p>
            <p className='mt-2 text-lg'>You can always re-assess your answers in the <Link href="/results" className="text-green-600 hover:underline">assessment</Link> page.</p>
        </div>
    )
}

export default page