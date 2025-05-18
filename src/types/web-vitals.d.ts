// Type definitions for web-vitals
declare module 'web-vitals' {
  export interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
    entries: PerformanceEntry[];
  }

  export type ReportHandler = (metric: Metric) => void;

  export function onLCP(callback: ReportHandler): void;
  export function onFID(callback: ReportHandler): void;
  export function onCLS(callback: ReportHandler): void;
  export function onFCP(callback: ReportHandler): void;
  export function onTTFB(callback: ReportHandler): void;
}
