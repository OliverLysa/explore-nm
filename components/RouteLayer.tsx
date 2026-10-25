"use client"

import { useEffect } from "react"

import { useMap } from "react-leaflet"

import L from "leaflet"

import { gpx } from "@tmcw/togeojson"

import { DOMParser } from "xmldom"

interface Props {
  file: string

  onElevationData?: (
    data: {
      distance: number
      elevation: number
    }[]
  ) => void
}

export default function RouteLayer({
  file,
  onElevationData
}: Props) {
  const map = useMap()

  useEffect(() => {
let routeLayer: L.FeatureGroup | null = null

    async function loadRoute() {
      const response =
        await fetch(file)

      const text =
        await response.text()

      const xml =
        new DOMParser().parseFromString(
          text,
          "text/xml"
        )

      const geojson = gpx(xml)

      const feature = geojson.features.find(
  (
    f: GeoJSON.Feature
  ): f is GeoJSON.Feature<GeoJSON.LineString> =>
    f.geometry.type === "LineString"
)

if (!feature) return

const coords =
  feature.geometry.coordinates

const latlngs: L.LatLngTuple[] =
  coords.map(
    (coord: number[]) => [
      coord[1],
      coord[0]
    ] as L.LatLngTuple
  )

      // Elevation profile
      let cumulativeDistance = 0

      const elevationData =
        coords.map(
          (
            coord: number[],
            index: number
          ) => {
            if (index > 0) {
              const prev =
                coords[index - 1]

              const dx =
                coord[0] - prev[0]

              const dy =
                coord[1] - prev[1]

              cumulativeDistance +=
                Math.sqrt(
                  dx * dx + dy * dy
                ) * 69
            }

            return {
              distance:
                Number(
                  cumulativeDistance.toFixed(
                    1
                  )
                ),

              elevation:
                coord[2] || 0
            }
          }
        )

      onElevationData?.(
        elevationData
      )

      // Wider cream casing for contrast
const routeOutline = L.polyline(latlngs, {
  color: "#FFFDF7",
  weight: 11,
  opacity: 1,
  lineCap: "round",
  lineJoin: "round"
})

// Bolder, darker hiking trail
const routeLine = L.polyline(latlngs, {
  color: "#A94325",
  weight: 6,
  opacity: 1,
  lineCap: "round",
  lineJoin: "round"
})

routeLayer = L.featureGroup([
  routeOutline,
  routeLine
]).addTo(map)

map.flyToBounds(
  routeLayer.getBounds(),
  {
    duration: 1.2,
    padding: [50, 50],
    maxZoom: 14
  }
)
    }

    loadRoute()

    return () => {
  if (routeLayer && map.hasLayer(routeLayer)) {
    map.removeLayer(routeLayer)
  }
}
  }, [file, map, onElevationData])

  return null
}