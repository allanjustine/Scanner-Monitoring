import { formatDate, formatDistanceToNowStrict, isPast, isToday } from 'date-fns';

export const formatDueDate = (date: string) => {
    const due = new Date(date);

    if (isPast(due)) {
        return 'Expired';
    }

    if (isToday(due)) {
        return `Due today at ${formatDate(due, 'hh:mm a')}`;
    }

    return formatDistanceToNowStrict(date);
};
