import * as XLSX from 'xlsx';
import { NetworkInterface } from '../types/network';

export function exportToExcel(data: NetworkInterface[], filename: string = 'interface_inventory') {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      Device: item.device,
      Interface: item.interface,
      'Link Status': item.linkStatus,
      'Admin Status': item.adminStatus,
      'Oper Status': item.operStatus,
      'VLAN/Mode': item.vlanMode,
      Duplex: item.duplex,
      Speed: item.speed,
      Type: item.type,
      'IP Address': item.ipAddress,
      Description: item.description,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interfaces');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(data: NetworkInterface[], filename: string = 'interface_inventory') {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      Device: item.device,
      Interface: item.interface,
      'Link Status': item.linkStatus,
      'Admin Status': item.adminStatus,
      'Oper Status': item.operStatus,
      'VLAN/Mode': item.vlanMode,
      Duplex: item.duplex,
      Speed: item.speed,
      Type: item.type,
      'IP Address': item.ipAddress,
      Description: item.description,
    }))
  );

  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
