"use client"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"

export function GuidelinesPopover() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50"></div>}
            <div className={`sticky top-[5dvh]`}>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Show Guidelines</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] sm:w-[550px] md:w-[650px]">
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
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}
