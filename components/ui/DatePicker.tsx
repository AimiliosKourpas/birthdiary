'use client';

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarDays, ChevronDown } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';

type CustomDatePickerProps = {
  name: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
};

type DateInputProps = {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
};

function toInputDate(date: Date | null) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function fromInputDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const BirthdayDateInput = forwardRef<HTMLButtonElement, DateInputProps>(
  ({ value, onClick, placeholder }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          'group flex min-h-12 w-full items-center justify-between rounded-full border-2 border-pink-200 bg-white px-5 py-3 text-left shadow-sm transition',
          'hover:border-pink-300 hover:bg-pink-50/50',
          'focus:outline-none focus:ring-4 focus:ring-pink-100'
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-500">
            <CalendarDays className="h-5 w-5" />
          </span>

          <span
            className={cn(
              'truncate text-sm font-black',
              value ? 'text-slate-800' : 'text-slate-400'
            )}
          >
            {value || placeholder || 'Choose a birthdate...'}
          </span>
        </span>

        <ChevronDown className="h-5 w-5 shrink-0 text-pink-400" />
      </button>
    );
  }
);

BirthdayDateInput.displayName = 'BirthdayDateInput';

export default function CustomDatePicker({
  name,
  selectedDate,
  onChange,
  placeholder = 'Choose a birthdate...',
  required = false,
}: CustomDatePickerProps) {
  return (
    <>
      {/* Mobile: use what everyone uses — native date picker */}
      <input
        type="date"
        name={name}
        value={toInputDate(selectedDate)}
        onChange={(e) => onChange(fromInputDate(e.target.value))}
        required={required}
        max={toInputDate(new Date())}
        className="block min-h-12 w-full rounded-full border-2 border-pink-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100 sm:hidden"
      />

      {/* Desktop/tablet: pretty calendar */}
      <div className="hidden sm:block">
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
          showPopperArrow={false}
          calendarClassName="birthdiary-calendar"
          popperClassName="birthdiary-datepicker-popper"
          wrapperClassName="w-full"
          shouldCloseOnSelect
          popperPlacement="bottom-start"
          customInput={<BirthdayDateInput placeholder={placeholder} />}
        />
      </div>
    </>
  );
}