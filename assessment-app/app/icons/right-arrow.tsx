interface Props {
    className?: string
}

const RightArrow: React.FC<Props> = ({ className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-arrow-big-right ${className}`}><path d="M6 9h6V5l7 7-7 7v-4H6V9z" /></svg>
    )
}
export default RightArrow