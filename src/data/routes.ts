import type { PresetRoute } from "../types/travel";

export const presetRoutes: readonly PresetRoute[] = [
  {
    id: "oneDayClassic",
    title: "1 日市区精华",
    summary: "适合第一次到景德镇、只有完整一天的人。主线是瓷器历史、城市街区和夜市。",
    lodgingHint: "住陶阳里、人民广场或陶溪川都可以，别住远郊。",
    transportHint: "市区点以打车、公交和共享电动车为主，节假日预留叫车时间。",
    days: [
      {
        title: "Day 1",
        theme: "御窑文脉 + 博物馆 + 夜游",
        startHint: "上午从陶阳里开始，晚上落在陶溪川。",
        stops: [
          { spotId: "taoyangli", note: "先建立瓷都主线，不要只拍照。" },
          { spotId: "fuzhouLane", stayMinutes: 50, note: "中午补能量，别为排队打乱节奏。" },
          { spotId: "ceramicMuseum", note: "下午看完整瓷器时间线。" },
          { spotId: "taoxichuan", note: "傍晚到夜间逛街区和市集。" },
        ],
      },
    ],
  },
  {
    id: "oneDaySanbao",
    title: "1 日三宝慢游",
    summary: "适合想拍照、喝咖啡、做陶艺的人。少排点，给三宝留时间。",
    lodgingHint: "可以住三宝民宿或陶溪川周边，住市区核心也能打车往返。",
    transportHint: "三宝村内部范围长，建议打车到村口后骑行或包车慢逛。",
    days: [
      {
        title: "Day 1",
        theme: "三宝村 + 陶艺 + 夜市",
        startHint: "上午不要太晚出发，下午留给三宝。",
        stops: [
          { spotId: "sculptureFactory", stayMinutes: 120, note: "先买小物和看工作室。" },
          { spotId: "sanbaoVillage", stayMinutes: 260, note: "留足慢逛和陶艺体验时间。" },
          { spotId: "taoxichuan", stayMinutes: 110, note: "晚上回市区逛，不想折腾可直接结束。" },
        ],
      },
    ],
  },
  {
    id: "twoDayClassic",
    title: "2 日经典不绕路",
    summary: "适合周末高铁往返。第一天市区文脉，第二天陶艺、市场和三宝。",
    lodgingHint: "优先陶溪川或陶阳里周边，晚上吃逛方便，第二天去三宝也不离谱。",
    transportHint: "两天都在市区和三宝，远郊不要硬塞。",
    days: [
      {
        title: "Day 1",
        theme: "陶阳里、陶瓷博物馆、陶溪川",
        startHint: "高铁到达后先去酒店放行李，再进市区核心。",
        stops: [
          { spotId: "taoyangli", note: "看御窑遗址和博物馆建筑。" },
          { spotId: "fuzhouLane", stayMinutes: 50, note: "用小吃当中场补给。" },
          { spotId: "ceramicMuseum", note: "下午看陶瓷史和重点展品。" },
          { spotId: "taoxichuan", note: "晚上逛街区，适合吃饭和买设计款。" },
        ],
      },
      {
        title: "Day 2",
        theme: "古窑、雕塑瓷厂、三宝村",
        startHint: "第二天别睡太晚，三宝需要大块时间。",
        stops: [
          { spotId: "ancientKiln", note: "看传统制瓷工艺，按表演时间调整。" },
          { spotId: "sculptureFactory", note: "淘瓷器和看工作室。" },
          { spotId: "sanbaoVillage", note: "下午慢逛，别把返程卡太死。" },
        ],
      },
    ],
  },
  {
    id: "threeDayDeep",
    title: "3 日完整瓷都",
    summary: "适合想真正认识景德镇的人。市区、三宝和浮梁远郊都照顾到。",
    lodgingHint: "前两晚住陶溪川/陶阳里，第三天远郊可考虑包车；想慢游瑶里可加住一晚。",
    transportHint: "第三天建议包车或自驾，公共交通会让体验明显变差。",
    days: [
      {
        title: "Day 1",
        theme: "市区瓷器历史线",
        startHint: "从陶阳里开始，不要把博物馆压缩成打卡。",
        stops: [
          { spotId: "taoyangli", note: "御窑主线。" },
          { spotId: "fuzhouLane", stayMinutes: 50, note: "市区吃饭。" },
          { spotId: "ceramicMuseum", note: "系统补瓷器史。" },
          { spotId: "taoxichuan", note: "夜游和设计市集。" },
        ],
      },
      {
        title: "Day 2",
        theme: "传统工艺 + 三宝慢游",
        startHint: "上午看工艺，下午进三宝。",
        stops: [
          { spotId: "ancientKiln", note: "传统制瓷工艺。" },
          { spotId: "sculptureFactory", stayMinutes: 120, note: "淘瓷器和工作室。" },
          { spotId: "sanbaoVillage", stayMinutes: 260, note: "陶艺、咖啡、民宿和山谷慢逛。" },
        ],
      },
      {
        title: "Day 3",
        theme: "浮梁远郊线",
        startHint: "按包车或自驾安排，别临时拼公交。",
        stops: [
          { spotId: "hanxiVillage", stayMinutes: 90, note: "天气好时更适合拍照。" },
          { spotId: "gaolingVillage", stayMinutes: 160, note: "浮梁景区式体验。" },
          { spotId: "yaoliAncientTown", stayMinutes: 240, note: "作为当天主角，留足返程时间。" },
        ],
      },
    ],
  },
] as const;
