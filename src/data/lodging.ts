import type { LodgingArea } from "../types/travel";

export const lodgingAreas: readonly LodgingArea[] = [
  {
    id: "taoxichuan",
    name: "陶溪川周边",
    bestFor: ["第一次来", "晚上想逛", "喜欢文艺街区和市集"],
    tradeoffs: ["热门时段价格更高", "节假日打车和停车会变慢"],
    linkedClusters: ["east", "central", "sanbao"],
    roast: "最不容易选错，但也最容易被热门价格教育。",
  },
  {
    id: "taoyangli",
    name: "陶阳里 / 人民广场",
    bestFor: ["市区经典点", "吃饭方便", "预算更稳"],
    tradeoffs: ["夜间氛围不如陶溪川集中", "酒店风格选择更杂"],
    linkedClusters: ["central", "west", "east"],
    roast: "实用派住这里没毛病，别期待每栋楼都长得很小红书。",
  },
  {
    id: "sanbao",
    name: "三宝村",
    bestFor: ["慢旅行", "陶艺体验", "安静民宿"],
    tradeoffs: ["进出市区更麻烦", "晚上选择少", "返程打车要提前看"],
    linkedClusters: ["sanbao"],
    roast: "住三宝是氛围选择，不是效率选择。",
  },
  {
    id: "northStation",
    name: "景德镇北站附近",
    bestFor: ["晚到早走", "只住一晚", "行李很多"],
    tradeoffs: ["白天游玩反复进城", "夜间可逛内容少"],
    linkedClusters: ["arrival"],
    roast: "适合过渡，不适合把它当景德镇生活中心。",
  },
  {
    id: "yaoli",
    name: "瑶里 / 浮梁远郊",
    bestFor: ["三日以上慢游", "山水古镇", "远郊摄影"],
    tradeoffs: ["不适合每天回市区", "天气影响体验", "交通弹性小"],
    linkedClusters: ["fuliangFar", "fuliangNear"],
    roast: "适合把时间放慢，不适合把行程塞爆。",
  },
] as const;
