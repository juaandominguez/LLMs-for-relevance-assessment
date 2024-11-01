import React from 'react'
import RelevanceButton from './relevance-button'

interface RelevancesProps {
    relevance: number | null
    setRelevance: (relevance: number | null) => void
}

const Relevances: React.FC<RelevancesProps> = ({ relevance: rel, setRelevance }) => {
    return (
        <span className='mt-12 flex flex-col gap-y-2 justify-center items-center'>
            <h3 className='text-xl font-semibold'>Relevance</h3>
            <div className='flex flex-row gap-x-4'>
                <RelevanceButton relevance={0} backgroundColor='bg-red-100' selected={rel == 0} setSelected={setRelevance} />
                <RelevanceButton relevance={1} backgroundColor='bg-yellow-100' selected={rel == 1} setSelected={setRelevance} />
                <RelevanceButton relevance={2} backgroundColor='bg-green-100' selected={rel == 2} setSelected={setRelevance} />
            </div>
        </span>
    )
}

export default Relevances