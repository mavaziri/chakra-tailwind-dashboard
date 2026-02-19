/**
 * Users List Component
 * Client component for displaying users with search and pagination
 */

"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Input, Table, Spinner } from "@chakra-ui/react";
import { useUsers, useUserSearch } from "./hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { User } from "@/domain/user/user.model";

export function UsersListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const debouncedSearch = useDebounce(search, 500);

  const skip = (page - 1) * limit;

  // Use search query if present, otherwise fetch all users
  const shouldSearch = debouncedSearch.trim().length > 0;

  const usersQuery = useUsers({
    limit,
    skip,
  });

  const searchQueryResult = useUserSearch(debouncedSearch, limit, skip);

  const query = shouldSearch ? searchQueryResult : usersQuery;
  const { data, isLoading, error } = query;

  // Calculate pagination values
  const totalPages = Math.ceil((data?.total ?? 0) / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Heading className="text-2xl font-bold text-gray-900">Users</Heading>
      </Box>

      {/* Search */}
      <Box>
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-blue-600" />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Failed to load users"}
          </p>
        </Box>
      )}

      {/* Users Table */}
      {data && !isLoading && (
        <>
          <Box className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table.Root className="min-w-full divide-y divide-gray-200">
              <Table.Header>
                <Table.Row className="bg-gray-50">
                  <Table.ColumnHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </Table.ColumnHeader>
                  <Table.ColumnHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </Table.ColumnHeader>
                  <Table.ColumnHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Company
                  </Table.ColumnHeader>
                  <Table.ColumnHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body className="divide-y divide-gray-200 bg-white">
                {data.items.map((user: User, idx: number) => (
                  <Table.Row
                    key={user.id}
                    className={`hover:bg-gray-50${idx === data.items.length - 1 ? " border-0" : ""}`}
                  >
                    <Table.Cell className="whitespace-nowrap px-6 py-4">
                      <Box className="flex items-center">
                        <Box className="h-10 w-10 shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        </Box>
                        <Box className="ml-4">
                          <Box className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </Box>
                          <Box className="text-sm text-gray-500">@{user.username}</Box>
                        </Box>
                      </Box>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.company}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        {user.role}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {/* Pagination */}
          <Box className="flex items-center justify-between">
            <Box className="text-sm text-gray-700">
              Showing {skip + 1} to {Math.min(skip + limit, data.total)} of {data.total} results
            </Box>
            <Box className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={!hasPreviousPage}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
