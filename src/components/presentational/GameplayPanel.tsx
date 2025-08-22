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
    added_at: Date
}
const data_url = "/backend/get-gameplay-data"

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

    const current_week = currentWeek()

    function currentDay(date = new Date()){
      const today = new Date(date)
      today.setHours(0); today.setMinutes(0); today.setSeconds(0)
      return today
    }
    function minus1Day(date = new Date()){
      const d = new Date(date)
      d.setHours(0); d.setMinutes(0); d.setSeconds(0)
      d.setDate(d.getDate() - 1)
      return d
    }
    function currentWeek(date = new Date()) {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
      const diff = d.getDate() - (day - 1) ; // subtract day index
      let new_date = new Date(d.setDate(diff));
      new_date.setHours(0); new_date.setMinutes(0); new_date.setSeconds(0)
      return new_date
    }

    function previousWeek(date = new Date()){

    }
    function currentMonth(date = new Date()){

    }
    function previousMonth(date = new Date()){

    }

    const [openModal, setOpenModal] = useState<string | undefined>();
    const [period, setPeriod] = useState("currentday");
    const [groupby, setGroupby] = useState("operator")
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const [data, setData] = useState<GameplayCols[]>();
    const [startDate, setStartDate] = useState<Date>(currentDay())
    const [endDate, setEndDate] = useState<Date>(new Date())
    const startDateRef = useRef<HTMLInputElement>(null);
    

  const changePeriod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Selected period:", value);
    if (e.target.value == "currentday"){
      setStartDate(currentDay())
      setEndDate(new Date())
    }
    if (e.target.value == "minus1day"){
      setStartDate(minus1Day())
      console.log(minus1Day())
  
    }
    if (e.target.value == "from_start_till_today"){
      setStartDate(currentWeek())
      console.log(startDate)
    }

  };

    const columnHelper = createColumnHelper<GameplayCols>();
    useEffect(() => {
      console.log("Period is ", period)
      console.log("start date is ", startDate)
    }, [period]);
    useEffect(() => {
      console.log(groupby)
    }, [groupby]);
    useEffect(() => {
      console.log(data_url)      
    }, []);

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
      {value:"currentday", name: "Current Day", selected: true},
      {value:"minus1day", name: "Yesterday"},
      {value:"from_start_till_today", name: "Current week"},
      {value:"from_start_till_end_of_prev_week", name: "Previous week"},
      {value:"from_start_of_cur_month_till_today", name: "Current month"},
      {value:"from_start_of_prev_month_till_its_end", name: "Previous month"},
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
                <DateTimePicker value ={startDate} onChange={(e) => setStartDate(e)} />
              </div>
              <div className="flex flex-row items-center gap-2">
                <div>End Date</div>
                <DateTimePicker value={endDate} onChange={(e) => setEndDate(e)}/>
              </div>
                <RPSelect name="action-select" onChange={(e)=>setGroupby(e.target.value)} options = {group_by_options} label="GroupBy" />
                <Button className="bg-slate-300 text-dark dark:bg-white"
                  onClick={(e) => {
                    console.log("start date",startDate); 
                    console.log("end date",endDate); 
                    console.log("period", period); 
                    console.log("group_by", groupby)
                    alert("В процес на разработка")
                    
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
        </div>
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <ModalHeader>Terms of Service</ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                  companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                  to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                  soon as possible of high-risk data breaches that could personally affect them.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setOpenModal(false)}>I accept</Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                Decline
              </Button>
            </ModalFooter>
          </Modal>
        </div>
    )
}