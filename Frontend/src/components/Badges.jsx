import React from "react";
import { SEVERITY_STYLES, SEVERITY_DOT, STATUS_STYLES, STATUS_DOT } from "../lib/Format";

export const SeverityBadge = ({ severity, withDot = true, ...rest }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold border ${SEVERITY_STYLES[severity] || SEVERITY_STYLES.Medium}`}
    data-testid={`severity-badge-${severity?.toLowerCase()}`}
    {...rest}
  >
    {withDot && (
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[severity] || SEVERITY_DOT.medium} ${
          severity === "critical" || severity === "high" ? "pulse-dot" : ""
        }`}
      />
    )}
    {severity}
  </span>
);

export const StatusPill = ({ status, ...rest }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.Investigating}`}
    data-testid={`status-pill-${status?.toLowerCase()}`}
    {...rest}
  >
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.investigating} ${
        status !== "resolved" ? "pulse-dot" : ""
      }`}
    />
    {status}
  </span>
);