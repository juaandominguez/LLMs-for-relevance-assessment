interface Props {
    className?: string
}

const LeftArrow: React.FC<Props> = ({ className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-arrow-big-left ${className}`}><path d="M18 15h-6v4l-7-7 7-7v4h6v6z" /></svg>
    )
}
export default LeftArrow