export type SpotId =
  | "northStation"
  | "taoyangli"
  | "ceramicMuseum"
  | "taoxichuan"
  | "sculptureFactory"
  | "taoyangMarket"
  | "ancientKiln"
  | "sanbaoVillage"
  | "fuzhouLane"
  | "porcelainPalace"
  | "fuliangOldCounty"
  | "hanxiVillage"
  | "gaolingVillage"
  | "yaoliAncientTown"
  | "bingdingWoodKiln";

export type SpotCluster =
  | "arrival"
  | "central"
  | "east"
  | "west"
  | "sanbao"
  | "fuliangNear"
  | "fuliangFar";

export type SpotMood =
  | "瓷都文脉"
  | "拍照出片"
  | "买瓷器"
  | "陶艺体验"
  | "夜间可逛"
  | "远郊慢游"
  | "亲子友好"
  | "交通枢纽";

export type TravelMode = "walk" | "taxi" | "ebike" | "charter" | "bus";

export type RouteId =
  | "oneDayClassic"
  | "oneDaySanbao"
  | "twoDayClassic"
  | "threeDayDeep"
  | "custom";

export type RouteIntensity = "轻松" | "正常" | "偏满" | "很折腾";

export type LodgingAreaId =
  | "taoxichuan"
  | "taoyangli"
  | "sanbao"
  | "northStation"
  | "yaoli";

export interface MapPosition {
  readonly x: number;
  readonly y: number;
}

export interface TravelSpot {
  readonly id: SpotId;
  readonly name: string;
  readonly shortName: string;
  readonly cluster: SpotCluster;
  readonly areaLabel: string;
  readonly mapPosition: MapPosition;
  readonly recommendedMinutes: number;
  readonly bestTime: string;
  readonly budgetNote: string;
  readonly bookingNote: string;
  readonly transportNote: string;
  readonly roast: string;
  readonly moods: readonly SpotMood[];
  readonly goodFor: readonly string[];
  readonly avoidFor: readonly string[];
  readonly tips: readonly string[];
}

export interface RouteStop {
  readonly spotId: SpotId;
  readonly stayMinutes?: number;
  readonly note: string;
}

export interface RouteDay {
  readonly title: string;
  readonly theme: string;
  readonly startHint: string;
  readonly stops: readonly RouteStop[];
}

export interface PresetRoute {
  readonly id: RouteId;
  readonly title: string;
  readonly days: readonly RouteDay[];
  readonly summary: string;
  readonly lodgingHint: string;
  readonly transportHint: string;
}

export interface LodgingArea {
  readonly id: LodgingAreaId;
  readonly name: string;
  readonly bestFor: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly linkedClusters: readonly SpotCluster[];
  readonly roast: string;
}

export interface PitfallNote {
  readonly id: string;
  readonly title: string;
  readonly severity: "高" | "中" | "低";
  readonly appliesTo: readonly SpotCluster[];
  readonly content: string;
}

export interface PlannedStop {
  readonly spot: TravelSpot;
  readonly stayMinutes: number;
  readonly transferFromPreviousMinutes: number;
  readonly note: string;
}

export interface PlannedDay {
  readonly title: string;
  readonly theme: string;
  readonly startHint: string;
  readonly stops: readonly PlannedStop[];
  readonly totalStayMinutes: number;
  readonly totalTransferMinutes: number;
  readonly totalMinutes: number;
}

export interface RouteWarning {
  readonly title: string;
  readonly detail: string;
  readonly level: "info" | "warning" | "danger";
}

export interface RoutePlan {
  readonly id: RouteId;
  readonly title: string;
  readonly days: readonly PlannedDay[];
  readonly totalMinutes: number;
  readonly intensity: RouteIntensity;
  readonly warnings: readonly RouteWarning[];
}
