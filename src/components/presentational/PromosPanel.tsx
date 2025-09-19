import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import PropsWithChildren from "react";
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

const fetchPromoData = async ({pageIndex, pageSize}:any) => {
  //add parameters to fetch data 
  const { data } = await axios.get(`${data_url}?page=${pageIndex +1}&per_page=${pageSize}`)
  return data
}

export type PromosCols = {
    id: BigInteger;
    month: Date;
    start_date: String;
    end_date: String;
    promo_type: String;
    site: String;
    endpoint: String;
    endpoint_id: BigInteger;
    platform: String;
    game: String;
    game_id: BigInteger;
    category_section: String;
    position: String;
    discount_percent: String;
    fixed_discount: BigInteger;
    priority: String;
    final_invoice_discount: String
}
const data_url = '/backend/pbi/get-promos'

const fetchData = async () => {
  //add parameters to fetch data 
  const { data } = await axios.get(data_url)
  return data
}

export const PromosPanel:FC<PropsWithChildren> = ({children}) => {

    

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [groupby, setGroupby] = useState("operator")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const [data, setData] = useState<PromosCols[]>();
    const startDateRef = useRef<HTMLInputElement>(null);
    const [editRecord, setEditRecord] = useState(null);
    const [editError, setEditError] = useState(false);
    const [editPromoModal, setEditPromoModal] = useState<String | undefined>()
    const [newRecord, setNewRecord] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(100)
    

    const editHandler = (rec:any) => {
        let last = rec.at(-1); 
        let record = last.original
        let headers = {
            "Content-Type": "application/json"
        }
        setEditRecord(last.original)
        setOpenModal(true)
    }
    const newHandler = () =>{
      setEditRecord(null)
        let headers = {
            "Content-Type": "application/json",
        }
        setNewRecord(true)
        setOpenModal(true)
    }

    const columnHelper = createColumnHelper<PromosCols>();

  const nextPage = () => setPageIndex((old) => old + 1);
  const prevPage = () => setPageIndex((old) => Math.max(old - 1, 0));

  const promos = useQuery({
      queryKey: ["promos", pageIndex, pageSize],
      queryFn: () =>
        fetchPromoData({
          pageIndex: pageIndex,
          pageSize: pageSize,
        }),
      enabled: pageSize > 0,
      keepPreviousData: true,
      throwOnError: (error) => error.response?.status >= 500,

    });
   
    
    const columns = [
        columnHelper.accessor('select', {
            header: "Select",
            cell: ({ row }) => (
                <div className="">
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
                </div>
            ),
            size: 50,
            enableSorting: false,
        }),
        columnHelper.accessor("id", {
          header: "ID",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 30, 
          maxSize: 75
        }),
        columnHelper.accessor("month", {
          header: "Month",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("start_date", {
          header: "Start Date",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("end_date", {
          header: "End Date",
          //render the Genres component here:
          cell: (info) => info.getValue() ,
        }),
        columnHelper.accessor("promo_type", {
          header: "Promo Type",
          //use our convertToHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue()

        }),
        columnHelper.accessor("site", {
          header: "Site",
          cell: (info) => info.getValue(),

        }), 
        columnHelper.accessor("endpoint", {
          header: "endpoint",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("endpoint_id", {
          header: "Endpoint ID",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("platform", {
          header: "Platform",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("game", {
          header: "Game",
          cell: (info) => info.getValue(),

        }),            
        columnHelper.accessor("game_id", {
          header: "Game ID",
          cell: (info) => info.getValue(),

        }),
        columnHelper.accessor("category_section", {
          header: "Category Section",
          cell: (info) => info.getValue(),

        }),            
        columnHelper.accessor("position", {
          header: "Position",
          cell: (info) => info.getValue(),

        }),            
        columnHelper.accessor("discount_percent", {
          header: "Discount Percent",
          cell: (info) => info.getValue(),

        }),                                                        
        columnHelper.accessor("fixed_discount", {
          header: "Fixed Discount",
          cell: (info) => info.getValue(),

        }),            
        columnHelper.accessor("priority", {
          header: "Priority",
          cell: (info) => info.getValue(),

        }),            
        columnHelper.accessor("final_invoice_discount", {
          header: "Final Invoice Discount",
          cell: (info) => info.getValue(),

        }),                                     
      ]
    
    return (
      <div>
        <div className="w-full flex flex-col items-stretch space-y-3 justify-between  overflow-x-scroll dark:border-gray-700">
            {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
            <div>
            {promos.isError ? <div>An error occured</div> : ''}
            {promos.isSuccess ? 
            <EditableTable
                            data = {promos.data}                            
                            columns = {columns}
                            editButtonMethod = { editHandler }
                            newButtonMethod = { newHandler }
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            setPageIndex={setPageIndex}
                            setPageSize={setPageSize}
                            nextPage={nextPage}
                            prevPage={prevPage}                            
            />: ''
            }
            </div>
            <Modal show={openModal} size="7xl" popup onClose={() => setOpenModal(false)} position="center" >
                <ModalHeader><div className="text-blue-700 text-center"> {editRecord ? 'Edit Promo' : 'Add Promo'} </div></ModalHeader>
                <ModalBody>
                  <div className="h-dvh">
                    {editRecord && <PromosForm form_data={editRecord}  onClose={() => setOpenModal(false)} />}
                    {newRecord && <NewPromosForm onClose={() => setOpenModal(false)}  /> }    
                  </div>
                </ModalBody>
            </Modal>
        </div>

        </div>
    )
}
