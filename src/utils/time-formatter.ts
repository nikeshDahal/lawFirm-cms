import { DateTime } from 'luxon';

export function formatNotificationTime(createdAt: Date): string {
    const now = DateTime.utc();
    const createdTime = DateTime.fromJSDate(createdAt).toUTC();
    const diffInSeconds = now.diff(createdTime, 'seconds').seconds;
    const diffInMinutes = now.diff(createdTime, 'minutes').minutes;
    const diffInHours = now.diff(createdTime, 'hours').hours;
    const diffInDays = now.diff(createdTime, 'days').days;
    const diffInMonths = now.diff(createdTime, 'months').months;
    const diffInYears = now.diff(createdTime, 'years').years;

    if (diffInSeconds < 60) {
        return 'Less than a minute ago';
    } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minute${Math.floor(diffInMinutes) !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 30) {
        return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)} month${Math.floor(diffInMonths) !== 1 ? 's' : ''} ago`;
    } else {
        return createdTime.toFormat('dd-MM-yyyy'); // Fallback for dates older than a year
    }
}

export function convertTimestampToFloat(timestamp) {
    const date = new Date(timestamp);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format seconds to always have two digits and construct the float representation
    const data = parseFloat(`${minutes}.${seconds.toString().padStart(2, '0')}`);
    return parseFloat(data.toFixed(2)); // Ensure the result is formatted to two decimal places
}
export function convertAndPadDate(date) {
    return date?.replace(
        /T(\d{1,2}):(\d{1,2}):(\d{1,2})/,
        (_, h, m, s) =>
            `T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
    )
}

export function getExactMinutesAndSecond(date) {
    const replacedDate = convertAndPadDate(date);
    const [, minutes, seconds] = replacedDate.match(/T\d{2}:(\d{2}):(\d{2})/) || [];

    const result = minutes && seconds ? `${minutes}:${seconds}` : '00:00';
    return result;
}