import {
  Bar,
  BarChart,
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

const maxVisibleItems = 8

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
  const chartHeight = Math.max(164, visibleData.length * 32 + 16)
  const wasLimited = data.length > maxVisibleItems

  return (
    <div className="space-y-2">
      <div
        className="h-auto min-h-40 w-full"
        style={{ height: chartHeight }}
        role="img"
        aria-label={`Professional counts by ${subject}`}
      >
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <BarChart
            data={visibleData}
            layout="vertical"
            margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
            accessibilityLayer
          >
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, "dataMax"]}
              hide
            />
            <YAxis
              type="category"
              dataKey="name"
              width={136}
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
              radius={[0, 5, 5, 0]}
              barSize={14}
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
