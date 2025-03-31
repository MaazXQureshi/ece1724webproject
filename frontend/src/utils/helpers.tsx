export function formatDate(isoString: string) {
  const date = new Date(isoString);
  const dateString = date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return dateString;
}

export function formatTime(isoString: string) {
  const date = new Date(isoString);
  const timeString = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  return timeString;
}