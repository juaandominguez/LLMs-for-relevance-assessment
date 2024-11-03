import React from 'react'
import Document from './document'
import Topic from './topic'
import { getTopicAndDocument } from '@/utils/get-data'
import { Pair } from '@/types'

interface MainInfoProps {
    relevance: number | null
    pair: Pair
}

const MainInfo: React.FC<MainInfoProps> = ({ relevance, pair }) => {
    const { topic, docHtml } = getTopicAndDocument(pair.topicId, pair.documentId)
    return (
        <div className='flex flex-col gap-y-8 text-lg items-center justify-center mt-12'>
            <Topic topic={topic} />
            <Document docHtml={docHtml} relevance={relevance} />
        </div>
    )
}

export default MainInfo