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

async function parseTXTFile(file: File): Promise<NetworkInterface[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          resolve([]);
          return;
        }

        const interfaces: NetworkInterface[] = [];

        if (text.includes('show int status') || text.includes('Port') && text.includes('Status') && text.includes('Vlan')) {
          const parsed = parseCiscoOutput(text);
          resolve(parsed);
          return;
        }

        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length === 0) {
          resolve([]);
          return;
        }

        const firstLine = lines[0];
        let delimiter = ',';

        if (firstLine.includes('\t')) {
          delimiter = '\t';
        } else if (firstLine.includes(';')) {
          delimiter = ';';
        } else if (firstLine.includes('|')) {
          delimiter = '|';
        }

        const headers = firstLine.split(delimiter).map(h => h.trim());
        if (headers.length < 1) {
          resolve([]);
          return;
        }

        for (let i = 1; i < lines.length; i++) {
          const trimmedLine = lines[i].trim();
          if (!trimmedLine) continue;

          const values = trimmedLine.split(delimiter).map(v => v.trim());
          const row: Record<string, string> = {};

          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          const mapped = mapRowToInterface(row, headers);
          if (mapped) {
            interfaces.push(mapped);
          }
        }

        resolve(interfaces);
      } catch (error) {
        reject(new Error(`Format TXT tidak valid: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
}

function parseCiscoOutput(text: string): NetworkInterface[] {
  const interfaces: NetworkInterface[] = [];
  const lines = text.split(/\r?\n/);
  const deviceMatch = text.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/);
  const device = deviceMatch ? deviceMatch[1] : 'Unknown';

  let interfaceMap: Map<string, Partial<NetworkInterface>> = new Map();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.includes('show int status')) {
      for (let j = i + 2; j < lines.length; j++) {
        const dataLine = lines[j];
        const dataTrimmed = dataLine.trim();

        if (!dataTrimmed || dataTrimmed.startsWith('###') || dataTrimmed.match(/^DRC-[A-Z0-9]/)) {
          break;
        }

        if (dataLine.match(/^[A-Za-z]/)) {
          const parsed = parseShowIntStatusLine(dataLine);
          if (parsed && parsed.interface) {
            const key = parsed.interface;
            if (!interfaceMap.has(key)) {
              interfaceMap.set(key, {
                device,
                interface: parsed.interface,
                description: parsed.description || '',
              });
            }
            const existing = interfaceMap.get(key)!;
            existing.linkStatus = parsed.status || existing.linkStatus;
            existing.vlanMode = parsed.vlan || existing.vlanMode;
            existing.duplex = parsed.duplex || existing.duplex;
            existing.speed = parsed.speed || existing.speed;
            existing.type = parsed.type || existing.type;
          }
        }
      }
      i += 100;
    }

    if (trimmed.includes('show int des')) {
      for (let j = i + 2; j < lines.length; j++) {
        const dataLine = lines[j];
        const dataTrimmed = dataLine.trim();

        if (!dataTrimmed || dataTrimmed.startsWith('###') || dataTrimmed.match(/^DRC-[A-Z0-9]/)) {
          break;
        }

        if (dataLine.match(/^[A-Za-z]/)) {
          const parsed = parseInterfaceDesLine(dataLine);
          if (parsed && parsed.interface) {
            const key = parsed.interface;
            if (!interfaceMap.has(key)) {
              interfaceMap.set(key, {
                device,
                interface: parsed.interface,
                description: parsed.description || '',
              });
            }
            const existing = interfaceMap.get(key)!;
            existing.adminStatus = parsed.adminStatus || existing.adminStatus;
            existing.operStatus = parsed.operStatus || existing.operStatus;
            existing.description = parsed.description || existing.description;
          }
        }
      }
      i += 100;
    }
  }

  interfaceMap.forEach((data) => {
    const mapped = mapRowToInterface(
      {
        device: data.device || '',
        interface: data.interface || '',
        'link status': data.linkStatus || '',
        'admin status': data.adminStatus || '',
        'oper status': data.operStatus || '',
        vlan: data.vlanMode || '',
        duplex: data.duplex || '',
        speed: data.speed || '',
        type: data.type || '',
        description: data.description || '',
      },
      ['device', 'interface', 'link status', 'admin status', 'oper status', 'vlan', 'duplex', 'speed', 'type', 'description']
    );
    if (mapped) {
      interfaces.push(mapped);
    }
  });

  return interfaces;
}

function parseShowIntStatusLine(line: string): Partial<NetworkInterface> & { status?: string; vlan?: string; duplex?: string; speed?: string; type?: string } | null {
  const parts = line.split(/\s{2,}/).map(p => p.trim());

  if (parts.length < 4) return null;

  const interfaceName = parts[0];

  if (!interfaceName.match(/^[A-Za-z]/)) return null;

  const description = parts[1] || '';
  const status = parts[2] || '';
  const vlan = parts[3] || '';
  const duplex = parts[4] || '';
  const speed = parts[5] || '';
  const type = parts.slice(6).join(' ') || '';

  return {
    interface: interfaceName,
    description,
    status,
    vlan,
    duplex,
    speed,
    type,
  };
}


function parseInterfaceDesLine(line: string): { interface?: string; adminStatus?: string; operStatus?: string; description?: string } | null {
  const parts = line.split(/\s+/);
  if (parts.length < 3) return null;

  const interfaceName = parts[0];
  if (!interfaceName.match(/^[A-Za-z]/)) return null;

  const adminStatus = parts[1];
  const operStatus = parts[2];
  const description = parts.slice(3).join(' ');

  return {
    interface: interfaceName,
    adminStatus,
    operStatus,
    description,
  };
}

export async function parseFile(file: File): Promise<NetworkInterface[]> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv')) {
    return parseCSVFile(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return parseExcelFile(file);
  } else if (fileName.endsWith('.txt')) {
    return parseTXTFile(file);
  } else {
    throw new Error('Format file tidak didukung. Gunakan .xlsx, .xls, .csv, atau .txt');
  }
}
