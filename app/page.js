import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect ke halaman login
  redirect("/login");

  return null;
}
