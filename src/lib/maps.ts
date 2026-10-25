function locationQuery(address: string, district: string): string {
  return [address, district]
    .map((part) => part.trim().replace(/[—–]/g, '-').replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(', ');
}

export function googleMapsSearchUrl(address: string, district: string): string {
  const query = locationQuery(address, district);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsEmbedUrl(address: string, district: string): string {
  // Coordenadas fijas del atelier Fernandina de Jagua (Jr. Comandante Juan Guillermo Moore 296, San Miguel, Lima)
  // Lat: -12.08381, Lon: -77.08738
  // El uso de OpenStreetMap con marcador fijo garantiza que el mapa muestre SIEMPRE
  // la ubicación exacta de Fernandina de Jagua en San Miguel, sin solicitar permisos
  // de geolocalización al visitante ni sustituir la vista por su ubicación en tiempo real.
  const coordMatch = address?.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
  const lat = coordMatch ? parseFloat(coordMatch[1]) : -12.08381;
  const lon = coordMatch ? parseFloat(coordMatch[2]) : -77.08738;

  const delta = 0.0055;
  const minLon = (lon - delta).toFixed(5);
  const minLat = (lat - delta).toFixed(5);
  const maxLon = (lon + delta).toFixed(5);
  const maxLat = (lat + delta).toFixed(5);

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`;
}
