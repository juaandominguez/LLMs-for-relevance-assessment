import LeftArrow from '@/app/icons/left-arrow'
import RightArrow from '@/app/icons/right-arrow'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import pairs from '@/data/pairs.json'
import { useSession } from 'next-auth/react'
import { submitAssessment } from '@/utils/server-actions'
import toast from 'react-hot-toast'

interface HandleProps {
    right: boolean
    disabled?: boolean
    className?: string
    relevance: number | null
}

const Handler: React.FC<HandleProps> = ({ right, disabled = false, className, relevance }) => {
    const { data: session } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pair = searchParams.get('pair') || '1'
    const intPair = parseInt(pair!)
    const [nextPair, setNextPair] = React.useState<number>()

    const onClickRight = async () => {
        try {
            await submitAssessment(session!.user!.id!, intPair, relevance!)
            toast.success('Assessment submitted')
        }
        catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error(error)
            }
            toast.error('Could not submit assessment. Please try again.')
        }
    }

    useEffect(() => {
        if (pairs.length > intPair) {
            setNextPair(intPair + 1)
        }
    }, [intPair, router])

    if (!pair) return null

    const handleClick = async () => {
        if (right) {
            onClickRight()
            if (pairs.length === intPair) {
                router.push('/result')
            } else {
                router.push(`/assessment?pair=${nextPair}`)
            }
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