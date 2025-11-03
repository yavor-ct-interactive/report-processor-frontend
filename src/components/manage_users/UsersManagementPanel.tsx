import React,{FC, useState, useRef, useEffect, PropsWithChildren, useReducer, useMemo} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient} from "@tanstack/react-query";
import { IndeterminateCheckbox } from "../functional/IndeterminateCheckbox.tsx"
import { AbstractTable } from "../tables/AbstractTable.tsx";
import { ColumnDef, RowSelection, createColumnHelper } from "@tanstack/react-table";
import dayjs from 'dayjs';

/* The panel will include 2 panels ManageRolesPanel and ManageUsersPanel */ 
import { users_cols } from './Utils.tsx';
const data_url = `/testroles/auth/users`

export const UsersManagementPanel:FC<PropsWithChildren> = ({children}) => {
    
    const fetchData = async () => {
      const formData = new FormData();
      const now = new Date()
      const oneMonthAgo = new Date()
    
      const {data} = await axios.post(data_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return data
    };

  

    //define our table headers and data
  

    
    return (
      <div>
        
        <div className="flex h-screen flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">

        </div>
      </div>
    )
}
