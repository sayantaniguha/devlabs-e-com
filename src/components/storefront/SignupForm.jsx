"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";

const initialState = { error: null };

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2";

const LABEL =
  "font-dl-sans text-dl-spec text-dl-charcoal uppercase tracking-wide";
const INPUT =
  "px-4 py-2 border border-dl-rule bg-dl-chalk font-dl-sans text-dl-body text-dl-ink placeholder:text-dl-charcoal focus:border-dl-signal transition-colors";

export function SignupForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [state, formAction, pending] = useActionState(
    async (_prevState, formData) => (await signUp(formData)) ?? initialState,
    initialState,
  );

  return (
    <section className="max-w-md mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl">
      <h1 className="font-dl-sans text-dl-headline text-dl-ink border-b border-dl-rule pb-stack-md mb-stack-lg">
        Create an account
      </h1>
      <form action={formAction} className="flex flex-col gap-stack-md">
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Full name</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            required
            className={`${INPUT} ${FOCUS_RING}`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            defaultValue={emailParam}
            className={`${INPUT} ${FOCUS_RING}`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={`${INPUT} ${FOCUS_RING}`}
          />
          <span className="font-dl-sans text-dl-spec text-dl-charcoal">
            At least 8 characters.
          </span>
        </label>

        {state.error && (
          <p className="font-dl-sans text-dl-body text-dl-signal-ink">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={`bg-dl-ink text-dl-chalk py-3 font-dl-sans text-dl-body font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 ${FOCUS_RING}`}
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="font-dl-sans text-dl-body text-dl-charcoal mt-stack-md">
        Already have an account?{" "}
        <Link
          href="/login"
          className={`text-dl-ink underline underline-offset-4 hover:text-dl-signal-ink transition-colors ${FOCUS_RING}`}
        >
          Log in
        </Link>
      </p>
    </section>
  );
}
