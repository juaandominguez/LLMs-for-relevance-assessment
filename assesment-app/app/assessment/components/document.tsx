"use client"
import React, { useState, useEffect } from 'react'
import Handler from './handler';

interface DocumentProps {
    docHtml: string,
    relevance: number | null
}

const Document: React.FC<DocumentProps> = ({ docHtml, relevance }) => {
    const [isWideScreen, setIsWideScreen] = useState<boolean>();

    useEffect(() => {
        setIsWideScreen(window.innerWidth >= 1024);
        const handleResize = () => setIsWideScreen(window.innerWidth >= 1024);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <article className='flex flex-col lg:flex-row justify-between items-center gap-x-24 mx-10'>
            {isWideScreen ? (
                <>
                    <Handler right={false} />
                    <div className='w-[80%] max-w-[800px]'>
                        <div dangerouslySetInnerHTML={{ __html: docHtml }} className='space-y-6' />
                    </div>
                    <Handler right={true} disabled={relevance === null} />
                </>
            ) : (
                <>
                    <div className='w-[80%] max-w-[800px]'>
                        <div dangerouslySetInnerHTML={{ __html: docHtml }} className='space-y-6' />
                    </div>
                    <div className='flex gap-x-4 mt-8'>
                        <Handler right={false} />
                        <Handler right={true} disabled={relevance === null} />
                    </div>
                </>

            )}
        </article>
    )
}

export default Document