"use client"
import React, { useState } from 'react'
import MainInfo from './components/main-info'
import { GuidelinesPopover } from './components/guidelines-popover'
import Relevances from './components/relevances'

const Page = () => {
    const [relevance, setRelevance] = useState<number | null>(null)
    return (
        <section className="min-h-[100dvh] flex flex-col items-center justify-center pb-20 pt-10">
            <GuidelinesPopover />
            <MainInfo relevance={relevance} />
            <Relevances relevance={relevance} setRelevance={setRelevance} />
        </section>
    )
}

export default Page