import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApplicationStatus, DashboardFilters, SortOption } from '../types';
import { STATUS_LIST } from '../constants';

const VALID_STATUSES: string[] = ['All', ...STATUS_LIST];
const VALID_SORTS: SortOption[] = ['date_desc', 'date_asc', 'amount_desc', 'amount_asc'];

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: DashboardFilters = useMemo(() => {
    const qParam = searchParams.get('q') || '';
    const statusParam = searchParams.get('status') || 'All';
    const sortParam = (searchParams.get('sort') as SortOption) || 'date_desc';

    return {
      q: qParam,
      status: VALID_STATUSES.includes(statusParam) ? (statusParam as DashboardFilters['status']) : 'All',
      sort: VALID_SORTS.includes(sortParam) ? sortParam : 'date_desc',
    };
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string | undefined, defaultValue: string = '') => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === defaultValue) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setQuery = useCallback(
    (q: string) => {
      updateParam('q', q.trim());
    },
    [updateParam]
  );

  const setStatus = useCallback(
    (status: 'All' | ApplicationStatus) => {
      updateParam('status', status, 'All');
    },
    [updateParam]
  );

  const setSort = useCallback(
    (sort: SortOption) => {
      updateParam('sort', sort, 'date_desc');
    },
    [updateParam]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const isFiltered = useMemo(() => {
    return filters.q.length > 0 || filters.status !== 'All' || filters.sort !== 'date_desc';
  }, [filters]);

  return {
    filters,
    setQuery,
    setStatus,
    setSort,
    clearFilters,
    isFiltered,
  };
}
