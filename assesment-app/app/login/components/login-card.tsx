"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import {
    Form,
    FormControl, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import GitHubIcon from "@/app/icons/github-icon"
import GoogleIcon from "@/app/icons/google-icon"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { loginAsGuest, loginWithCredentials, loginWithGithub, loginWithGoogle, registerWithCredentials } from "@/utils/server-actions"

import toast from "react-hot-toast"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email"
    }),
    password: z.string().min(7, 'Password must contain at least 7 letters'),
})

const LoginCard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingGithub, setIsLoadingGithub] = useState(false)
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
    const [isRegister, setIsRegister] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onChange = () => {
        setIsRegister(!isRegister)
    }

    const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            if (isRegister) {
                await registerWithCredentials(email, password)
            }
            else {
                await loginWithCredentials(email, password)
            }
        }
        catch (error) {
            if ((error as Error).message === 'NEXT_REDIRECT') {
                toast.success(`${isRegister ? "Account registered" : "Logged In"} successfully`)
                return
            }
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }

            if (isRegister) {
                toast.error("Could not register. Please try again.")
            }
            else {
                toast.error("Invalid credentials.")
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    const onGuestLogin = async () => {
        setIsLoading(true)
        setIsLoadingGithub(true)
        setIsLoadingGoogle(true)
        try {
            await loginAsGuest()
        }
        catch (error) {
            if ((error as Error).message === 'NEXT_REDIRECT') {
                toast.success("Logged in as a Guest")
                return
            }
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            toast.error("Could not login as a Guest. Please try again.")
        }
        finally {
            setIsLoading(false)
            setIsLoadingGithub(false)
            setIsLoadingGoogle(false)
        }
    }

    const onSigninWithGithub = async () => {
        setIsLoadingGithub(true)
        try {
            await loginWithGithub()
        }
        catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            toast.error("Could not login with Github. Please try again.")
        }
        finally {
            setIsLoadingGithub(false)
        }
    }

    const onSigninWithGoogle = async () => {
        setIsLoadingGoogle(true)
        try {
            await loginWithGoogle()
        }
        catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            toast.error("Could not login with Google. Please try again.")
        }
        finally {
            setIsLoadingGoogle(false)
        }
    }

    return (
        <>
            <Card className="sm:max-w-[425px] w-full">
                <CardContent>
                    <CardHeader>
                        <CardTitle className="text-xl text-center">
                            {isRegister ? "Register" : "Login"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isRegister ? "Create an account to save your progress" : "Login to your account"
                            }
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isLoading}
                                                placeholder="Enter your email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={isLoading}
                                                placeholder="Enter your password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-[100%]" type="submit" disabled={isLoading}>Login</Button>
                        </form>
                    </Form>
                    <div className="flex justify-between items-center mt-4">
                        <Button className="w-[48%]" disabled={isLoadingGoogle} onClick={onSigninWithGoogle}><GoogleIcon /> Login with Google</Button>
                        <Button className="w-[48%]" disabled={isLoadingGithub} onClick={onSigninWithGithub}><GitHubIcon /> Login with Github</Button>
                    </div>
                    <CardFooter className="border-t flex justify-between pt-3 px-5 mt-4">
                        <p className="w-auto cursor-pointer text-muted-foreground text-sm">Forgot password?</p>
                        <p className="w-auto cursor-pointer text-sm" onClick={onChange}>{isRegister ? "Login" : "Register"} here</p>
                    </CardFooter>
                </CardContent>
            </Card >
            <button className="text-xl text-muted-foreground cursor-pointer transition-all duration-100 hover:border-b p-1 h-8"
                onClick={onGuestLogin}>
                Or login as a Guest
            </button>
        </>
    )
}

export default LoginCard