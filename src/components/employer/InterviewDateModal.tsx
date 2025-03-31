"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DialogDescription } from "@radix-ui/react-dialog";

interface InterviewDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  deadlineDate: Date | null;
  isMobileDevice?: boolean;
}

export function InterviewDateModal({
  isOpen,
  onClose,
  onConfirm,
  deadlineDate,
  isMobileDevice,
}: InterviewDateModalProps) {
  // Initialize with current month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Store the current month for comparison (to prevent going back)
  const [initialMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth());
  });

  // Reset the calendar when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setCurrentMonth(new Date(now.getFullYear(), now.getMonth()));
      setSelectedDate(null);
    }
  }, [isOpen]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if previous month button should be disabled
  const isPrevMonthDisabled = () => {
    // Disable if current month is the initial month (current month when modal opened)
    return (
      currentMonth.getFullYear() === initialMonth.getFullYear() &&
      currentMonth.getMonth() === initialMonth.getMonth()
    );
  };

  // Check if next month button should be disabled
  const isNextMonthDisabled = () => {
    if (!deadlineDate) return false;

    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );

    // Compare year and month to determine if next month is beyond deadline
    if (nextMonth.getFullYear() > deadlineDate.getFullYear()) {
      return true;
    }

    if (
      nextMonth.getFullYear() === deadlineDate.getFullYear() &&
      nextMonth.getMonth() > deadlineDate.getMonth()
    ) {
      return true;
    }

    return false;
  };

  const handlePrevMonth = () => {
    if (!isPrevMonthDisabled()) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      );
    }
  };

  const handleNextMonth = () => {
    if (!isNextMonthDisabled()) {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      );
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create empty cells using Array.from instead of for loop
    const emptyCells = Array.from({ length: firstDay }, (_, i) => (
      <div key={`empty-${i}`} className="h-10 w-10"></div>
    ));

    // Create day cells using Array.from instead of for loop
    const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isPastDate = date < today;

      // Check if date is beyond deadline
      const isFutureDeadline = deadlineDate ? date > deadlineDate : false;
      const isDisabled = isPastDate || isFutureDeadline;

      return (
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(day)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm ${
            isSelected
              ? "bg-[#001630] text-white"
              : isDisabled
              ? "text-[#d6d7d9] cursor-not-allowed"
              : "hover:bg-[#eceef0]"
          }`}
          disabled={isDisabled}
          title={
            isDisabled ? (isPastDate ? "Past date" : "Beyond deadline") : ""
          }
        >
          {day}
        </button>
      );
    });

    // Combine empty cells and day cells
    return [...emptyCells, ...dayCells];
  };

  // Calendar content that will be used in both Dialog and Drawer
  const calendarContent = (
    <>
      <div className="border border-[#eceef0] rounded-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8"
              disabled={isPrevMonthDisabled()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
              disabled={isNextMonthDisabled()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="h-10 w-10 flex items-center justify-center text-[#68696b] text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
      </div>

      {deadlineDate && (
        <div className="mt-4 text-[#fd5964] text-[14px] font-normal leading-5 tracking-[0.21px]">
          *You must submit before{" "}
          {deadlineDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}

      <div className="bg-[#dbf7e7] rounded-lg p-4 mt-6">
        <p className="text-[#414447] text-[14px] font-normal leading-6 tracking-[0.21px]">
          Tip: Early submissions give an advantage over other candidates
        </p>
      </div>

      <div className="flex justify-between mt-6 gap-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 border-[#d6d7d9] text-[#202326]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate}
          className="flex-1 bg-[#001630] hover:bg-[#001630]/90 text-white"
        >
          Confirm Date
        </Button>
      </div>
    </>
  );

  // Render either Dialog or Drawer based on screen size
  if (isMobileDevice) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent
          side="bottom"
          className="px-8 pb-8 pt-5 max-h-[90vh] w-full"
          showCloseButton={false}
        >

          {/* Drawer handle/indicator */}
          <div className="absolute top-2 left-0 right-0 flex justify-center mt-4">
            <div className="w-12 h-1.5 rounded-full bg-[#e2e2e2]"></div>
          </div>

          <DrawerHeader className="p-0 pb-4 mt-6">
            <DrawerTitle className="text-xl font-semibold text-[#001630]">
              When can you complete the interview?
            </DrawerTitle>
            <p className="text-[#68696b] text-[14px] font-normal leading-6 tracking-[0.21px] mt-2">
              *This helps your employer know when to expect your submission
            </p>
          </DrawerHeader>
          {calendarContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-h2 text-[#001630]">
              When can you complete the interview?
            </DialogTitle>
          </div>
          <DialogDescription className="text-[#68696b] text-left text-[14px] font-normal leading-6 tracking-[0.21px] mt-2">
            *This helps employer know when to expect your submission
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">{calendarContent}</div>
      </DialogContent>
    </Dialog>
  );
}
