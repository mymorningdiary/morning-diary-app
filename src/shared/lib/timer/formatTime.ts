export function formatSecondsToMMSS(totalSeconds: number) {
  const clamped = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${mm}:${ss}`;
}
