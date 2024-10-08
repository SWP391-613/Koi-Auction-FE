export const getAuctionStatus = (
  startTime: string,
  endTime: string,
): string => {
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
