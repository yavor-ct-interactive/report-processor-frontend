import { NetworkConnections } from "./widgets/NetworkConnections";
import { RPCard } from "../RPCard";
import { useQuery } from "@tanstack/react-query";
import {useEffect, useState} from 'react'
import type {SystemInfoCols} from './SysinfoTypes';
import { getData } from "./Functions";
import { network_connections_url } from "./Functions";
import { sysinfo_url } from "./Functions";

export const MainSysInfo = () => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [inProgress, setInProgress] = useState<Boolean | undefined>(false)

    const network_connections = useQuery({
      queryKey: ['network_connections'],
      queryFn: () => getData({data_url:network_connections_url}),
      refetchInterval: 30000,
    })
    
    const systeminfo = useQuery({
      queryKey: ['sysinfo'],
      queryFn: () => getData({data_url:sysinfo_url}),
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
    })

    useEffect( () => {
        console.log(systeminfo.status)
        if(systeminfo.status =="error"){
            console.log(systeminfo.error)
        }

    }, [systeminfo])
    




    
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
            <div className="">
              <div className="w-full h-auto flex flex-row items-center justify-between gap-3 mx-auto p-3 wrap">
                 
                  {cards}
              </div>
              <div className="w-full h-auto flex flex-row items-center justify-between gap-3 mx-auto p-3 wrap">
                <NetworkConnections title="Network Connections" url={network_connections_url}  />
              </div>
            </div>
          </div>
        );
      }
}