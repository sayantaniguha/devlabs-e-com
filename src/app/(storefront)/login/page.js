import { Suspense } from "react";
import { LoginForm } from "@/components/storefront/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  // Suspense because LoginForm reads ?next= via useSearchParams, matching the
  // signup page's arrangement.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
