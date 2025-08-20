import { Datepicker } from "flowbite-react";
import {CalendarView} from './CalendarView';
import { useRef, useEffect } from "react";

export function RPDatePicker() {
  return <Datepicker />;
}
// DateTimePicker.tsx
import { useState } from "react";
import dayjs from "dayjs"; // For date formatting

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  wrapperRef?: React.RefCallback<HTMLInputElement> | React.RefObject<HTMLInputElement> | undefined;
}

export function DateTimePicker({ value, onChange, wrapperRef }: DateTimePickerProps) {
  const initialDate = value || new Date();


  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [showPicker, setShowPicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(initialDate);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      console.log(wrapperRef)
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPicker(false); // close if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect( () => {
    selectedDate 
  })
  const handleDateClick = (day: number) => {
    const newDate = dayjs(selectedDate).date(day).toDate();
    setSelectedDate(newDate);
    onChange?.(newDate);
    setShowPicker(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = dayjs(selectedDate).hour(hours).minute(minutes).toDate();
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div className="relative w-64">
      {/* Input */}
      <input
        type="text"
        readOnly
        className="w-full border rounded-lg p-2 cursor-pointer"
        value={dayjs(selectedDate).format("YYYY-MM-DD HH:mm:ss")}
        onClick={() => setShowPicker(!showPicker)}
      />

      {/* Dropdown Picker */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-10 dark:bg-teal-900"
          ref={wrapperRef}>
          {/* Calendar */}
          <CalendarView
            currentDate={calendarMonth}
            onDateClick={handleDateClick}
            onMonthChange={setCalendarMonth}
            selectedDate={selectedDate}

          />

          {/* Time Selector */}
          <div className="mt-2">
            <input
              type="time"
              value={dayjs(selectedDate).format("HH:mm")}
              onChange={handleTimeChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}