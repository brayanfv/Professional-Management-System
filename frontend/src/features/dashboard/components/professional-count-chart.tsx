import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

type CountDatum = {
  id: number
  name: string
  count: number
}

const maxVisibleItems = 10

export function ProfessionalCountChart({
  data,
  subject,
}: {
  data: CountDatum[]
  subject: "department" | "position"
}) {
  const sortedData = [...data].sort(
    (left, right) =>
      right.count - left.count || left.name.localeCompare(right.name),
  )
  const visibleData = sortedData.slice(0, maxVisibleItems)
  const chartHeight = Math.max(264, visibleData.length * 44)
  const wasLimited = data.length > maxVisibleItems

  return (
    <div className="space-y-3">
      <div
        className="h-auto min-h-64 w-full"
        style={{ height: chartHeight }}
        role="img"
        aria-label={`Professional counts by ${subject}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            layout="vertical"
            margin={{ top: 4, right: 36, bottom: 4, left: 4 }}
            accessibilityLayer
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={128}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              tickFormatter={(value: string) =>
                value.length > 18 ? `${value.slice(0, 17)}…` : value
              }
            />
            <RechartsTooltip
              cursor={{ fill: "var(--surface-secondary)" }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-dropdown-token)",
                color: "var(--text-primary)",
                fontSize: 13,
              }}
              labelStyle={{ color: "var(--text-primary)", fontWeight: 600 }}
              formatter={(value) => {
                const count = Number(value)
                return [
                  `${count} professional${count === 1 ? "" : "s"}`,
                  "Count",
                ]
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[0, 6, 6, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="count"
                position="right"
                fill="var(--text-secondary)"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="sr-only">
        {visibleData.map((item) => (
          <li key={item.id}>
            {item.name}: {item.count} professional
            {item.count === 1 ? "" : "s"}
          </li>
        ))}
      </ul>
      {wasLimited ? (
        <p className="text-xs text-muted-foreground">
          Showing the top {maxVisibleItems} {subject}s by professional count.
        </p>
      ) : null}
    </div>
  )
}
