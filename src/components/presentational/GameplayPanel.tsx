import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import PropsWithChildren from "react";
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

interface SummarizedItems {
    value: string;
    count: number;
}
interface SummarizedWinningsProps {
    criteria: string;
    items: SummarizedItems[];
}
export type GameplayCols = {
    id: BigInteger;
    gameplay_id: BigInteger;
    operator: String;
    operator_endpoint: String;
    operator_player_id: String;
    currency: String;
    game: String;
    successful_operator_win_transaction_ammount: BigInteger;
    game_start_time: Date;
    jp: BigInteger;
    added_at: Date;
    rgs_total_bet: BigInteger;
    game_denomination: BigInteger;
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
    /* Date time functions for toolbar */

    function currentDay(date = new Date()){
      const startOfToday = dayjs().startOf('day'); // Today at 00:00:00
      const now = dayjs(); // Current time
      return {
        start: startOfToday.toDate(),
        end: now.toDate()
      }
    }
    function previousDay(date = new Date()){
      const startOfToday = dayjs().startOf('day'); // Today at 00:00:00
      const startOfYesterday = startOfToday.subtract(1, 'day'); // Yesterday at 00:00:00
      return {
        start: startOfYesterday.toDate(),
        end: startOfToday.toDate(),
      }

    }
    function currentWeek(date = new Date()) {
      dayjs.extend(isoWeek); // Enables ISO week support (Monday as start)

      const now = dayjs(); // Current time
      const startOfWeek = now.startOf('isoWeek'); // Monday at 00:00:00
      return {
        start: startOfWeek.toDate(),
        end: now.toDate()
      }

    }

    function previousWeek(){
      dayjs.extend(isoWeek);

      // Get start and end of previous week
      const startOfPreviousWeek = dayjs().startOf('isoWeek').subtract(1, 'week');
      const endOfPreviousWeek = dayjs().startOf('isoWeek').subtract(1, 'day').endOf('day');
      return {
        start: startOfPreviousWeek.toDate(), 
        end: endOfPreviousWeek.toDate()
      }

    }
    function currentMonth(date = new Date()){
      const startOfMonth = dayjs().startOf('month'); // e.g. 2025-08-01 00:00:00
      const now = dayjs(); // current date and time

      console.log('Start of month:', startOfMonth.format('YYYY-MM-DD HH:mm:ss'));
      console.log('Now:', now.format('YYYY-MM-DD HH:mm:ss'));
      return {
        start: startOfMonth.toDate(),
        end: now.toDate()
      }

    }
    function previousMonth(date = new Date()){
      const startOfCurrentMonth = dayjs().startOf('month'); // e.g. Sep 1, 2025
      const startOfPreviousMonth = startOfCurrentMonth.subtract(1, 'month'); // e.g. Aug 1, 2025
      return {
        start: startOfPreviousMonth.toDate(),
        end: startOfCurrentMonth.toDate()
      }
    }
    /* End of Date time functions */

    let {start,end} = currentDay()
    const [openModal, setOpenModal] = useState(false);
    const [period, setPeriod] = useState("current_day");
    const [groupby, setGroupby] = useState("operator")
    const [includeParams, setIncludeParams] = useState(false)
    const [groupbyParam, setGroupbyParam] = useState("")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const [data, setData] = useState<GameplayCols[]>();
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

  const changeGroupByCriteria = () => {
    
  }


    const columnHelper = createColumnHelper<GameplayCols>();

     const queryDataFn = async () => {
      const formData = new FormData()
      formData.append("start_date",dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'));
      formData.append("end_date", dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'));
      if (includeParams){
        formData.append("groupby", groupby);
        formData.append("groupby_param", groupbyParam);
      }
      const data_url_l = `${data_url}`
      const {data} = await axios.post(data_url_l, formData ) 
      console.log("sending data to backend")
      return data
    }

    const gameplays = useQuery({
      queryKey: [`gameplays, ${startDate}, ${endDate}, ${randNumber}`],
      queryFn: () => queryDataFn(),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })
    const columns = [
        columnHelper.accessor("id", {
          header: "ID",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
          size: 50,
          minSize: 30, 
          maxSize: 100
        }),
        columnHelper.accessor("gameplay_id", {
          header: "Gameplay Id",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator", {
          header: "Operator",
          aggregationFn: "count",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("operator_endpoint", {
          header: "Operator Endpoint",
          //render the Genres component here:
          cell: (info) => info.getValue() ,
        }),
        columnHelper.accessor("operator_player_id", {
          header: "Operator Player Id",
          //use our convertToHoursAndMinutes function to render the runtime of the show
          cell: (info) => info.getValue()

        }),
        columnHelper.accessor("rgs_total_bet", {
          header: "RGS Total Bet",
          cell: (info) => info.getValue(),
          size:70,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("game_denomination", {
          header: "Game Den.",
          cell: (info) => info.getValue(),
          size:50,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("currency", {
          header: "Currency",
          cell: (info) => info.getValue(),
          size:70,
          minSize: 50, 
          maxSize: 100,
        }), 
        columnHelper.accessor("game", {
          header: "Game",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("win_transaction_amount", {
          header: "Win Amount",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("game_start_time", {
          header: "Game Start Time",
          cell: (info) => info.getValue(),
        }),   
        columnHelper.accessor("jp", {
          header: "Jackpot",
          cell: (info) => info.getValue(),
          size: 75
        }),             
      ]
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
    return (
      <div>
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
              
                <Button className="bg-red-500 hover:bg-red-600"  disabled={selectGroupByWinningCriteriaDisabled()}
                  onClick={(e) => {
                    setOpenModal(true)
                  }}>
                    Group By Winnings
                </Button>
            </div>
            <div>
            {gameplays.isSuccess ? 
            <AbstractTable                            
                            data={gameplays.data}
                            columns = {columns}
            />: ''
            }
            </div>
            <div>
              <ThemeProvider theme={modalTheme}>
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
          
        </div>
    )
}