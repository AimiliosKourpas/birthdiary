// components/ui/DatePicker.tsx
"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

export default function CustomDatePicker({
  name,
  selectedDate,
  onChange,
  placeholder = "Select birthdate",
  required = false,
}: {
  name: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      maxDate={new Date()}
      required={required}
      customInput={
        <input
          readOnly // disables keyboard popup on mobile
          inputMode="none" // hint for mobile to skip keyboard
          className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        />
      }
    />
  );
}
