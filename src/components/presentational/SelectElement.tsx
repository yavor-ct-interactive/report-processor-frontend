import { useEffect, useState } from "react"
export const RPSelect = ({name, onChange, options, label, value, disabled, classes = false}:any) => {
    console.log("Disabled is ",disabled)

    return (
        <div className="flex flex-row items-center gap-2">
            <div>
                {label}
            </div>
        <select name={name} id={name} onChange={onChange} value={value} disabled={disabled} 
                className={ classes ? classes : "bg-gray-50 border border-gray-300 disabled:bg-gray-100 disabled:cursor-default hover:cursor-pointer text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}>
                {options.map((item:any, index) => {
                    return (
                        <option  key={index} value={item.value} selected={item.is_selected} >{item.name}</option>
                    )
                })}
        </select>
        </div>

    )
}