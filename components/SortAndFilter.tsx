'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownZA,
  ArrowUpAZ,
  CalendarCheck,
  CalendarDays,
  Filter,
  SortAsc,
  UserMinus,
  UserPlus,
} from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

type FilterType = 'all' | 'thisMonth' | 'today';

type SortType =
  | 'nameAsc'
  | 'nameDesc'
  | 'birthdayMdAsc'
  | 'birthdayMdDesc'
  | 'ageAsc'
  | 'ageDesc';

interface SortAndFilterProps {
  friends: Friend[];
  filter: FilterType;
  setFilter: (value: FilterType) => void;
  sort: SortType;
  setSort: (value: SortType) => void;
  onFilteredFriends: (filtered: Friend[]) => void;
  searchQuery: string;
}

const ICONS = {
  filter: Filter,
  calendarDays: CalendarDays,
  calendarCheck: CalendarCheck,
  arrowUpAZ: ArrowUpAZ,
  arrowDownZA: ArrowDownZA,
  userMinus: UserMinus,
  userPlus: UserPlus,
  sortAsc: SortAsc,
} as const;

const OPTIONS = {
  filter: [
    { label: 'All Friends', value: 'all', iconKey: 'filter' as keyof typeof ICONS },
    { label: 'This Month', value: 'thisMonth', iconKey: 'calendarDays' },
    { label: 'Today', value: 'today', iconKey: 'calendarCheck' },
  ] as { label: string; value: FilterType; iconKey: keyof typeof ICONS }[],
  sort: [
    { label: 'Name A-Z', value: 'nameAsc', iconKey: 'arrowUpAZ' },
    { label: 'Name Z-A', value: 'nameDesc', iconKey: 'arrowDownZA' },
    { label: 'Birthday Soon', value: 'birthdayMdAsc', iconKey: 'calendarDays' },
    { label: 'Birthday Later', value: 'birthdayMdDesc', iconKey: 'calendarCheck' },
    { label: 'Oldest', value: 'ageAsc', iconKey: 'userPlus' },
    { label: 'Youngest', value: 'ageDesc', iconKey: 'userMinus' },
  ] as { label: string; value: SortType; iconKey: keyof typeof ICONS }[],
};

function useDropdown<T extends string>(value: T, onChange: (v: T) => void) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    open,
    toggle: () => setOpen((o) => !o),
    select: (v: T) => {
      onChange(v);
      setOpen(false);
    },
    ref,
    value,
  };
}

function IconDropdown<T extends string>({
  dd,
  options,
  icon,
  label,
}: {
  dd: ReturnType<typeof useDropdown<T>>;
  options: { label: string; value: T; iconKey: keyof typeof ICONS }[];
  icon: React.ReactElement;
  label: string;
}) {
  return (
    <div className="relative" ref={dd.ref}>
      <button
        onClick={dd.toggle}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-purple-600 shadow-md ring-2 ring-purple-100 transition hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-lg"
        title={label}
        type="button"
        aria-label={label}
      >
        {icon}
      </button>

      {dd.open && (
        <ul className="absolute right-0 z-50 mt-3 min-w-[210px] overflow-hidden rounded-3xl bg-white p-2 shadow-xl ring-2 ring-pink-100">
          {options.map(({ label, value, iconKey }) => {
            const IconComp = ICONS[iconKey];

            return (
              <li
                key={value}
                onClick={() => dd.select(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dd.select(value);
                  }
                }}
                tabIndex={0}
                role="option"
                aria-selected={value === dd.value}
                className={`flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${
                  value === dd.value
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-pink-50'
                }`}
              >
                <IconComp className="h-4 w-4" />
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SortAndFilter({
  friends,
  filter,
  setFilter,
  sort,
  setSort,
  onFilteredFriends,
  searchQuery,
}: SortAndFilterProps) {
  const filterDD = useDropdown(filter, setFilter);
  const sortDD = useDropdown(sort, setSort);

  useEffect(() => {
    const today = new Date();

    const filtered = friends
      .filter((f) => {
        const bd = new Date(f.birthday);

        if (filter === 'today') {
          return bd.getDate() === today.getDate() && bd.getMonth() === today.getMonth();
        }

        if (filter === 'thisMonth') {
          return bd.getMonth() === today.getMonth();
        }

        return true;
      })
      .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const aD = new Date(a.birthday);
        const bD = new Date(b.birthday);

        switch (sort) {
          case 'nameAsc':
            return a.name.localeCompare(b.name);
          case 'nameDesc':
            return b.name.localeCompare(a.name);
          case 'birthdayMdAsc':
            return aD.getMonth() === bD.getMonth()
              ? aD.getDate() - bD.getDate()
              : aD.getMonth() - bD.getMonth();
          case 'birthdayMdDesc':
            return aD.getMonth() === bD.getMonth()
              ? bD.getDate() - aD.getDate()
              : bD.getMonth() - aD.getMonth();
          case 'ageAsc':
            return aD.getTime() - bD.getTime();
          case 'ageDesc':
            return bD.getTime() - aD.getTime();
          default:
            return 0;
        }
      });

    onFilteredFriends(filtered);
  }, [friends, filter, sort, searchQuery, onFilteredFriends]);

  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <IconDropdown
        dd={filterDD}
        options={OPTIONS.filter}
        icon={<Filter className="h-5 w-5" />}
        label="Filter friends"
      />

      <IconDropdown
        dd={sortDD}
        options={OPTIONS.sort}
        icon={<SortAsc className="h-5 w-5" />}
        label="Sort friends"
      />
    </div>
  );
}