import { ExternalLink, Timer } from "lucide-react";
import type { TravelSpot } from "../types/travel";
import { createAmapSearchUrl } from "../utils/mapLinks";
import { formatDuration } from "../utils/planner";

interface SpotDetailPanelProps {
  readonly spot: TravelSpot;
}

/**
 * Renders practical details for the selected attraction.
 *
 * @param props - Selected attraction.
 * @returns Attraction detail panel.
 */
export function SpotDetailPanel({ spot }: SpotDetailPanelProps) {
  return (
    <article className="info-panel spot-detail">
      <div className="panel-heading">
        <Timer size={20} aria-hidden="true" />
        <div>
          <h2>{spot.name}</h2>
          <p>{spot.areaLabel} · 建议 {formatDuration(spot.recommendedMinutes)}</p>
        </div>
      </div>

      <p className="roast-line">{spot.roast}</p>

      <div className="tag-row">
        {spot.moods.map((mood) => (
          <span key={mood}>{mood}</span>
        ))}
      </div>

      <div className="detail-grid">
        <div>
          <strong>适合</strong>
          <p>{spot.goodFor.join("、")}</p>
        </div>
        <div>
          <strong>不适合</strong>
          <p>{spot.avoidFor.join("、")}</p>
        </div>
        <div>
          <strong>预约</strong>
          <p>{spot.bookingNote}</p>
        </div>
        <div>
          <strong>交通</strong>
          <p>{spot.transportNote}</p>
        </div>
      </div>

      <ul className="tip-list">
        {spot.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      <a className="map-link" href={createAmapSearchUrl(spot)} rel="noreferrer" target="_blank">
        <ExternalLink size={16} aria-hidden="true" />
        打开地图搜索
      </a>
    </article>
  );
}
