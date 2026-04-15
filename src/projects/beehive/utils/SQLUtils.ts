export function nowSqlTimestamp() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      `${d.getFullYear()}-` +
      `${pad(d.getMonth() + 1)}-` +
      `${pad(d.getDate())} ` +
      `${pad(d.getHours())}:` +
      `${pad(d.getMinutes())}:` +
      `${pad(d.getSeconds())}`
    );
}

export function dateToSqlTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())} ` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`
  );
}

export function twoWeeksAgoSqlTimestamp() {
    const d = new Date();
    d.setDate(d.getDate() - 14); // subtract 14 days

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      `${d.getFullYear()}-` +
      `${pad(d.getMonth() + 1)}-` +
      `${pad(d.getDate())} ` +
      `${pad(d.getHours())}:` +
      `${pad(d.getMinutes())}:` +
      `${pad(d.getSeconds())}`
    );
}

export function howLongSinceTimestamp(timestamp: string | undefined): string | null {
  if (!timestamp) return null;

  const now = new Date();
  const past = new Date(timestamp);
  if (isNaN(past.getTime())) return null;

  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
