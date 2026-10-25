"use client"

import { useState } from "react"

import {
MapContainer,
Marker,
Popup,
Tooltip
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import RouteLayer from "./RouteLayer"
import MaptoolkitBasemap from "./MaptoolkitBasemap"

import L from "leaflet"

import { trips, Trip } from "../data/trips"

import ElevationChart from "./ElevationChart"

import LandManagementLayer from "./LandManagementLayer";

// Hiking trail marker
const icon = L.divIcon({
  className: "hiking-marker",
  html: `
    <div class="hiking-marker__badge">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="18" cy="4.5" r="2.8" fill="white"/>

        <!-- Backpack -->
        <rect x="11.5" y="9" width="5" height="8" rx="2" fill="white"/>

        <!-- Body -->
        <path
          d="M17 9 L15 17"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Front arm -->
        <path
          d="M16 11 L21 14 L23 11"
          stroke="white"
          stroke-width="2.4"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Rear arm -->
        <path
          d="M14 12 L10 17"
          stroke="white"
          stroke-width="2.4"
          fill="none"
          stroke-linecap="round"
        />

        <!-- Legs -->
        <path
          d="M15 17 L13 22 L10 28 M15 17 L18 22 L20 28"
          stroke="white"
          stroke-width="2.8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Straight trekking poles -->
        <path
          d="M9 16 L5 29 M24 12 L24 29"
          stroke="white"
          stroke-width="1.8"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -19]
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
  onClick={() => setShowRoutes(!showRoutes)}
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,
    background: "rgba(255,255,255,0.95)",
    padding: "12px 16px",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
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
  <div
    className="hiking-marker__badge"
    style={{
      width: "28px",
      height: "28px",
      flexShrink: 0
    }}
  >
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ width: "21px", height: "21px" }}
    >
      <circle cx="18" cy="4.5" r="2.8" fill="white" />
      <rect x="11.5" y="9" width="5" height="8" rx="2" fill="white" />
      <path d="M17 9 L15 17" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 11 L21 14 L23 11" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12 L10 17" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M15 17 L13 22 L10 28 M15 17 L18 22 L20 28" stroke="white" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 16 L5 29 M24 12 L24 29" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  </div>

  <span>Hiking Routes</span>
</div>


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
        {/* Basemap */}
        <MaptoolkitBasemap showTopo={true} />

        {/* Public land management overlay */}
        <LandManagementLayer />

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
  <div className="trail-card">
    <div className="trail-card__header">
      <div className="trail-card__icon">
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <circle cx="18" cy="4.5" r="2.8" fill="#FFF8E9" />
          <rect x="11.5" y="9" width="5" height="8" rx="2" fill="#FFF8E9" />
          <path d="M17 9 L15 17" stroke="#FFF8E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 11 L21 14 L23 11" stroke="#FFF8E9" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 12 L10 17" stroke="#FFF8E9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M15 17 L13 22 L10 28 M15 17 L18 22 L20 28" stroke="#FFF8E9" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 16 L5 29 M24 12 L24 29" stroke="#FFF8E9" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="trail-card__heading">
        <div className="trail-card__eyebrow">
          WILDERNESS TRAIL
        </div>

        <div className="trail-card__title">
          {trip.title}
        </div>
      </div>
    </div>

    <div className="trail-card__divider" />

    <div className="trail-card__description">
      {trip.description}
    </div>

    <div className="trail-card__footer">
      EXPLORE NEW MEXICO
    </div>
  </div>
</Tooltip>
</Marker>
        ))}
      </MapContainer>
    </div>
  )
}