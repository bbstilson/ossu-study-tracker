export function formatDuration(duration) {
  const durationMinutes = duration / 1000 / 60;

  const remMinutes = Math.floor(durationMinutes % 60);
  const hours = Math.floor(durationMinutes / 60);

  return hours
    ? `${hours}h ${remMinutes}m`
    : `${remMinutes}m`;
}
