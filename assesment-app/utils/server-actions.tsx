"use server"
import { signIn } from "@/auth"
export const loginWithCredentials = async (email: string, password: string) => {
    await signIn("credentials", { email, password, isLogin: true }, { redirectTo: "/" })
}

export const registerWithCredentials = async (email: string, password: string) => {
    await signIn("credentials", { email, password, isLogin: false }, { redirectTo: "/" })
}

export const loginWithGithub = async () => {
    await signIn("github", { redirectTo: "/" })
}

export const loginWithGoogle = async () => {
    await signIn("google", { redirectTo: "/" })
}

export const logout = async () => {
    await signIn("signout")
}
