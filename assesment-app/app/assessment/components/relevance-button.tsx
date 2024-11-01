import React from 'react'

interface RelevanceButtonProps {
    relevance: number
    backgroundColor?: string
    selected: boolean
    setSelected: (relevance: number) => void
}

const RelevanceButton: React.FC<RelevanceButtonProps> = ({ relevance, backgroundColor = "bg-green-100", selected, setSelected }) => {
    return (
        <button className={`border rounded-full size-20 hover:${backgroundColor} shadow-sm transition-colors duration-300 font-semibold text-lg bg-white ${selected && "border-black " + backgroundColor}`} onClick={() => setSelected(relevance)}>{relevance}</button>
    )
}

export default RelevanceButton