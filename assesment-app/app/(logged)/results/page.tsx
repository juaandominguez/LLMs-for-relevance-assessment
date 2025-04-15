import React from 'react'
import { getGroupedAssessments, getAllPairs } from "@/db/queries"
import DataDashboard from './data-dashboard'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getUserRole } from '@/db/queries'

const Page = async () => {
    const session = await auth()
    const isAdmin = await getUserRole(session?.user.id as string) === 'admin'
    if (!isAdmin) {
        redirect('/assessment')
    }
    const [assessments, pairs] = await Promise.all([getGroupedAssessments(), getAllPairs()]);

    const assessmentMap = new Map(pairs.map((pair) => [pair.id, {
        id: pair.id,
        originalRelevance: pair.originalRelevance > 0 ? 1 : 0,
    }]));

    const parsedAssessments = assessments.reduce((acc: { [key: number]: { golden: number; llm: number } }, { pairId, value, count }) => {
        if (!acc[pairId]) {
            acc[pairId] = { golden: 0, llm: 0 };
        }
        const binaryValue = value >= 1 ? 1 : 0;
        const originalRelevance = assessmentMap.get(pairId)?.originalRelevance;

        if (binaryValue === originalRelevance) {
            acc[pairId].golden += count;
        }
        else {
            acc[pairId].llm += count;
        }

        return acc;
    }, {});

    const parsedAssessmentsArray = Object.entries(parsedAssessments).map(([pair, { golden, llm }]) => ({
        pair,
        golden,
        llm,
    }));
    return (
        <DataDashboard data={parsedAssessmentsArray} />
    )
}

export default Page