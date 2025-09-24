import { getData } from "../presentational/Sysinfo/Functions"
import { useQuery } from "@tanstack/react-query"
import { get_platforms_url } from "../presentational/Sysinfo/Functions"
import Select, { components } from 'react-select';
import type {DropdownIndicatorProps} from 'react-select';
import { useEffect } from "react";

interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

const monthsOptions: readonly ColourOption[] = [
  { value: 'january', label: 'January', color: '#00B8D9'},
  { value: 'february', label: 'February', color: '#070707ff' },
  { value: 'march', label: 'March', color: '#5243AA' },
  { value: 'april', label: 'April', color: '#FF5630' },
  { value: 'may', label: 'May', color: '#FF8B00' },
  { value: 'june', label: 'June', color: '#FFC400' },
  { value: 'july', label: 'July', color: '#36B37E' },
  { value: 'august', label: 'August', color: '#00875A' },
  { value: 'september', label: 'September', color: '#253858' },
  { value: 'october', label: 'October', color: '#666666' },
  { value: 'november', label: 'November', color: '#666666' },
  { value: 'december', label: 'December', color: '#666666' },
];

export const CustomSelect = ({url, onChange, value, queryKey}) => {
    const {data, isPending, error, isSuccess} = useQuery({
      queryKey: queryKey,
      queryFn: () => getData({data_url: url}),      
    })
    
    const IsSuccess = () => {
        const selectOpts = [];
        if (isSuccess) {
            console.log(data)
            data.map( (item) => {
                selectOpts.push({value: item.id, label: item.name})
            })
            return (
            <Select
                defaultValue={selectOpts[0]}
                value={selectOpts.find((opt) => opt.value === value) || null}
                closeMenuOnSelect={true}
                options={selectOpts}
                onChange={onChange}
            />       
            )
        }
    }
    const IsError = () => {
        if (error){
            return (
                <div>
                    {error.message}
                </div>
            )
        }
    }
    const IsLoading = () =>{
        if (isPending) return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div>
            <IsLoading />
            <IsSuccess />
            <IsError />
        </div>
    )
}