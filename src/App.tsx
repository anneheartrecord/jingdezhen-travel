import { useEffect, useMemo, useState } from "react";
import { Compass, MapPinned, Sparkles } from "lucide-react";
import { lodgingAreas } from "./data/lodging";
import { pitfallNotes } from "./data/pitfalls";
import { researchSources } from "./data/sources";
import { defaultCustomSpotIds, travelSpots } from "./data/spots";
import { CustomRouteBuilder } from "./components/CustomRouteBuilder";
import { InteractiveMap } from "./components/InteractiveMap";
import { LodgingGuide } from "./components/LodgingGuide";
import { PitfallPanel } from "./components/PitfallPanel";
import { RoutePanel } from "./components/RoutePanel";
import { SourcePanel } from "./components/SourcePanel";
import { SpotDetailPanel } from "./components/SpotDetailPanel";
import { buildCustomRoutePlan, buildPresetRoutePlan, findSpot, getPresetRoute } from "./utils/planner";
import type { RouteId, SpotId, TravelSpot } from "./types/travel";

const routeTabs: readonly { readonly id: RouteId; readonly label: string }[] = [
  { id: "oneDayClassic", label: "1日精华" },
  { id: "oneDaySanbao", label: "1日三宝" },
  { id: "twoDayClassic", label: "2日经典" },
  { id: "threeDayDeep", label: "3日完整" },
  { id: "custom", label: "自定义" },
];

/**
 * Renders the complete Jingdezhen travel planning workspace.
 *
 * @returns React application root.
 */
export default function App() {
  const [selectedRouteId, setSelectedRouteId] = useState<RouteId>("twoDayClassic");
  const [selectedSpotId, setSelectedSpotId] = useState<SpotId>("taoyangli");
  const [customSpotIds, setCustomSpotIds] = useState<SpotId[]>([...defaultCustomSpotIds]);
  const [travelerSpotId, setTravelerSpotId] = useState<SpotId>("taoyangli");
  const [isTravelerPlaying, setIsTravelerPlaying] = useState(true);
  const [, setTravelerStepIndex] = useState(0);

  const selectedRoutePlan = useMemo(() => {
    if (selectedRouteId === "custom") {
      return buildCustomRoutePlan(customSpotIds);
    }

    return buildPresetRoutePlan(getPresetRoute(selectedRouteId));
  }, [customSpotIds, selectedRouteId]);

  const activeRouteSpots = useMemo(
    () => selectedRoutePlan.days.flatMap((plannedDay) => plannedDay.stops.map((plannedStop) => plannedStop.spot)),
    [selectedRoutePlan],
  );

  const selectedSpot = useMemo(
    () => findSpot(selectedSpotId) ?? activeRouteSpots[0] ?? travelSpots[0],
    [activeRouteSpots, selectedSpotId],
  );

  const selectedPresetRoute = selectedRouteId === "custom" ? undefined : getPresetRoute(selectedRouteId);

  useEffect(() => {
    const firstRouteSpot = activeRouteSpots[0];
    if (!firstRouteSpot) {
      return;
    }

    setTravelerStepIndex(0);
    setTravelerSpotId(firstRouteSpot.id);
    setSelectedSpotId(firstRouteSpot.id);
  }, [activeRouteSpots]);

  useEffect(() => {
    if (!isTravelerPlaying || activeRouteSpots.length <= 1) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTravelerStepIndex((currentStepIndex) => {
        const nextStepIndex = (currentStepIndex + 1) % activeRouteSpots.length;
        const nextSpot = activeRouteSpots[nextStepIndex];
        setTravelerSpotId(nextSpot.id);
        setSelectedSpotId(nextSpot.id);
        return nextStepIndex;
      });
    }, 1600);

    return () => window.clearInterval(timerId);
  }, [activeRouteSpots, isTravelerPlaying]);

  /**
   * Selects one route tab and starts the traveler animation.
   *
   * @param routeId - Route tab identifier selected by the user.
   */
  function handleRouteSelect(routeId: RouteId): void {
    setSelectedRouteId(routeId);
    setIsTravelerPlaying(true);
  }

  /**
   * Moves the traveler to one spot selected from the map.
   *
   * @param spot - Attraction selected by the user.
   */
  function handleSpotSelect(spot: TravelSpot): void {
    setSelectedSpotId(spot.id);
    setTravelerSpotId(spot.id);
    setIsTravelerPlaying(false);
  }

  /**
   * Restarts the traveler animation from the first route stop.
   */
  function handleReplayRoute(): void {
    const firstRouteSpot = activeRouteSpots[0];
    if (!firstRouteSpot) {
      return;
    }

    setTravelerStepIndex(0);
    setTravelerSpotId(firstRouteSpot.id);
    setSelectedSpotId(firstRouteSpot.id);
    setIsTravelerPlaying(true);
  }

  return (
    <main className="app-shell">
      <section className="top-bar" aria-label="瓷都旅游指北">
        <div className="brand-block">
          <img alt="" className="brand-stamp" src={`${import.meta.env.BASE_URL}assets/porcelain-stamp.svg`} />
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            青花瓷风格互动路线工具
          </div>
          <h1>瓷都旅游指北</h1>
        </div>
        <div className="route-tabs" aria-label="路线切换">
          {routeTabs.map((routeTab) => (
            <button
              className={selectedRouteId === routeTab.id ? "route-tab active" : "route-tab"}
              key={routeTab.id}
              onClick={() => handleRouteSelect(routeTab.id)}
              type="button"
            >
              {routeTab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="planner-grid">
        <div className="map-workspace">
          <div className="panel-heading">
            <MapPinned size={20} aria-hidden="true" />
            <div>
              <h2>迷你景德镇地图</h2>
              <p>市区、三宝、浮梁远郊分开看，少走冤枉路。</p>
            </div>
          </div>
          <InteractiveMap
            activeRouteSpots={activeRouteSpots}
            selectedSpotId={selectedSpot.id}
            travelerSpotId={travelerSpotId}
            travelSpots={travelSpots}
            onSpotSelect={handleSpotSelect}
          />
        </div>

        <RoutePanel
          isPlaying={isTravelerPlaying}
          plan={selectedRoutePlan}
          presetRoute={selectedPresetRoute}
          onPause={() => setIsTravelerPlaying(false)}
          onPlay={() => setIsTravelerPlaying(true)}
          onReplay={handleReplayRoute}
        />
      </section>

      <section className="insight-grid">
        <SpotDetailPanel spot={selectedSpot} />
        <CustomRouteBuilder
          selectedSpotIds={customSpotIds}
          spots={travelSpots.filter((spot) => spot.id !== "northStation")}
          onRouteChange={(nextSpotIds) => {
            setCustomSpotIds(nextSpotIds);
            setSelectedRouteId("custom");
          }}
        />
      </section>

      <section className="guide-grid">
        <LodgingGuide lodgingAreas={lodgingAreas} />
        <PitfallPanel notes={pitfallNotes} selectedSpot={selectedSpot} />
      </section>

      <section className="source-band">
        <div className="panel-heading">
          <Compass size={20} aria-hidden="true" />
          <div>
            <h2>资料可信度</h2>
            <p>路线时间是经验估算，门票、预约、天气和交通要出发当天确认。</p>
          </div>
        </div>
        <SourcePanel sources={researchSources} />
      </section>
    </main>
  );
}
