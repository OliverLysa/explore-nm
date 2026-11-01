
"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import * as EsriLeaflet from "esri-leaflet";

const SERVICE_URL =
  "https://services.arcgis.com/v01gqwM5QqNysAAi/ArcGIS/rest/services/Fee_Managers_PADUS/FeatureServer/0";

// Each option corresponds to a checkbox in the map legend.
// State Land combines the state-related manager codes.
export const LAND_MANAGER_OPTIONS = [
  {
    id: "USFS",
    label: "U.S. Forest Service",
    color: "#78A878",
    codes: ["USFS"],
  },
  {
    id: "BLM",
    label: "Bureau of Land Management",
    color: "#E7C65B",
    codes: ["BLM"],
  },
  {
    id: "NPS",
    label: "National Park Service",
    color: "#C98686",
    codes: ["NPS"],
  },
  {
    id: "FWS",
    label: "Fish and Wildlife Service",
    color: "#80BBD1",
    codes: ["FWS"],
  },
  {
    id: "USBR",
    label: "Bureau of Reclamation",
    color: "#78A9D6",
    codes: ["USBR"],
  },
  {
    id: "USACE",
    label: "Army Corps of Engineers",
    color: "#70C9D0",
    codes: ["USACE"],
  },
  {
    id: "DOD",
    label: "Department of Defense",
    color: "#8C6D4F",
    codes: ["DOD"],
  },
  {
    id: "STATE",
    label: "State Land",
    color: "#C6A0C8",
    codes: ["SLB", "SDOL", "SDNR", "SFW", "SPR"],
  },
] as const;

type ManagerId = (typeof LAND_MANAGER_OPTIONS)[number]["id"];

type MapFeature = {
  properties?: Record<string, string>;
};

type ManagedFeatureLayer = L.Layer & {
  setStyle: (
    style: (feature: MapFeature) => L.PathOptions
  ) => void;
};

type Props = {
  selectedManagers: ManagerId[];
};

export default function LandManagementLayer({
  selectedManagers,
}: Props) {
  const map = useMap();

  const layerRef = useRef<ManagedFeatureLayer | null>(null);

  const selectedManagersRef = useRef<ManagerId[]>(selectedManagers);

  // Keep the latest selection available to the layer's style function.
  useEffect(() => {
    selectedManagersRef.current = selectedManagers;

    if (layerRef.current) {
      layerRef.current.setStyle(getFeatureStyle);
    }
  }, [selectedManagers]);

  function getFeatureStyle(feature: MapFeature): L.PathOptions {
    const manager = feature.properties?.Mang_Name ?? "";

    const option = LAND_MANAGER_OPTIONS.find((item) =>
      (item.codes as readonly string[]).includes(manager)
    );

    const visible =
      option &&
      selectedManagersRef.current.includes(option.id);

    if (!visible) {
      return {
        opacity: 0,
        fillOpacity: 0,
        weight: 0,
      };
    }

    return {
      color: option.color,
      weight: 0.6,
      opacity: 0.8,
      fillColor: option.color,
      fill: true,
      fillOpacity: 0.3,
    };
  }

  useEffect(() => {
    const esri = EsriLeaflet as unknown as {
      featureLayer: (options: {
        url: string;
        fields: string[];
        simplifyFactor: number;
        precision: number;
        style: (feature: MapFeature) => L.PathOptions;
      }) => ManagedFeatureLayer;
    };

    const layer = esri.featureLayer({
      url: SERVICE_URL,
      fields: ["OBJECTID", "Mang_Name", "Own_Name", "Unit_Nm"],
      simplifyFactor: 0.5,
      precision: 5,
      style: getFeatureStyle,
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map]);

  return null;
}
