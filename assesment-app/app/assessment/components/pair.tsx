"use client"
import React, { useState, useEffect } from 'react'
import MainInfo from './main-info'
import Relevances from './relevances'
import { Pair as PairT } from '@/types'

interface PairProps {
    pair: PairT
}

const Pair: React.FC<PairProps> = ({ pair }) => {
    const [relevance, setRelevance] = useState<number | null>(null)

    useEffect(() => {
        setRelevance(null)
    }, [pair])

    return (
        <>
            <MainInfo relevance={relevance} pair={pair} />
            <Relevances relevance={relevance} setRelevance={setRelevance} />
        </>
    )
}

export default Pair