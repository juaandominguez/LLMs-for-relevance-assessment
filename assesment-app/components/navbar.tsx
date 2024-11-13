import { User } from "next-auth"
import NavbarAvatar from "./navbar-avatar"
import { auth } from "@/auth"
import { Button } from "./ui/button"
import Link from "next/link"

const Navbar = async () => {
    const session = await auth()
    return (
        <nav className='flex w-full justify-between min-h-[5dvh] items-center px-[15dvw] md:px-[10dvw] pt-6'>
            <Link href={'/'} className="font-bold tracking-tighter">Relevance Assessment</Link>
            <ul className="flex space-x-4 justify-center items-center">
                <Link href={'/results'}>
                    <Button variant="outline">Results</Button>
                </Link>
                <NavbarAvatar user={session?.user as User} />
            </ul>
        </nav>
    )
}

export default Navbar