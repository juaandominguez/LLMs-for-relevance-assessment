'use server'
import { getUserRole } from "@/db/queries"

export default async function getRole(userId: string) {
    const role = await getUserRole(userId)
    return role
}