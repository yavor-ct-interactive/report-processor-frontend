import React, { useState, useEffect } from 'react';
import type { ColumnFiltersState, SortingState, ColumnResizeMode, ColumnResizeDirection, GroupColumnDef} from "@tanstack/react-table"
import { flexRender, RowSelection, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import type { Column } from '@tanstack/react-table';
import type { HTMLProps } from 'react';
import { functionalUpdate } from '@tanstack/react-table';
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
import  axios from 'axios';
type TableProps<TData> = {
    data: TData[],
    columns: GroupColumnDef<TData>[];
    editButtonMethod: (e) => void;
    newButtonMethod: () => void;
    pageIndex: number;
    pageSize: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    nextPage: () => void,
    prevPage: () => void,
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
  const data_url = '/backend/pbi/get-promos'
  const fetchData = async ({pageIndex, pageSize}:any) => {
  //add parameters to fetch data 
  const { data } = await axios.get(`${data_url}?page=${pageIndex +1}&per_page=${pageSize}`)
  return data
}

export function EditableTable<TData>({ columns, data, editButtonMethod, newButtonMethod, 
                                       pageIndex, pageSize, setPageIndex, setPageSize, prevPage, nextPage }: TableProps<TData>) {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr");
  const [rowSelection, setRowSelection] = React.useState({})

  /*const { data, isLoading, isError }:any = useQuery({
    queryKey: ["promos", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      fetchData({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      }),
    enabled: pagination.pageSize > 0,
    keepPreviousData: true,

  });*/

  useEffect( () => {
    console.log("Total Records:",data?.total)
  }, [data?.total])
  const totalRecords = data?.total ?? 0;
  const totalPages = Math.ceil(totalRecords / (pageSize ?? 1));

  const Loading = () => {
    if (isLoading) {
      return (
        <div>
          Loading ...
        </div>
      )
    }
  }
  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    enableColumnResizing: true,
    enableRowSelection: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    pageCount: totalPages > 0 ? totalPages : 1,
    state: {
      rowSelection: rowSelection,
      sorting,
      pagination: { pageIndex, pageSize },
      globalFilter,
      columnFilters,
    },
    manualPagination: true,
    columnResizeMode: columnResizeMode,
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
    onRowSelectionChange: setRowSelection,
  });
  console.log("Total records:", totalRecords, "Page size:", pageSize, "Total pages:", totalPages, "current page:", pageIndex);

  return (
    <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="flex flex-row gap-4">
            <Button color="alternative" onClick={() => editButtonMethod(table.getSelectedRowModel().rows)}><div className="flex flex-row gap-2 items-center">
                <FaEdit /><div>Edit</div></div></Button>
            <Button color="alternative" onClick={() => {table.resetRowSelection(); return (newButtonMethod())}}><div className="flex flex-row gap-2 items-center">
                <IoAddCircleOutline /> <div>New</div></div></Button>
        </div>
      <table className="text-sm text-left text-gray-500 dark:text-gray-200 table-fixed mx-auto px-4" >
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