import { Search, X } from 'lucide-react';
import { FilterState } from '../types/network';

interface FilterSectionProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  availableDevices: string[];
  availableLinkStatuses: string[];
  availableAdminStatuses: string[];
  availableVlanModes: string[];
  availableTypes: string[];
}

export default function FilterSection({
  filter,
  onFilterChange,
  availableDevices,
  availableLinkStatuses,
  availableAdminStatuses,
  availableVlanModes,
  availableTypes,
}: FilterSectionProps) {
  const handleMultiSelectChange = (
    field: keyof Pick<FilterState, 'devices' | 'linkStatuses' | 'adminStatuses' | 'vlanModes' | 'types'>,
    value: string
  ) => {
    const currentValues = filter[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({ ...filter, [field]: newValues });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, searchText: value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      devices: [],
      linkStatuses: [],
      adminStatuses: [],
      vlanModes: [],
      types: [],
      searchText: '',
    });
  };

  const hasActiveFilters =
    filter.devices.length > 0 ||
    filter.linkStatuses.length > 0 ||
    filter.adminStatuses.length > 0 ||
    filter.vlanModes.length > 0 ||
    filter.types.length > 0 ||
    filter.searchText !== '';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filter Data</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Hapus Semua Filter
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pencarian
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filter.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari interface, IP address, atau description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Device ({filter.devices.length} dipilih)
          </label>
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
            {availableDevices.map((device) => (
              <label key={device} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.devices.includes(device)}
                  onChange={() => handleMultiSelectChange('devices', device)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{device}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Status ({filter.linkStatuses.length} dipilih)
          </label>
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
            {availableLinkStatuses.map((status) => (
              <label key={status} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.linkStatuses.includes(status)}
                  onChange={() => handleMultiSelectChange('linkStatuses', status)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Status ({filter.adminStatuses.length} dipilih)
          </label>
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
            {availableAdminStatuses.map((status) => (
              <label key={status} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.adminStatuses.includes(status)}
                  onChange={() => handleMultiSelectChange('adminStatuses', status)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VLAN/Mode ({filter.vlanModes.length} dipilih)
          </label>
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
            {availableVlanModes.map((mode) => (
              <label key={mode} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.vlanModes.includes(mode)}
                  onChange={() => handleMultiSelectChange('vlanModes', mode)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type ({filter.types.length} dipilih)
          </label>
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
            {availableTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.types.includes(type)}
                  onChange={() => handleMultiSelectChange('types', type)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
