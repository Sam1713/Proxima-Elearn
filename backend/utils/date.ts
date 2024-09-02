import { formatDistanceToNow } from 'date-fns';

// Utility function to format the timestamp
export const formatTimestamp = (timestamp: Date): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
      