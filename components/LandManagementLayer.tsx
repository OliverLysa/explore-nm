
"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import * as EsriLeaflet from "esri-leaflet";

const SERVICE_URL =
  "https://services.arcgis.com/v01gqwM5QqNysAAi/ArcGIS/rest/services/Fee_Managers_PADUS/FeatureServer/0";

const agencyColors: Record<string, string> = {
  USFS: "#78A878", // Forest Service
  BLM: "#E7C65B",  // Bureau of Land Management
  NPS: "#C98686",  // National Park Service
  FWS: "#80BBD1",  // Fish and Wildlife Service
  USBR: "#78A9D6", // Bureau of Reclamation
  USACE: "#70C9D0", // Army Corps of Engineers
  DOD: "#8C6D4F", // Department of Defense
  SLB: "#C6A0C8",  // State trust land
  SDOL: "#C6A0C8",
  SDNR: "#C6A0C8",
  SFW: "#A9A0D8",  // State Fish and Wildlife
  SPR: "#A9BCE0",  // State parks
};

export default function LandManagementLayer() {
  const map = useMap();

  useEffect(() => {
    const esri = EsriLeaflet as unknown as {
      featureLayer: (options: {
        url: string;
        fields: string[];
        simplifyFactor: number;
        precision: number;
        style: (feature: {
          properties?: Record<string, string>;
        }) => L.PathOptions;
      }) => L.Layer;
    };

    const layer = esri.featureLayer({
      url: SERVICE_URL,
      fields: ["OBJECTID", "Mang_Name", "Own_Name", "Unit_Nm"],
      simplifyFactor: 0.5,
      precision: 5,
      style: (feature) => {
        const manager = feature.properties?.Mang_Name ?? "";
        const color = agencyColors[manager];

        return {
  color: color ?? "#B9B9B9",
  weight: 0.6,
  opacity: 0.8,
  fillColor: color ?? "#B9B9B9",
  fill: true,
  fillOpacity: color ? 0.3 : 0,
};
      },
    });

    // Put the public-land overlay above the basemap.
    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        left: "20px",
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
        fontSize: "13px",
        lineHeight: 1.8,
      }}
    >
      <strong>Public Land Managers</strong>

      {(
        [
          ["USFS", "U.S. Forest Service"],
          ["BLM", "Bureau of Land Management"],
          ["NPS", "National Park Service"],
          ["FWS", "Fish and Wildlife Service"],
          ["USBR", "Bureau of Reclamation"],
          ["USACE", "Army Corps of Engineers"],
          ["DOD", "Department of Defense"],
          ["SLB", "State Land"],
        ] as [string, string][]
      ).map(([agency, label]) => (
        <div
          key={agency}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: agencyColors[agency],
              border: "1px solid #777",
              borderRadius: "3px",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
