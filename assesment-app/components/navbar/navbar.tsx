import { User } from "next-auth"
import NavbarAvatar from "./navbar-avatar"
import { auth } from "@/auth"
import { ProgressInfo } from "./progress-info"
import NavbarButton from "./navbar-button"

const Navbar = async () => {
    const session = await auth()
    return (
        <nav className='flex w-full justify-between min-h-[5dvh] items-center px-[15dvw] md:px-[10dvw] py-6'>
            <ProgressInfo />
            <ul className="flex space-x-4 justify-center items-center">
                <NavbarButton />
                <NavbarAvatar user={session?.user as User} />
            </ul>
        </nav>
    )
}

export default Navbar