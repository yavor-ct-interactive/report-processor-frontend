import React from "react";

export const RPCard = ({ title, rows, wrap = false }) => {
  return (
    <div className="w-96 h-64 p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-teal-900">
        <div className="text-center border-b-1">{title}</div>
        {rows.map((row:any, index:any) => (
          <div key={index} className={`w-full ${wrap ? 'flex flex-wrap' : 'flex-nowrap'} items-center justify-between`}>
              <div className="font-medium text-gray-700 dark:text-gray-300">{row.label}</div>
              <div className="text-gray-900 dark:text-white">{row.value}</div>
          </div>
        ))
    }
   </div>
  );
};
