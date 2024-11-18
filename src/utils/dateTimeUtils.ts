import {
  differenceInDays,
  format,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  parse,
  parseISO,
} from "date-fns";

export const getAuctionStatus = (
  startTime: string,
  endTime: string,
): string => {
  console.log(`Data received: ${startTime} - ${endTime}`);

  const now = new Date();

  // Use the Date constructor to parse ISO 8601 date string
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Check for invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Invalid date"; // Handle invalid date parsing
  }

  // If the current time is before the start time
  if (now < start) {
    return "Not started yet";
  }
  // If the auction is ongoing
  else if (now >= start && now < end) {
    return "Ongoing";
  }
  // If the auction has ended
  else {
    const diffTime = now.getTime() - end.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (diffDays < 1) {
      return "Ended today";
    } else if (diffDays < 30) {
      return `Ended ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `Ended ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `Ended ${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    }
  }
};

export const getAuctionStatusV2 = (
  startTime: string,
  endTime: string,
): string => {
  console.log(`Data received: ${startTime} - ${endTime}`);

  const now = new Date();

  // Parse dates using date-fns with the format "MMM d, yyyy 'at' h:mm a"
  const start = parse(startTime, "MMM d, yyyy 'at' h:mm a", new Date());
  const end = parse(endTime, "MMM d, yyyy 'at' h:mm a", new Date());

  // Check for invalid dates
  if (!isValid(start) || !isValid(end)) {
    return "Invalid date"; // Handle invalid date parsing
  }

  // If the current time is before the start time
  if (isBefore(now, start)) {
    return "Not started yet";
  }
  // If the auction is ongoing
  else if (isAfter(now, start) && isBefore(now, end)) {
    return "Ongoing";
  }
  // If the auction has ended
  else {
    const diffDays = differenceInDays(now, end);

    if (diffDays < 1) {
      return "Ended today";
    } else if (diffDays < 30) {
      return `Ended ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `Ended ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `Ended ${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    }
  }
};

export const convertToJavaLocalDateTime = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toString().replace("T", " ") + ":00.000000";
  }
  return date.replace("T", " ") + ":00.000000";
};

export function convertTimestamp(inputStr: string): string {
  // Replace 'T' with a space
  let result = inputStr.replace("T", " ");

  // Ensure milliseconds have six digits by appending '000' at the end
  result = result + "000";

  return result;
}

//2024-11-20T20:05 -> 2024-10-30T14:41:38.679
export function formatDateTimeString(dateTime: string): string {
  // Split date and time if there's a 'T'
  let [date, time] = dateTime.split("T");

  // Ensure the time has the seconds part ":38" and microseconds ".670000"
  if (!time.includes(":")) {
    time += ":00"; // Add seconds if missing
  }

  // Add the milliseconds and microseconds ".670000"
  if (!time.includes(".")) {
    time += ":00.670000"; // Add microseconds if missing
  }

  // Combine date and time with a space instead of 'T'
  return `${date} ${time}`;
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const formatDateV2 = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isYesterday(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else if (isTomorrow(date)) {
    return `${format(date, "MMM d, yyyy 'at' h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};
