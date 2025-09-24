import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import { ImSpinner9 } from "react-icons/im";
import { useQuery } from '@tanstack/react-query';

import { getData } from '../Functions.tsx';


type NetworkConnectionsProps = { title: string, url: string };
export const NetworkConnections: FC<NetworkConnectionsProps>  = ({title, url}) => {


    // Fetch system info data
    const dataquery = useQuery({
        queryKey: ['data'],
        queryFn: () => getData({data_url: url}),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    })


    // Render the component
    return (
        <div className="w-2/6 p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg mt-2 dark:hover:shadow-teal-900">
            <div className="p-2 border-gray-200 flex flex-col items-center">
            <div className="p-2">
            <div className="text-center border-b-1">{title}</div>
            {dataquery.status === "success" &&
          Array.isArray(dataquery.data) &&
          dataquery.data.flatMap((item: any) =>
            item.connections.map((connection: any) => {
              const fields = [
                item.port,
                connection.local_addr,
                connection.remote_addr,
                connection.pid,
              ];

              return (
                <div key={`${item.port}-${connection.pid}`}>
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