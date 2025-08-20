import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import PropsWithChildren from "react";
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { IndeterminateCheckbox } from "../../panels/functional/IndeterminateCheckbox.tsx"

type SystemInfoCols = {
    id: BigInteger;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_in: number;
    network_out: number;
    timestamp: Date;
}
export const getData = async (data_url:string) => {
    const formData = new FormData();
    const now = new Date()
    const oneMonthAgo = new Date()
    const formatWithTime = (date:Date) => date.toISOString().replace("T", " ").slice(0, 19);
  
    oneMonthAgo.setMonth(now.getMonth() - 1);
    formData.append("start_date", formatWithTime(oneMonthAgo));
    formData.append("end_date", formatWithTime(now));
  
    const { data } = await axios.get(data_url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Get Data",data)
    return data
  }
type NetworkConnectionsProps = { title: string, url: string };
export const NetworkConnections: FC<NetworkConnectionsProps>  = ({title, url}) => {


    // Fetch system info data
    const dataquery = useQuery({
        queryKey: ['data'],
        queryFn: () => getData(url),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    })


    // Render the component
    return (
        <div className="bg-red-200 w-2/4 p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg mt-2 dark:hover:shadow-teal-900">
            <div className="w-full p-2 border-gray-200 flex flex-col items-center">
            <div className="p-2">
            <div className="text-center border-b-1">{title}</div>
            {dataquery.status === "success" &&
          Array.isArray(dataquery.data) &&
          dataquery.data.flatMap((item: any, index: any) =>
            item.connections.map((connection: any) => {
              const fields = [
                item.port,
                connection.local_addr,
                connection.remote_addr,
                connection.pid,
              ];

              return (
                <div key={index}>
                  <div className="flex flex-row items-center justify-between gap-2">
                    {fields.map((field, idx) => (
                      <div key={idx}>{field}</div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
            </div>
            </div>
            
                </div>
    );
}
