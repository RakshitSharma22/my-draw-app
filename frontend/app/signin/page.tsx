// app/signin/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./SignInForm";


export default async function SignInPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  

  if (token) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
