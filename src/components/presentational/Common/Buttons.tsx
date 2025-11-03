import React, {FC} from 'react';
import { Button } from 'flowbite-react';
import type { PropsWithChildren } from 'react';
import type { Props } from 'react-select';


export const CustomButton:FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <Button className="focus:ring-0 border border-slate-300 focus:border-1 active:border-1 bg-white dark:bg-teal-900 
        dark:hover:bg-teal-700 rounded-lg text-gray-700 dark:text-white hover:bg-slate-200 p-2 h-10"
        {...props} >
      {children}
    </Button>
  );
};
export const FilterButton:FC<PropsWithChildren> = ({ children, ...props}) => {
  return (
    <Button className="w-[100%] align-center m-auto border border-gray-300 focus:ring-1 focus:border-black active:border-1 bg-white dark:bg-teal-900 
        dark:hover:bg-teal-700 rounded-lg text-gray-700 dark:text-white hover:bg-slate-200 p-2 h-10"
        {...props} >
      {children}
    </Button>
  )
}