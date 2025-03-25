"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  maxDate?: string;
  minDate?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  maxDate,
  minDate,
  placeholder = "Select date",
  className,
  error,
}: DatePickerProps) {
  const [month, setMonth] = React.useState<Date>(
    value ? parseISO(value) : new Date()
  );

  // Generate years (from 1900 to 2100)
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  // Months array
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get days from previous month to fill the first row
    const prevMonthDays = [];
    const prevMonth = new Date(year, month, 0);
    const prevMonthDaysCount = prevMonth.getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: new Date(year, month - 1, prevMonthDaysCount - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill the last row
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDaysNeeded = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const days = getDaysInMonth(month);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleYearChange = (year: string) => {
    const newDate = new Date(month);
    newDate.setFullYear(Number.parseInt(year));
    setMonth(newDate);
  };

  const handleMonthChange = (monthValue: string) => {
    const newDate = new Date(month);
    newDate.setMonth(Number.parseInt(monthValue));
    setMonth(newDate);
  };

  const handlePrevMonth = () => {
    setMonth(subMonths(month, 1));
  };

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  const handleSelectDate = (day: { date: Date; isCurrentMonth: boolean }) => {
    // Check if date is within allowed range
    if (maxDate && day.date > parseISO(maxDate)) return;
    if (minDate && day.date < parseISO(minDate)) return;

    // Format as YYYY-MM-DD for form value
    const formattedDate = format(day.date, "yyyy-MM-dd");
    onChange(formattedDate);
  };

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > parseISO(maxDate)) return true;
    if (minDate && date < parseISO(minDate)) return true;
    return false;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-[50px] font-sf-pro text-base leading-6 tracking-[0.24px]",
            !value && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(parseISO(value), "MMMM d, yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 gap-2">
            <Select
              value={month.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isDisabled = isDateDisabled(day.date);
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => !isDisabled && handleSelectDate(day)}
                  disabled={isDisabled}
                  className={cn(
                    "h-9 w-9 rounded-md text-center text-sm p-0 hover:bg-gray-100 focus:outline-none",
                    !day.isCurrentMonth && "text-gray-400",
                    value &&
                      day.date.toDateString() ===
                        parseISO(value).toDateString() &&
                      "bg-[#00183D] hover:bg-[#062549] text-white",
                    new Date().toDateString() === day.date.toDateString() &&
                      day.isCurrentMonth &&
                      !value &&
                      "border border-gray-300",
                    isDisabled &&
                      "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
