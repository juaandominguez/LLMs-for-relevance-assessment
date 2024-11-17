"use client"
import React, { useState, useEffect } from 'react'
import MainInfo from './main-info'
import Relevances from './relevances'
import { SessionProvider } from "next-auth/react";

interface PairProps {
    pair: number
}

const Pair: React.FC<PairProps> = ({ pair }) => {
    const [relevance, setRelevance] = useState<number | null>(null)

    useEffect(() => {
        setRelevance(null)
    }, [pair])

    return (
        <SessionProvider>
            <MainInfo relevance={relevance} pair={pair} />
            <Relevances relevance={relevance} setRelevance={setRelevance} />
        </SessionProvider>
    )
}

export default Pair