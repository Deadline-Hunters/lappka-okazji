export function formatTimeAgo(iso: string, now = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);

  if (minutes < 1) return "przed chwilą";
  if (minutes < 60) return `${minutes} min temu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;

  const days = Math.floor(hours / 24);
  return days === 1 ? "1 dzień temu" : `${days} dni temu`;
}

// "Potwierdzone przez 1 łowcę / 5 łowców" - the accusative singular differs from the plural.
export function formatHunters(count: number) {
  return count === 1 ? "1 łowcę" : `${count} łowców`;
}
