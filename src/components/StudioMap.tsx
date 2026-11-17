import { useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';
import type { MapLocation } from '../types/cms';

interface StudioMapProps {
  apiKey: string;
  location: MapLocation;
}

function SanctuaryMarker({ location }: { location: MapLocation }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);
  const position = { lat: Number(location.lat) || 49.2827, lng: Number(location.lng) || -123.1207 };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        title={location.markerLabel}
        onClick={() => setInfoOpen((prev) => !prev)}
      >
        <Pin background="#3F4F3B" borderColor="#1E241E" glyphColor="#F8F6F1" scale={1.15} />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={240} onCloseClick={() => setInfoOpen(false)}>
          <div className="p-1 text-[#1E241E] space-y-1">
            <p className="text-sm font-semibold">{location.markerLabel}</p>
            <p className="text-xs text-[#5A6358]">{location.address}</p>
            <p className="text-xs text-[#5A6358]">
              {location.city}, {location.region}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function StudioMap({ apiKey, location }: StudioMapProps) {
  const lat = Number(location.lat) || 49.2827;
  const lng = Number(location.lng) || -123.1207;
  const zoom = Number(location.zoom) || 13;
  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lat},${lng}`
  )}`;

  if (!apiKey) {
    return (
      <div className="w-full h-[360px] rounded-2xl border border-[#E2DDD2] bg-[#F0ECE3] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <MapPin className="w-8 h-8 text-[#5E7059]" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-base font-medium text-[#1E241E]">{location.markerLabel}</p>
          <p className="text-sm text-[#5A6358]">
            {location.address} · {location.city}, {location.region}
          </p>
          <p className="text-xs font-tabular text-[#5A6358]">
            Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>
        <a
          href={mapsExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[#FFFFFF] border border-[#D8D2C5] text-[#1E241E] hover:bg-[#F8F6F1] transition-colors"
        >
          Open in Google Maps
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-[#E2DDD2]">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <GoogleMap
          mapId="DEMO_MAP_ID"
          center={{ lat, lng }}
          zoom={zoom}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <SanctuaryMarker location={location} />
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
