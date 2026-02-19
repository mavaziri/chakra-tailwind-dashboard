/**
 * Dashboard Navigation Component
 * Client component for navigation with logout
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useAuth } from "@/features/auth/auth-context";

const navItems = [
  { name: "Users", href: "/users" },
  { name: "Products", href: "/products" },
  { name: "Games", href: "/games" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAuth();

  const handleLogout = () => {
    logout();

    router.push("/login");

    router.refresh();
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <Box className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Box className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <Box className="flex items-center gap-8">
            <Heading className="text-xl font-bold text-gray-900">Enterprise Dashboard</Heading>

            <Box className="flex gap-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </Box>
          </Box>

          {/* User Info and Logout */}
          <Box className="flex items-center gap-4">
            {session?.user && (
              <Box className="text-sm text-gray-700">
                <span className="font-medium">
                  {session.user.firstName} {session.user.lastName}
                </span>
              </Box>
            )}
            <Button
              onClick={handleLogout}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>
    </nav>
  );
}
