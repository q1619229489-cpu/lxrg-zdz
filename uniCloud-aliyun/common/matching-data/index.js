'use strict'

// ===== 人际关系数据 =====
const relationships = [
  { id: 1, a: "特种兵", b: "特种兵", name: "遥遥领先组", desc: "两人日均步数加起来五万，建议直接保送马拉松", rarity: 187, rarityText: "比体育课不跑圈还难", destTags: ["运动", "户外", "爬山"] },
  { id: 2, a: "特种兵", b: "卡皮巴适", name: "松弛与急迫组", desc: "一个五点起来看日出，一个睡到退房闹钟都叫不醒", rarity: 342, rarityText: "比食堂阿姨手不抖还难", destTags: ["城市", "休闲", "混合"] },
  { id: 3, a: "特种兵", b: "吗当喽", name: "步数排行榜冠亚军", desc: "一个说再逛一个点，一个说我饿得能吃下一头牛", rarity: 256, rarityText: "比午休不偷吃零食还难", destTags: ["美食街", "夜市", "步行街"] },
  { id: 4, a: "特种兵", b: "摄影大师", name: "快到模糊组", desc: "一个跑得太快，一个追焦追到崩溃", rarity: 421, rarityText: "比英语听力全对还难", destTags: ["古镇", "街拍", "建筑"] },
  { id: 5, a: "特种兵", b: "预制人", name: "将遇良才组", desc: "一个做攻略精确到分钟，一个执行到腿软", rarity: 189, rarityText: "比老师说不拖堂真不拖还难", destTags: ["博物馆", "艺术区", "历史遗迹"] },
  { id: 6, a: "特种兵", b: "哈基迷", name: "难以望其项背", desc: "一个拼命走在前，一个凭感觉乱逛，最后谁也找不到谁", rarity: 503, rarityText: "比数学选择题全蒙对还难", destTags: ["自然", "公园", "风景区"] },
  { id: 7, a: "卡皮巴适", b: "卡皮巴适", name: "双倍巴适", desc: "两个人一起躺三天不出门，外卖就是社交", rarity: 128, rarityText: "比周末不补课还难", destTags: ["度假村", "温泉", "海边"] },
  { id: 8, a: "卡皮巴适", b: "吗当喽", name: "电子榨菜搭子", desc: "一个点外卖一个躺着等投喂，双赢", rarity: 215, rarityText: "比作业忘写了不被发现还难", destTags: ["小吃街", "夜市", "民宿"] },
  { id: 9, a: "卡皮巴适", b: "摄影大师", name: "酒店写真组", desc: "一个躺着当背景板，一个从上拍到下", rarity: 378, rarityText: "比同桌不抄你作业还难", destTags: ["酒店", "民宿", "室内"] },
  { id: 10, a: "卡皮巴适", b: "预制人", name: "带不动", desc: "预制人做了精美攻略，卡皮巴适躺着不动，像极了游戏里带不动队友", rarity: 297, rarityText: "比押中语文作文题还难", destTags: ["城市游", "度假", "混合"] },
  { id: 11, a: "卡皮巴适", b: "哈基迷", name: "误入躺平深处", desc: "出去走了两步累了，还是酒店舒服", rarity: 164, rarityText: "比周一升旗不被点名还难", destTags: ["民宿", "海边", "度假村"] },
  { id: 12, a: "吗当喽", b: "吗当喽", name: "胃的报恩", desc: "两个吃货终极幸福，菜单全点一遍", rarity: 93, rarityText: "比双十一抢到限量鞋还难", destTags: ["美食街", "夜市", "老字号"] },
  { id: 13, a: "吗当喽", b: "摄影大师", name: "先拍先吃", desc: "相机先吃人再吃，菜凉了没事好看就行", rarity: 412, rarityText: "比外卖准时送到还难", destTags: ["网红店", "咖啡厅", "美食街"] },
  { id: 14, a: "吗当喽", b: "预制人", name: "吗喽的美食探店笔记", desc: "一个规划到每条巷子，一个负责验证是不是尊嘟好吃", rarity: 231, rarityText: "比晚自习不偷看手机还难", destTags: ["老城区", "小巷子", "市集"] },
  { id: 15, a: "吗当喽", b: "哈基迷", name: "吗喽觅食记", desc: "为找一家店满城绕三圈，吃到的那一刻两个人都哭了", rarity: 348, rarityText: "比抢到食堂最后一个鸡腿还难", destTags: ["美食街", "夜市", "菜市场"] },
  { id: 16, a: "摄影大师", b: "摄影大师", name: "泼天的出片量", desc: "走到哪里都是拍拍拍，满意了才离开", rarity: 156, rarityText: "比自拍不用修图还难", destTags: ["古镇", "花海", "美术馆"] },
  { id: 17, a: "摄影大师", b: "预制人", name: "摄制组CP", desc: "一个知道哪个机位出片，一个规划好最佳路线", rarity: 274, rarityText: "比老师点名刚好点你前一桌还难", destTags: ["博物馆", "建筑群", "艺术区"] },
  { id: 18, a: "摄影大师", b: "哈基迷", name: "命运的构图", desc: "走到哪拍到哪，但总有一张能封神", rarity: 489, rarityText: "比蒙对完形填空还难", destTags: ["街角", "自然", "人文"] },
  { id: 19, a: "预制人", b: "预制人", name: "计划通", desc: "两人各出一份精确到分钟的攻略，先开会对齐校准再出发，比期末考试对答案还认真", rarity: 76, rarityText: "比买彩票中五块还难", destTags: ["博物馆", "艺术区", "规划景点"] },
  { id: 20, a: "预制人", b: "哈基迷", name: "黄金搭档", desc: "哈基迷终于找到人带自己，预制人终于有个听话的，双赢", rarity: 203, rarityText: "比模考超常发挥还难", destTags: ["城市游", "主题乐园", "风景区"] },
  { id: 21, a: "哈基迷", b: "哈基迷", name: "迷路的双向奔赴", desc: "一个说好像走左边，另一个说好像走右边，半小时后在同一路口相遇", rarity: 445, rarityText: "比考场上隔壁答案跟你一样还难", destTags: ["街角", "小镇", "随便走"] }
]

