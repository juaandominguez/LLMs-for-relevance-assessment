import LeftArrow from '@/app/icons/left-arrow'
import RightArrow from '@/app/icons/right-arrow'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import pairs from '@/data/pairs.json'

interface HandleProps {
    right: boolean
    disabled?: boolean
    className?: string
}

const Handler: React.FC<HandleProps> = ({ right, disabled = false, className }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pair = searchParams.get('pair') || '1'
    const intPair = parseInt(pair!)
    const [nextPair, setNextPair] = React.useState<number>()

    useEffect(() => {
        if (pairs.length > intPair) {
            setNextPair(intPair + 1)
        }
    }, [intPair, router])

    if (!pair) return null

    const handleClick = () => {
        if (pairs.length === intPair) {
            router.push('/result')
        }
        else if (right) {
            router.push(`/assessment?pair=${nextPair}`)
        } else {
            router.push(`/assessment?pair=${intPair - 1}`)
        }
    }

    disabled = disabled || (!right && intPair === 1)

    return (
        <button className={`flex items-center justify-center rounded-full size-20 shadow-md transition-colors duration-300 font-semibold text-lg ${!disabled && "hover:bg-gray-100"} ${disabled && "cursor-default"} bg-white ${className}`} disabled={disabled} onClick={handleClick}>
            {right ?
                (
                    <RightArrow className={`size-7 ${disabled && 'text-gray-300'}`} />
                ) :
                (
                    <LeftArrow className={`size-7 ${disabled && 'text-gray-300'}`} />
                )}
        </button>
    )
}

export default Handler