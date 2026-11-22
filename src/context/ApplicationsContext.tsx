import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus } from '../types';
import { getStoredApplications, saveStoredApplications } from '../services/storage';
import { updateApplicationStatus as apiUpdateStatus } from '../services/mockApi';
import { useToast } from './ToastContext';

type ApplicationsAction =
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: ApplicationStatus; remarks?: string } };

interface ApplicationsState {
  applications: Application[];
  isLoaded: boolean;
  updatingIds: Record<string, boolean>; // tracks IDs undergoing async update
}

const initialState: ApplicationsState = {
  applications: [],
  isLoaded: false,
  updatingIds: {},
};

function applicationsReducer(state: ApplicationsState, action: ApplicationsAction): ApplicationsState {
  switch (action.type) {
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
        isLoaded: true,
      };

    case 'ADD_APPLICATION': {
      // Prepend to top so new applications appear first
      const updated = [action.payload, ...state.applications];
      saveStoredApplications(updated);
      return {
        ...state,
        applications: updated,
      };
    }

    case 'UPDATE_STATUS': {
      const { id, status, remarks } = action.payload;
      const now = new Date().toISOString();

      const updated = state.applications.map((app) => {
        if (app.id !== id) return app;
        return {
          ...app,
          status,
          updatedAt: now,
          history: [
            ...app.history,
            {
              status,
              changedAt: now,
              remarks: remarks?.trim() || `Status updated to ${status}.`,
            },
          ],
        };
      });

      saveStoredApplications(updated);
      return {
        ...state,
        applications: updated,
      };
    }

    default:
      return state;
  }
}

interface ApplicationsContextValue {
  applications: Application[];
  isLoaded: boolean;
  updatingIds: Record<string, boolean>;
  addApplication: (app: Application) => void;
  updateStatus: (id: string, status: ApplicationStatus, remarks?: string) => Promise<boolean>;
}

const ApplicationsContext = createContext<ApplicationsContextValue | undefined>(undefined);

export const ApplicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(applicationsReducer, initialState);
  const { showSuccess, showError } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const apps = getStoredApplications();
    dispatch({ type: 'SET_APPLICATIONS', payload: apps });
  }, []);

  const addApplication = useCallback((newApp: Application) => {
    dispatch({ type: 'ADD_APPLICATION', payload: newApp });
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: ApplicationStatus, remarks?: string): Promise<boolean> => {
      // Mark as updating
      state.updatingIds[id] = true;

      try {
        const response = await apiUpdateStatus(id, status, remarks);
        if (response.success) {
          dispatch({
            type: 'UPDATE_STATUS',
            payload: { id, status, remarks },
          });
          showSuccess(
            `Status Updated to ${status}`,
            `Application ${id} status has been updated successfully.`
          );
          delete state.updatingIds[id];
          return true;
        }
        delete state.updatingIds[id];
        return false;
      } catch (err: unknown) {
        delete state.updatingIds[id];
        const errorMessage = err instanceof Error ? err.message : 'Failed to update status.';
        
        // Error toast with retry option that executes this exact status update
        showError(
          'Status Update Failed',
          `${errorMessage}`,
          () => {
            updateStatus(id, status, remarks);
          }
        );
        return false;
      }
    },
    [showError, showSuccess, state.updatingIds]
  );

  return (
    <ApplicationsContext.Provider
      value={{
        applications: state.applications,
        isLoaded: state.isLoaded,
        updatingIds: state.updatingIds,
        addApplication,
        updateStatus,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

export function useApplications(): ApplicationsContextValue {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
}
