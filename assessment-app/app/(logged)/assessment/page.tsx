import React from 'react'
import { GuidelinesPopover } from './components/guidelines-popover'
import Pair from './components/pair'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getLastAssessmentFromUser } from '@/db/queries'

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const session = await auth()
    const lastAssessment = await getLastAssessmentFromUser(session!.user.id)

    const pairParam = (await searchParams).pair

    const pairId = parseInt(pairParam! as string)

    if (isNaN(pairId) || pairId < 1) {
        if (lastAssessment === 0) {
            redirect('/assessment?pair=1')
        }
        else {
            redirect(`/assessment?pair=${lastAssessment}`)
        }
    }

    return (
        <>
            <GuidelinesPopover />
            <Pair pair={pairId!} />
        </>
    )
}

export default Page
