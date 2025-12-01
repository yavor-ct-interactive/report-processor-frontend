import React, { useState, useEffect } from 'react';
import type { ColumnFiltersState, SortingState, ColumnResizeMode, ColumnResizeDirection, GroupColumnDef} from "@tanstack/react-table"
import { flexRender, useReactTable } from '@tanstack/react-table';
import type{ Column } from '@tanstack/react-table';
import { Modal, Button, Label, TextInput, Select, ModalHeader, ModalBody, ModalFooter, ThemeProvider } from "flowbite-react";
import type { FilterFn } from '@tanstack/react-table';
import { CustomButton, FilterButton } from '../presentational/Common/Buttons';
import { ImSpinner9 } from 'react-icons/im';
import { CustomModalTheme } from '../../themes/MainTheme';
import {ColumnFilter, advancedFilter} from './abstractTable'
/*New code for table filters */
/*End of new codee for table filters */
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table';
import exportToCsv  from "tanstack-table-export-to-csv";

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

interface EndpointLogsCols {
    endpoint: string,
    sender_ip: string, 
    filename: string,
    unique_identifier: string, 
    status_code: string,
    error_message: string,
    result: string,
    started_at: Date,
    ended_at: Date
}
interface FilterProps {
  column: Column<EndpointLogsCols, unknown>;
}


const Filter: React.FC<FilterProps> = ({ column }) => {
  const columnFilterValue = column.getFilterValue();
  return (   
    <div className="w-full flex justify-center">
      <TextInput className="w-full box-border"
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
      />
    </div>
  );
};  

/* New code added here */
interface FilterModalProps {
  columnName: string;
  columnHeader: string;
  show: boolean;
  onClose: () => void;
  onApply: (filter: { operator: string; value1: string; value2?: string }) => void;
}
export const FilterModal: React.FC<FilterModalProps> = ({
  columnName,
  columnHeader,
  show,
  onClose,
  onApply,
}) => {
  const [operator, setOperator] = useState(">");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const handleApply = () => {
    onApply({ operator, value1, value2 });
    onClose();
  };
  const handleClear = () => {
    onApply(undefined)
    onClose()
  }
  const filter_name = columnName.replaceAll('_',' ')
  return (
    <ThemeProvider theme={CustomModalTheme}>
    <Modal show={show} onClose={onClose} popup size="md">
      <ModalHeader>
        Filter by  <span className="font-semibold"> {columnHeader}</span>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div>
            <Label htmlFor="operator">Operator</Label>
            <Select id="operator" value={operator} onChange={(e) => setOperator(e.target.value)}>
              <option value=">">Greater than</option>
              <option value="<">Less than </option>
              <option value="=">Equal to</option>
              <option value="between">Between</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="value1">Value</Label>
            <TextInput
              id="value1"
              type="text"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter value..."
            />
          </div>

          {operator === "between" && (
            <div>
              <Label htmlFor="value2">And</Label>
              <TextInput
                id="value2"
                type="text"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter second value..."
              />
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton onClick={handleApply}>
          Apply
        </CustomButton>
        <CustomButton onClick={() => handleClear()}>
          Clear
        </CustomButton>
        <CustomButton onClick={onClose}>
          Cancel
        </CustomButton>
      </ModalFooter>
    </Modal>
    </ThemeProvider>
  );
};


/*End of new code */
export function EndpointLogsTable<TData>({ columns, data}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    filterFns: {
      advanced: advancedFilter,
    },
    enableColumnResizing: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    columnResizeMode: 'onChange',
    // table.getFilteredRowModel().rows.length} / {data?.items?.length ?? 0
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Include grouping/expanded features if needed
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  const string_filterable_columns = ['command', 'sender_ip', 'uploaded_filename', 'unique_identifier', 'status_code', 'error_message', 'result', 'started_at', 'ended_at'];
  const handleExportToCsv = (): void => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getFilteredRowModel().rows;

    exportToCsv(`gameplays_data_${Date.now()}`, headers, rows);
  };
return (
    <div className="relative overflow-y-auto max-h-[75vh] min-h-[75vh] border w-full border-gray-700 rounded-lg">
      <div className='flex flex-row items-center justify-center gap-4 p-4'>
          <div>
            Filtered records: {table.getFilteredRowModel().rows.length}
          </div>
          <CustomButton onClick={handleExportToCsv}>Export to csv</CustomButton>

      </div>
      <table className=" text-sm text-left text-gray-500  dark:text-gray-200 table-fixed mx-auto w-full" >
        <thead className="sticky top-0 text-m text-gray-700 bg-neutral-100 h-8 bg-gray-50 dark:bg-teal-900 dark:text-gray-400 z-10">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} >
              {hg.headers.map((header) => (
                
                <th key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }} 
                 className="overflow-hidden text-ellipsis whitespace-wrap p-2" >                  
                  {header.column.getCanFilter() &&
                      string_filterable_columns.includes(header.id as string) && (
                        <div className="flex flex-row h-8 whitespace-wrap mb-2 ">
                          <Filter column={header.column} />
                        </div>
                  )}
                  <div
                    onClick={header.column.getToggleSortingHandler()} 
                    className={`${header.column.getCanSort() ? 'cursor-pointer' : ''} pt-1 pb-1`}

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
            <tr key={row.id} className="even:bg-gray-100 odd:bg-white dark:even:bg-neutral-800 dark:odd:bg-black">
              {row.getVisibleCells().map((cell, index) => (
                <td key={cell.id} style={{ width: cell.column.getSize() }}   
                className="overflow-hidden text-ellipsis whitespace-wrap p-2"
                  >{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row items-center justify-center gap-4 p-4'>
        <CustomButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </CustomButton>
        <CustomButton 
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </CustomButton>
        <span>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </span>
        <CustomButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </CustomButton>
        <CustomButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </CustomButton>
      </div>
    </div>
  );
}