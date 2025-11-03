import {createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper()
export const users_cols = [
        columnHelper.accessor("id", {
          header: "ID",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 30, 
          maxSize: 100
        }),
        columnHelper.accessor("username", {
          header: "Username",
          aggregationFn: "count",
          filterFn: (row, columnId, filterValue) => {
          const rowValue = String(row.getValue(columnId));
          return rowValue.includes(String(filterValue));
    },
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("email", {
          header: "Email",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("password", {
          header: "Password",
          //render the Genres component here:
          cell: (info) => info.getValue() ,
        })
        
            
      ]