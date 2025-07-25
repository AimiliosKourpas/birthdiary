"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";
import FormWrapper from "@/components/ui/FormWrapper";
import CustomDatePicker from "@/components/ui/DatePicker";

export function SignUpForm() {
  const [birthdate, setBirthdate] = useState<Date | null>(null);

  return (
    <FormWrapper
      title="Sign Up"
      description="Enter your information to create an account"
      showConfetti
    >
      <Card className="shadow-none border-none bg-transparent p-0">
        <CardContent>
          <form action="">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  name="full_name"
                  id="full_name"
                  placeholder="Max Robinson"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <CustomDatePicker
                  name="birthdate"
                  selectedDate={birthdate}
                  onChange={setBirthdate}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  required
                />
              </div>

              <Button formAction={signup} type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </FormWrapper>
  );
}
