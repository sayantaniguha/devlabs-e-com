import { Suspense } from "react";
import { SignupForm } from "@/components/storefront/SignupForm";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
