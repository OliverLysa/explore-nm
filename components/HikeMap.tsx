"use client"

import { useState } from "react"

import {
  MapContainer,
  Marker,
  Popup,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import RouteLayer from "./RouteLayer"
import MaptoolkitBasemap from "./MaptoolkitBasemap"

import L from "leaflet"

import { trips, Trip } from "../data/trips"

import ElevationChart from "./ElevationChart"
import TrailheadsLayer, {
  TRAIL_ACTIVITY_OPTIONS,
  ACTIVITY_STYLES,
  type TrailActivity,
} from "./TrailheadsLayer"

import LandManagementLayer, {
  LAND_MANAGER_OPTIONS,
} from "./LandManagementLayer";

const photoIcon = new L.Icon({
  iconUrl: "/icons/photo-marker.svg",

  iconSize: [30, 30],

  iconAnchor: [15, 30],

  popupAnchor: [0, -30]
})

export default function HikeMap() {
  const [selectedTrip, setSelectedTrip] =
    useState<Trip | null>(null)

  const [showRecreation, setShowRecreation] = useState(true)

  const [showRecreationPanel, setShowRecreationPanel] = useState(false)

  const [selectedActivities, setSelectedActivities] =
    useState<TrailActivity[]>([...TRAIL_ACTIVITY_OPTIONS])


  const [selectedLandManagers, setSelectedLandManagers] =
  useState<(typeof LAND_MANAGER_OPTIONS)[number]["id"][]>([]);

const [showLandLegend, setShowLandLegend] =
  useState(false);


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

{/* Unified Recreation Opportunities control */}
<div
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1200,
    width: "270px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    padding: "12px 14px",
    fontSize: "13px",
    color: "#24352d",
  }}
>
  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
    <input
      type="checkbox"
      aria-label="Show recreation opportunities"
      checked={showRecreation}
      onChange={(e) => setShowRecreation(e.target.checked)}
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    />
    <button
      type="button"
      onClick={() => setShowRecreationPanel((open) => !open)}
      aria-expanded={showRecreationPanel}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: 0,
        background: "none",
        padding: 0,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "14px",
        color: "inherit",
        textAlign: "left",
      }}
    >
      <span>Recreation Opportunities</span>
      <span>{showRecreationPanel ? "▲" : "▼"}</span>
    </button>
  </div>

  {showRecreationPanel && (
    <div style={{ borderTop: "1px solid #e5e7e3", marginTop: "10px", paddingTop: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", color: "#68736c", fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase" }}>
          Activity filters
        </span>
        <button
          type="button"
          onClick={() => setSelectedActivities(
            selectedActivities.length === TRAIL_ACTIVITY_OPTIONS.length
              ? []
              : [...TRAIL_ACTIVITY_OPTIONS]
          )}
          style={{ border: 0, background: "none", padding: 0, color: "#426b59", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
        >
          {selectedActivities.length === TRAIL_ACTIVITY_OPTIONS.length ? "Clear all" : "Select all"}
        </button>
      </div>

      {TRAIL_ACTIVITY_OPTIONS.map((activity) => (
        <label
          key={activity}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "5px 0",
            cursor: "pointer",
            opacity: showRecreation ? 1 : 0.45,
          }}
        >
          <input
            type="checkbox"
            checked={selectedActivities.includes(activity)}
            disabled={!showRecreation}
            onChange={(e) => setSelectedActivities((previous) =>
              e.target.checked
                ? [...previous, activity]
                : previous.filter((item) => item !== activity)
            )}
          />
          <span style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: ACTIVITY_STYLES[activity].color,
            border: "1px solid rgba(0,0,0,0.2)",
            flexShrink: 0,
          }} />
          <span>{activity}</span>
        </label>
      ))}
      <div style={{ borderTop: "1px solid #eef0ed", marginTop: "5px", paddingTop: "7px", fontSize: "11px", color: "#68736c" }}>
        Includes curated hiking routes and USFS recreation access points.
      </div>
    </div>
  )}
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


{/* Public land managers control */}
<div
  style={{
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1000,
    width: "250px",
    background: "rgba(255,255,255,0.96)",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
    padding: "12px 14px",
    fontSize: "13px",
  }}
>
  {/* Legend heading */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
    }}
  >
    <button
      onClick={() => setShowLandLegend(!showLandLegend)}
      style={{
        border: "none",
        background: "none",
        padding: 0,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "14px",
        textAlign: "left",
        flex: 1,
      }}
    >
      Public Land Managers
      <span style={{ marginLeft: "8px" }}>
        {showLandLegend ? "▼" : "▲"}
      </span>
    </button>

    <label
      title="Toggle all public land managers"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        fontSize: "12px",
        whiteSpace: "nowrap",
      }}
    >
      All
      <input
        type="checkbox"
        checked={
          selectedLandManagers.length === LAND_MANAGER_OPTIONS.length
        }
        onChange={(e) =>
          setSelectedLandManagers(
            e.target.checked
              ? LAND_MANAGER_OPTIONS.map((manager) => manager.id)
              : []
          )
        }
      />
    </label>
  </div>

  {/* Individual manager controls */}
  {showLandLegend && (
    <div
      style={{
        marginTop: "10px",
        borderTop: "1px solid #e5e5e5",
        paddingTop: "8px",
      }}
    >
      {LAND_MANAGER_OPTIONS.map((manager) => (
        <label
          key={manager.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "4px 0",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={selectedLandManagers.includes(manager.id)}
            onChange={(e) => {
              setSelectedLandManagers((previous) =>
                e.target.checked
                  ? [...previous, manager.id]
                  : previous.filter((id) => id !== manager.id)
              );
            }}
          />

          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: manager.color,
              border: "1px solid #777",
              borderRadius: "3px",
              flexShrink: 0,
            }}
          />

          <span>{manager.label}</span>
        </label>
      ))}
    </div>
  )}
</div>

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

        {/* Unified recreation opportunities: curated trails and USFS access points */}
        {showRecreation && (
          <TrailheadsLayer
            selectedActivities={selectedActivities}
            curatedTrips={trips}
            onSelectTrip={setSelectedTrip}
          />
        )}

        {/* Public land management overlay */}
<LandManagementLayer
  selectedManagers={selectedLandManagers}
/>

        {/* Route layer */}
        {showRecreation && selectedActivities.includes("Hiking") && selectedTrip?.routeFile && (
          <RouteLayer
  file={selectedTrip.routeFile}

  onElevationData={
    setElevationData
  }
/>
        )}

{/* Photo markers */}
{showRecreation && selectedActivities.includes("Hiking") && selectedTrip?.photos?.map((photo) => (
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


      </MapContainer>
    </div>
  )
}