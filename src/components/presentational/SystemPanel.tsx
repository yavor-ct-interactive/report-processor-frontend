import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import PropsWithChildren from "react";
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { IndeterminateCheckbox } from "../panels/functional/IndeterminateCheckbox.tsx"
import { AbstractTable} from "../tables/abstractTable.tsx";
import { RowSelection, createColumnHelper } from "@tanstack/react-table";
import { RPCard} from './RPCard';
import { NetworkConnections } from './widgets/NetworkConnections.tsx';


type SystemInfoCols = {
    id: BigInteger;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_in: number;
    network_out: number;
    timestamp: Date;
}
const base_url = "/backend"
const sysinfo_url = `${base_url}/sysinfo/system-info`
const network_connections_url = `${base_url}/sysinfo/network-connections`
const getData = async (data_url:string) => {
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
  console.log(data)
  return data
}
export const SysinfoPanel :FC<PropsWithChildren> = ({children}) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)
    const queryClient = useQueryClient()
    const [data, setData] = useState<GameplayCols[]>();
    const columnHelper = createColumnHelper<GameplayCols>();


    
    const network_connections = useQuery({
      queryKey: ['network_connections'],
      queryFn: () => getData(network_connections_url),
      refetchInterval: 30000,
    })
    
    const systeminfo = useQuery({
      queryKey: ['sysinfo'],
      queryFn: () => getData(sysinfo_url),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })




    
    if (systeminfo.status === "success") {
        const cards:any = [];
      
        systeminfo.data.forEach((item: any, index: number) => {
          if (item.cpu_usage) {
            cards.push(
              <RPCard
                key={`cpu-${index}`}
                title="CPU Usage"
                rows={[
                  { label: 'User', value: item.cpu_usage.user },
                  { label: 'System', value: item.cpu_usage.system },
                  { label: 'Idle', value: item.cpu_usage.idle },
                ]}
                wrap
              />
            );
          }
          if (item.disk_usage) {
            cards.push(
              <RPCard
                key={`disk-${index}`}
                title="Disk Usage"
                rows={[
                  { label: 'Total', value: item.disk_usage.total },
                  { label: 'Used', value: item.disk_usage.used },
                  { label: 'Free', value: item.disk_usage.free },
                ]}
                wrap
              />
            );
          }
      
          if (item.network_info) {
            cards.push(
              <RPCard
                key={`net-${index}`}
                title="Network Info"
                rows={[
                  { label: 'Interface', value: item.network_info.interface },
                  { label: 'Sent', value: item.network_info.bytes_sent },
                  { label: 'Received', value: item.network_info.bytes_recv },
                  { label: 'Dropped in', value: item.network_info.dropin },
                  { label: 'Dropped out', value: item.network_info.dropout },
                  { label: 'Errors in', value: item.network_info.errin },
                  { label: 'Errors out', value: item.network_info.errout },
                ]}
                wrap
              />
            );
          }
      
          if (item.memory_usage) {
            cards.push(
              <RPCard
                key={`mem-${index}`}
                title="Memory Info"
                rows={[
                  { label: 'Total', value: item.memory_usage.total },
                  { label: 'Available', value: item.memory_usage.available },
                  { label: 'Free', value: item.memory_usage.free },
                  { label: 'Used', value: item.memory_usage.used },
                ]}
                wrap
              />
            );
          }
      
          if (item.host_info) {
            cards.push(
              <RPCard
                key={`host-${index}`}
                title="Host Info"
                rows={[
                  { label: 'Hostname', value: item.host_info.hostname },
                  { label: 'IP address', value: item.host_info.ip_address },
                  { label: 'Python version', value: item.host_info.python_version },
                  { label: 'OS name', value: item.host_info.os_name },
                  { label: 'OS release', value: item.host_info.os_release },
                ]}
                wrap
              />
            );
          }
        });
        return (
          <div>
            <div className="w-full h-auto flex flex-row items-center justify-between gap-3 mx-auto p-3 wrap">
                {cards}
            </div>
            <div className="w-full h-auto flex flex-row items-center justify-between gap-3 mx-auto p-3 wrap">
              <NetworkConnections title="Network Connections" url={network_connections_url} />
            </div>
          </div>
        );
      }
    
}