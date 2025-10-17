import React, { useState, useEffect } from 'react';
import type { ColumnFiltersState, SortingState, ColumnResizeMode, ColumnResizeDirection, GroupColumnDef} from "@tanstack/react-table"
import { flexRender, useReactTable } from '@tanstack/react-table';
import type{ Column } from '@tanstack/react-table';

import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';

import type {GameplayCols} from '../presentational/Gameplays'

type TableProps<TData> = {
    data: TData[];
    columns: GroupColumnDef<TData>[];
    pageIndex: number;
    pageSize: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    nextPage: () => void,
    prevPage: () => void,
    totalCount: number,
};
/*export function Searchbar({
    value: initialValue,
    onChange,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    //if the entered value changes, run the onChange handler once again.
    useEffect(() => {
      onChange(value);
    }, [value]);
    //render the basic searchbar:
    return (
      <input className="w-full"
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
  
function Filter({ column }: { column: Column<GameplayCols, unknown> }) {
    const columnFilterValue = column.getFilterValue();

    return (
      <Searchbar
        onChange={(value) => {
          column.setFilterValue(value);
        }}
        placeholder={`Search...`}
        type="text"
        value={(columnFilterValue ?? "") as string}
      />
    );
  }
*/
interface FilterProps {
  column: Column<GameplayCols, unknown>;
}
const Filter: React.FC<FilterProps> = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
    />
  );
};  
export function AbstractTable<TData>({ columns, data, pageIndex, pageSize, setPageIndex, setPageSize, nextPage, prevPage }: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr");

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    enableColumnResizing: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
      globalFilter,
      columnFilters,
    },
    columnResizeMode: 'onChange',
    manualPagination: true,
    pageCount: Math.ceil(data?.total / pageSize),
    onSortingChange: setSorting,
    onPaginationChange: (updater) =>
      typeof updater === "function"
        ? setPageIndex((old) => updater({ pageIndex: old, pageSize }).pageIndex)
        : setPageIndex(updater.pageIndex),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Include grouping/expanded features if needed
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

    console.log("Page Index is :",pageSize)
  return (
    <div style={{ direction: table.options.columnResizeDirection }}>
      <table style={{ width: '100%' }} className=" text-sm text-left text-gray-500  dark:text-gray-200 table-fixed mx-auto px-4" >
        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-teal-900 dark:text-gray-400">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                
                <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} className="text-center align-middle">
                  {header.column.getCanFilter() && header.id !== "id" && header.id !== "select" &&(
                    <div>
                      <Filter column={header.column} />
                      {/*Add your search component here */}
                    </div>
                  )}
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : undefined }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                  
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-gray-100 odd:bg-white dark:even:bg-neutral-950 dark:odd:bg-black">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="text-center align-middle truncate whitespace-nowrap overflow-hidden">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
         <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => prevPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Page <strong>{pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}