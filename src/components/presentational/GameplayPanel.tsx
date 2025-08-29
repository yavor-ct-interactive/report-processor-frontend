import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import PropsWithChildren from "react";
import { Button, Modal, Checkbox, Label, TextInput,Datepicker , DropdownItem, Dropdown, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
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
import { SummarizedWinnings } from '../tables/groupTable.tsx';

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
    rgs_total_win: BigInteger;
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
  formData.append("start_date", formatWithTime(oneMonthAgo));
  formData.append("end_date", formatWithTime(now));
  console.log("Now date is ", now)
  console.log("One month ago is",oneMonthAgo)
  const { data } = await axios.post(data_url, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data
}
export const GameplayPanel:FC<PropsWithChildren> = ({children}) => {

    
    const minusOneWeek = new Date();
    minusOneWeek.setDate(minusOneWeek.getDate() - 7);
    const minusOneMonth = new Date();
    minusOneMonth.setDate(minusOneMonth.getMonth() - 1);
    const minusOneYear = new Date()
    minusOneYear.setDate(minusOneYear.getFullYear() - 1 );


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
    let {start,end} = currentDay()
    const [openModal, setOpenModal] = useState(false);
    const [period, setPeriod] = useState("current_day");
    const [groupby, setGroupby] = useState("operator")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const [data, setData] = useState<GameplayCols[]>();
    const [startDate, setStartDate] = useState<Date>(start)
    const [endDate, setEndDate] = useState<Date>(end)
    const [groupedData, setGroupedData] = useState<any>()
    
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
    }
    if (e.target.value == "previous_day"){
      let {start, end} = previousDay()
      setStartDate(start)
      setEndDate(end)
  
    }
    if (e.target.value == "current_week"){
      let {start, end} = currentWeek()
      setStartDate(start)
      setEndDate(end)
    }
    if (e.target.value == "previous_week"){
      let {start, end} = previousWeek()
      setStartDate(start)
      setEndDate(end)
    }
    if (e.target.value == "current_month"){
      let {start, end} = currentMonth()
      setStartDate(start)
      setEndDate(end)
    }
    if (e.target.value == "previous_month"){
      let {start, end} = previousMonth()
      setStartDate(start)
      setEndDate(end)
    }


  };
  

    const columnHelper = createColumnHelper<GameplayCols>();

    

    const gameplays = useQuery({
      queryKey: ['gameplays'],
      queryFn: () => fetchData(),
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
        columnHelper.accessor("rgs_total_win", {
          header: "RGS Total Win",
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
    const period_select_options = [ 
      {value:"current_day", name: "Current Day", selected: true}, //From 0 till now
      {value:"previous_day", name: "Yesterday"}, //From 0 to  0 
      {value:"current_week", name: "Current week"}, //from start of the week till now 
      {value:"previous_week", name: "Previous week"}, // from start of the previous week till its end
      {value:"current_month", name: "Current month"}, // from start of the month till now
      {value:"previous_month", name: "Previous month"}, // from start of the previous month till it's end
    ]
    const group_by_options = [
      { value: "operator", name: "Operator", selected: true},
      { value: "operator_endpoint", name: "Operator Endpoint"},
      { value: "game", name: "Game"},
      { value: "player", name: "Player"},
      { value: "currency", name: "Currency"},
    ]
    return (
      <div>
        <div className="w-full flex flex-col items-stretch space-y-3 justify-between  dark:border-gray-700">
            {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
            <div className="flex flex-row items-stretch justify-start gap-4 border-b-1 pb-2">
                <RPSelect name="period-select" onChange={changePeriod} options={period_select_options} label="Period" />
              <div className="flex flex-row items-center gap-2">
                <div>Start Date</div>
                <DateTimePicker start_date ={startDate} onChange={(e) => setStartDate(e)} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div>End Date</div>
                <DateTimePicker start_date={endDate} onChange={(e) => setEndDate(e)}/>
              </div>
                <RPSelect name="action-select" onChange={(e)=>setGroupby(e.target.value)} options = {group_by_options} label="GroupBy" />
                <Button className="bg-slate-300 text-dark dark:bg-white"
                  onClick={(e) => {
                    let formatted_start_date = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
                    let formatted_end_date = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
                    console.log("start date", dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')); 
                    console.log("end date",dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')); 
                    console.log("group_by", groupby)
                    let headers = {
                      "Content-Type":"application/x-www-form-urlencoded",
                    }
                    const formData = new FormData();
                    formData.append("start_date", formatted_start_date);
                    formData.append("end_date", formatted_end_date);
                    formData.append("criteria", groupby);

                    axios.post("/backend/summarize-winnings",formData, {
                      headers: headers
                    }).then( 
                      (res:any) => {
                        setGroupedData(res.data)
                        setOpenModal(true)
                      }
                        
                    ).catch( 
                      (err) => console.log(err)
                    )
                                          
                  }
                    }>
                    Submit
                </Button>
            </div>
            <div >
            {gameplays.isSuccess ? 
            <AbstractTable                            
                            data={gameplays.data}
                            columns = {columns}
            />: ''
            }
            </div>
            <div>
              <Modal show={openModal} size="3xl" popup onClose={() => setOpenModal(false)} position="center" >
                              <ModalHeader><div className="text-blue-700 text-center"> Operator </div></ModalHeader>
                              <ModalBody>
                                   {groupedData && 
                                    <SummarizedWinnings criteria={groupedData.criteria} items={groupedData.items} 
                                        queryFunction={() => alert('Hopa')} /> 
                                    }  
                              </ModalBody>
                          </Modal>
             
            </div>

        </div>
          
        </div>
    )
}