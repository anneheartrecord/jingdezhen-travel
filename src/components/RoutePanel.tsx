import { Copy, Pause, Play, RotateCcw } from "lucide-react";
import type { PresetRoute, RoutePlan } from "../types/travel";
import { createRouteShareText } from "../utils/mapLinks";
import { formatDuration } from "../utils/planner";

interface RoutePanelProps {
  readonly isPlaying: boolean;
  readonly plan: RoutePlan;
  readonly presetRoute?: PresetRoute;
  readonly onPause: () => void;
  readonly onPlay: () => void;
  readonly onReplay: () => void;
}

/**
 * Renders route timing, controls, day itinerary, and warnings.
 *
 * @param props - Route plan and traveler animation controls.
 * @returns Route planning side panel.
 */
export function RoutePanel({ isPlaying, plan, presetRoute, onPause, onPlay, onReplay }: RoutePanelProps) {
  const routeSpots = plan.days.flatMap((plannedDay) => plannedDay.stops.map((plannedStop) => plannedStop.spot));

  /**
   * Copies the current route to the clipboard.
   *
   * @returns Promise that resolves when clipboard writing completes.
   */
  async function handleCopyRoute(): Promise<void> {
    await navigator.clipboard.writeText(createRouteShareText(routeSpots));
  }

  return (
    <aside className="route-panel">
      <div className="route-panel-header">
        <div>
          <p className="eyebrow">当前路线</p>
          <h2>{plan.title}</h2>
        </div>
        <span className={`intensity intensity-${plan.intensity}`}>{plan.intensity}</span>
      </div>

      <p className="route-summary">
        {presetRoute?.summary ?? "按你选择的景点顺序估算。远郊点越多，越建议拆成多天或包车。"}
      </p>

      <div className="metric-row">
        <div>
          <strong>{formatDuration(plan.totalMinutes)}</strong>
          <span>总估算</span>
        </div>
        <div>
          <strong>{plan.days.length} 天</strong>
          <span>行程块</span>
        </div>
        <div>
          <strong>{routeSpots.length} 点</strong>
          <span>景点数</span>
        </div>
      </div>

      <div className="control-row" aria-label="小人路线动画控制">
        <button className="icon-button" onClick={isPlaying ? onPause : onPlay} type="button">
          {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          <span>{isPlaying ? "暂停" : "继续"}</span>
        </button>
        <button className="icon-button" onClick={onReplay} type="button">
          <RotateCcw size={18} aria-hidden="true" />
          <span>重走</span>
        </button>
        <button className="icon-button" onClick={() => void handleCopyRoute()} type="button">
          <Copy size={18} aria-hidden="true" />
          <span>复制</span>
        </button>
      </div>

      <div className="warning-list">
        {plan.warnings.map((warning) => (
          <article className={`warning-card ${warning.level}`} key={`${warning.title}-${warning.detail}`}>
            <strong>{warning.title}</strong>
            <p>{warning.detail}</p>
          </article>
        ))}
      </div>

      <div className="timeline">
        {plan.days.map((plannedDay) => (
          <article className="day-card" key={plannedDay.title}>
            <div className="day-card-title">
              <span>{plannedDay.title}</span>
              <strong>{plannedDay.theme}</strong>
            </div>
            <p>{plannedDay.startHint}</p>
            <ol>
              {plannedDay.stops.map((plannedStop) => (
                <li key={`${plannedDay.title}-${plannedStop.spot.id}`}>
                  <span>{plannedStop.spot.shortName}</span>
                  <small>
                    停留 {formatDuration(plannedStop.stayMinutes)}
                    {plannedStop.transferFromPreviousMinutes > 0
                      ? ` · 路上 ${formatDuration(plannedStop.transferFromPreviousMinutes)}`
                      : ""}
                  </small>
                  <em>{plannedStop.note}</em>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      {presetRoute ? (
        <div className="route-footnotes">
          <p>{presetRoute.lodgingHint}</p>
          <p>{presetRoute.transportHint}</p>
        </div>
      ) : null}
    </aside>
  );
}
