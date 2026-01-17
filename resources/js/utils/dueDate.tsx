import { formatDate, formatDistanceToNowStrict, isPast, isToday } from 'date-fns';

export const dueDate = (date: string) => {
    const due = new Date(date);

    if (isPast(due)) {
        return <span className="text-red-500">Expired</span>;
    }

    if (isToday(due)) {
        return <span className="animate-pulse text-green-500">Due today at {formatDate(due, 'hh:mm a')}</span>;
    }

    return <span className="text-yellow-200">{formatDistanceToNowStrict(date)} left</span>;
};
