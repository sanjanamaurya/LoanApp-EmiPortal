import React, { useState, useEffect, useMemo } from 'react';
import { useApplications } from '../hooks/useApplications';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { Application, SortOption } from '../types';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { FiltersBar } from '../components/dashboard/FiltersBar';
import { ApplicationsTable } from '../components/dashboard/ApplicationsTable';
import { ApplicationCard } from '../components/dashboard/ApplicationCard';
import { ApplicationDrawer } from '../components/dashboard/ApplicationDrawer';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { applications, isLoaded, updatingIds, updateStatus } = useApplications();
  const { filters, setQuery, setStatus, setSort, clearFilters, isFiltered } = useUrlFilters();
  const navigate = useNavigate();

  // Simulated initial load skeleton delay (~600ms)
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [globalShowPan, setGlobalShowPan] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Logic
  const filteredApplications = useMemo(() => {
    let list = [...applications];

    // Status filter
    if (filters.status !== 'All') {
      list = list.filter((app: Application) => app.status === filters.status);
    }

    // Search query (debounced)
    if (filters.q.trim()) {
      const query = filters.q.trim().toLowerCase();
      list = list.filter(
        (app: Application) =>
          app.id.toLowerCase().includes(query) ||
          app.applicant.fullName.toLowerCase().includes(query) ||
          app.applicant.pan.toLowerCase().includes(query)
      );
    }

    // Sort
    list.sort((a: Application, b: Application) => {
      switch (filters.sort) {
        case 'amount_desc':
          return b.loan.amount - a.loan.amount;
        case 'amount_asc':
          return a.loan.amount - b.loan.amount;
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return list;
  }, [applications, filters]);

  // Keep selectedApplication synced with live application store updates
  useEffect(() => {
    if (selectedApplication) {
      const updated = applications.find((a: Application) => a.id === selectedApplication.id);
      if (updated) {
        setSelectedApplication(updated);
      }
    }
  }, [applications, selectedApplication]);

  const handleUpdateStatus = async (
    id: string,
    status: Application['status'],
    remarks?: string
  ) => {
    return await updateStatus(id, status, remarks);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Loan Applications Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor submitted loan requests, review risk ratios, and perform instant underwriter decisions.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <SummaryCards
        applications={applications}
        selectedStatus={filters.status}
        onSelectStatus={setStatus}
      />

      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onClearFilters={clearFilters}
        isFiltered={isFiltered}
        globalShowPan={globalShowPan}
        onToggleGlobalShowPan={() => setGlobalShowPan(!globalShowPan)}
      />

      {/* Main Content Area */}
      {isSimulatedLoading || !isLoaded ? (
        <TableSkeleton />
      ) : applications.length === 0 ? (
        <EmptyState
          icon="document"
          title="No loan applications found"
          description="There are currently no submitted loan applications in the registry."
          actionLabel="Apply for a Loan"
          onAction={() => navigate('/apply')}
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon="search"
          title="No applications match your filters"
          description="Try modifying your search term or reset the status filters to view all entries."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ApplicationsTable
              applications={filteredApplications}
              onSelectApplication={(app: Application) => setSelectedApplication(app)}
              currentSort={filters.sort}
              onSortChange={(s: SortOption) => setSort(s)}
              globalShowPan={globalShowPan}
            />
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredApplications.map((app: Application) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onClick={() => setSelectedApplication(app)}
                globalShowPan={globalShowPan}
              />
            ))}
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <ApplicationDrawer
        application={selectedApplication}
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={Boolean(selectedApplication && updatingIds[selectedApplication.id])}
      />
    </div>
  );
};
