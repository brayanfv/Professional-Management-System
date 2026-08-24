"use client"

import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CircleAlertIcon,
  PlusIcon,
  UserCheckIcon,
  UsersIcon,
  UserXIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"

import { PageHeader } from "@/components/common/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChartCard } from "@/features/dashboard/components/chart-card"
import { DashboardMetricCard } from "@/features/dashboard/components/dashboard-metric-card"
import {
  ChartSkeleton,
  DashboardMetricsSkeleton,
} from "@/features/dashboard/components/dashboard-skeletons"
import { RecentProfessionals } from "@/features/dashboard/components/recent-professionals"
import {
  useDashboardSummary,
  useProfessionalsByDepartment,
  useProfessionalsByPosition,
  useRecentProfessionals,
} from "@/features/dashboard/hooks/use-dashboard"
import { routes } from "@/lib/routes"

const recentProfessionalsLimit = 5

const ProfessionalCountChart = dynamic(
  () =>
    import("@/features/dashboard/components/professional-count-chart").then(
      ({ ProfessionalCountChart: Chart }) => Chart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
)

export function DashboardContent() {
  const summaryQuery = useDashboardSummary()
  const departmentQuery = useProfessionalsByDepartment()
  const positionQuery = useProfessionalsByPosition()
  const recentQuery = useRecentProfessionals(recentProfessionalsLimit)

  const departmentData = departmentQuery.data?.map((item) => ({
    id: item.departmentId,
    name: item.departmentName,
    count: item.count,
  }))
  const positionData = positionQuery.data?.map((item) => ({
    id: item.positionId,
    name: item.positionName,
    count: item.count,
  }))

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your organization"
        actions={
          <Link href={routes.professionals.create} className={buttonVariants()}>
            <PlusIcon aria-hidden="true" />
            Add professional
          </Link>
        }
      />

      {summaryQuery.isPending ? <DashboardMetricsSkeleton /> : null}
      {summaryQuery.isError ? (
        <div
          className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-danger/20 bg-danger-soft/40 px-6 text-center"
          role="alert"
        >
          <CircleAlertIcon
            className="size-5 text-danger"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-danger-foreground">
              Unable to load dashboard summary.
            </p>
            <p className="text-sm text-text-secondary">
              The remaining dashboard sections are still available.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void summaryQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}
      {summaryQuery.data ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <DashboardMetricCard
            label="Total professionals"
            value={summaryQuery.data.totalProfessionals}
            icon={UsersIcon}
            supportingText="All registered"
          />
          <DashboardMetricCard
            label="Active professionals"
            value={summaryQuery.data.activeProfessionals}
            icon={UserCheckIcon}
            tone="success"
            supportingText="Currently active"
          />
          <DashboardMetricCard
            label="Inactive professionals"
            value={summaryQuery.data.inactiveProfessionals}
            icon={UserXIcon}
            tone="warning"
            supportingText="Not active"
          />
          <DashboardMetricCard
            label="Departments"
            value={summaryQuery.data.totalDepartments}
            icon={Building2Icon}
            tone="department"
            supportingText="Organization areas"
          />
          <DashboardMetricCard
            label="Positions"
            value={summaryQuery.data.totalPositions}
            icon={BriefcaseBusinessIcon}
            tone="position"
            supportingText="Defined roles"
          />
        </div>
      ) : null}

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Professionals by Department"
          description="Distribution across departments"
          isLoading={departmentQuery.isPending}
          isError={departmentQuery.isError}
          isEmpty={departmentData?.length === 0}
          emptyMessage="No department data yet."
          onRetry={() => void departmentQuery.refetch()}
        >
          {departmentData ? (
            <ProfessionalCountChart
              data={departmentData}
              subject="department"
            />
          ) : null}
        </ChartCard>

        <ChartCard
          title="Professionals by Position"
          description="Distribution across positions"
          isLoading={positionQuery.isPending}
          isError={positionQuery.isError}
          isEmpty={positionData?.length === 0}
          emptyMessage="No position data yet."
          onRetry={() => void positionQuery.refetch()}
        >
          {positionData ? (
            <ProfessionalCountChart data={positionData} subject="position" />
          ) : null}
        </ChartCard>
      </div>

      <RecentProfessionals
        data={recentQuery.data}
        isLoading={recentQuery.isPending}
        isError={recentQuery.isError}
        onRetry={() => void recentQuery.refetch()}
      />
    </section>
  )
}
