import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { RPSelect } from '../presentational/SelectElement';
import axios from 'axios';
import dayjs from 'dayjs';
import { CustomButton } from '../presentational/Common/Buttons';

export interface SummarizedItems {
    value: string;
    count: number;
}
export interface SummarizedWinningsProps {
    criteria: string;
    items: SummarizedItems[];
}
export const SummarizedWinnings = ({criteria, items, onLoadData}:any) => {

    useEffect( () =>{
        console.log("Jinga  component", criteria, items)
    }, [criteria,items])
    return (
        <div>
            <div>{items.map( (item) => {
                return (
                    <div className="flex flex-row mb-2">
                        <div className='w-1/3'>{item.value}</div><div className='w-1/3'>{item.count}</div><div className='w-1/3'><Button color="alternate" onClick = { () => onLoadData?.(item.value)}>Load Data</Button></div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}
interface group_by {
    groupby: String
}
export const GroupByWinnings = ({groupby}:group_by) => {
    return (
        <div>
            <div>
                <div>{groupby}</div><div>Winnings</div><div>Action</div>
            </div>

        </div>
    )
}
export const ShowWinnings = ({data}) =>{
    console.log(data)
    return (
        <div>
            Winnings Component
        </div>
    )
}
const group_by_options = [
      { value: "operator", name: "Operator"},
      { value: "operator_endpoint", name: "Operator Endpoint"},
      { value: "game", name: "Game"},
      { value: "player", name: "Player"},
      { value: "currency", name: "Currency"},
    ]

interface SummarizedWinningsComponentProps {
  start_date: Date | string;
  end_date: Date | string;
  onLoadData?: (value: object) => void;
}
export const SummarizedWinningsComponent = ( {start_date, end_date, onLoadData}:SummarizedWinningsComponentProps) => {

    /*const {data} = useQuery({

    });*/
    const [groupby, setGroupby] = useState("operator")
    const getWinningsByGroup = async () =>{
        const data_url = "/backend/summarize-winnings";
        const formData = new FormData();
        formData.append("start_date", dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'));
        formData.append("end_date", dayjs(end_date).format('YYYY-MM-DD HH:mm:ss'));
        formData.append("criteria", groupby);
        const {data} = await axios.post(data_url,formData)
        return data
    }
    const {data,isLoading, error} = useQuery( {
        queryKey: [`groupwinnings` , groupby],
        queryFn: getWinningsByGroup
    })
    const Loading = () => {
        return <div>Loading...</div>
    }
    const Error = () => {
        return <div>Error</div>
    }
    useEffect( () => {
        console.log("Summarized winnings component init")

    })
    const handleChange = () => {
        console.log("handle change function")
    }
    if (isLoading){
        return <Loading />
    }
    if (error){
        return <Error />
    }
    const classes = "bg-gray-50 border border-gray-300 disabled:bg-gray-100 disabled:cursor-default hover:cursor-pointer text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    if (data){
        return (
            <div>
                    <RPSelect classes={classes} name="action-select" onChange={(e)=>{setGroupby(e.target.value)}} value={groupby} options = {group_by_options} label="Filter By: " />

                <hr className='mb-2 mt-2'/>
                <div>
                    <div className="flex flex-row mb-2 mt-2 mb-3 font-bold text-lg">
                    <div className='w-1/3 capitalize'>{data.criteria}</div><div className='w-1/3'>Winnings</div><div className='w-1/3'>Action</div>
                    </div>
                    <hr className='mb-3 mt-3'/>
                    {data.items.map( (item) => (
                        <div className="flex flex-row mb-2">
                        <div className='w-1/3'>{item.value}</div><div className='w-1/3'>{item.count}</div><div className='w-1/3'><CustomButton onClick = { () => onLoadData?.({item: item.value, criteria: data.criteria})}>Load Data</CustomButton></div>
                        </div>
                    ))}
                    
                </div>
            </div>
        )
    }

}