"use client"

import { useEffect } from "react"

import { useMap } from "react-leaflet"

import L from "leaflet"

import "leaflet-ant-path"

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
    let routeLayer: L.Layer | null = null

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

      const latlngs = coords.map(
        (coord: number[]) => [
          coord[1],
          coord[0]
        ]
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

      routeLayer = (
  L.polyline as typeof L.polyline & {
    antPath: (
      latlngs: L.LatLngExpression[],
      options?: L.PolylineOptions & {
        delay?: number
        dashArray?: number[]
        pulseColor?: string
        paused?: boolean
        reverse?: boolean
        hardwareAccelerated?: boolean
      }
    ) => L.Layer
  }
).antPath(
        latlngs,
        {
          delay: 8000,

          dashArray: [10, 20],

          weight: 7,

          color: "#bde0fe",

          pulseColor: "#3a86ff",

          paused: false,

          reverse: false,

          hardwareAccelerated: true
        }
      )

      routeLayer.addTo(map)

      map.flyToBounds(
        routeLayer.getBounds(),
        {
          duration: 2
        }
      )
    }

    loadRoute()

    return () => {
      if (routeLayer) {
        map.removeLayer(routeLayer)
      }
    }
  }, [file, map, onElevationData])

  return null
}