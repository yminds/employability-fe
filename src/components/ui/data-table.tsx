import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface DataTableProps<TData> {
  searchPlaceholder: string;
  rows: TData[];
  columns: ColumnDef<TData>[];
  onRowClick: (rowData: TData) => void;
  pageSize?: number;
  isUsersPage?: boolean;
}

export function DataTable<TData>({
  rows,
  columns,
  searchPlaceholder,
  onRowClick,
  pageSize = 10,
  isUsersPage = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 1) Build the table instance
  const table = useReactTable<TData>({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // 2) Collect unique goals from `rows` -> used for the dropdown
  const uniqueGoals = React.useMemo(() => {
    const goalNames = new Set<string>();
    // We'll assume each row has: row.goals = [{ name: "..." }, ...]
    rows.forEach((row: any) => {
      if (row.goals && Array.isArray(row.goals)) {
        row.goals.forEach((g: any) => {
          if (g.name) {
            goalNames.add(g.name);
          }
        });
      }
    });
    return Array.from(goalNames);
  }, [rows]);

  // 3) Example page size options
  const pageSizeOptions = [5, 10, 15, 20, 50, 100];
  const ALL_GOALS_VALUE = "__ALL__";

  // 4) Render
  return (
    <div className="w-full">
      {/* Existing "name" text filter */}
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            // Filter by "name" column
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />

        {/* New Dropdown filter for "goals" */}
        {isUsersPage && (
          <Select
            // If no filter is set, fallback to ALL_GOALS_VALUE
            value={
              (table.getColumn("goals")?.getFilterValue() as string) ||
              ALL_GOALS_VALUE
            }
            onValueChange={(value) => {
              // If user picks our sentinel, treat it as "no filter"
              if (value === ALL_GOALS_VALUE) {
                table.getColumn("goals")?.setFilterValue(undefined);
              } else {
                table.getColumn("goals")?.setFilterValue(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Goals" />
            </SelectTrigger>
            <SelectContent>
              {/* Instead of value="", we use a special sentinel */}
              <SelectItem value={ALL_GOALS_VALUE}>All Goals</SelectItem>

              {uniqueGoals.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* The Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getPaginationRowModel().rows?.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between py-4">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <span>Rows per page</span>
          <select
            className="border rounded px-2 py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Page X of Y */}
        <div className="flex items-center space-x-2">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          {/* First page */}
          <button
            className="border rounded px-2 py-1 cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={18} />
          </button>
          {/* Previous page */}
          <button
            className="border rounded px-2 py-1 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={18} />
          </button>
          {/* Next page */}
          <button
            className="border rounded px-2 py-1 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={18} />
          </button>
          {/* Last page */}
          <button
            className="border rounded px-2 py-1 cursor-pointer"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
