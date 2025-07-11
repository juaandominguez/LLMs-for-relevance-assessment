import Handler from './handler';

interface DocumentProps {
    doc: string,
    relevance: number | null
}

const Document: React.FC<DocumentProps> = ({ doc, relevance }) => {
    return (
        <article className='lg:flex lg:flex-row justify-between items-center lg:gap-x-24 mx-10 grid grid-cols-2 grid-rows-[auto,1fr] gap-y-4 place-items-center'>

            <div className='w-[80%] max-w-[800px] lg:order-2 col-span-2'>
                <p>
                    {doc}
                </p>
            </div>
            <Handler right={false} className='lg:order-1' relevance={relevance} />
            <Handler right={true} disabled={relevance === null} className='lg:order-3' relevance={relevance} />
        </article >
    )
}

export default Document