import { Application, ApplicationStatus } from '../types';
import { API_CONFIG } from '../constants';
import { getStoredApplications, saveStoredApplications } from './storage';

/**
 * Tracks the last requestId to protect against stale-response race conditions
 */
let latestRequestId = 0;

/**
 * Simulated async API call to update application status.
 * Delay: ~600 ms
 * Failure rate: ~20%
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  remarks?: string
): Promise<{ success: boolean; application: Application }> {
  const currentReqId = ++latestRequestId;

  await new Promise((resolve) => setTimeout(resolve, API_CONFIG.DELAY_MS));

  // Check if a newer request has overridden this one
  if (currentReqId !== latestRequestId) {
    throw new Error('Request superseded by a newer update');
  }

  // Simulated 20% random failure
  if (Math.random() < API_CONFIG.FAILURE_RATE) {
    throw new Error('Network error: Unable to update application status. Please check your connection and retry.');
  }

  const applications = getStoredApplications();
  const targetIndex = applications.findIndex((app) => app.id === applicationId);

  if (targetIndex === -1) {
    throw new Error(`Application with ID "${applicationId}" not found.`);
  }

  const currentApp = applications[targetIndex];
  const now = new Date().toISOString();

  const updatedHistory = [
    ...currentApp.history,
    {
      status: newStatus,
      changedAt: now,
      remarks: remarks?.trim() || `Status updated to ${newStatus}.`,
    },
  ];

  const updatedApp: Application = {
    ...currentApp,
    status: newStatus,
    updatedAt: now,
    history: updatedHistory,
  };

  const updatedList = [...applications];
  updatedList[targetIndex] = updatedApp;

  saveStoredApplications(updatedList);

  return { success: true, application: updatedApp };
}
