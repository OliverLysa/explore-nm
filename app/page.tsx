"use client"

import dynamic from "next/dynamic"

const HikeMap = dynamic(
  () => import("../components/HikeMap"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Loading map...
      </div>
    )
  }
)

export default function HomePage() {
  return <HikeMap />
}