
"use client";

import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import trailheads from "../data/trailheads.json";
import type { Trip } from "../data/trips";

export const TRAIL_ACTIVITY_OPTIONS = [
  "Hiking",
  "Horse Riding",
  "Cycling",
  "Motorised Recreation",
  "Camping",
  "Fishing",
] as const;

export type TrailActivity = (typeof TRAIL_ACTIVITY_OPTIONS)[number];

export const ACTIVITY_STYLES: Record<TrailActivity, { color: string }> = {
  Hiking: { color: "#B65332" },
  "Horse Riding": { color: "#8B6B43" },
  Cycling: { color: "#277C83" },
  "Motorised Recreation": { color: "#657A35" },
  Camping: { color: "#8063A6" },
  Fishing: { color: "#347DB5" },
};

type TrailRecord = {
  name: string;
  district?: string;
  status?: string;
  description?: string;
  uses?: string[];
};

type RecreationLocation = {
  id: string;
  lat: number;
  lng: number;
  locations: string[];
  activities: TrailActivity[];
  trails: TrailRecord[];
};

type Props = {
  selectedActivities: TrailActivity[];
  curatedTrips: Trip[];
  onSelectTrip: (trip: Trip) => void;
};

const locations = trailheads as RecreationLocation[];

// Shared marker dimensions.
const MARKER_SIZE = 25;
const MARKER_HALF = MARKER_SIZE / 2;
const HIKER_SIZE = 19;

// Original hiker drawing, shared by both marker types.
const ORIGINAL_HIKER_SVG = `
  <svg
    viewBox="0 0 32 32"
    width="${HIKER_SIZE}"
    height="${HIKER_SIZE}"
    aria-hidden="true"
    style="display:block; flex-shrink:0;"
  >
    <circle cx="18" cy="4.5" r="2.8" fill="white"/>
    <rect x="11.5" y="9" width="5" height="8" rx="2" fill="white"/>
    <path d="M17 9 L15 17" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <path d="M16 11 L21 14 L23 11" stroke="white" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 12 L10 17" stroke="white" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M15 17 L13 22 L10 28 M15 17 L18 22 L20 28" stroke="white" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 16 L5 29 M24 12 L24 29" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </svg>
`;

// Curated hiking marker: 25 x 25 px with original terracotta circle.
const CURATED_HIKER_ICON = L.divIcon({
  className: "hiking-marker",
  html: `
    <div style="
      width:25px;
      height:25px;
      min-width:25px;
      min-height:25px;
      max-width:25px;
      max-height:25px;
      background:#B65332;
      border:2px solid white;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      box-sizing:border-box;
      overflow:hidden;
      padding:0;
      margin:0;
      box-shadow:0 2px 5px rgba(0,0,0,0.3);
    ">
      ${ORIGINAL_HIKER_SVG}
    </div>
  `,
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5],
  popupAnchor: [0, -12.5],
});

// USFS recreation marker: same 25 x 25 px outer dimensions,
// with an activity-coloured ring.
function makeActivityIcon(activities: TrailActivity[]) {
  const colours = TRAIL_ACTIVITY_OPTIONS
    .filter((activity) => activities.includes(activity))
    .map((activity) => ACTIVITY_STYLES[activity].color);

  const ringBackground =
    colours.length > 1
      ? `conic-gradient(${colours
          .map((colour, index) => {
            const start = (index / colours.length) * 100;
            const end = ((index + 1) / colours.length) * 100;
            return `${colour} ${start}% ${end}%`;
          })
          .join(", ")})`
      : colours[0] || ACTIVITY_STYLES.Hiking.color;

  return L.divIcon({
    className: "hiking-marker",
    html: `
      <div
        style="
          width:${MARKER_SIZE}px;
          height:${MARKER_SIZE}px;
          min-width:${MARKER_SIZE}px;
          min-height:${MARKER_SIZE}px;
          max-width:${MARKER_SIZE}px;
          max-height:${MARKER_SIZE}px;
          padding:2px;
          margin:0;
          border-radius:50%;
          background:${ringBackground};
          box-sizing:border-box;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          box-shadow:0 2px 5px rgba(0,0,0,0.3);
        "
      >
        <div
          style="
            width:21px;
            height:21px;
            min-width:21px;
            min-height:21px;
            max-width:21px;
            max-height:21px;
            border:2px solid white;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            overflow:hidden;
          "
        >
          ${ORIGINAL_HIKER_SVG}
        </div>
      </div>
    `,
    iconSize: [MARKER_SIZE, MARKER_SIZE],
    iconAnchor: [MARKER_HALF, MARKER_HALF],
    popupAnchor: [0, -MARKER_HALF],
    tooltipAnchor: [0, -MARKER_HALF],
  });
}

// Tooltip for the original curated hiking trails.
function CuratedTrailTooltip({ trip }: { trip: Trip }) {
  return (
    <div className="trail-card">
      <div className="trail-card__header">
        <div className="trail-card__icon">
          <svg viewBox="0 0 32 32" aria-hidden="true">
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
  );
}

// Tooltip for USFS recreation locations.
function RecreationTooltip({ point }: { point: RecreationLocation }) {
  const locationName =
    point.locations?.[0] || "Recreation access point";

  const trailNames = point.trails
    .map((trail) => trail.name)
    .filter(Boolean);

  const summary =
    trailNames.length > 0
      ? trailNames.slice(0, 3).join(" · ") +
        (trailNames.length > 3
          ? ` +${trailNames.length - 3} more`
          : "")
      : point.activities.join(" · ");

  return (
    <div className="trail-card">
      <div className="trail-card__header">
        <div className="trail-card__icon">
          <svg viewBox="0 0 32 32" aria-hidden="true">
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
            RECREATION OPPORTUNITY
          </div>

          <div className="trail-card__title">
            {locationName}
          </div>
        </div>
      </div>

      <div className="trail-card__divider" />

      <div className="trail-card__description">
        {summary}
      </div>

      <div className="trail-card__footer">
        EXPLORE NEW MEXICO
      </div>
    </div>
  );
}

export default function TrailheadsLayer({
  selectedActivities,
  curatedTrips,
  onSelectTrip,
}: Props) {
  // Curated trails appear whenever Hiking is selected.
  const visibleCuratedTrips = selectedActivities.includes("Hiking")
    ? curatedTrips
    : [];

  // USFS access points appear when at least one matching activity is selected.
  const visibleLocations = locations.filter((point) =>
    point.activities.some((activity) =>
      selectedActivities.includes(activity)
    )
  );

  return (
    <>
      {/* Curated hiking trails */}
      {visibleCuratedTrips.map((trip) => (
        <Marker
          key={`curated-${trip.slug}`}
          position={[trip.lat, trip.lng]}
          icon={CURATED_HIKER_ICON}
          eventHandlers={{
            click: () => onSelectTrip(trip),
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
            <CuratedTrailTooltip trip={trip} />
          </Tooltip>
        </Marker>
      ))}

      {/* USFS recreation access points */}
      {visibleLocations.map((point) => (
        <Marker
          key={`usfs-${point.id}`}
          position={[point.lat, point.lng]}
          icon={makeActivityIcon(point.activities)}
        >
          <Tooltip
            direction="top"
            offset={[0, -20]}
            opacity={1}
            sticky={false}
            permanent={false}
            className="custom-tooltip"
          >
            <RecreationTooltip point={point} />
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
