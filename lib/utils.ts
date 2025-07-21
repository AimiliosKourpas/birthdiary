import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Friend = {
  id?: string | number;
  name: string;
  birthday: string; // ISO date string (YYYY-MM-DD)
};

// Calculate days until next birthday and age on upcoming birthday
export function getNextBirthdayInfo(birthdayStr: string) {
  const today = new Date();
  const birthday = new Date(birthdayStr);

  const currentYear = today.getFullYear();
  const birthMonth = birthday.getMonth();
  const birthDay = birthday.getDate();

  // Birthday this year
  let nextBirthday = new Date(currentYear, birthMonth, birthDay);

  // If birthday already passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
  }

  // Calculate days left
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((nextBirthday.getTime() - today.getTime()) / msPerDay);

  // Calculate age they will turn on upcoming birthday
  const birthYear = birthday.getFullYear();
  const age = nextBirthday.getFullYear() - birthYear;

  return { daysLeft, age, nextBirthday };
}

export function sortByNameAsc(friends: Friend[]): Friend[] {
  return [...friends].sort((a, b) => a.name.localeCompare(b.name));
}

export function sortByNameDesc(friends: Friend[]): Friend[] {
  return [...friends].sort((a, b) => b.name.localeCompare(a.name));
}

export function sortByBirthday(friends: Friend[]): Friend[] {
  // Sort by month and day ignoring year (earliest birthday first)
  return [...friends].sort((a, b) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);

    const monthDayA = dateA.getMonth() * 100 + dateA.getDate();
    const monthDayB = dateB.getMonth() * 100 + dateB.getDate();

    return monthDayA - monthDayB;
  });
}

export function sortByLastBirthday(friends: Friend[]): Friend[] {
  // Sort by reverse order of birthday (month & day), i.e. latest birthday first in the year
  return [...friends].sort((a, b) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);

    const monthDayA = dateA.getMonth() * 100 + dateA.getDate();
    const monthDayB = dateB.getMonth() * 100 + dateB.getDate();

    return monthDayB - monthDayA;
  });
}
