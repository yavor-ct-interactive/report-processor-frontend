import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import type {PropsWithChildren} from "react";
import { Button, Modal, Checkbox, Label, TextInput,Datepicker , DropdownItem, createTheme, ThemeProvider,  Dropdown, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { IndeterminateCheckbox } from "../panels/functional/IndeterminateCheckbox.tsx"
import { AbstractTable} from "../tables/abstractTable.tsx";
import { RowSelection, createColumnHelper } from "@tanstack/react-table";
import { DateTimePicker, RPDatePicker } from './widgets/RPDatePicker.tsx';
import {RPSelect} from './SelectElement.tsx'
import dayjs from "dayjs"; // For date formatting
import isoWeek from 'dayjs/plugin/isoWeek';
import { SummarizedWinnings, SummarizedWinningsComponent } from '../tables/groupTable.tsx';
import { CustomModalTheme } from '../../themes/MainTheme.tsx';
import { currentDay, previousDay, currentWeek, previousWeek, currentMonth, previousMonth } from '../date_functions/index.tsx';
import { gameplay_columns } from './Gameplays/index.tsx';
import { Select } from 'flowbite-react';
import { exportToCsv } from "tanstack-table-export-to-csv";
import { CustomButton } from './Common/Buttons.tsx';

interface SummarizedItems {
    value: string;
    count: number;
}
interface SummarizedWinningsProps {
    criteria: string;
    items: SummarizedItems[];
}

const data_url = "/backend/get-gameplay-data"
const returnDataComponent = () => {
  return (
    <div>
      {}
    </div>
  )
}


export const GameplayPanel:FC<PropsWithChildren> = ({children}) => {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(100)
    const nextPage = () => {
      console.log(pageIndex) 
      return setPageIndex((old) => old + 1);
    }
    const prevPage = () => setPageIndex((old) => Math.max(old - 1, 0));
    

    const fetchData = async () => {
      //add parameters to fetch data 
      const formData = new FormData();
      const formatWithTime = (date) => date.toISOString().replace("T", " ").slice(0, 19);
      const datetimeSofia = () => {
        const sofia_date = new Date(new Date().getTime())
        return sofia_date
      }

      const now = datetimeSofia()
      const oneMonthAgo = datetimeSofia()
      
      oneMonthAgo.setMonth(now.getMonth() - 1);
      formData.append("start_date", formatWithTime(startDate));
      formData.append("end_date", formatWithTime(endDate));
      const { data } = await axios.post(data_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data
    } 

    useEffect( () => {
      console.log(pageIndex)
    }, [pageIndex])
    let {start,end} = currentDay()
    const [openModal, setOpenModal] = useState(false);
    const [period, setPeriod] = useState("current_day");
    const [groupby, setGroupby] = useState("operator")
    const [includeParams, setIncludeParams] = useState(false)
    const [groupbyParam, setGroupbyParam] = useState("")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const [randNumber, setRandNumber] = useState(dayjs().unix())
    const [startDate, setStartDate] = useState<Date>(start)
    const [endDate, setEndDate] = useState<Date>(end)
    const [groupedData, setGroupedData] = useState<string>("")
    
    useEffect( () => {
      console.log("Grouped data is ",groupedData)
    }, [groupedData])

    const changePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setPeriod(value)
      console.log("Selected period:", value);
      if (e.target.value == "current_day"){
        let {start, end} = currentDay()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
      if (e.target.value == "previous_day"){
        let {start, end} = previousDay()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
      if (e.target.value == "current_week"){
        let {start, end} = currentWeek()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
      if (e.target.value == "previous_week"){
        let {start, end} = previousWeek()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
      if (e.target.value == "current_month"){
        let {start, end} = currentMonth()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
      if (e.target.value == "previous_month"){
        let {start, end} = previousMonth()
        setStartDate(start)
        setEndDate(end)
        setGroupby("")
        setGroupbyParam("")
      }
  };

    const queryDataFn = async () => {
      const formData = new FormData()
      formData.append("start_date",dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'));
      formData.append("end_date", dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'));
      //formData.append("page", pageIndex+1);
      //formData.append("per_page", pageSize);
      if (includeParams){
        formData.append("groupby", groupby);
        formData.append("groupby_param", groupbyParam);
        //formData.append("page", pageIndex+1);
        //formData.append("per_page", pageSize);
      }
      const data_url_l = `${data_url}`
      const {data} = await axios.post(data_url_l, formData ) 
      console.log("sending data to backend with formdata", formData)
      return data
    }

    const gameplays = useQuery({
      queryKey: [`gameplays, ${startDate}, ${endDate}, ${randNumber}, `],
      queryFn: () => queryDataFn(),
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    })
    
    function onLoadData(e:any) {
      console.log(e.criteria)
      console.log(e.item)
      setGroupby(e.criteria)
      setGroupbyParam(e.item)
      setIncludeParams(true)
      setRandNumber(dayjs().unix())
      setOpenModal(false)
    }
    const period_select_options = [ 
      {value:"current_day", name: "Current Day"}, //From 0 till now
      {value:"previous_day", name: "Yesterday"}, //From 0 to  0 
      {value:"current_week", name: "Current week"}, //from start of the week till now 
      {value:"previous_week", name: "Previous week"}, // from start of the previous week till its end
      {value:"current_month", name: "Current month"}, // from start of the month till now
      {value:"previous_month", name: "Previous month"}, // from start of the previous month till it's end
    ]
    const group_by_options = [
      { value: "operator", name: "Operator"},
      { value: "operator_endpoint", name: "Operator Endpoint"},
      { value: "game", name: "Game"},
      { value: "player", name: "Player"},
      { value: "currency", name: "Currency"},
    ]
    const selectGroupByWinningCriteriaDisabled = () => {
      console.log("Groupby is ", groupby)
      return gameplays.data?.length === 0;
    }

    const modalTheme = createTheme({
        modal: {
          root: { 
            base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            
          },
          header: {
            base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600 text-center",
            title: "text-blue-600 text-xl font-medium text-gray-900 dark:text-white w-full text-center ",
            close:{
              base: "bg-red-200 p-0",
              icon: "w-3 h-3",
            }
          },
          
        },
      });
    console.log(pageIndex)
    return (
        <div className="w-full flex flex-col items-stretch space-y-3 justify-between  dark:border-gray-700">
            {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
            <div className="flex flex-row items-stretch justify-start gap-4 border-b-1 pb-2">
                <RPSelect name="period-select" onChange={changePeriod} options={period_select_options} label="Period" value={period} />
              <div className="flex flex-row items-center gap-2">
                <div>Start Date</div>
                <DateTimePicker start_date ={startDate} onChange={(e) => {console.log("Event is ",e); setStartDate(e)}} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div>End Date</div>
                <DateTimePicker start_date={endDate} onChange={(e) => setEndDate(e)}/>
              </div>           
                <CustomButton  disabled={selectGroupByWinningCriteriaDisabled()}
                  onClick={(e) => {
                    setOpenModal(true)
                  }}>
                    Group By Winnings
                </CustomButton>
            </div>
            {gameplays.isSuccess ? 
            <AbstractTable                            
                            data={gameplays?.data}
                            columns={gameplay_columns}
                            pageSize={pageSize}
            />: ''
            }
            {gameplays.isPending ? 'Loading ... ' : ''}
            <div>
              <ThemeProvider theme={CustomModalTheme}>
              <Modal show={openModal} size="5xl" popup onClose={() => setOpenModal(false)} position="center" >
                  <ModalHeader>Winnings</ModalHeader>
                  <ModalBody>
                    {/*
                      {groupedData && 
                        {<SummarizedWinnings criteria={groupedData.criteria} items={groupedData.items} onLoadData={onLoadData}
                        /> 
                        }
                        setGroupby(item.criteria)
                        setGroupByValue(item.item) 
                    */} 
                    <SummarizedWinningsComponent start_date={startDate} end_date={endDate}
                                onLoadData={onLoadData} />
                  </ModalBody>
              </Modal>
              </ThemeProvider>
             
            </div>

        </div>
    )
}