import type { PitfallNote } from "../types/travel";

export const pitfallNotes: readonly PitfallNote[] = [
  {
    id: "distance-is-not-walkable",
    title: "地图近不等于好走",
    severity: "高",
    appliesTo: ["central", "east", "west", "sanbao", "fuliangNear", "fuliangFar"],
    content: "景德镇市区点能串，但三宝、浮梁、瑶里不是随便步行或共享车就能补上的距离。",
  },
  {
    id: "sanbao-time-sink",
    title: "三宝村会吞时间",
    severity: "高",
    appliesTo: ["sanbao"],
    content: "三宝村是一片区域，不是单点。咖啡、陶艺、拍照和交通会一起吃掉半天。",
  },
  {
    id: "yaoli-is-a-day",
    title: "瑶里要按一天规划",
    severity: "高",
    appliesTo: ["fuliangFar"],
    content: "瑶里古镇从市区往返车程长，适合三日游或更长行程，别塞在市区暴走日里。",
  },
  {
    id: "holiday-traffic",
    title: "节假日交通会放大所有问题",
    severity: "高",
    appliesTo: ["central", "east", "west", "sanbao"],
    content: "陶溪川、陶阳里、雕塑瓷厂等热门点周边会遇到停车、叫车、返程拥堵问题。",
  },
  {
    id: "museum-booking",
    title: "博物馆和展区规则要二次确认",
    severity: "中",
    appliesTo: ["central", "west", "fuliangFar"],
    content: "御窑、陶瓷博物馆、丙丁柴窑等点位可能涉及预约、闭馆日或限流。",
  },
  {
    id: "ceramic-shopping",
    title: "买瓷器先定预算和用途",
    severity: "中",
    appliesTo: ["east", "central"],
    content: "雕塑瓷厂、陶溪川、陶阳新村侧重点不同。先决定买日用、设计款还是伴手礼。",
  },
  {
    id: "workshop-delivery",
    title: "陶艺体验别只看拉坯价格",
    severity: "中",
    appliesTo: ["east", "sanbao", "west"],
    content: "确认烧制、上色、邮寄、破损处理和取件时间，否则体验后半段会变成客服沟通。",
  },
  {
    id: "weather-outskirts",
    title: "远郊出片看天气",
    severity: "中",
    appliesTo: ["fuliangNear", "fuliangFar"],
    content: "寒溪村、瑶里、高岭这些点位受天气影响很明显。阴雨天要准备替代路线。",
  },
] as const;
