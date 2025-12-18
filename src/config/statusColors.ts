export const statusColorConfig = {
  linkStatus: {
    connected: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      border: 'border-green-200',
    },
    notconnect: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      badge: 'bg-gray-100 text-gray-800',
      border: 'border-gray-200',
    },
    down: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
      border: 'border-red-200',
    },
    'admin down': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
      border: 'border-orange-200',
    },
    disabled: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
      border: 'border-orange-200',
    },
  },
};

export function getStatusColor(linkStatus: string, adminStatus: string, operStatus: string) {
  const lowerLinkStatus = linkStatus?.toLowerCase() || '';
  const lowerAdminStatus = adminStatus?.toLowerCase() || '';
  const lowerOperStatus = operStatus?.toLowerCase() || '';

  if (lowerLinkStatus === 'connected' || lowerOperStatus === 'up') {
    return statusColorConfig.linkStatus.connected;
  }

  if (lowerAdminStatus.includes('down') || lowerLinkStatus === 'admin down' || lowerLinkStatus === 'disabled') {
    return statusColorConfig.linkStatus['admin down'];
  }

  if (lowerLinkStatus === 'notconnect' || lowerOperStatus === 'notconnect') {
    return statusColorConfig.linkStatus.notconnect;
  }

  if (lowerLinkStatus === 'down' || lowerOperStatus === 'down') {
    return statusColorConfig.linkStatus.down;
  }

  return statusColorConfig.linkStatus.notconnect;
}
