import React, { useState, useEffect } from 'react';
import type { ColumnFiltersState, SortingState, ColumnResizeMode, ColumnResizeDirection, GroupColumnDef} from "@tanstack/react-table"
import { flexRender, useReactTable } from '@tanstack/react-table';
import type{ Column } from '@tanstack/react-table';
import { Modal, Button, Label, TextInput, Select, ModalHeader, ModalBody, ModalFooter, ThemeProvider } from "flowbite-react";
import type { FilterFn } from '@tanstack/react-table';
import { CustomButton, FilterButton } from '../presentational/Common/Buttons';
import { ImSpinner9 } from 'react-icons/im';
import { CustomModalTheme } from '../../themes/MainTheme';
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
interface FilterProps {
  column: Column<any, unknown>;
}

export const ColumnFilter: React.FC<FilterProps> = ({ column }) => {
  const [showModal, setShowModal] = useState(false);

  const handleApply = (filter: { operator: string; value1: string; value2?: string }) => {
    console.log(filter)
    // Create a simple string representation for now
    /*const filterString =
      filter.operator === "between"
        ? `${filter.operator} ${filter.value1} and ${filter.value2}`
        : `${filter.operator} ${filter.value1}`;
    */
    column.setFilterValue(filter);
  };


  return (
    <>
      <FilterButton
        size="xs"
        onClick={() => setShowModal(true)}
      >
        Filter
      </FilterButton>

      {showModal && (
        <FilterModal
          columnName={String(column.id)}
          columnHeader={String(column.columnDef.header)}
          show={showModal}
          onClose={() => setShowModal(false)}
          onApply={handleApply}
        />
      )}
    </>
  );
};
/*New code for filters */
export const stringFilter: FilterFn<any> = (row, columnId, filterValue) => {
            const rowValue = String(row.getValue(columnId));
            return rowValue.toLowerCase().includes(String(filterValue.toLowerCase()));
          }

export const advancedFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const cellValue = parseFloat(row.getValue(columnId));
  if (isNaN(cellValue)) return false;

  // Expecting filterValue to look like { operator: ">", value1: "500", value2?: "1000" }
  const { operator, value1, value2 } = filterValue;

  const v1 = parseFloat(value1);
  const v2 = parseFloat(value2);

  switch (operator) {
    case ">":
      return cellValue > v1;
    case "<":
      return cellValue < v1;
    case "=":
      return cellValue === v1;
    case "between":
      return cellValue >= v1 && cellValue <= v2;
    default:
      return true;
  }
};
/*end of new code for filters */ 
/*End of new code */
export function AbstractTable<TData>({ columns, data, pageSize}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr");

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
  const string_filterable_columns = ['gameplay_id', 'operator', 'operator_endpoint', 'operator_player_id', 'currency', 'game', 'game_start_time'];
  const number_filterable_columns = ['rgs_total_bet', 'game_denomination', 'win_transaction_amount', 'jp', 'multiplier']

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
      <table className=" text-sm text-left text-gray-500  dark:text-gray-200 table-auto mx-auto " >
        <thead className="sticky top-0 text-m text-gray-700 bg-neutral-100 h-8 bg-gray-50 dark:bg-teal-900 dark:text-gray-400 z-10">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} >
              {hg.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className={`
                    text-center align-middle pt-2
                    ${header.index === 0 ? "pl-2 pr-1" : ""}
                    ${header.index === hg.headers.length - 1 ? "pr-2" : ""}
                    ${header.index != 0 && header.index != hg.headers.length -1 && 'pr-1'}`
                  }  >                  
                  {header.column.getCanFilter() &&
                      string_filterable_columns.includes(header.id as string) && (
                        <div>
                          <Filter column={header.column} />
                        </div>
                  )}
                  {header.column.getCanFilter() &&
                    number_filterable_columns.includes(header.id as string) && (
                      <div  >
                        <ColumnFilter column={header.column} />
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
                <td key={cell.id} className={`
                  text-center align-middle truncate whitespace-nowrap overflow-hidden
                  ${index === 0 ? "pl-2" : ""}
                  ${index === row.getVisibleCells().length - 1 ? "pr-2" : ""}
                  ${index != 0 && index != row.getVisibleCells().length -1 && 'pr-1'}
                  `
                } 
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