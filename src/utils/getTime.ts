const addZero: (times: string) => string = (times) =>
    times.length === 1 ? `0${times}` : times;

export function getTime(date: string): string {
    const sentAt = new Date(date);
    let hours = sentAt.getHours().toString();
    let minutes = sentAt.getMinutes().toString();
    hours = addZero(hours);
    minutes = addZero(minutes);
    return `${hours}:${minutes}`;
}
