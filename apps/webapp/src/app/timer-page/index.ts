export function formatSolveTime(millis: number): string {
  const seconds = ('00' + (Math.floor(millis / 1000) % 60).toFixed(0)).slice(
    -2
  );
  const minutes = ('00' + Math.floor(millis / (1000 * 60)).toFixed(0)).slice(
    -2
  );
  const millisStr = (millis % 1000)
    .toString()
    .split('.')[0]
    .padStart(3, '0')
    .slice(-3)
    .substring(0, 2);

  return `${minutes}:${seconds}.${millisStr}`;
}
