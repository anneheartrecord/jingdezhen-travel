import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { SpotId, TravelSpot } from "../types/travel";

interface InteractiveMapProps {
  readonly activeRouteSpots: readonly TravelSpot[];
  readonly selectedSpotId: SpotId;
  readonly travelerSpotId: SpotId;
  readonly travelSpots: readonly TravelSpot[];
  readonly onSpotSelect: (spot: TravelSpot) => void;
}

/**
 * Renders the cute porcelain-style map and moving traveler.
 *
 * @param props - Map spots, route path, selected spot, and selection callback.
 * @returns Interactive map component.
 */
export function InteractiveMap({
  activeRouteSpots,
  selectedSpotId,
  travelerSpotId,
  travelSpots,
  onSpotSelect,
}: InteractiveMapProps) {
  const travelerSpot = travelSpots.find((spot) => spot.id === travelerSpotId) ?? activeRouteSpots[0] ?? travelSpots[0];
  const routePath = createRoutePath(activeRouteSpots);

  return (
    <div className="porcelain-map" aria-label="景德镇景点分布地图">
      <img alt="" className="map-art" src={`${import.meta.env.BASE_URL}assets/porcelain-map.png`} />
      <div className="map-river" aria-hidden="true" />
      <div className="map-mountain mountain-left" aria-hidden="true" />
      <div className="map-mountain mountain-right" aria-hidden="true" />
      <span className="cluster-label central">市区核心</span>
      <span className="cluster-label east">陶溪川 / 三宝</span>
      <span className="cluster-label fuliang">浮梁远郊</span>

      <svg className="route-line" viewBox="0 0 100 100" role="img" aria-label="当前路线连线">
        <path d={routePath} />
      </svg>

      {travelSpots.map((spot) => (
        <button
          aria-label={`查看${spot.name}`}
          className={selectedSpotId === spot.id ? "spot-marker active" : "spot-marker"}
          key={spot.id}
          onClick={() => onSpotSelect(spot)}
          style={{ left: `${spot.mapPosition.x}%`, top: `${spot.mapPosition.y}%` }}
          type="button"
        >
          <MapPin size={16} aria-hidden="true" />
          <span>{spot.shortName}</span>
        </button>
      ))}

      <motion.div
        animate={{ left: `${travelerSpot.mapPosition.x}%`, top: `${travelerSpot.mapPosition.y}%` }}
        className="traveler"
        initial={false}
        transition={{ damping: 18, stiffness: 120, type: "spring" }}
      >
        <img alt="" className="traveler-avatar" src={`${import.meta.env.BASE_URL}assets/traveler-character.png`} />
        <span className="traveler-shadow" />
      </motion.div>
    </div>
  );
}

/**
 * Converts route spot positions into an SVG path.
 *
 * @param routeSpots - Ordered route attractions.
 * @returns SVG path string.
 */
function createRoutePath(routeSpots: readonly TravelSpot[]): string {
  if (routeSpots.length === 0) {
    return "";
  }

  const [firstSpot, ...remainingSpots] = routeSpots;
  return remainingSpots.reduce(
    (pathValue, spot) => `${pathValue} L ${spot.mapPosition.x} ${spot.mapPosition.y}`,
    `M ${firstSpot.mapPosition.x} ${firstSpot.mapPosition.y}`,
  );
}
