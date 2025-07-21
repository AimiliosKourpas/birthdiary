export function getMonthDay(dateString: string) {
    const d = new Date(dateString);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  
  export function getDaysUntilNextBirthday(dateString: string) {
    const now = new Date();
    const birthday = new Date(dateString);
  
    // Next birthday year
    let next = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
  
    if (next < now) {
      next.setFullYear(next.getFullYear() + 1);
    }
  
    const diff = next.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  
  export function getCurrentAge(dateString: string) {
    const now = new Date();
    const birthday = new Date(dateString);
    let age = now.getFullYear() - birthday.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > birthday.getMonth() ||
      (now.getMonth() === birthday.getMonth() && now.getDate() >= birthday.getDate());
  
    if (!hasHadBirthdayThisYear) age--;
  
    return age;
  }
  
  export function applyFilter(friends: any[], filter: 'all' | 'thisMonth' | 'today') {
    if (filter === 'all') return friends;
  
    const now = new Date();
  
    if (filter === 'thisMonth') {
      return friends.filter((f) => {
        const bday = new Date(f.birthday);
        return bday.getMonth() === now.getMonth();
      });
    }
  
    if (filter === 'today') {
      return friends.filter((f) => {
        const bday = new Date(f.birthday);
        return bday.getMonth() === now.getMonth() && bday.getDate() === now.getDate();
      });
    }
  
    return friends;
  }
  
  export function applySort(friends: any[], sort: string) {
    const sorted = [...friends];
  
    switch (sort) {
      case 'nameAsc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
  
      case 'nameDesc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
  
      case 'birthdayMdAsc':
        sorted.sort(
          (a, b) =>
            getMonthDay(a.birthday).localeCompare(getMonthDay(b.birthday))
        );
        break;
  
      case 'birthdayMdDesc':
        sorted.sort(
          (a, b) =>
            getMonthDay(b.birthday).localeCompare(getMonthDay(a.birthday))
        );
        break;
  
      case 'ageAsc':
        sorted.sort((a, b) => getCurrentAge(a.birthday) - getCurrentAge(b.birthday));
        break;
  
      case 'ageDesc':
        sorted.sort((a, b) => getCurrentAge(b.birthday) - getCurrentAge(a.birthday));
        break;
    }
  
    return sorted;
  }
  