import { User } from "next-auth"
import NavbarAvatar from "./navbar-avatar"
import { auth } from "@/auth"

const Navbar = async () => {
    const session = await auth()
    return (
        <nav className='flex w-full justify-between min-h-[5dvh] items-center px-[15dvw] md:px-[10dvw]'>
            <div>LOGO</div>
            <NavbarAvatar user={session?.user as User} />
        </nav>
    )
}

export default Navbar