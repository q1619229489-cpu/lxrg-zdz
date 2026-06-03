"use strict";
const destinations = [
  {
    id: 1,
    name: "成都",
    desc: "一座来了就不想走的城市，火锅串串遍地都是",
    tags: ["美食街", "夜市", "休闲"],
    traits: { action: 30, planning: 30, photo: 45, spontaneity: 65, food: 95, budget: 50 }
  },
  {
    id: 2,
    name: "西安",
    desc: "十三朝古都，历史爱好者和肉夹馍爱好者的天堂",
    tags: ["博物馆", "历史遗迹", "美食街"],
    traits: { action: 70, planning: 65, photo: 50, spontaneity: 30, food: 80, budget: 55 }
  },
  {
    id: 3,
    name: "大理",
    desc: "苍山洱海，适合放空自己也适合拍大片",
    tags: ["自然", "民宿", "休闲"],
    traits: { action: 35, planning: 25, photo: 75, spontaneity: 75, food: 50, budget: 45 }
  },
  {
    id: 4,
    name: "重庆",
    desc: "8D魔幻城市，导航在这里就是个摆设",
    tags: ["美食街", "夜市", "街拍"],
    traits: { action: 75, planning: 30, photo: 60, spontaneity: 60, food: 90, budget: 50 }
  },
  {
    id: 5,
    name: "上海",
    desc: "梧桐区压马路，咖啡馆里修图，精致到骨子里",
    tags: ["城市", "艺术区", "街拍"],
    traits: { action: 50, planning: 55, photo: 85, spontaneity: 40, food: 60, budget: 30 }
  },
  {
    id: 6,
    name: "三亚",
    desc: "阳光沙滩酒店，躺着就是旅行的全部意义",
    tags: ["海边", "度假村", "休闲"],
    traits: { action: 20, planning: 15, photo: 55, spontaneity: 80, food: 50, budget: 35 }
  },
  {
    id: 7,
    name: "长沙",
    desc: "不睡觉的城市，凌晨两点还在排队等小吃",
    tags: ["美食街", "夜市", "步行街"],
    traits: { action: 60, planning: 30, photo: 45, spontaneity: 50, food: 95, budget: 60 }
  },
  {
    id: 8,
    name: "杭州",
    desc: "西湖边散步，龙井村喝茶，全是手机壁纸",
    tags: ["自然", "古镇", "休闲"],
    traits: { action: 40, planning: 40, photo: 80, spontaneity: 50, food: 55, budget: 40 }
  },
  {
    id: 9,
    name: "拉萨",
    desc: "离天堂最近的地方，攻略做得越细越好",
    tags: ["自然", "风景区", "历史遗迹"],
    traits: { action: 65, planning: 75, photo: 70, spontaneity: 35, food: 35, budget: 45 }
  },
  {
    id: 10,
    name: "广州",
    desc: "从早茶吃到宵夜，一天五顿不是梦",
    tags: ["美食街", "老字号", "夜市"],
    traits: { action: 35, planning: 30, photo: 40, spontaneity: 55, food: 95, budget: 60 }
  },
  {
    id: 11,
    name: "南京",
    desc: "梧桐大道走一走，秋天就是最好的滤镜",
    tags: ["博物馆", "古镇", "自然"],
    traits: { action: 45, planning: 55, photo: 70, spontaneity: 40, food: 55, budget: 50 }
  },
  {
    id: 12,
    name: "青岛",
    desc: "红瓦绿树碧海蓝天，啤酒配蛤蜊就是夏天",
    tags: ["海边", "建筑", "休闲"],
    traits: { action: 40, planning: 35, photo: 65, spontaneity: 60, food: 65, budget: 50 }
  }
];
function recommendDestination(relationship, personalityA, personalityB, multiPrefs, traitsA, traitsB) {
  var combined = {};
  var dims = ["action", "planning", "photo", "spontaneity", "food", "budget"];
  dims.forEach(function(k) {
    combined[k] = Math.round(((traitsA[k] || 50) + (traitsB[k] || 50)) / 2);
  });
  var scored = destinations.map(function(d) {
    var dist = 0;
    dims.forEach(function(k) {
      var diff = combined[k] - (d.traits[k] || 50);
      dist += diff * diff;
    });
    dist = Math.sqrt(dist);
    var bonus = 0;
    if (multiPrefs && multiPrefs.length > 0) {
      multiPrefs.forEach(function(pref) {
        if (d.tags.indexOf(pref) !== -1)
          bonus -= 10;
      });
    }
    return { name: d.name, desc: d.desc, score: Math.round((100 - dist + bonus) * 10) / 10, dist: Math.round(dist * 10) / 10 };
  });
  scored.sort(function(a, b) {
    return b.score - a.score;
  });
  return scored.slice(0, 3);
}
exports.destinations = destinations;
exports.recommendDestination = recommendDestination;
//# sourceMappingURL=../../.sourcemap/mp-weixin/data/destinations.js.map
