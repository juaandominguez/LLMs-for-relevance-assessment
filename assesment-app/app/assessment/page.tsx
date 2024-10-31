import React from 'react'
import MainInfo from './components/main-info'
import { GuidelinesPopover } from './components/guidelines-popover'

const Page = () => {
    return (
        <section className="flex flex-col items-center justify-center py-20">
            <GuidelinesPopover />
            <MainInfo />
        </section>
    )
}

export default Page