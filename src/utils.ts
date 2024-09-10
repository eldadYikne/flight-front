export function formatTime(time: string): string {
  // Split the string by the colon
  const [hours, minutes] = time.split(':');

  // Pad the hours with a leading zero if necessary
  const formattedHours = hours.length === 1 ? '0' + hours : hours;

  // Return the formatted time with the padded hours
  return `${formattedHours}:${minutes}`;
}
