import { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { NetworkInterface, SortConfig } from '../types/network';
import { getStatusColor } from '../config/statusColors';
import { exportToExcel, exportToCSV } from '../utils/exportFile';

interface DataTableProps {
  data: NetworkInterface[];
}

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleSort = (column: keyof NetworkInterface) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.column === column) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ column, direction });
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.column || !sortConfig.direction) return 0;

    const aValue = String(a[sortConfig.column] || '');
    const bValue = String(b[sortConfig.column] || '');

    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const columns: { key: keyof NetworkInterface; label: string }[] = [
    { key: 'device', label: 'Device' },
    { key: 'interface', label: 'Interface' },
    { key: 'linkStatus', label: 'Link Status' },
    { key: 'adminStatus', label: 'Admin Status' },
    { key: 'operStatus', label: 'Oper Status' },
    { key: 'vlanMode', label: 'VLAN/Mode' },
    { key: 'duplex', label: 'Duplex' },
    { key: 'speed', label: 'Speed' },
    { key: 'type', label: 'Type' },
    { key: 'ipAddress', label: 'IP Address' },
    { key: 'description', label: 'Description' },
  ];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        Belum ada data. Silakan unggah file Excel atau CSV.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Data Interface</h2>
            <p className="text-sm text-gray-600 mt-1">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, sortedData.length)} dari {sortedData.length} interface
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV(sortedData)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => exportToExcel(sortedData)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => {
              const statusColor = getStatusColor(row.linkStatus, row.adminStatus, row.operStatus);
              return (
                <tr key={index} className={`hover:bg-gray-50 ${statusColor.bg}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.device}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.interface}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor.badge}`}>
                      {row.linkStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.adminStatus}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.operStatus}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.vlanMode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.duplex}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.speed}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                    {row.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <span className="text-sm text-gray-700">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
