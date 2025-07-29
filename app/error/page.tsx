import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-semibold mb-4">Oops! Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        We couldn&apos;t verify your login. The link may have expired or is invalid.
      </p>
      <Link href="/login">
        <Button variant="outline">Back to Login</Button>
      </Link>
    </div>
  );
}