function findRelationship(personA, personB) {
  var tags = [personA, personB].sort()
  return relationships.find(function(r) {
    var sorted = [r.a, r.b].sort()
    return sorted[0] === tags[0] && sorted[1] === tags[1]
  })
}

// ===== 目的地数据 =====
const destinations = [
  { id: 1, name: "成都", desc: "一座来了就不想走的城市，火锅串串遍地都是", tags: ["美食街", "夜市", "休闲"], traits: { action: 30, planning: 30, photo: 45, spontaneity: 65, food: 95, budget: 50 } },
  { id: 2, name: "西安", desc: "十三朝古都，历史爱好者和肉夹馍爱好者的天堂", tags: ["博物馆", "历史遗迹", "美食街"], traits: { action: 70, planning: 65, photo: 50, spontaneity: 30, food: 80, budget: 55 } },
  { id: 3, name: "大理", desc: "苍山洱海，适合放空自己也适合拍大片", tags: ["自然", "民宿", "休闲"], traits: { action: 35, planning: 25, photo: 75, spontaneity: 75, food: 50, budget: 45 } },
  { id: 4, name: "重庆", desc: "8D魔幻城市，导航在这里就是个摆设", tags: ["美食街", "夜市", "街拍"], traits: { action: 75, planning: 30, photo: 60, spontaneity: 60, food: 90, budget: 50 } },
  { id: 5, name: "上海", desc: "梧桐区压马路，咖啡馆里修图，精致到骨子里", tags: ["城市", "艺术区", "街拍"], traits: { action: 50, planning: 55, photo: 85, spontaneity: 40, food: 60, budget: 30 } },
  { id: 6, name: "三亚", desc: "阳光沙滩酒店，躺着就是旅行的全部意义", tags: ["海边", "度假村", "休闲"], traits: { action: 20, planning: 15, photo: 55, spontaneity: 80, food: 50, budget: 35 } },
  { id: 7, name: "长沙", desc: "不睡觉的城市，凌晨两点还在排队等小吃", tags: ["美食街", "夜市", "步行街"], traits: { action: 60, planning: 30, photo: 45, spontaneity: 50, food: 95, budget: 60 } },
  { id: 8, name: "杭州", desc: "西湖边散步，龙井村喝茶，全是手机壁纸", tags: ["自然", "古镇", "休闲"], traits: { action: 40, planning: 40, photo: 80, spontaneity: 50, food: 55, budget: 40 } },
  { id: 9, name: "拉萨", desc: "离天堂最近的地方，攻略做得越细越好", tags: ["自然", "风景区", "历史遗迹"], traits: { action: 65, planning: 75, photo: 70, spontaneity: 35, food: 35, budget: 45 } },
  { id: 10, name: "广州", desc: "从早茶吃到宵夜，一天五顿不是梦", tags: ["美食街", "老字号", "夜市"], traits: { action: 35, planning: 30, photo: 40, spontaneity: 55, food: 95, budget: 60 } },
  { id: 11, name: "南京", desc: "梧桐大道走一走，秋天就是最好的滤镜", tags: ["博物馆", "古镇", "自然"], traits: { action: 45, planning: 55, photo: 70, spontaneity: 40, food: 55, budget: 50 } },
  { id: 12, name: "青岛", desc: "红瓦绿树碧海蓝天，啤酒配蛤蜊就是夏天", tags: ["海边", "建筑", "休闲"], traits: { action: 40, planning: 35, photo: 65, spontaneity: 60, food: 65, budget: 50 } }
]

