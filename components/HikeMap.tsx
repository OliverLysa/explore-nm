"use client"

import { useState } from "react"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import RouteLayer from "./RouteLayer"

import L from "leaflet"

import { trips, Trip } from "../data/trips"

// Marker icon
const icon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41]
})

export default function HikeMap() {
  const [selectedTrip, setSelectedTrip] =
    useState<Trip | null>(null)

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative"
      }}
    >
      {/* Info card */}
      {selectedTrip && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            width: "320px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.15)"
          }}
        >
          {/* Close button */}
<button
  onClick={() =>
    setSelectedTrip(null)
  }

  style={{
    border: "none",
    background: "#f3f3f3",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "16px",
    fontWeight: "bold"
  }}
>
  ← Back to map
</button>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "12px"
            }}
          >
            {selectedTrip.title}
          </h2>

          <p>
            Distance:
            {" "}
            {selectedTrip.distance}
          </p>

          <p>
            Elevation Gain:
            {" "}
            {selectedTrip.elevation}
          </p>

          <p>
            {selectedTrip.location}
          </p>
        </div>
      )}

      <MapContainer
        center={[33.7, -107.5]}

        zoom={9}

        style={{
          height: "100%",
          width: "100%"
        }}
      >
        {/* Dynamic basemap */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"

          url={
            selectedTrip
              ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {/* Route layer */}
        {selectedTrip?.routeFile && (
          <RouteLayer
            file={selectedTrip.routeFile}
          />
        )}

        {/* Trail markers */}
        {trips.map((trip) => (
          <Marker
            key={trip.slug}

            position={[
              trip.lat,
              trip.lng
            ]}

            icon={icon}

            eventHandlers={{
              click: () => {
                console.log(trip)

                setSelectedTrip(trip)
              }
            }}
          >
            <Popup>
              <div>
                <h3>{trip.title}</h3>

                <p>
                  {trip.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}