import { Activity, CheckCircle, XCircle, AlertCircle, Server } from 'lucide-react';
import { SummaryData } from '../types/network';

interface SummaryCardsProps {
  summary: SummaryData;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Interface',
      value: summary.totalInterfaces,
      icon: Activity,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Connected',
      value: summary.totalConnected,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Down',
      value: summary.totalDown,
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      title: 'Admin Down',
      value: summary.totalAdminDown,
      icon: AlertCircle,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Device Unik',
      value: summary.uniqueDevices,
      icon: Server,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {summary.deviceSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan per Device</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total Interface
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Connected
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Down
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Admin Down
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.deviceSummary.map((device) => (
                  <tr key={device.device} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {device.device}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {device.total}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className="text-green-700 font-medium">{device.connected}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className="text-red-700 font-medium">{device.down}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className="text-orange-700 font-medium">{device.adminDown}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
