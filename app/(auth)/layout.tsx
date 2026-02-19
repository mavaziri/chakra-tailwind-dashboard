/**
 * Login Page Layout
 * Simple layout for authentication pages
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Enterprise Dashboard",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-gray-50">{children}</div>;
}
