/**
 * Root Page
 * Implements server-side redirect based on authentication status
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Check authentication status from cookies (server-side)
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");
  const isAuthenticated = !!authToken?.value;

  // Redirect based on authentication status
  if (isAuthenticated) {
    redirect("/users");
  } else {
    redirect("/login");
  }
}
