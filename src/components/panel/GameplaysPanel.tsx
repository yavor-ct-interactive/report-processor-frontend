import React,{FC, useState, useRef, useEffect, PropsWithChildren, useReducer, useMemo} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { IndeterminateCheckbox } from "../functional/IndeterminateCheckbox.tsx"
import { AbstractTable } from "../tables/AbstractTable.tsx";
import { ColumnDef, RowSelection, createColumnHelper } from "@tanstack/react-table";
import dayjs from 'dayjs';

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
const data_url = `${import.meta.env.VITE_BACKEND_URL}/get-gameplay-data`;


export const GameplaysPanel:FC<PropsWithChildren> = ({children}) => {
    const [data, setData] = useState<GameplayCols[]>()
    const rerender = useReducer(() => ({}), {})[1]
    const columnHelper = createColumnHelper<GameplayCols>();

    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const [reloaded, setReloaded] = useState(false)
    const queryClient = useQueryClient()
    

    const gameplays = useQuery({
      queryKey: ['gameplays'],
      queryFn: () => fetchData(),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })

    const fetchData = async () => {
      const formData = new FormData();
      const now = new Date()
      const oneMonthAgo = new Date()
      const formatWithTime = (date) => date.toISOString().replace("T", " ").slice(0, 19);
  
      oneMonthAgo.setMonth(now.getMonth() - 1);
      formData.append("start_date", formatWithTime(oneMonthAgo));
      formData.append("end_date", formatWithTime(now));
  
      const {data} = await axios.post(data_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return data
    };
  
    //define our table headers and data
    const columns = useMemo(
      () => [
        //create a header group:
        columnHelper.group({
          id: "High Amount Gameplay Wins",
          header: () => <span>High Amount Gameplay Wins</span>,
          //now define all columns within this group
          columns: [
            columnHelper.accessor("id", {
              header: "ID",
              aggregationFn: "count",
              cell: (info) => info.getValue(),
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
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("currency", {
              header: "Currency",
              cell: (info) => info.getValue(),
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
            }),        
            columnHelper.accessor("added_at", {
              header: "Added At",
              cell: (info) => info.getValue(),
            }),      
          ],
        }),
      ],
      [],
    );

    
    return (
        <div>
        
      <div className="flex h-screen flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">

        {inProgress ? <ImSpinner9 className="loading-icon" /> : ""} 
          {gameplays.isSuccess ? 
          <AbstractTable 
                         data={gameplays.data}
                         columns = {columns}
          />: ''
          }
        </div>
      </div>
    )
}
