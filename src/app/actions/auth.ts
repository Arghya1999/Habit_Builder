'use server';

import { signIn } from "@/auth";

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithGithub() {
    await signIn("github", { redirectTo: "/dashboard" });
}
