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

import { loginWithCredentials, loginWithGithub, loginWithGoogle } from "@/utils/server-actions"

import toast from "react-hot-toast"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email"
    }),
    password: z.string().min(7, 'Password must contain at least 7 letters'),
})

interface Props {
    setRegister: (val: boolean) => void
}

const LoginCard: React.FC<Props> = ({ setRegister }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingGithub, setIsLoadingGithub] = useState(false)
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onRegister = () => setRegister(true)

    const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await loginWithCredentials(email, password)
        }
        catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(error)
            }
            toast.error("Invalid credentials")
        }
        finally {
            setIsLoading(false)
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
        <Card className="sm:max-w-[425px] w-full">
            <CardContent>
                <CardHeader>
                    <CardTitle className="text-xl text-center">Login</CardTitle>
                    <CardDescription className="text-center">
                        Login to save your progress.
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
                    <p className="w-auto cursor-pointer text-sm" onClick={onRegister}>Register here</p>
                </CardFooter>
            </CardContent>
        </Card >
    )
}

export default LoginCard