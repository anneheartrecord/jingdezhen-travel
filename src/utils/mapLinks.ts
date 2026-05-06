import type { TravelSpot } from "../types/travel";

const amapSearchBaseUrl = "https://ditu.amap.com/search";

/**
 * Builds an AMap search URL for a Jingdezhen attraction.
 *
 * @param spot - Attraction selected by the user.
 * @returns URL that opens AMap search for the attraction.
 */
export function createAmapSearchUrl(spot: TravelSpot): string {
  const searchQuery = encodeURIComponent(`景德镇 ${spot.name}`);
  return `${amapSearchBaseUrl}?query=${searchQuery}&city=360200`;
}

/**
 * Builds a copyable route text.
 *
 * @param spots - Ordered attraction list.
 * @returns Chinese route text for notes or social sharing.
 */
export function createRouteShareText(spots: readonly TravelSpot[]): string {
  const spotNames = spots.map((spot, spotIndex) => `${spotIndex + 1}. ${spot.name}`).join("\n");
  return `瓷都旅游指北路线：\n${spotNames}\n\n提醒：景德镇远郊交通成本高，出发前确认预约、天气和返程车。`;
}
