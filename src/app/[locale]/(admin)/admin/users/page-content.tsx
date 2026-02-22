'use client';

import type { User } from '@/services';
import { List, SquaresFour, Users } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { Button } from '@/components/ui';
import { useAdminUsersList } from '@/services/admin/users/list';
import { useUserStatisticsOverview } from '@/services/admin/users/statistics';
import { CreateUserModal, InlineChart, UserDetailModal, UserTable } from './_components';

function toIsoDateTimeRange(start?: string | Date, end?: string | Date): [string, string] | undefined {
  if (!start || !end) {
    return undefined;
  }
  const startDate = typeof start === 'string' ? new Date(`${start}T00:00:00`) : new Date(start.getTime());
  startDate.setHours(0, 0, 0, 0);
  const endDate = typeof end === 'string' ? new Date(`${end}T23:59:59`) : new Date(end.getTime());
  endDate.setHours(23, 59, 59, 999);
  return [startDate.toISOString(), endDate.toISOString()];
}

// helper removed (no longer used)

export default function UsersPageContent() {
  const { data, isLoading, error } = useAdminUsersList();

  // Date range states (store Date objects)
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>(undefined);
  const [createdTo, setCreatedTo] = useState<Date | undefined>(undefined);
  const [updatedFrom, setUpdatedFrom] = useState<Date | undefined>(undefined);
  const [updatedTo, setUpdatedTo] = useState<Date | undefined>(undefined);

  const statsParams = useMemo(() => {
    const params: any = {};
    const createdRange = toIsoDateTimeRange(createdFrom, createdTo);
    const updatedRange = toIsoDateTimeRange(updatedFrom, updatedTo);
    if (createdRange) {
      params.created_time_filter = createdRange;
    }
    if (updatedRange) {
      params.updated_at_filter = updatedRange;
    }
    return params;
  }, [createdFrom, createdTo, updatedFrom, updatedTo]);
  const { data: statsData } = useUserStatisticsOverview(statsParams);
  const summary = statsData?.data?.statistics as
    | {
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      emailUsers: number;
      googleUsers: number;
      githubUsers: number;
      twoFactorEnabled: number;
      usersToday: number;
      usersThisWeek: number;
      usersThisMonth: number;
    }
    | undefined;
  const details = statsData?.data?.statisticsDetails;
  const timeline = useMemo(() => details?.statisticsTime || [], [details]);
  const totalUsers = useMemo(() => details?.totalUsers || [], [details]);
  const activeUsers = useMemo(() => details?.activeUsers || [], [details]);
  const inactiveUsers = useMemo(() => details?.inactiveUsers || [], [details]);
  const recentUsers = useMemo(() => details?.recentUsers || [], [details]);
  const twoFactorEnabled = useMemo(() => details?.twoFactorEnabled || [], [details]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'detail'>('overview');
  const queryClient = useQueryClient();

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserDeleted = () => {
    // Invalidate and refetch users list
    queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Error loading user data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-600">
              Total
              {' '}
              <span className="font-semibold text-blue-600">{data?.total || 0}</span>
              {' '}
              users
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <Users size={24} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Users</span>
          </div>
        </div>

        {/* Tabs - Segmented control style */}
        <div className="mt-6 inline-flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" role="tablist" aria-label="View switcher">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              activeTab === 'overview'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SquaresFour size={16} className={activeTab === 'overview' ? 'text-gray-700' : 'text-gray-500'} />
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'detail'}
            onClick={() => setActiveTab('detail')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              activeTab === 'detail'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <List size={16} className={activeTab === 'detail' ? 'text-gray-700' : 'text-gray-500'} />
            Details
          </button>
        </div>
      </div>

      {/* Filters */}
      {activeTab === 'overview' && (
        <div className="mt-4 flex items-center gap-4">
          <div className="">
            <div className="mb-2 text-xs font-medium text-gray-700">Created range</div>
            <DateRangePicker
              value={createdFrom && createdTo ? [createdFrom, createdTo] : null}
              onChange={(val) => {
                if (val && Array.isArray(val)) {
                  const [start, end] = val as [Date, Date];
                  setCreatedFrom(start);
                  setCreatedTo(end);
                } else {
                  setCreatedFrom(undefined);
                  setCreatedTo(undefined);
                }
              }}
              placement="bottomStart"
              showOneCalendar
            />
          </div>
          <div className="">
            <div className="mb-2 text-xs font-medium text-gray-700">Updated range</div>
            <DateRangePicker
              value={updatedFrom && updatedTo ? [updatedFrom, updatedTo] : null}
              onChange={(val) => {
                if (val && Array.isArray(val)) {
                  const [start, end] = val as [Date, Date];
                  setUpdatedFrom(start);
                  setUpdatedTo(end);
                } else {
                  setUpdatedFrom(undefined);
                  setUpdatedTo(undefined);
                }
              }}
              placement="bottomStart"
              showOneCalendar
            />
          </div>
        </div>
      )}

      {/* Content by Tab */}
      {activeTab === 'overview' && (
        <>
          {timeline.length > 0 && (
            <>

              {/* Provider & period breakdown */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Email Users</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.emailUsers ?? 0}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Google Users</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.googleUsers ?? 0}</div>
                </div>
                {/* <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Github Users</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.githubUsers ?? 0}</div>
                </div> */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Users Today</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.usersToday ?? 0}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Users This Week</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.usersThisWeek ?? 0}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Users This Month</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{summary?.usersThisMonth ?? 0}</div>
                </div>
              </div>

              {/* Time series overview */}
              <div className="mt-6 grid grid-cols-1 gap-6">
                <InlineChart title="Total Users" timeline={timeline} data={totalUsers} lineColor="#2563EB" areaColor="rgba(37, 99, 235, 0.12)" />
                <InlineChart title="Active Users" timeline={timeline} data={activeUsers} lineColor="#10B981" areaColor="rgba(16, 185, 129, 0.18)" />
                <InlineChart title="Inactive Users" timeline={timeline} data={inactiveUsers} lineColor="#EF4444" areaColor="rgba(239, 68, 68, 0.10)" />
                <InlineChart title="Recent Users" timeline={timeline} data={recentUsers} lineColor="#8B5CF6" areaColor="rgba(139, 92, 246, 0.12)" />
                <InlineChart title="2FA Enabled" timeline={timeline} data={twoFactorEnabled} lineColor="#F59E0B" areaColor="rgba(245, 158, 11, 0.12)" />
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'detail' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Table View</h2>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Create User
            </Button>
          </div>
          <UserTable
            data={data?.data || []}
            onUserClickAction={handleUserClick}
          />
        </div>
      )}

      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUserDeleted={handleUserDeleted}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onCloseAction={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
