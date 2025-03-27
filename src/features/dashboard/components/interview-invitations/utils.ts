// Format date to readable string
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Capitalize first letter of each word
export const capitalizeString = (str: string | undefined) => {
  return str?.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Calculate days remaining until deadline
export const getDaysRemaining = (dateString: string) => {
  const today = new Date();
  const deadline = new Date(dateString);
  const timeDiff = deadline.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

// Get status badge color
export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-secondary-green text-greens-700';
    case 'accepted':
      return 'bg-secondary-green text-greens-700';
    case 'declined':
      return 'bg-greys-100 text-greys-700';
    case 'completed':
      return 'bg-secondary-green text-greens-700';
    case 'expired':
      return 'bg-greys-100 text-[#FF3B30]';
    default:
      return 'bg-grey-1 text-grey-7';
  }
};

// Generate list item class name based on processing state
export const getItemClassName = (isProcessing: boolean, isSelected: boolean) => {
  return `bg-white ${isProcessing ? 'opacity-70' : ''} ${isSelected ? 'bg-background-grey' : ''} p-5 rounded-lg border border-[#0000001A] transition-all relative`;
};

// Generate grid item class name based on processing state
export const getGridItemClassName = (isProcessing: boolean, isSelected: boolean) => {
  return `bg-white ${isProcessing ? 'opacity-70' : ''} ${isSelected ? 'bg-background-grey' : ''} p-4 rounded-lg shadow-sm border border-grey-1 cursor-pointer hover:shadow-md hover:bg-background-grey transition-all flex flex-col h-full justify-between relative`;
}; 

 export const formatDuration = (totalMinutes: number) => {
  if (totalMinutes < 60) {
    return `${totalMinutes} min${totalMinutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours} hr${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  }
};