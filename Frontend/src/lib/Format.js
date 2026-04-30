export const SEVERITY_STYLES = {
  low: "bg-slate-100 text-slate-700 border-slate-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

export const STATUS_STYLES = {
  investigating: "bg-amber-50 text-amber-700 border-amber-300",
  identified: "bg-blue-50 text-blue-700 border-blue-300",
  monitoring: "bg-indigo-50 text-indigo-700 border-indigo-300",
  resolved: "bg-green-50 text-green-700 border-green-300",
};

export const STATUS_DOT = {
  investigating: "bg-amber-500",
  identified: "bg-blue-500",
  monitoring: "bg-indigo-500",
  resolved: "bg-green-500",
};

export const SEVERITY_DOT = {
  low: "bg-slate-400",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export const SERVICE_STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded Performance",
  partial_outage: "Partial Outage",
  major_outage: "Major Outage",
  maintenance: "Under Maintenance",
};

export const SERVICE_STATUS_COLORS = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  partial_outage: "bg-orange-500",
  major_outage: "bg-red-500",
  maintenance: "bg-blue-500",
};

export function formatRelative(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatAbsolute(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleString();
}