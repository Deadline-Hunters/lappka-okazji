import { Badge } from "@/components/Badge";

import type { SubmissionStatus } from "../types";

interface Props {
  status: SubmissionStatus;
  confirmationsCount: number;
}

export function SubmissionStatusBadge({ status, confirmationsCount }: Props) {
  const isActive = status === "active";
  const statusLabel = isActive ? "Aktywna" : "Wygasła";

  return (
    <Badge
      label={`${statusLabel} (+${confirmationsCount} 👍)`}
      tone={isActive ? "primary" : "muted"}
      size="md"
      dot={isActive}
      icon={isActive ? undefined : "refresh-outline"}
      accessibilityLabel={`Status: ${statusLabel}, ${confirmationsCount} potwierdzeń`}
    />
  );
}
