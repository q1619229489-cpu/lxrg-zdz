"use strict";
const common_vendor = require("../common/vendor.js");
function getStorageKey() {
  return "travelBuddy_teamMap";
}
function getIndexKey() {
  return "travelBuddy_teamIndex";
}
function getAllTeams() {
  try {
    var raw = common_vendor.index.getStorageSync(getStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveAllTeams(map) {
  try {
    common_vendor.index.setStorageSync(getStorageKey(), JSON.stringify(map));
  } catch (e) {
  }
}
function getTeamIndex() {
  try {
    var raw = common_vendor.index.getStorageSync(getIndexKey());
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveTeamIndex(idxMap) {
  try {
    common_vendor.index.setStorageSync(getIndexKey(), JSON.stringify(idxMap));
  } catch (e) {
  }
}
function generateCode() {
  var code = "";
  for (var i = 0; i < 8; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  var map = getAllTeams();
  if (map[code])
    return generateCode();
  return code;
}
var surnames = ["张", "王", "李", "刘", "陈", "杨", "黄", "赵", "周", "吴", "徐", "孙", "马", "朱", "胡", "郭", "何", "高", "林", "罗"];
var givenNames = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "洋", "勇", "艳", "杰", "倩", "鹏", "宇", "洋", "宁", "婷", "旭", "鑫"];
function randomName() {
  return surnames[Math.floor(Math.random() * surnames.length)] + givenNames[Math.floor(Math.random() * givenNames.length)] + givenNames[Math.floor(Math.random() * givenNames.length)];
}
function getOrCreateTeam(matchIndex, matchData) {
  var idxMap = getTeamIndex();
  if (idxMap[matchIndex])
    return idxMap[matchIndex];
  var code = generateCode();
  var map = getAllTeams();
  map[code] = { destinationName: matchData.destination || "", destinationId: matchData.destinationId || 1, pairA: { personality: matchData.myPersonality || "", traits: matchData.myTraits || {} }, pairB: { personality: matchData.partnerPersonality || "", traits: matchData.partnerTraits || {} }, relationshipName: matchData.relationship || "", members: [], createdAt: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN") };
  saveAllTeams(map);
  idxMap[matchIndex] = code;
  saveTeamIndex(idxMap);
  return code;
}
function getTeam(teamCode) {
  var map = getAllTeams();
  return map[teamCode] || null;
}
function joinTeam(teamCode, memberData) {
  var map = getAllTeams();
  var team = map[teamCode];
  if (!team)
    return false;
  if (!team.members)
    team.members = [];
  var member = { nickName: memberData.nickName || randomName(), avatarUrl: memberData.avatarUrl || "/static/logo.png", personality: memberData.personality || "", fit: memberData.fit || "no", fitReason: memberData.fitReason || "" };
  team.members.push(member);
  saveAllTeams(map);
  return true;
}
function getAllTeamCodes() {
  var idxMap = getTeamIndex();
  return Object.keys(idxMap).map(function(k) {
    return { matchIndex: parseInt(k), code: idxMap[k] };
  });
}
exports.getAllTeamCodes = getAllTeamCodes;
exports.getOrCreateTeam = getOrCreateTeam;
exports.getTeam = getTeam;
exports.joinTeam = joinTeam;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/team-store.js.map
