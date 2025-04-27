import React from 'react';

interface RelevanceButtonProps {
    relevance: number;
    selected: boolean;
    setSelected: (relevance: number) => void;
}

const RelevanceButton: React.FC<RelevanceButtonProps> = ({ relevance, selected, setSelected }) => {
    let hoverBgColor = 'hover:bg-gray-100'
    let bgColor = 'bg-white'

    if (relevance === 0) {
        bgColor = 'bg-red-100'
        hoverBgColor = 'hover:bg-red-100'
    }
    else if (relevance === 1) {
        bgColor = 'bg-yellow-100'
        hoverBgColor = 'hover:bg-yellow-100'
    }
    else {
        bgColor = 'bg-green-100'
        hoverBgColor = 'hover:bg-green-100'
    }

    const selectedBorderColor = selected ? "border-black" : "bg-white";
    return (
        <button
            className={`border rounded-full size-20 ${selectedBorderColor} ${hoverBgColor} ${selected && bgColor} shadow-sm transition-colors duration-300 font-semibold text-lg`}
            onClick={() => setSelected(relevance)}
        >
            {relevance}
        </button>
    );
};

export default RelevanceButton;
