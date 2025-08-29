import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';

export interface SummarizedItems {
    value: string;
    count: number;
}
export interface SummarizedWinningsProps {
    criteria: string;
    items: SummarizedItems[];
}
export const SummarizedWinnings = ({criteria, items, queryFunction}:any) => {

    useEffect( () =>{
        console.log("Jinga  component", criteria, items)
    }, [criteria,items])
    return (
        <div>
            <div>{items.map( (item) => {
                return (
                    <div className="flex flex-row mb-2">
                        <div className='w-1/3'>{item.value}</div><div className='w-1/3'>{item.count}</div><div className='w-1/3'><Button color="alternate" onClick = {queryFunction}>Load Data</Button></div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}