function recommendDestination(relationship, personalityA, personalityB, multiPrefs, traitsA, traitsB) {
  var combined = {}
  var dims = ["action", "planning", "photo", "spontaneity", "food", "budget"]
  dims.forEach(function(k) {
    combined[k] = Math.round(((traitsA[k] || 50) + (traitsB[k] || 50)) / 2)
  })
  var scored = destinations.map(function(d) {
    var dist = 0
    dims.forEach(function(k) {
      var diff = combined[k] - (d.traits[k] || 50)
      dist += diff * diff
    })
    dist = Math.sqrt(dist)
    var bonus = 0
    if (multiPrefs && multiPrefs.length > 0) {
      multiPrefs.forEach(function(pref) {
        if (d.tags.indexOf(pref) !== -1) bonus -= 10
      })
    }
    return { name: d.name, desc: d.desc, score: Math.round((100 - dist + bonus) * 10) / 10, dist: Math.round(dist * 10) / 10 }
  })
  scored.sort(function(a, b) { return b.score - a.score })
  return scored.slice(0, 3)
}

// ===== 目的地适配检测 =====
function findDest(destIdOrName) {
  if (typeof destIdOrName === "number" || /^\d+$/.test(String(destIdOrName))) {
    return destinations.find(function(d) { return d.id === Number(destIdOrName) })
  }
  return destinations.find(function(d) { return d.name === destIdOrName })
}

function checkDestinationFit(personResult, destIdOrName, relationship, partnerTraits) {
  var dest = findDest(destIdOrName)
  if (!dest) return { fit: "no", reason: "目的地不存在" }
  var dims = ["action", "planning", "photo", "spontaneity", "food", "budget"]
  var dimNames = { action: "行动力", planning: "规划欲", photo: "出片欲", spontaneity: "随性度", food: "美食欲", budget: "预算敏度" }
  var pTraits = personResult.traits || {}
  var dist = 0, maxDiff = { name: "", diff: 0 }
  dims.forEach(function(k) {
    var diff = (pTraits[k] || 50) - (dest.traits[k] || 50)
    dist += diff * diff
    if (Math.abs(diff) > Math.abs(maxDiff.diff)) { maxDiff = { name: k, diff: diff } }
  })
  dist = Math.sqrt(dist)
  if (dist <= 60) return { fit: "yes", dist: Math.round(dist), reason: "你和" + dest.name + "的气质很搭，加入他们一起去吧！" }
  else if (dist <= 90) return { fit: "ok", dist: Math.round(dist), reason: "节奏有点不同，但磨合一下也可以一起去" + dest.name }
  else {
    var direction = maxDiff.diff > 0 ? "偏高" : "偏低"
    return { fit: "no", dist: Math.round(dist), reason: "你的" + dimNames[maxDiff.name] + direction + "，和" + dest.name + "的旅行节奏不太合拍" }
  }
}

module.exports = {
  relationships,
  destinations,
  findRelationship,
  recommendDestination,
  checkDestinationFit
}
