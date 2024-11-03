import React from 'react'
import { GuidelinesPopover } from './components/guidelines-popover'
import pairs from '@/data/pairs.json'
import { redirect } from 'next/navigation'
import Pair from './components/pair'

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const pairParam = (await searchParams).pair

    const pairId = pairParam ? parseInt(pairParam! as string) : 1
    const selectedPair = pairs.find((pair) => pair.id === pairId) || null

    if (!selectedPair) {
        redirect('/assessment?pair=1')
    }

    return (
        <section className="min-h-[100dvh] flex flex-col items-center justify-center pb-20 pt-10">
            <GuidelinesPopover />
            <Pair pair={selectedPair!} />
        </section>
    )
}

export default Page
