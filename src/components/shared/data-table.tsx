"use client";

import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found.",
  getRowKey,
  onRowClick,
  skeletonRows = 5,
}: {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  skeletonRows?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: skeletonRows }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key -- skeleton rows have no real identity
            <TableRow key={`skeleton-${i}`}>
              {columns.map((col) => (
                <TableCell key={col.header}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!isLoading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center text-muted-foreground py-8"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          data.map((row) => (
            <TableRow
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={
                onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined
              }
            >
              {columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
