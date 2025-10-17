import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import {PropsWithChildren} from "react";
import { Button, Modal, Checkbox, Label, TextInput,Datepicker , DropdownItem, Dropdown, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { IndeterminateCheckbox } from "../panels/functional/IndeterminateCheckbox.tsx"
import { EditableTable} from "../tables/editableTable.tsx";
import { RowSelection, createColumnHelper } from "@tanstack/react-table";
import { DateTimePicker, RPDatePicker } from './widgets/RPDatePicker.tsx';
import {RPSelect} from './SelectElement.tsx';
import dayjs from "dayjs"; // For date formatting
import { PromosForm } from '../Forms/PromosForm.tsx';
import { NewPromosForm } from '../Forms/NewPromoForm.tsx';
import { AbstractTable } from '../tables/abstractTable.tsx';

const data_url = '/backend/sysinfo/get-cmd-exec-stats'

const fetchEndpointsLogs = async ({pageIndex, pageSize}:any) => {
  //add parameters to fetch data 
  const { data } = await axios.get(`${data_url}?page=${pageIndex +1}&per_page=${pageSize}`)
  return data
}

export type EndpointLogsCols = {
    id: number;
    command: string;
    unique_identifier: string | null; 
    ended_at: Date;
    started_at: Date, 
    result: string,
    error_message: string,
    status_code: number,
}


export const EndpointsLogsPanel:FC<PropsWithChildren<{}>> = ({children}) => {

    

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [groupby, setGroupby] = useState("operator")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const [data, setData] = useState<EndpointLogsCols[]>();
    const startDateRef = useRef<HTMLInputElement>(null);
    const [editRecord, setEditRecord] = useState(null);
    const [editError, setEditError] = useState(false);
    const [editPromoModal, setEditPromoModal] = useState<String | undefined>()
    const [newRecord, setNewRecord] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(100)
    

  const columnHelper = createColumnHelper<EndpointLogsCols>();

  const nextPage = () => setPageIndex((old) => old + 1);
  const prevPage = () => setPageIndex((old) => Math.max(old - 1, 0));

  const promos = useQuery({
      queryKey: ["promos", pageIndex, pageSize],
      queryFn: () =>
        fetchEndpointsLogs({
          pageIndex: pageIndex,
          pageSize: pageSize,
        }),
      enabled: pageSize > 0,
      keepPreviousData: true,
      throwOnError: (error) => error.response?.status >= 500,

    });

    const columns = [
        columnHelper.accessor("id", {
          header: "ID",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 30, 
          maxSize: 75
        }),
        columnHelper.accessor("command", {
          header: "endpoint",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 100,
          minSize: 100, 
          maxSize: 100
        }),
        columnHelper.accessor("unique_identifier", {
          header: "Unique identifier",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 70, 
          maxSize: 75
        }),
        columnHelper.accessor("status_code", {
          header: "Status Code",
          //render the Genres component here:
          cell: (info) => info.getValue() ,
          size: 30, 
          minSize: 30, 
          maxSize:30
        }),
        columnHelper.accessor("error_message", {
          header: "Error Message",
          //use our convertTsoHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue()

        }),
        columnHelper.accessor("result", {
          header: "Result",
          cell: (info) => info.getValue(),
          size:70,
          minSize:70,
          maxSize:100
        }), 
        columnHelper.accessor("started_at", {
          header: "Started At",
          cell: (info) => info.getValue(),
          size: 100,
          minSize:100,
          maxSize: 100
        }),   
        columnHelper.accessor("ended_at", {
          header: "Ended At",
          cell: (info) => info.getValue(),
          size: 100,
          minSize: 100,
          maxSize: 100,
        }),                    
      ]
    
    return (
      <div>
        <div className="w-full flex flex-col items-stretch space-y-3 justify-between  overflow-x-scroll dark:border-gray-700">
            {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
            <div>
            {promos.isError ? <div>An error occured</div> : ''}
            {promos.isSuccess ? 
              <AbstractTable                            
                  data={promos?.data}
                  columns={columns}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />: ''
            }
            </div>
        </div>

        </div>
    )
}
