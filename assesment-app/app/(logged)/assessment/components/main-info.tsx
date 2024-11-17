import React from 'react'
import Document from './document'
import Topic from './topic'
import { getTopicAndDocument } from '@/utils/get-data'

interface MainInfoProps {
    relevance: number | null
    pair: number
}

const MainInfo: React.FC<MainInfoProps> = ({ relevance, pair }) => {
    const { topic, doc } = getTopicAndDocument(pair)
    return (
        <div className='flex flex-col gap-y-8 text-lg items-center justify-center mt-12'>
            <Topic topic={topic} />
            <Document doc={doc} relevance={relevance} />
        </div>
    )
}

export default MainInfo