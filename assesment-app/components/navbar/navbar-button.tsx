'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import Link from 'next/link'

const NavbarButton = () => {
    const pathName = usePathname()
    return (
        <Link href={`${pathName === '/results' ? '/assessment' : '/results'}`}>
            <Button variant="outline">
                {pathName === '/results' ? 'Assessment' : 'Results'}
            </Button>
        </Link>
    )
}

export default NavbarButton