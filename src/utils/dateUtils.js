export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    // Handle different date formats
    const parts = dateString.split(' ');
    
    // Simple date without time (e.g., "12/1/2025") 
    if (parts.length === 1) {
      const [day, month, year] = parts[0].split('/');
      if (!day || !month || !year) return null;
      return new Date(year, month - 1, parseInt(day));
    }

    // Date with time (e.g., "15/1/2025, 4:37:28") 
    if (parts.length >= 2) {
      // Handle the comma in the date part
      const datePart = parts[0].replace(',', '');
      const timePart = parts[1];
      
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      
      if (!day || !month || !year || !hours || !minutes) return null;
      
      // Parse all components as integers
      const parsedDay = parseInt(day.trim(), 10);
      const parsedMonth = parseInt(month.trim(), 10);
      const parsedYear = parseInt(year.trim(), 10);
      const parsedHours = parseInt(hours.trim(), 10);
      const parsedMinutes = parseInt(minutes.trim(), 10);
      const parsedSeconds = seconds ? parseInt(seconds.trim(), 10) : 0;
      
      // Validate parsed values
      if (isNaN(parsedDay) || isNaN(parsedMonth) || isNaN(parsedYear) || 
          isNaN(parsedHours) || isNaN(parsedMinutes) || isNaN(parsedSeconds)) {
        return null;
      }
      
      return new Date(parsedYear, parsedMonth - 1, parsedDay, parsedHours, parsedMinutes, parsedSeconds);
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getRelativeTime = (dateString) => {
  try {
    const date = parseDate(dateString);
    if (!date) return 'N/A';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // For very recent events (less than a minute)
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    // For events within the last hour, show minutes and seconds
    } else if (diffInMinutes < 60) {
      const seconds = diffInSeconds % 60;
      return `${diffInMinutes}m ${seconds}s ago`;
    // For events within the last day, show hours and minutes
    } else if (diffInHours < 24) {
      const minutes = diffInMinutes % 60;
      return `${diffInHours}h ${minutes}m ago`;
    // For events within the last month, show days and hours
    } else if (diffInDays < 30) {
      const hours = diffInHours % 24;
      return `${diffInDays}d ${hours}h ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    } else {
      return `${diffInYears}y ago`;
    }
  } catch (error) {
    return 'N/A';
  }
};