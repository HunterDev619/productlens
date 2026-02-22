import { formatNumberValue } from '@/utils/namespaces/format';
import { GlobeHemisphereEast, MapPin, MapTrifold, Truck } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

type SupplyChainTraceabilityAndTransportationProps = {
  supplyChainMapping: any;
  geographicAnalysis: any;
};

export default function SupplyChainTraceabilityAndTransportation({
  supplyChainMapping,
  geographicAnalysis,
}: SupplyChainTraceabilityAndTransportationProps) {
  const geoSupplyChainMapping = geographicAnalysis?.supply_chain_mapping;
  const regionalImpactIntensity = geographicAnalysis?.regional_impact_intensity;
  const distributionRoutes = geoSupplyChainMapping?.distribution_routes || [];
  const rawMaterials = geoSupplyChainMapping?.raw_materials || [];
  const manufacturingHubs = geoSupplyChainMapping?.manufacturing_hubs || [];
  const uniqueCountrySet = new Set<string>();
  rawMaterials.forEach((m: any) => (m?.source_countries || []).forEach((c: any) => uniqueCountrySet.add(typeof c === 'string' ? c : (c?.country || 'Unknown'))));

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  // Create teardrop-shaped marker icon
  const createTeardropIcon = (L: any, color: string = '#3b82f6') => {
    const svgIcon = `
      <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" 
              fill="${color}" 
              stroke="white" 
              stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `;
    return L.divIcon({
      html: svgIcon,
      className: 'custom-teardrop-marker',
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
    });
  };

  // Leaflet map for distribution routes
  useEffect(() => {
    if (!mapRef.current || distributionRoutes.length === 0) {
      return;
    }
    const win = window as any;

    const ensureLeaflet = (): Promise<any> => {
      if (win.L) {
        return Promise.resolve(win.L);
      }
      return new Promise((resolve) => {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => resolve(win.L);
        document.body.appendChild(script);
      });
    };

    let timeoutId: any;
    ensureLeaflet().then((L) => {
      // If an instance already exists, remove it safely
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch {}

      if (!mapRef.current) {
        return; // container unmounted
      }

      mapInstanceRef.current = L.map(mapRef.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Leaflet | © OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add custom CSS for popup
      if (!document.getElementById('leaflet-popup-custom-css')) {
        const style = document.createElement('style');
        style.id = 'leaflet-popup-custom-css';
        style.textContent = `
          .material-sourcing-popup .leaflet-popup-content-wrapper,
          .distribution-route-popup .leaflet-popup-content-wrapper,
          .manufacturing-hub-popup .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 0;
          }
          .material-sourcing-popup .leaflet-popup-content,
          .distribution-route-popup .leaflet-popup-content,
          .manufacturing-hub-popup .leaflet-popup-content {
            margin: 0;
            padding: 16px;
          }
          .material-sourcing-popup .leaflet-popup-tip,
          .distribution-route-popup .leaflet-popup-tip,
          .manufacturing-hub-popup .leaflet-popup-tip {
            background: white;
          }
        `;
        document.head.appendChild(style);
      }

      const allLatLngs: any[] = [];
      const usedCoordinates = new Map<string, number>(); // Track coordinate usage count

      // Helper to create a unique coordinate key
      const getCoordKey = (lat: number, lng: number): string => {
        return `${lat.toFixed(4)},${lng.toFixed(4)}`;
      };

      // Helper to get a unique coordinate by offsetting if duplicate
      const getUniqueLatLng = (lat: number, lng: number): { lat: number; lng: number } => {
        const key = getCoordKey(lat, lng);
        const count = usedCoordinates.get(key) || 0;
        usedCoordinates.set(key, count + 1);

        if (count === 0) {
          // First occurrence, use original coordinates
          return { lat, lng };
        }

        // Duplicate found, offset by count * 0.001 degrees (alternating lat/lng)
        if (count % 2 === 1) {
          // Odd count: offset latitude
          return { lat: lat + (count * 0.1), lng };
        } else {
          // Even count: offset longitude
          return { lat, lng: lng + (count * 0.1) };
        }
      };

      // Helper to normalize various coordinate shapes
      const toLatLngArray = (entry: any): any[] => {
        if (!entry) {
          return [];
        }
        if (Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'number') {
          return [L.latLng(entry[0], entry[1])];
        }
        if (Array.isArray(entry) && entry.length > 0 && Array.isArray(entry[0])) {
          return entry
            .map((p: any) => (Array.isArray(p) && p.length === 2 ? L.latLng(p[0], p[1]) : null))
            .filter(Boolean);
        }
        if (typeof entry === 'object' && typeof entry.lat === 'number' && typeof entry.lng === 'number') {
          return [L.latLng(entry.lat, entry.lng)];
        }
        if (typeof entry === 'object' && entry.coordinates && Array.isArray(entry.coordinates) && entry.coordinates.length === 2) {
          return [L.latLng(entry.coordinates[1], entry.coordinates[0])];
        }
        return [];
      };

      // Draw routes with dashed blue lines
      distributionRoutes.forEach((route: any) => {
        const coords = (route.route_coordinates || []).map(([lat, lng]: [number, number]) => {
          const unique = getUniqueLatLng(lat, lng);
          return L.latLng(unique.lat, unique.lng);
        });
        if (coords.length === 0) {
          return;
        }
        allLatLngs.push(...coords);
        const poly = L.polyline(coords, { color: '#3b82f6', weight: 3, dashArray: '10,10', opacity: 0.7 });
        poly.addTo(mapInstanceRef.current);

        // Route information
        const from = route.from || route.route?.split('→')[0]?.trim() || 'Unknown';
        const to = route.to || route.route?.split('→')[1]?.trim() || 'Unknown';
        const distance = route.distance_km || null;
        const transportMode = route.transport_mode || route.mode || 'Unknown';
        const emissions = route.emissions || route.emissions_share || null;

        // Blue teardrop markers for each waypoint with popup
        coords.forEach((ll: any, waypointIndex: number) => {
          const waypointLabel = coords.length > 1 ? `Waypoint ${waypointIndex + 1}` : 'Route Point';
          const coordinates = `${ll.lat.toFixed(4)}, ${ll.lng.toFixed(4)}`;

          // Create popup content
          const popupContent = `
            <div style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">Distribution Route</h3>
                <button onclick="this.closest('.leaflet-popup').closePopup()"
                        style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 18px; color: #6b7280; line-height: 1;">
                  ×
                </button>
              </div>
              <div style="margin-bottom: 10px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">Route</p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #3b82f6;">
                  ${from} → ${to}
                </p>
              </div>
              ${distance
                ? `
                <div style="margin-bottom: 10px;">
                  <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">Distance</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 500; color: #111827;">
                    ${formatNumberValue(distance)} km
                  </p>
                </div>
              `
                : ''}
              <div style="margin-bottom: 10px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">Transport Mode</p>
                <p style="margin: 0; font-size: 14px; font-weight: 500; color: #111827;">
                  ${transportMode}
                </p>
              </div>
              ${emissions
                ? `
                <div style="margin-bottom: 10px;">
                  <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;">Emissions</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 500; color: #111827;">
                    ${formatNumberValue(emissions)} kg CO₂e
                  </p>
                </div>
              `
                : ''}
              <hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">
              <div style="margin-bottom: 6px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${waypointLabel}</p>
                <p style="margin: 0; font-size: 12px; color: #9ca3af; font-family: monospace;">
                  ${coordinates}
                </p>
              </div>
            </div>
          `;

          const marker = L.marker(ll, { icon: createTeardropIcon(L, '#3b82f6') });
          marker.bindPopup(popupContent, {
            className: 'distribution-route-popup',
            maxWidth: 320,
            closeButton: false,
          });
          marker.addTo(mapInstanceRef.current);
        });
      });

      // Manufacturing hubs (orange teardrop markers)
      manufacturingHubs.forEach((hub: any) => {
        const name = hub?.name || hub?.hub_name || 'Manufacturing Hub';
        const sources = hub?.hub_coordinates || hub?.coordinates || hub?.location || hub;
        const location = typeof hub?.location === 'string' ? hub.location : hub?.location?.name || 'Global';
        const emissions = hub?.emissions || hub?.annual_emissions || hub?.emissions_share || null;
        const processes = Array.isArray(hub?.processes) ? hub.processes : [];
        const workforce = hub?.workforce || hub?.employees || null;
        const gridIntensity = hub?.grid_carbon_intensity || hub?.grid_intensity || null;

        const latlngs = toLatLngArray(sources);
        latlngs.forEach((ll: any) => {
          const unique = getUniqueLatLng(ll.lat, ll.lng);
          const uniqueLL = L.latLng(unique.lat, unique.lng);
          allLatLngs.push(uniqueLL);
          const marker = L.marker(uniqueLL, { icon: createTeardropIcon(L, '#f59e0b') });
          const popupContent = `
            <div style="min-width: 260px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #92400e;">Manufacturing Hub</h3>
                <button onclick="this.closest('.leaflet-popup').closePopup()"
                        style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 18px; color: #6b7280; line-height: 1;">
                  ×
                </button>
              </div>
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #111827;">${name}</p>
              <p style="margin: 0 0 10px 0; font-size: 13px; color: #4b5563;">${location}</p>
              ${processes.length > 0
                ? `
                  <div style="margin-bottom: 10px;">
                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #6b7280;">Key Processes</p>
                    <ul style="margin: 0; padding-left: 18px; color: #1f2937; font-size: 13px;">
                      ${processes.slice(0, 3).map((proc: string) => `<li>${proc}</li>`).join('')}
                    </ul>
                    ${processes.length > 3 ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #9ca3af;">+${processes.length - 3} more</p>` : ''}
                  </div>
                `
                : ''}
              ${emissions
                ? `
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Annual Emissions</p>
                    <p style="margin: 0; font-size: 13px; font-weight: 500; color: #111827;">
                      ${formatNumberValue(emissions)} kg CO₂e
                    </p>
                  </div>
                `
                : ''}
              ${gridIntensity
                ? `
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Grid Carbon Intensity</p>
                    <p style="margin: 0; font-size: 13px; font-weight: 500; color: #111827;">
                      ${formatNumberValue(gridIntensity)} g CO₂e/kWh
                    </p>
                  </div>
                `
                : ''}
              ${workforce
                ? `
                  <div style="margin-bottom: 8px;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Estimated Workforce</p>
                    <p style="margin: 0; font-size: 13px; font-weight: 500; color: #111827;">
                      ${formatNumberValue(workforce, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                `
                : ''}
            </div>
          `;
          marker.bindTooltip(name, { permanent: false });
          marker.bindPopup(popupContent, {
            className: 'manufacturing-hub-popup',
            maxWidth: 320,
            closeButton: false,
          });
          marker.addTo(mapInstanceRef.current);
        });
      });

      // Raw material sources with teardrop markers and popups
      rawMaterials.forEach((material: any) => {
        const materialLabel = material?.material || material?.material_name || 'Raw Material';
        const emissionsByCountry = material?.emissions_by_country || {};
        const materialsList = Array.isArray(material?.materials) ? material.materials : [materialLabel];
        const source = material?.source || 'USGS';

        const fromSourceCountries = Array.isArray(material?.source_countries) && material.source_countries.length > 0;
        if (fromSourceCountries) {
          material.source_countries.forEach((c: any) => {
            const latlngs = toLatLngArray(c?.coordinates || c);
            latlngs.forEach((ll: any) => {
              const unique = getUniqueLatLng(ll.lat, ll.lng);
              const uniqueLL = L.latLng(unique.lat, unique.lng);
              allLatLngs.push(uniqueLL);
              const countryName = c?.country || '';
              const meta = emissionsByCountry?.[countryName];
              const intensity = meta?.intensity;
              const color = intensity === 'high' ? '#ef4444' : intensity === 'medium' ? '#f59e0b' : '#3b82f6';

              // Create description
              const description = material?.description
                || `${materialsList.join(', ')} sourced from manufacturers in major industrial cities.`
                || `${materialLabel} sourced from ${countryName}.`;

              // Create popup content
              const popupContent = `
                <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">Material Sourcing</h3>
                    <button onclick="this.closest('.leaflet-popup').closePopup()" 
                            style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 18px; color: #6b7280; line-height: 1;">
                      ×
                    </button>
                  </div>
                  <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3b82f6;">${countryName}</p>
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${description}</p>
                  <hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 7v10c0 2 2 4 4 4h8c2 0 4-2 4-4V7c0-2-2-4-4-4H8c-2 0-4 2-4 4z"/>
                      <path d="M9 9h6M9 13h6M9 17h4"/>
                    </svg>
                    <span>Source: ${source}</span>
                  </div>
                </div>
              `;

              const marker = L.marker(uniqueLL, { icon: createTeardropIcon(L, color) });
              marker.bindPopup(popupContent, {
                className: 'material-sourcing-popup',
                maxWidth: 300,
                closeButton: false,
              });
              marker.addTo(mapInstanceRef.current);
            });
          });
          return;
        }

        const possible = material?.source_coordinates || material?.coordinates || material?.locations || material?.source_locations || [];
        const list = Array.isArray(possible) ? possible : [possible];
        list.forEach((entry: any) => {
          const latlngs = toLatLngArray(entry);
          latlngs.forEach((ll: any) => {
            const unique = getUniqueLatLng(ll.lat, ll.lng);
            const uniqueLL = L.latLng(unique.lat, unique.lng);
            allLatLngs.push(uniqueLL);
            const description = material?.description
              || `${materialLabel} sourced from manufacturers in major industrial cities.`;
            const popupContent = `
              <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #111827;">Material Sourcing</h3>
                  <button onclick="this.closest('.leaflet-popup').closePopup()" 
                          style="background: none; border: none; cursor: pointer; padding: 4px; font-size: 18px; color: #6b7280; line-height: 1;">
                    ×
                  </button>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3b82f6;">${materialLabel}</p>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">${description}</p>
                <hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 7v10c0 2 2 4 4 4h8c2 0 4-2 4-4V7c0-2-2-4-4-4H8c-2 0-4 2-4 4z"/>
                    <path d="M9 9h6M9 13h6M9 17h4"/>
                  </svg>
                  <span>Source: ${material?.source || 'USGS'}</span>
                </div>
              </div>
            `;
            const marker = L.marker(uniqueLL, { icon: createTeardropIcon(L, '#3b82f6') });
            marker.bindPopup(popupContent, {
              className: 'material-sourcing-popup',
              maxWidth: 300,
              closeButton: false,
            });
            marker.addTo(mapInstanceRef.current);
          });
        });
      });

      if (allLatLngs.length > 0) {
        const bounds = L.latLngBounds(allLatLngs);
        mapInstanceRef.current.fitBounds(bounds.pad(0.2));
      }

      // Fix render issues when container just mounted
      timeoutId = setTimeout(() => {
        try {
          mapInstanceRef.current?.invalidateSize?.();
        } catch {}
      }, 100);
    });

    return () => {
      try {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        mapInstanceRef.current?.remove?.();
        mapInstanceRef.current = null;
      } catch {}
    };
  }, [distributionRoutes, rawMaterials, manufacturingHubs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GlobeHemisphereEast size={18} className="text-sky-600" />
        <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Supply-chain Traceability & Transportation</h3>
      </div>

      {/* Distribution Routes Map (Top) */}
      {distributionRoutes.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div ref={mapRef} className="h-96 w-full overflow-hidden rounded-lg sm:h-[28rem] lg:h-[36rem]" />
          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-700 sm:text-sm">
            <div className="inline-flex items-center gap-1.5">
              <svg width="16" height="24" viewBox="0 0 24 36" className="inline-block">
                <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              <span>Route waypoints</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <svg width="16" height="24" viewBox="0 0 24 36" className="inline-block">
                <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              <span>Manufacturing hubs</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <svg width="16" height="24" viewBox="0 0 24 36" className="inline-block">
                <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              <span>Raw materials (low)</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <svg width="16" height="24" viewBox="0 0 24 36" className="inline-block">
                <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              <span>Raw materials (medium)</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <svg width="16" height="24" viewBox="0 0 24 36" className="inline-block">
                <path d="M12 0 C5.4 0 0 5.4 0 12 C0 18 12 36 12 36 C12 36 24 18 24 12 C24 5.4 18.6 0 12 0 Z" fill="#ef4444" stroke="white" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              <span>Raw materials (high)</span>
            </div>
          </div>
        </div>
      )}

      {/* Supply Chain Mapping */}
      {supplyChainMapping && (
        <div className="space-y-6">
          {/* Tier Breakdown */}
          {supplyChainMapping.tier_breakdown && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h5 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MapTrifold size={18} className="text-gray-700" />
                Supplier Tier Breakdown
              </h5>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {supplyChainMapping.tier_breakdown.tier_1_suppliers !== undefined && (
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {supplyChainMapping.tier_breakdown.tier_1_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 1 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.tier_2_suppliers !== undefined && (
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-3xl font-bold text-green-700">
                      {supplyChainMapping.tier_breakdown.tier_2_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 2 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.tier_3_suppliers !== undefined && (
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-700">
                      {supplyChainMapping.tier_breakdown.tier_3_suppliers}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Tier 3 Suppliers</p>
                  </div>
                )}
                {supplyChainMapping.tier_breakdown.geographical_spread && (
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <p className="text-sm font-bold text-purple-700">
                      {supplyChainMapping.tier_breakdown.geographical_spread}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">Geographical Spread</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transportation Network */}
          {supplyChainMapping.transportation_network && supplyChainMapping.transportation_network.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-gray-600" />
                  <h5 className="text-lg font-semibold text-gray-900 sm:text-xl">Transportation Distance & Emissions</h5>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                    {`${formatNumberValue(
                      supplyChainMapping.transportation_network.reduce(
                        (sum: number, route: any) => sum + (Number(route.distance_km) || 0),
                        0,
                      ),
                    )} km`}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-base font-semibold text-gray-700">Route</th>
                      <th className="pb-3 text-right text-base font-semibold text-gray-700">Distance (km)</th>
                      <th className="pb-3 text-center text-base font-semibold text-gray-700">Transport Mode</th>
                      <th className="pb-3 text-right text-base font-semibold text-gray-700">Emissions (kg CO₂e)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplyChainMapping.transportation_network.map((route: any, index: number) => (
                      <tr key={route.route || `route-${index}`} className="border-b border-gray-100">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-base text-gray-900">{route.route || 'Unknown Route'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-base text-gray-700">
                          {route.distance_km !== undefined && route.distance_km !== null
                            ? formatNumberValue(route.distance_km)
                            : '-'}
                        </td>
                        <td className="py-3 text-center">
                          {route.mode && (
                            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                              {route.mode}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right text-base text-gray-700">
                          {route.emissions_share !== undefined && route.emissions_share !== null
                            ? formatNumberValue(route.emissions_share)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                      <td className="py-3 text-base text-gray-900">Total Transportation</td>
                      <td className="py-3 text-right text-base text-gray-900">
                        {`${formatNumberValue(
                          supplyChainMapping.transportation_network.reduce(
                            (sum: number, route: any) => sum + (Number(route.distance_km) || 0),
                            0,
                          ),
                        )} km`}
                      </td>
                      <td className="py-3 text-center text-sm text-gray-600">-</td>
                      <td className="py-3 text-right text-base text-gray-900">
                        {`${formatNumberValue(
                          supplyChainMapping.transportation_network.reduce(
                            (sum: number, route: any) => sum + (Number(route.emissions_share) || 0),
                            0,
                          ),
                        )} kg CO₂e`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Geographic Impact Analysis */}
      {geographicAnalysis && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobeHemisphereEast size={18} className="text-sky-600" />
              <h4 className="text-xl font-semibold text-gray-900">Geographic Impact Analysis</h4>
            </div>
            {rawMaterials.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="mr-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                  {rawMaterials.length}
                  {' '}
                  materials
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700">
                  {uniqueCountrySet.size}
                  {' '}
                  source countries
                </span>
              </div>
            )}
          </div>

          {/* Supply Chain Materials */}
          {geoSupplyChainMapping && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h5 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MapTrifold size={18} className="text-gray-700" />
                Supply Chain Materials
              </h5>
              {geoSupplyChainMapping?.raw_materials && geoSupplyChainMapping.raw_materials.length > 0
                ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {geoSupplyChainMapping.raw_materials.map((material: any, index: number) => (
                        <div key={material.material || `material-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <h6 className="font-semibold text-gray-900">{material.material || 'Unknown Material'}</h6>
                          {material.source_countries && material.source_countries.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">Source Countries</p>
                              <div className="flex flex-wrap gap-2">
                                {material.source_countries.map((country: any, countryIndex: number) => {
                                  const countryName = typeof country === 'string' ? country : country?.country || 'Unknown';
                                  const key = typeof country === 'string' ? country : `${country?.country || 'unknown'}-${countryIndex}`;
                                  return (
                                    <span key={key} className="rounded-full bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                                      {countryName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                : (
                    <p className="text-gray-500">No supply chain mapping data available</p>
                  )}
            </div>
          )}

          {/* Regional Impact Intensity */}
          {regionalImpactIntensity && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h5 className="mb-4 text-lg font-semibold text-gray-900">Regional Impact Intensity</h5>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h6 className="font-semibold text-red-700">High Impact Regions</h6>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-700 ring-1 ring-red-200">
                      {regionalImpactIntensity.high_impact_regions?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regionalImpactIntensity.high_impact_regions && regionalImpactIntensity.high_impact_regions.length > 0
                      ? regionalImpactIntensity.high_impact_regions.map((region: string, index: number) => (
                          <span key={region || `high-${index}`} className="rounded-full bg-white px-2 py-1 text-sm font-medium text-red-700 ring-1 ring-red-200">
                            {region}
                          </span>
                        ))
                      : (
                          <span className="text-sm text-gray-500">None</span>
                        )}
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h6 className="font-semibold text-yellow-700">Medium Impact Regions</h6>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-sm font-semibold text-yellow-700 ring-1 ring-yellow-200">
                      {regionalImpactIntensity.medium_impact_regions?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regionalImpactIntensity.medium_impact_regions && regionalImpactIntensity.medium_impact_regions.length > 0
                      ? regionalImpactIntensity.medium_impact_regions.map((region: string, index: number) => (
                          <span key={region || `medium-${index}`} className="rounded-full bg-white px-2 py-1 text-sm font-medium text-yellow-700 ring-1 ring-yellow-200">
                            {region}
                          </span>
                        ))
                      : (
                          <span className="text-sm text-gray-500">None</span>
                        )}
                  </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h6 className="font-semibold text-green-700">Low Impact Regions</h6>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-700 ring-1 ring-green-200">
                      {regionalImpactIntensity.low_impact_regions?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {regionalImpactIntensity.low_impact_regions && regionalImpactIntensity.low_impact_regions.length > 0
                      ? regionalImpactIntensity.low_impact_regions.map((region: string, index: number) => (
                          <span key={region || `low-${index}`} className="rounded-full bg-white px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-green-200">
                            {region}
                          </span>
                        ))
                      : (
                          <span className="text-sm text-gray-500">None</span>
                        )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
