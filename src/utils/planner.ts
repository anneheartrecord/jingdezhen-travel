import { presetRoutes } from "../data/routes";
import { travelSpots } from "../data/spots";
import type {
  PlannedDay,
  PlannedStop,
  PresetRoute,
  RouteDay,
  RouteId,
  RouteIntensity,
  RoutePlan,
  RouteStop,
  RouteWarning,
  SpotCluster,
  SpotId,
  TravelSpot,
} from "../types/travel";

const spotById = new Map<SpotId, TravelSpot>(travelSpots.map((spot) => [spot.id, spot]));

const pairTransferOverrides = new Map<string, number>([
  ["taoyangli:fuzhouLane", 8],
  ["fuzhouLane:taoyangli", 8],
  ["taoyangli:ceramicMuseum", 18],
  ["ceramicMuseum:taoyangli", 18],
  ["ceramicMuseum:taoxichuan", 24],
  ["taoxichuan:ceramicMuseum", 24],
  ["taoxichuan:sculptureFactory", 12],
  ["sculptureFactory:taoxichuan", 12],
  ["sculptureFactory:sanbaoVillage", 25],
  ["sanbaoVillage:sculptureFactory", 25],
  ["taoxichuan:sanbaoVillage", 28],
  ["sanbaoVillage:taoxichuan", 28],
  ["ceramicMuseum:ancientKiln", 14],
  ["ancientKiln:ceramicMuseum", 14],
  ["ancientKiln:sculptureFactory", 28],
  ["hanxiVillage:gaolingVillage", 45],
  ["gaolingVillage:hanxiVillage", 45],
  ["gaolingVillage:yaoliAncientTown", 40],
  ["yaoliAncientTown:gaolingVillage", 40],
  ["hanxiVillage:yaoliAncientTown", 58],
  ["yaoliAncientTown:hanxiVillage", 58],
  ["porcelainPalace:fuliangOldCounty", 18],
  ["fuliangOldCounty:porcelainPalace", 18],
]);

const clusterTransferMinutes: Record<SpotCluster, Record<SpotCluster, number>> = {
  arrival: {
    arrival: 5,
    central: 28,
    east: 24,
    west: 32,
    sanbao: 42,
    fuliangNear: 45,
    fuliangFar: 90,
  },
  central: {
    arrival: 28,
    central: 10,
    east: 18,
    west: 20,
    sanbao: 32,
    fuliangNear: 42,
    fuliangFar: 85,
  },
  east: {
    arrival: 24,
    central: 18,
    east: 12,
    west: 28,
    sanbao: 26,
    fuliangNear: 48,
    fuliangFar: 90,
  },
  west: {
    arrival: 32,
    central: 20,
    east: 28,
    west: 12,
    sanbao: 40,
    fuliangNear: 38,
    fuliangFar: 82,
  },
  sanbao: {
    arrival: 42,
    central: 32,
    east: 26,
    west: 40,
    sanbao: 14,
    fuliangNear: 58,
    fuliangFar: 96,
  },
  fuliangNear: {
    arrival: 45,
    central: 42,
    east: 48,
    west: 38,
    sanbao: 58,
    fuliangNear: 20,
    fuliangFar: 55,
  },
  fuliangFar: {
    arrival: 90,
    central: 85,
    east: 90,
    west: 82,
    sanbao: 96,
    fuliangNear: 55,
    fuliangFar: 35,
  },
};

/**
 * Looks up one attraction by id.
 *
 * @param spotId - Attraction identifier from the product data model.
 * @returns The matching spot, or undefined when the id is unknown.
 */
export function findSpot(spotId: SpotId): TravelSpot | undefined {
  return spotById.get(spotId);
}

/**
 * Estimates point-to-point travel time between two attractions.
 *
 * @param originSpotId - Previous attraction id.
 * @param destinationSpotId - Next attraction id.
 * @returns Estimated transfer minutes based on overrides and cluster defaults.
 */
export function estimateTransferMinutes(originSpotId: SpotId, destinationSpotId: SpotId): number {
  if (originSpotId === destinationSpotId) {
    return 0;
  }

  const overrideKey = `${originSpotId}:${destinationSpotId}`;
  const overrideMinutes = pairTransferOverrides.get(overrideKey);
  if (overrideMinutes !== undefined) {
    return overrideMinutes;
  }

  const originSpot = findSpot(originSpotId);
  const destinationSpot = findSpot(destinationSpotId);
  if (!originSpot || !destinationSpot) {
    return 30;
  }

  return clusterTransferMinutes[originSpot.cluster][destinationSpot.cluster];
}

/**
 * Builds a planned day from route stops.
 *
 * @param routeDay - Route day definition from preset or custom data.
 * @returns Planned day with stop details and time totals.
 */
export function buildPlannedDay(routeDay: RouteDay): PlannedDay {
  const plannedStops = routeDay.stops.reduce<PlannedStop[]>((result, routeStop, stopIndex) => {
    const currentSpot = findSpot(routeStop.spotId);
    if (!currentSpot) {
      return result;
    }

    const previousStop = routeDay.stops[stopIndex - 1];
    const transferFromPreviousMinutes = previousStop
      ? estimateTransferMinutes(previousStop.spotId, routeStop.spotId)
      : 0;

    result.push({
      spot: currentSpot,
      stayMinutes: routeStop.stayMinutes ?? currentSpot.recommendedMinutes,
      transferFromPreviousMinutes,
      note: routeStop.note,
    });

    return result;
  }, []);

  const totalStayMinutes = plannedStops.reduce(
    (totalMinutes, plannedStop) => totalMinutes + plannedStop.stayMinutes,
    0,
  );
  const totalTransferMinutes = plannedStops.reduce(
    (totalMinutes, plannedStop) => totalMinutes + plannedStop.transferFromPreviousMinutes,
    0,
  );

  return {
    title: routeDay.title,
    theme: routeDay.theme,
    startHint: routeDay.startHint,
    stops: plannedStops,
    totalStayMinutes,
    totalTransferMinutes,
    totalMinutes: totalStayMinutes + totalTransferMinutes,
  };
}

