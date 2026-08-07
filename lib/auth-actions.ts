"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();  // <== await here!

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message }; 
  }
      
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();  // <== await here!

  const full_name = formData.get("full_name") as string;
  const birthdate = formData.get("birthdate") as string;

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name,
        email: formData.get("email") as string,
        birthdate,
      },
    },
  };

  const { error, data: signUpData } = await supabase.auth.signUp(data);

  if (error || !signUpData.user) {
    redirect("/error");
  }

  // A DB trigger on auth.users already creates this row in production
  // (confirmed: it exists before this line runs). upsert() instead of
  // insert() avoids a redundant duplicate-key error there, while still
  // creating the row directly in any environment where that trigger
  // isn't set up (e.g. a fresh local Supabase project).
  await supabase.from("profiles").upsert({
    id: signUpData.user.id,
    full_name,
    email: data.email,
    birthdate,
  });

  revalidatePath("/", "layout");

  // signUp() only returns a session when email confirmation is not
  // required. When it is required, there's no session yet, so redirect
  // to the public landing page with a flag instead of "/" (which would
  // just silently bounce back here anyway) so the user learns they need
  // to confirm their email before they can log in.
  if (!signUpData.session) {
    redirect("/about?confirmEmail=1");
  }

  redirect("/");
}

export async function signout() {
  const supabase = await createClient();  // <== await here!
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();  // <== await here!
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}
