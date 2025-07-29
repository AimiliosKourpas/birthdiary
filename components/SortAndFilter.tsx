import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpAZ,
  ArrowDownZA,
  CalendarDays,
  CalendarCheck,
  UserMinus,
  UserPlus,
  Filter,
  SortAsc,
} from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  birthday: string;
}

interface SortAndFilterProps {
    friends: Friend[];
    filter: FilterType;
    setFilter: (value: FilterType) => void;
    sort: SortType;
    setSort: (value: SortType) => void;
    onFilteredFriends: (filtered: Friend[]) => void;
    searchQuery: string; // 👈 add this
  }
  

type FilterType = 'all' | 'thisMonth' | 'today';
type SortType =
  | 'nameAsc'
  | 'nameDesc'
  | 'birthdayMdAsc'
  | 'birthdayMdDesc'
  | 'ageAsc'
  | 'ageDesc';

// Map string keys to icon components
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
    { label: 'Birthdays This Month', value: 'thisMonth', iconKey: 'calendarDays' },
    { label: 'Birthdays Today', value: 'today', iconKey: 'calendarCheck' },
  ] as { label: string; value: FilterType; iconKey: keyof typeof ICONS }[],
  sort: [
    { label: 'Name A-Z', value: 'nameAsc', iconKey: 'arrowUpAZ' },
    { label: 'Name Z-A', value: 'nameDesc', iconKey: 'arrowDownZA' },
    { label: 'Birthday ↑', value: 'birthdayMdAsc', iconKey: 'calendarDays' },
    { label: 'Birthday ↓', value: 'birthdayMdDesc', iconKey: 'calendarCheck' },
    { label: 'Oldest', value: 'ageAsc', iconKey: 'userPlus' },
    { label: 'Youngest', value: 'ageDesc', iconKey: 'userMinus' },
  ] as { label: string; value: SortType; iconKey: keyof typeof ICONS }[],
};

function useDropdown<T extends string>(value: T, onChange: (v: T) => void) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
}: {
  dd: ReturnType<typeof useDropdown<T>>;
  options: { label: string; value: T; iconKey: keyof typeof ICONS }[];
  icon: React.ReactElement;
}) {
  return (
    <div className="relative" ref={dd.ref}>
      <button
        onClick={dd.toggle}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-sm"
        title="Filter / Sort"
      >
        {icon}
      </button>

      {dd.open && (
        <ul className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto min-w-[180px]">
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
                className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-2 transition-colors
                ${value === dd.value 
                  ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600' 
                  : 'hover:bg-blue-100 text-gray-800'}
              `}
              
              >
                <IconComp className="w-4 h-4" />
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
        if (filter === 'today')
          return bd.getDate() === today.getDate() && bd.getMonth() === today.getMonth();
        if (filter === 'thisMonth') return bd.getMonth() === today.getMonth();
        return true;
      })
      .filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
<div className="flex items-center gap-3 w-full sm:w-auto">
      <IconDropdown dd={filterDD} options={OPTIONS.filter} icon={<Filter className="w-5 h-5" />} />
      <IconDropdown dd={sortDD} options={OPTIONS.sort} icon={<SortAsc className="w-5 h-5" />} />
    </div>
  );
}
