import React, { useState, useEffect } from 'react';
import type { ColumnFiltersState, SortingState, ColumnResizeMode, ColumnResizeDirection, GroupColumnDef} from "@tanstack/react-table"
import { flexRender, RowSelection, useReactTable } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import type { GameplayCols } from '../presentational/GameplayPanel';
import { Button } from 'flowbite-react';
import { FaEdit } from 'react-icons/fa';
import { IoAddCircleOutline } from "react-icons/io5";

type TableProps<TData> = {
    data: TData[];
    columns: GroupColumnDef<TData>[];
    editButtonMethod: () => {};
    newButtonMethod: () => {};
};

export function IndeterminateCheckbox({
                                 indeterminate,
                                 className = '',
                                 ...rest
                               }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
      <input
          type="checkbox"
          ref={ref}
          className={className + ' cursor-pointer'}
          {...rest}
      />
  )
}

export function Searchbar({
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
export function EditableTable<TData>({ columns, data, editButtonMethod, newButtonMethod }: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 });
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr");
  const [rowSelection, setRowSelection] = React.useState({})


  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    enableRowSelection: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      rowSelection: rowSelection,
      sorting,
      pagination,
      globalFilter,
      columnFilters,
    },
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Include grouping/expanded features if needed
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="flex flex-row gap-4">
            <Button color="alternative" onClick={() => editButtonMethod(table.getSelectedRowModel().rows)}><div className="flex flex-row gap-2">
                <FaEdit /><div>Edit</div></div></Button>
            <Button color="alternative" onClick={() => newButtonMethod()}><div className="flex flex-row gap-2">
                <IoAddCircleOutline /> <div>New</div></div></Button>
        </div>
      <table style={{ width: '100%' }} className=" text-sm text-left text-gray-500  dark:text-gray-200 table-fixed mx-auto px-4" >
        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-teal-900 dark:text-gray-400">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                
                <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} className="text-center align-middle">
                  {header.column.getCanFilter() && header.id !== "id" && header.id !=="select" && (
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
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </div>
  );
}