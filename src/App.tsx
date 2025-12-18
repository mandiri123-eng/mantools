import { useState, useMemo } from 'react';
import { Network } from 'lucide-react';
import UploadSection from './components/UploadSection';
import SummaryCards from './components/SummaryCards';
import FilterSection from './components/FilterSection';
import DataTable from './components/DataTable';
import { NetworkInterface, FilterState, SummaryData, DeviceSummary } from './types/network';

function App() {
  const [allData, setAllData] = useState<NetworkInterface[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    devices: [],
    linkStatuses: [],
    adminStatuses: [],
    vlanModes: [],
    types: [],
    searchText: '',
  });

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (filter.devices.length > 0 && !filter.devices.includes(item.device)) {
        return false;
      }

      if (filter.linkStatuses.length > 0 && !filter.linkStatuses.includes(item.linkStatus)) {
        return false;
      }

      if (filter.adminStatuses.length > 0 && !filter.adminStatuses.includes(item.adminStatus)) {
        return false;
      }

      if (filter.vlanModes.length > 0 && !filter.vlanModes.includes(item.vlanMode)) {
        return false;
      }

      if (filter.types.length > 0 && !filter.types.includes(item.type)) {
        return false;
      }

      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        return (
          item.interface.toLowerCase().includes(searchLower) ||
          item.ipAddress.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [allData, filter]);

  const summary = useMemo<SummaryData>(() => {
    const deviceMap = new Map<string, DeviceSummary>();

    filteredData.forEach((item) => {
      const linkLower = item.linkStatus.toLowerCase();
      const adminLower = item.adminStatus.toLowerCase();
      const operLower = item.operStatus.toLowerCase();

      const isConnected = linkLower === 'connected' || operLower === 'up';
      const isAdminDown = adminLower.includes('down') || linkLower === 'admin down' || linkLower === 'disabled';
      const isDown = !isConnected && !isAdminDown && (linkLower === 'down' || operLower === 'down' || linkLower === 'notconnect');

      if (!deviceMap.has(item.device)) {
        deviceMap.set(item.device, {
          device: item.device,
          total: 0,
          connected: 0,
          down: 0,
          adminDown: 0,
        });
      }

      const deviceSummary = deviceMap.get(item.device)!;
      deviceSummary.total++;
      if (isConnected) deviceSummary.connected++;
      else if (isAdminDown) deviceSummary.adminDown++;
      else if (isDown) deviceSummary.down++;
    });

    const deviceSummary = Array.from(deviceMap.values()).sort((a, b) =>
      a.device.localeCompare(b.device)
    );

    return {
      totalInterfaces: filteredData.length,
      totalConnected: deviceSummary.reduce((sum, d) => sum + d.connected, 0),
      totalDown: deviceSummary.reduce((sum, d) => sum + d.down, 0),
      totalAdminDown: deviceSummary.reduce((sum, d) => sum + d.adminDown, 0),
      uniqueDevices: deviceMap.size,
      deviceSummary,
    };
  }, [filteredData]);

  const availableOptions = useMemo(() => {
    const devices = new Set<string>();
    const linkStatuses = new Set<string>();
    const adminStatuses = new Set<string>();
    const vlanModes = new Set<string>();
    const types = new Set<string>();

    allData.forEach((item) => {
      if (item.device) devices.add(item.device);
      if (item.linkStatus) linkStatuses.add(item.linkStatus);
      if (item.adminStatus) adminStatuses.add(item.adminStatus);
      if (item.vlanMode) vlanModes.add(item.vlanMode);
      if (item.type) types.add(item.type);
    });

    return {
      devices: Array.from(devices).sort(),
      linkStatuses: Array.from(linkStatuses).sort(),
      adminStatuses: Array.from(adminStatuses).sort(),
      vlanModes: Array.from(vlanModes).sort(),
      types: Array.from(types).sort(),
    };
  }, [allData]);

  const handleDataLoaded = (data: NetworkInterface[]) => {
    setAllData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Network className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Interface Inventory Dashboard
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Dashboard untuk Network Engineer & NOC
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <UploadSection onDataLoaded={handleDataLoaded} />

        {allData.length > 0 && (
          <>
            <SummaryCards summary={summary} />

            <FilterSection
              filter={filter}
              onFilterChange={setFilter}
              availableDevices={availableOptions.devices}
              availableLinkStatuses={availableOptions.linkStatuses}
              availableAdminStatuses={availableOptions.adminStatuses}
              availableVlanModes={availableOptions.vlanModes}
              availableTypes={availableOptions.types}
            />

            <DataTable data={filteredData} />
          </>
        )}
      </main>

      <footer className="bg-slate-800 text-slate-400 text-center py-4 mt-12">
        <p className="text-sm">
          Network Engineer Tools &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
