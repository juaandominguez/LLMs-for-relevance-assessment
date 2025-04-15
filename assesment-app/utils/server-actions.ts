"use server";
import { signIn, signOut } from "@/auth";
import { createAssessment } from "@/db/queries";

export const loginWithCredentials = async (email: string, password: string) => {
  await signIn("credentials", {
    email,
    password,
    isLogin: true,
    isGuest: false,
  });
};

export const registerWithCredentials = async (
  email: string,
  password: string
) => {
  await signIn("credentials", {
    email,
    password,
    isLogin: false,
    isGuest: false,
  });
};

export const loginAsGuest = async () => {
  await signIn("credentials", {
    email: "",
    password: "",
    isLogin: false,
    isGuest: true,
  });
};

export const loginWithGithub = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const loginWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const logout = async () => {
  await signOut();
};

export const submitAssessment = async (
  userId: string,
  pairId: number,
  score: number
) => {
  await createAssessment(userId, pairId, score);
};
