export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    // Handle different date formats
    const parts = dateString.split(' ');
    
    // Simple date without time (e.g., "12/1/2025")
    if (parts.length === 1) {
      const [month, day, year] = parts[0].split('/');
      if (!month || !day || !year) return null;
      return new Date(year, month - 1, day);
    }

    // Date with time (e.g., "12/05/24 9:20 AM")
    if (parts.length === 3 || parts.length === 2) {
      const [datePart, timePart, meridiem] = parts;
      const [month, day, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      if (!month || !day || !year || !hours || !minutes) return null;
      
      let hour = parseInt(hours, 10);
      if (meridiem === 'PM' && hour !== 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0;
      
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(fullYear, month - 1, day, hour, minutes);
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

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    } else {
      return `${diffInYears}y ago`;
    }
  } catch (error) {
    return 'N/A';
  }
};