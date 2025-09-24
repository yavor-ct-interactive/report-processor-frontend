import React,{FC, useState, useRef, useEffect, useMemo, useReducer} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput } from 'flowbite-react';
import { HiOutlineArrowRight } from "react-icons/hi";
import axios from "axios";
import { ImSpinner9 } from "react-icons/im";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { IndeterminateCheckbox } from "../../panels/functional/IndeterminateCheckbox.tsx"
import { AbstractTable} from "../../tables/abstractTable.tsx";
import { RowSelection, createColumnHelper } from "@tanstack/react-table";
import { RPCard} from '../RPCard.tsx';
import { NetworkConnections } from './widgets/NetworkConnections.tsx';
import { TabsComponent } from '../Tabs.tsx';
import {Link, Route, Routes} from 'react-router';
import { MainSysInfo } from './MainSysInfo.tsx';
import type { PropsWithChildren } from 'react';
import { SystemServices } from './Services.tsx';


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

    const [activeTab, setActiveTab] = useState(0)

    const tabData = [
      {
        label:'Overview', content: <MainSysInfo />
      },
      {
        label:'Services', content: <SystemServices />
      }
    ]
    return (
      <div>
        <ul className="flex flex-row gap-4 border-b">
          <li>
            <div onClick={()=>{setActiveTab(0)}} className={activeTab == 0 ? "hover:cursor-pointer font-bold" : "hover:cursor-pointer hover:font-bold"}>Overview</div></li>
          <li>
            <div onClick={()=>{setActiveTab(1)}} className={activeTab == 1 ? "hover:cursor-pointer font-bold" :"hover:cursor-pointer hover:font-bold"}>Services</div></li>
        </ul>
        <div>
          {activeTab == 0 ? <MainSysInfo /> : ''}
          {activeTab == 1 ? <SystemServices /> : ''}
        </div>
      </div>
    )
      
    
}