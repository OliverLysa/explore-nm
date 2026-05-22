"use client"

import { useEffect } from "react"

import { useMap } from "react-leaflet"

import L from "leaflet"

import { gpx } from "@tmcw/togeojson"

import { DOMParser } from "xmldom"

interface Props {
  file: string
}

export default function RouteLayer({
  file
}: Props) {
  const map = useMap()

  useEffect(() => {
    let routeLayer: L.GeoJSON | null = null

    async function loadRoute() {
      console.log("Loading route:", file)

      const response = await fetch(file)

      console.log("Fetch status:", response.status)

      const text = await response.text()

      console.log("GPX text loaded")

      const xml = new DOMParser().parseFromString(
        text,
        "text/xml"
      )

      console.log("XML parsed")

      const geojson = gpx(xml)

      console.log("GeoJSON:", geojson)

      routeLayer = L.geoJSON(geojson, {
        filter: (feature: any) => {
          return (
            feature.geometry.type ===
              "LineString" ||

            feature.geometry.type ===
              "MultiLineString"
          )
        },

        style: {
          color: "#ff5533",
          weight: 6,
          opacity: 0.85
        }
      }).addTo(map)

      console.log("Route layer added")

      map.fitBounds(routeLayer.getBounds())
    }

    loadRoute()

    return () => {
      if (routeLayer) {
        map.removeLayer(routeLayer)
      }
    }
  }, [file, map])

  return null
}