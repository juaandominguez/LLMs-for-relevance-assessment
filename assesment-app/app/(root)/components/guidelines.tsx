import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'


const PromptInfo = () => {
    return (
        <Card className="w-[80%] max-w-[800px]">
            <CardHeader>
                <CardTitle>Guidelines</CardTitle>
                <CardDescription>Instructions to assess.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='text-lg space-y-6'>
                    <p>
                        Given a query and a web page, you must select a score on an integer scale of 0 to 2 with the following meanings:
                    </p>
                    <p>
                        2 = highly relevant, very helpful for this query
                        <br />
                        1 = relevant, may be partly helpful but might contain other irrelevant content
                        <br />
                        0 = not relevant, should never be shown for this query
                    </p>
                    <p>
                        Assume that you are writing a report on the subject of the topic.
                        <br />
                        If you would use any of the information contained in the web page in such a report, mark it 1. If the web page is primarily about the topic, or contains vital information about the topic, mark it 2. Otherwise, mark it 0.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <div className='w-full flex flex-col md:flex-row justify-between items-center gap-y-2'>
                    <p className='text-sm opacity-70'>You can always re-read these guidelines in the left sidebar</p>
                    <Link href='/assessment'>
                        <Button size={'lg'}>Continue</Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PromptInfo