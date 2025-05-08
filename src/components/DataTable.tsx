// components/DataTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type ColumnDef<T> = {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  options?: UseQueryOptions<T[], unknown, T[], readonly unknown[]>;
};

export function DataTable<T extends Record<string, any>>({
  queryKey,
  queryFn,
  columns,
  options,
}: DataTableProps<T>) {
  const { data, isLoading, error } = useQuery<T[]>({
    queryKey,
    queryFn,
    ...options,
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading data.</div>;
  if (!data || data.length === 0) return <div>No data.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.accessor)}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: any, idx: number) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              <TableCell key={String(col.accessor)}>
                {col.cell ? col.cell(row) : String(row[col.accessor])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
