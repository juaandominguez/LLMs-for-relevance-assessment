import LeftArrow from '@/app/icons/left-arrow'
import RightArrow from '@/app/icons/right-arrow'
import React from 'react'

interface HandleProps {
    right: boolean
    disabled?: boolean
}

const Handler: React.FC<HandleProps> = ({ right, disabled = false }) => {
    return (
        <button className={`flex items-center justify-center rounded-full size-20 shadow-md transition-colors duration-300 font-semibold text-lg ${!disabled && "hover:bg-gray-100"} ${disabled && "cursor-default"} bg-white`}>
            {right ? (
                <RightArrow className={`size-7 ${disabled && 'text-gray-300'}`} />
            ) :
                (
                    <LeftArrow className={`size-7 ${disabled && 'text-gray-300'}`} />
                )}
        </button>
    )
}

export default Handler