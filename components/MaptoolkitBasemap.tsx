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
      // The Leaflet bridge is UMD and expects these libraries on window before
      // it is imported. Keeping this in the effect avoids accessing window on
      // the server during Next.js rendering.
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

    }

    void addBasemap()

    return () => {
      cancelled = true
      if (basemapLayer) map.removeLayer(basemapLayer)
    }
  }, [map, showTopo])

  return null
}