/**
 * Converts a preset route into a calculated route plan.
 *
 * @param presetRoute - Preset route data.
 * @returns Calculated plan with warnings and intensity.
 */
export function buildPresetRoutePlan(presetRoute: PresetRoute): RoutePlan {
  const plannedDays = presetRoute.days.map(buildPlannedDay);
  const totalMinutes = plannedDays.reduce(
    (routeTotalMinutes, plannedDay) => routeTotalMinutes + plannedDay.totalMinutes,
    0,
  );

  return {
    id: presetRoute.id,
    title: presetRoute.title,
    days: plannedDays,
    totalMinutes,
    intensity: calculateIntensity(plannedDays),
    warnings: createRouteWarnings(plannedDays),
  };
}

/**
 * Creates a custom route plan from ordered spots.
 *
 * @param selectedSpotIds - Ordered attraction ids chosen by the visitor.
 * @returns Calculated one-day custom route plan.
 */
export function buildCustomRoutePlan(selectedSpotIds: readonly SpotId[]): RoutePlan {
  const routeStops: RouteStop[] = selectedSpotIds.map((spotId) => ({
    spotId,
    note: "自定义路线点，按你的顺序计算。",
  }));

  const plannedDay = buildPlannedDay({
    title: "自定义",
    theme: "你自己排的瓷都路线",
    startHint: "建议把远郊点单独成天，不要和市区点硬挤。",
    stops: routeStops,
  });

  return {
    id: "custom",
    title: "自定义路线",
    days: [plannedDay],
    totalMinutes: plannedDay.totalMinutes,
    intensity: calculateIntensity([plannedDay]),
    warnings: createRouteWarnings([plannedDay]),
  };
}

/**
 * Finds a preset route by id.
 *
 * @param routeId - Preset route id.
 * @returns Matching preset route; falls back to the first preset.
 */
export function getPresetRoute(routeId: RouteId): PresetRoute {
  return presetRoutes.find((presetRoute) => presetRoute.id === routeId) ?? presetRoutes[0];
}

/**
 * Formats minutes into a compact Chinese duration label.
 *
 * @param minutes - Raw minutes.
 * @returns Human-readable duration.
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} 分钟`;
  }

  if (remainingMinutes === 0) {
    return `${hours} 小时`;
  }

  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

/**
 * Calculates route intensity from per-day time totals.
 *
 * @param plannedDays - Planned days to score.
 * @returns Route intensity label.
 */
function calculateIntensity(plannedDays: readonly PlannedDay[]): RouteIntensity {
  const busiestDayMinutes = Math.max(...plannedDays.map((plannedDay) => plannedDay.totalMinutes));
  if (busiestDayMinutes >= 660) {
    return "很折腾";
  }

  if (busiestDayMinutes >= 540) {
    return "偏满";
  }

  if (busiestDayMinutes >= 390) {
    return "正常";
  }

  return "轻松";
}

/**
 * Creates practical warnings for a route plan.
 *
 * @param plannedDays - Planned days to inspect.
 * @returns Actionable warnings for travelers.
 */
function createRouteWarnings(plannedDays: readonly PlannedDay[]): readonly RouteWarning[] {
  const warnings: RouteWarning[] = [];

  for (const plannedDay of plannedDays) {
    const clusters = new Set(plannedDay.stops.map((plannedStop) => plannedStop.spot.cluster));
    const remoteStopCount = plannedDay.stops.filter((plannedStop) =>
      ["fuliangNear", "fuliangFar"].includes(plannedStop.spot.cluster),
    ).length;
    const hasYaoli = plannedDay.stops.some((plannedStop) => plannedStop.spot.id === "yaoliAncientTown");
    const hasSanbao = plannedDay.stops.some((plannedStop) => plannedStop.spot.cluster === "sanbao");

    if (plannedDay.totalMinutes > 600) {
      warnings.push({
        title: `${plannedDay.title} 行程过满`,
        detail: "总时长超过 10 小时，实际会被吃饭、排队、等车继续放大。",
        level: "danger",
      });
    }

    if (hasYaoli && plannedDay.stops.length >= 4) {
      warnings.push({
        title: "瑶里不要当顺路小点",
        detail: "瑶里适合当日主角。和多个市区点混排，会让返程非常难受。",
        level: "warning",
      });
    }

    if (hasSanbao && clusters.has("fuliangFar")) {
      warnings.push({
        title: "三宝和瑶里/高岭不建议同日硬串",
        detail: "两边都是会吞时间的片区，同日串联更适合包车且要砍掉其他点。",
        level: "warning",
      });
    }

    if (remoteStopCount >= 2 && plannedDay.totalTransferMinutes > 90) {
      warnings.push({
        title: "远郊交通成本偏高",
        detail: "建议自驾或包车，并准备天气变差时的替代方案。",
        level: "info",
      });
    }
  }

  if (warnings.length === 0) {
    warnings.push({
      title: "路线节奏可执行",
      detail: "当前路线没有明显硬伤，但门票、预约和交通仍建议当天二次确认。",
      level: "info",
    });
  }

  return warnings;
}
