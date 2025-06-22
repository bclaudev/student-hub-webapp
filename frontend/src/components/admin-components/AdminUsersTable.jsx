import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function AdminUsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(0);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const pageSize = 10;

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      filterFn: "includesString",
      meta: { filterable: true },
    },
    {
      header: "Nume complet",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "fullName",
      filterFn: "includesString",
      meta: { filterable: true },
    },
    {
      header: "Email",
      accessorKey: "email",
      filterFn: "includesString",
      meta: { filterable: true },
    },
    {
      header: "Rol",
      accessorKey: "role",
      filterFn: "includesString",
      meta: { filterable: true },
    },
    {
      header: "Ultima autentificare",
      accessorKey: "lastLoginAt",
      filterFn: "includesString",
      meta: { filterable: true },
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    },
    {
      header: "Creat la",
      accessorKey: "createdAt",
      filterFn: "includesString",
      meta: { filterable: true },
      cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    },
    {
      header: "Acțiune",
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const [open, setOpen] = useState(false);

        if (user.role === "admin") return null;

        return (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Șterge
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                <AlertDialogDescription>
                  Sigur vrei să ștergi utilizatorul{" "}
                  <strong>{user.email}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anulează</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/admin/users/${user.id}`, {
                        method: "DELETE",
                      });

                      if (!res.ok) throw new Error("Eroare la ștergere");

                      queryClient.invalidateQueries({
                        queryKey: ["admin-users"],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["admin-overview"],
                      });
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Confirmă
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.users || [],
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      columnFilters,
      sorting,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex ?? 0);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // ADDED
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card className="mt-6">
      <CardContent className="overflow-x-auto p-4">
        {isLoading ? (
          <div>Se încarcă utilizatorii...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler?.()}
                        className="cursor-pointer select-none"
                      >
                        <div>
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" && (
                              <ArrowUp className="ml-1 inline h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ArrowDown className="ml-1 inline h-4 w-4" />
                            )}
                          </div>
                          {header.column.getCanFilter() && (
                            <input
                              type="text"
                              className="mt-1 w-full rounded-xl border px-2 py-1 text-sm"
                              value={header.column.getFilterValue() ?? ""}
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder={`Search`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Înapoi
              </Button>
              <div>
                Pagina {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Înainte
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
