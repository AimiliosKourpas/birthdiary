'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FormWrapper from "@/components/ui/FormWrapper";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer); 
  }, [router]);

  return (
    <FormWrapper title="Logged Out" description="You have logged out... redirecting in a sec." showConfetti={false}>
      <div className="text-center text-lg font-medium mt-6">
        You have logged out... redirecting in a sec.
      </div>
    </FormWrapper>
  );
};

export default LogoutPage;
