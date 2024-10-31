import React from 'react'

interface DocumentProps {
    docHtml: string
}

const Document: React.FC<DocumentProps> = ({ docHtml }) => {
    return (
        <div className='w-[60%]'>
            <div dangerouslySetInnerHTML={{ __html: docHtml }} className='space-y-6' />
        </div>
    )
}

export default Document