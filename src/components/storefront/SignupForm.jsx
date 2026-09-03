"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";

const initialState = { error: null };

export function SignupForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [state, formAction, pending] = useActionState(
    async (_prevState, formData) => (await signUp(formData)) ?? initialState,
    initialState,
  );

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-headline-lg text-headline-lg text-on-background dark:text-inverse-on-surface mb-stack-lg">
        Create an account
      </h1>
      <form action={formAction} className="flex flex-col gap-stack-md">
        <label className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
            Full name
          </span>
          <input
            type="text"
            name="fullName"
            required
            className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface dark:bg-surface-container-low text-on-surface dark:text-inverse-on-surface focus:outline-none focus:border-secondary"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            defaultValue={emailParam}
            className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface dark:bg-surface-container-low text-on-surface dark:text-inverse-on-surface focus:outline-none focus:border-secondary"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-caps text-label-caps text-on-surface-variant dark:text-on-primary-container uppercase">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="px-4 py-2 border border-outline-variant dark:border-outline rounded bg-surface dark:bg-surface-container-low text-on-surface dark:text-inverse-on-surface focus:outline-none focus:border-secondary"
          />
        </label>

        {state.error && (
          <p className="text-error text-body-sm font-body-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-secondary text-on-primary py-3 rounded font-semibold hover:bg-secondary-container transition-colors disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-on-primary-container mt-stack-md">
        Already have an account?{" "}
        <Link href="/login" className="text-secondary hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}
