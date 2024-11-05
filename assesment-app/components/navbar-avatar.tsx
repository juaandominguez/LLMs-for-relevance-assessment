import { LogOut } from "lucide-react"
import { logout } from "@/utils/server-actions"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "next-auth"

interface NavbarAvatarProps {
    user: User
}

const NavbarAvatar: React.FC<NavbarAvatarProps> = ({
    user,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    {user.email ? (
                        <>
                            <AvatarImage src={user!.image!} alt="Default Profile Picture" />
                            <AvatarFallback>{user.email![0].toUpperCase()}</AvatarFallback>
                        </>
                    ) : (
                        <AvatarFallback>G</AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavbarAvatar