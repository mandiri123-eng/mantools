export interface NetworkInterface {
  device: string;
  interface: string;
  linkStatus: string;
  adminStatus: string;
  operStatus: string;
  vlanMode: string;
  duplex: string;
  speed: string;
  type: string;
  ipAddress: string;
  description: string;
}

export interface FilterState {
  devices: string[];
  linkStatuses: string[];
  adminStatuses: string[];
  vlanModes: string[];
  types: string[];
  searchText: string;
}

export interface SummaryData {
  totalInterfaces: number;
  totalConnected: number;
  totalDown: number;
  totalAdminDown: number;
  uniqueDevices: number;
  deviceSummary: DeviceSummary[];
}

export interface DeviceSummary {
  device: string;
  total: number;
  connected: number;
  down: number;
  adminDown: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  column: keyof NetworkInterface | null;
  direction: SortDirection;
}
