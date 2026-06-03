"use strict";
const data_destinations = require("../data/destinations.js");
function findDest(destIdOrName) {
  if (typeof destIdOrName === "number" || /^\d+$/.test(String(destIdOrName))) {
    return data_destinations.destinations.find(function(d) {
      return d.id === Number(destIdOrName);
    });
  }
  return data_destinations.destinations.find(function(d) {
    return d.name === destIdOrName;
  });
}
function checkDestinationFit(personResult, destIdOrName, relationship, partnerTraits) {
  var dest = findDest(destIdOrName);
  if (!dest)
    return { fit: "no", reason: "目的地不存在" };
  var dims = ["action", "planning", "photo", "spontaneity", "food", "budget"];
  var dimNames = { action: "行动力", planning: "规划欲", photo: "出片欲", spontaneity: "随性度", food: "美食欲", budget: "预算敏度" };
  var pTraits = personResult.traits || {};
  var dist = 0, maxDiff = { name: "", diff: 0 };
  dims.forEach(function(k) {
    var diff = (pTraits[k] || 50) - (dest.traits[k] || 50);
    dist += diff * diff;
    if (Math.abs(diff) > Math.abs(maxDiff.diff)) {
      maxDiff = { name: k, diff };
    }
  });
  dist = Math.sqrt(dist);
  if (dist <= 60)
    return { fit: "yes", dist: Math.round(dist), reason: "你和" + dest.name + "的气质很搭，加入他们一起去吧！" };
  else if (dist <= 90)
    return { fit: "ok", dist: Math.round(dist), reason: "节奏有点不同，但磨合一下也可以一起去" + dest.name };
  else {
    var direction = maxDiff.diff > 0 ? "偏高" : "偏低";
    return { fit: "no", dist: Math.round(dist), reason: "你的" + dimNames[maxDiff.name] + direction + "，和" + dest.name + "的旅行节奏不太合拍" };
  }
}
exports.checkDestinationFit = checkDestinationFit;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/destination-fit.js.map
