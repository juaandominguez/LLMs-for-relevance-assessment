import React from 'react'
import Document from './document'
import Topic from './topic'
import { getTopicAndDocument } from '@/utils/get-data'

const MainInfo = () => {
    const { topic, docHtml } = getTopicAndDocument(377, 'FR940128-1-00135')
    return (
        <div className='flex flex-col gap-y-8 text-lg items-center justify-center mt-12'>
            <Topic topic={topic} />
            <Document docHtml={docHtml} />
        </div>
    )
}

export default MainInfo