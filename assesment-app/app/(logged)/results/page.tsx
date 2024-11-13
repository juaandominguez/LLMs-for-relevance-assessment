import React from 'react'
import Component from './prueba'
import { getGroupedAssesments } from "@/db/queries"


const Page = async () => {
    const assessments = await getGroupedAssesments()

    const parsedAssessments = assessments.reduce((acc: { [key: number]: { golden: number; llm: number } }, { pairId, value, count }) => {
        if (!acc[pairId]) {
            acc[pairId] = { golden: 0, llm: 0 };
        }

        if (value === 0) {
            acc[pairId].golden += count;
        } else if (value > 0) {
            acc[pairId].llm += count;
        }

        return acc;
    }, {});

    const parsedAssessmentsArray = Object.entries(parsedAssessments).map(([pair, { golden, llm }]) => ({
        pair: `Pair ${pair}`,
        golden,
        llm,
    }));
    return (
        <article className='flex items-center justify-center flex-col space-y-4 w-full'>
            <h1 className='text-2xl font-semibold tracking-tighter'>Number of agreements</h1>
            <div className='flex border-2 rounded-md p-5 bg-white w-full'>
                <Component assessment={parsedAssessmentsArray} />
            </div>
        </article>
    )
}

export default Page