import * as XLSX from 'xlsx';
import { NetworkInterface } from '../types/network';

const COLUMN_MAPPING: Record<string, keyof NetworkInterface> = {
  device: 'device',
  interface: 'interface',
  'link status': 'linkStatus',
  linkstatus: 'linkStatus',
  'admin status': 'adminStatus',
  adminstatus: 'adminStatus',
  'oper status': 'operStatus',
  operstatus: 'operStatus',
  'vlan/mode': 'vlanMode',
  vlan: 'vlanMode',
  mode: 'vlanMode',
  duplex: 'duplex',
  speed: 'speed',
  type: 'type',
  'ip address': 'ipAddress',
  ipaddress: 'ipAddress',
  ip: 'ipAddress',
  description: 'description',
  desc: 'description',
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().trim().replace(/[_\s]+/g, ' ');
}

function mapRowToInterface(row: Record<string, string>, headers: string[]): NetworkInterface | null {
  const mapped: Partial<NetworkInterface> = {};

  headers.forEach((header) => {
    const normalizedHeader = normalizeHeader(header);
    const targetKey = COLUMN_MAPPING[normalizedHeader];

    if (targetKey) {
      mapped[targetKey] = String(row[header] || '').trim();
    }
  });

  if (!mapped.device && !mapped.interface) {
    return null;
  }

  return {
    device: mapped.device || '',
    interface: mapped.interface || '',
    linkStatus: mapped.linkStatus || '',
    adminStatus: mapped.adminStatus || '',
    operStatus: mapped.operStatus || '',
    vlanMode: mapped.vlanMode || '',
    duplex: mapped.duplex || '',
    speed: mapped.speed || '',
    type: mapped.type || '',
    ipAddress: mapped.ipAddress || '',
    description: mapped.description || '',
  };
}

export async function parseExcelFile(file: File): Promise<NetworkInterface[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve([]);
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        if (!workbook.SheetNames.length) {
          resolve([]);
          return;
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: Record<string, string>[] = XLSX.utils.sheet_to_json(firstSheet, { raw: false });

        if (!jsonData || jsonData.length === 0) {
          resolve([]);
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const interfaces: NetworkInterface[] = [];

        jsonData.forEach((row) => {
          const mapped = mapRowToInterface(row, headers);
          if (mapped) {
            interfaces.push(mapped);
          }
        });

        resolve(interfaces);
      } catch (error) {
        reject(new Error(`Format Excel tidak valid: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsBinaryString(file);
  });
}

export async function parseCSVFile(file: File): Promise<NetworkInterface[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          resolve([]);
          return;
        }

        const workbook = XLSX.read(text, { type: 'string' });
        if (!workbook.SheetNames.length) {
          resolve([]);
          return;
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: Record<string, string>[] = XLSX.utils.sheet_to_json(firstSheet, { raw: false });

        if (!jsonData || jsonData.length === 0) {
          resolve([]);
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const interfaces: NetworkInterface[] = [];

        jsonData.forEach((row) => {
          const mapped = mapRowToInterface(row, headers);
          if (mapped) {
            interfaces.push(mapped);
          }
        });

        resolve(interfaces);
      } catch (error) {
        reject(new Error(`Format CSV tidak valid: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
}

export async function parseFile(file: File): Promise<NetworkInterface[]> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv')) {
    return parseCSVFile(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return parseExcelFile(file);
  } else {
    throw new Error('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv');
  }
}
