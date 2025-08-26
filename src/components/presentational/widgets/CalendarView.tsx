// components/CalendarView.tsx
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "flowbite-react";
import {useRef, useEffect, useState} from 'react';

interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onDateClick: (day: number) => void;
  onMonthChange: (newDate: Date) => void;
}

export function CalendarView({ currentDate, selectedDate, onDateClick, onMonthChange }: CalendarViewProps) {
  const month = dayjs(currentDate);
  const daysInMonth = month.daysInMonth();
  const startDay = month.startOf("month").day();
  const [isopen, setIsopen] = useState(0)
  const today = dayjs()
  const selected = dayjs(selectedDate)
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];

  
  // Fill empty slots before first day
  for (let i = 0; i < startDay; i++) week.push(null);

  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);

  return (
    <div className="dark:text-slate-300" >
        <div className="flex justify-between items-center mb-2">
            <div  onClick={ () => onMonthChange(month.subtract(1,"month").toDate())} 
                className="p-1 rounded hover:bg-blue-200  dark:hover:bg-cyan-700 cursor-pointer">
                <ChevronLeft size={18} />
            </div>
            <span className="font-bold">
                {month.format("MMMM YYYY")}
            </span>
            <div  color="black"  onClick = { () => onMonthChange(month.add(1,"month").toDate())}
            className="p-1 rounded hover:bg-blue-200 dark:hover:bg-cyan-700 cursor-pointer" >
                <ChevronRight size={18} />
            </div>
        </div>
        {/* Days grid */}
         <div className="grid grid-cols-7 gap-1 text-center justify-between items-center dark:text-slate-300">
             {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="font-bold">{d}</div>
            ))}
             {weeks.map((week, i) =>
                week.map((day, j) => {
                    if (!day) return <div key={i + "-" + j}></div>;
                    const thisDay = month.date(day);
                    const isToday = thisDay.isSame(today, "day");
                    const isSelected = thisDay.isSame(selected, "day");
                    let classes = "p-0 m-0 rounded cursor-pointer transition-colors duration-200 dark:bg-transparent dark:hover:bg-cyan-700" ;
                    if (isSelected) {
                        classes += " border border-green-500 text-green-200 dark:text-cyan-200 font-semibold";
                    }else if (isToday){
                        classes += " border border-blue-500 text-blue-600 font-semibold";
                    } else {
                        classes += " hover:bg-blue-200";
                    }
                    return (
                        <div 
                            key={i + "-" + j}
                            className={classes}
                            onClick={() => onDateClick(day)}
                        >
                         {day}
                        </div>
                    )
                })
            )}
         </div>
    </div>
  );
}