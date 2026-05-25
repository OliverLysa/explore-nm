"use client"

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip
} from "recharts"

interface Props {
  data: {
    distance: number
    elevation: number
  }[]
}

export default function ElevationChart({
  data
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "140px",
        marginTop: "20px"
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart data={data}>
          <Tooltip

formatter={(value) => [
  `${Math.round(Number(value))} m`,
  "Elevation"
]}

labelFormatter={(label) =>
  `${Number(label).toFixed(1)} mi`
}

/>

          <Area
            type="monotone"
            dataKey="elevation"

            stroke="#e76f51"

            fill="#f4a261"

            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}