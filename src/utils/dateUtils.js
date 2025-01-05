export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return new Date();
  }

  try {
    // Parse date in format "DD/MM/YYYY HH:mm:ss"
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) return new Date();

    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');

    // Validate parts
    if (!day || !month || !year || !hours || !minutes || !seconds) {
      return new Date();
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
};

export const getRelativeTime = (dateString) => {
  try {
    const date = parseDate(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return 'unknown';
  }
};