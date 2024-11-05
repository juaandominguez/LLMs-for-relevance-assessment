"use client"
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
import toast from "react-hot-toast"

interface NavbarAvatarProps {
    user: User
}

const NavbarAvatar: React.FC<NavbarAvatarProps> = ({
    user,
}) => {

    const onLogout = async () => {
        await logout()
        toast.success('Logged out successfully')
    }

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
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavbarAvatar