"use client"

import { useState } from "react"

import {
MapContainer,
TileLayer,
Marker,
Popup,
Tooltip
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import RouteLayer from "./RouteLayer"

import L from "leaflet"

import { trips, Trip } from "../data/trips"

import ElevationChart from "./ElevationChart"

// Marker icon
const icon = new L.Icon({
  iconUrl: "/icons/hiking-marker.svg",

  iconSize: [36, 36],

  iconAnchor: [18, 36],

  popupAnchor: [0, -36]
})

const photoIcon = new L.Icon({
  iconUrl: "/icons/photo-marker.svg",

  iconSize: [30, 30],

  iconAnchor: [15, 30],

  popupAnchor: [0, -30]
})

export default function HikeMap() {
  const [selectedTrip, setSelectedTrip] =
    useState<Trip | null>(null)

  const [showRoutes, setShowRoutes] =
  useState(true)

const [showTopo, setShowTopo] =
  useState(false)

const [fullscreenImage, setFullscreenImage] =
    useState<string | null>(null) 

const [elevationData, setElevationData] =
  useState<
    {
      distance: number
      elevation: number
    }[]
  >([])    

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
            top: 80,
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
            ←  Close trail
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

          {elevationData.length > 0 && (
  <ElevationChart
    data={elevationData}
  />
)}
        </div>
      )}

{/* Legend */}
<div
  onClick={() =>
    setShowRoutes(!showRoutes)
  }

  style={{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,

    background: "rgba(255,255,255,0.95)",

    padding: "12px 16px",

    borderRadius: "14px",

    boxShadow:
      "0 4px 14px rgba(0,0,0,0.18)",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    fontSize: "15px",

    fontWeight: 600,

    cursor: "pointer",

    opacity: showRoutes ? 1 : 0.5,

    transition: "0.2s"
  }}
>
  <img
    src="/icons/hiking-marker.svg"
    alt="Hiking route"

    style={{
      width: "24px",
      height: "24px"
    }}
  />

  <span>
    Hiking Routes
  </span>
</div>

{/* Topographic toggle */}
{selectedTrip && (
  <div
    onClick={() =>
      setShowTopo(!showTopo)
    }

    style={{
      position: "absolute",
      top: 80,
      left: 20,
      zIndex: 1000,

      background:
        "rgba(255,255,255,0.95)",

      padding: "12px 16px",

      borderRadius: "14px",

      boxShadow:
        "0 4px 14px rgba(0,0,0,0.18)",

      display: "flex",

      alignItems: "center",

      gap: "12px",

      fontSize: "15px",

      fontWeight: 600,

      cursor: "pointer",

      opacity: showTopo ? 1 : 0.5,

      transition: "0.2s"
    }}
  >
    🗺️ Toggle Topographic Map
  </div>
)}


{/* Fullscreen image modal */}
{fullscreenImage && (
  <div
    onClick={() =>
      setFullscreenImage(null)
    }

    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,0.85)",

      zIndex: 5000,

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      padding: "40px",

      cursor: "pointer"
    }}
  >
    <img
      src={fullscreenImage}

      alt="Trail photo"

      style={{
        maxWidth: "95%",
        maxHeight: "95%",

        borderRadius: "14px",

        boxShadow:
          "0 10px 40px rgba(0,0,0,0.5)"
      }}
    />
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
  showTopo
    ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}
        />

        {/* Route layer */}
        {selectedTrip?.routeFile && (
          <RouteLayer
  file={selectedTrip.routeFile}

  onElevationData={
    setElevationData
  }
/>
        )}

{/* Photo markers */}
{selectedTrip?.photos?.map((photo) => (
  <Marker
    key={photo.image}

    position={[
      photo.lat,
      photo.lng
    ]}

    icon={photoIcon}
  >
    <Popup maxWidth={340}>
      <div>
        <img
  src={photo.image}

  alt={photo.caption}

  onClick={() =>
    setFullscreenImage(photo.image)
  }

  style={{
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",

    cursor: "pointer"
  }}
/>

        <p
          style={{
            margin: 0
          }}
        >
          {photo.caption}
        </p>
      </div>
    </Popup>
  </Marker>
))}

        {/* Trail markers */}
        {showRoutes &&
  trips.map((trip) => (
<Marker
  key={trip.slug}

  position={[
    trip.lat,
    trip.lng
  ]}

  icon={icon}

  eventHandlers={{
    click: () => {
      setSelectedTrip(trip)
    }
  }}
>
<Tooltip
  direction="top"

  offset={[0, -28]}

  opacity={1}

  sticky={false}

  permanent={false}

  className="custom-tooltip"
>
  <div>
    <div
      style={{
        fontWeight: 700,

        fontSize: "18px",

        marginBottom: "10px",

        color: "#111"
      }}
    >
      {trip.title}
    </div>

    <div
      style={{
        fontSize: "14px",

        color: "#555"
      }}
    >
      {trip.description}
    </div>
  </div>
</Tooltip>
</Marker>
        ))}
      </MapContainer>
    </div>
  )
}