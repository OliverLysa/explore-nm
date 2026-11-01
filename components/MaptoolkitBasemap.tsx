
"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import type * as maplibreglTypes from "maplibre-gl"

type MaplibreLeafletLayer = L.Layer & {
  getMaplibreMap?: () => maplibreglTypes.Map
}

type LeafletWithMaplibre = typeof L & {
  maplibreGL: (options: {
    style: string
    attribution: string
  }) => MaplibreLeafletLayer
}

/** Adds Maptoolkit's vector basemap underneath the existing Leaflet layers. */
export default function MaptoolkitBasemap({
  showTopo,
}: {
  showTopo: boolean
}) {
  const map = useMap()

  useEffect(() => {
    let cancelled = false
    let basemapLayer: MaplibreLeafletLayer | undefined

    async function addBasemap() {
      // Load MapLibre and the Leaflet bridge.
      const browserWindow = window as Window & {
        L?: typeof L
        maplibregl?: typeof import("maplibre-gl")
      }

      const maplibregl = await import("maplibre-gl")

      browserWindow.L = L
      browserWindow.maplibregl = maplibregl

      await import("@maplibre/maplibre-gl-leaflet")

      if (cancelled) return

      const leafletWithMaplibre = L as LeafletWithMaplibre

      basemapLayer = leafletWithMaplibre.maplibreGL({
        style: showTopo
          ? "https://styles.maptoolkit.org/hiking.json"
          : "https://styles.maptoolkit.org/summer.json",
        attribution:
          '© <a href="https://www.maptoolkit.org/">Maptoolkit</a> ' +
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })

      basemapLayer.addTo(map)

      const maplibreMap = basemapLayer.getMaplibreMap?.()

      if (!maplibreMap) return

      // Wait until the Maptoolkit style has loaded.
      maplibreMap.once("idle", () => {
        if (cancelled) return

        // Make hiking trails more prominent.
        const trailLayers = [
          "road_path",
          "road_path_mountain",
          "road_path_alpine",
        ]

        trailLayers.forEach((id) => {
          if (!maplibreMap.getLayer(id)) return

          maplibreMap.setPaintProperty(
            id,
            "line-color",
            "#A85D48"
          )

          maplibreMap.setPaintProperty(
            id,
            "line-width",
            [
              "interpolate",
              ["exponential", 1.4],
              ["zoom"],
              6, 0.3,
              10, 0.8,
              13, 1.8,
              16, 3.2,
              19, 4.5,
            ]
          )

          maplibreMap.setPaintProperty(
  id,
  "line-dasharray",
  [2, 1.5]
)
        })

        // Improve trail name labels.
        if (maplibreMap.getLayer("road_path_label")) {
          maplibreMap.setLayoutProperty(
            "road_path_label",
            "text-size",
            [
              "interpolate",
              ["linear"],
              ["zoom"],
              11, 11,
              14, 14,
              16, 17,
              19, 19,
            ]
          )

          // Show names more frequently along paths.
          maplibreMap.setLayoutProperty(
            "road_path_label",
            "symbol-spacing",
            [
              "interpolate",
              ["linear"],
              ["zoom"],
              10, 80,
              14, 180,
              19, 350,
            ]
          )

          maplibreMap.setPaintProperty(
            "road_path_label",
            "text-color",
            "#493D36"
          )

          maplibreMap.setPaintProperty(
            "road_path_label",
            "text-halo-color",
            "#FFFFFF"
          )

          maplibreMap.setPaintProperty(
            "road_path_label",
            "text-halo-width",
            1.8
          )

          maplibreMap.setPaintProperty(
            "road_path_label",
            "text-halo-blur",
            0.5
          )
        }
      })
    }

    void addBasemap()

    return () => {
      cancelled = true

      if (basemapLayer) {
        map.removeLayer(basemapLayer)
      }
    }
  }, [map, showTopo])

  return null
}
