export interface ResearchSource {
  readonly title: string;
  readonly url: string;
  readonly type: "官方公告" | "攻略平台" | "社区游记" | "媒体攻略";
  readonly usedFor: readonly string[];
}

export const researchSources: readonly ResearchSource[] = [
  {
    title: "Xcrawl 搜索结果汇总",
    url: "research/raw/xcrawl-search-results.json",
    type: "攻略平台",
    usedFor: ["景点池", "路线范式", "住宿关键词", "避坑关键词"],
  },
  {
    title: "Xcrawl 重点页面摘要",
    url: "research/raw/xcrawl-page-summaries.json",
    type: "攻略平台",
    usedFor: ["路线摘要", "交通经验", "买瓷器和陶艺体验提醒"],
  },
  {
    title: "景德镇市政府五一出行指南",
    url: "https://jdz.gov.cn/zwzx/gggs/t1089171.shtml",
    type: "官方公告",
    usedFor: ["节假日交通", "停车与旅游专线提醒"],
  },
  {
    title: "景德镇三天两晚旅行攻略",
    url: "https://zhuanlan.zhihu.com/p/649719344",
    type: "社区游记",
    usedFor: ["市区一日游", "浮梁一日线", "陶艺体验"],
  },
  {
    title: "景德镇住宿指南",
    url: "https://www.thechinajourney.com/zh/%E6%99%AF%E5%BE%B7%E9%8E%AE%E4%BD%8F%E5%AE%BF%E6%8E%A8%E8%96%A6/",
    type: "攻略平台",
    usedFor: ["住宿区域"],
  },
  {
    title: "瑶里古镇交通与包车攻略",
    url: "https://www.sohu.com/a/1007862646_122593161",
    type: "媒体攻略",
    usedFor: ["瑶里车程", "远郊路线"],
  },
] as const;
