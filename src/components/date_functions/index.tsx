import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';

export function currentDay(date = new Date()){
    const startOfToday = dayjs().startOf('day'); // Today at 00:00:00
    const now = dayjs(); // Current time
    return {
    start: startOfToday.toDate(),
    end: now.toDate()
    }
}
export function previousDay(date = new Date()){
    const startOfToday = dayjs().startOf('day'); // Today at 00:00:00
    const startOfYesterday = startOfToday.subtract(1, 'day'); // Yesterday at 00:00:00
    return {
    start: startOfYesterday.toDate(),
    end: startOfToday.toDate(),
    }

}
export function currentWeek(date = new Date()) {
    dayjs.extend(isoWeek); // Enables ISO week support (Monday as start)

    const now = dayjs(); // Current time
    const startOfWeek = now.startOf('isoWeek'); // Monday at 00:00:00
    return {
    start: startOfWeek.toDate(),
    end: now.toDate()
    }

}

export function previousWeek(){
    dayjs.extend(isoWeek);

    // Get start and end of previous week
    const startOfPreviousWeek = dayjs().startOf('isoWeek').subtract(1, 'week');
    const endOfPreviousWeek = dayjs().startOf('isoWeek').subtract(1, 'day').endOf('day');
    return {
    start: startOfPreviousWeek.toDate(), 
    end: endOfPreviousWeek.toDate()
    }

}
export function currentMonth(date = new Date()){
    const startOfMonth = dayjs().startOf('month'); // e.g. 2025-08-01 00:00:00
    const now = dayjs(); // current date and time

    console.log('Start of month:', startOfMonth.format('YYYY-MM-DD HH:mm:ss'));
    console.log('Now:', now.format('YYYY-MM-DD HH:mm:ss'));
    return {
    start: startOfMonth.toDate(),
    end: now.toDate()
    }

}
export function previousMonth(date = new Date()){
    const startOfCurrentMonth = dayjs().startOf('month'); // e.g. Sep 1, 2025
    const startOfPreviousMonth = startOfCurrentMonth.subtract(1, 'month'); // e.g. Aug 1, 2025
    return {
    start: startOfPreviousMonth.toDate(),
    end: startOfCurrentMonth.toDate()
    }
}

