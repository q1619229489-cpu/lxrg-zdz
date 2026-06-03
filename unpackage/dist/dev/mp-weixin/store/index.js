"use strict";
const common_vendor = require("../common/vendor.js");
const utils_inviteCode = require("../utils/invite-code.js");
const state = common_vendor.reactive({
  hasTakenQuiz: false,
  answers: [],
  myResult: null,
  inviteCode: null,
  currentMatch: null,
  matchStatus: "none",
  matchHistory: [],
  groupShares: []
});
function initStore() {
  try {
    var saved = common_vendor.index.getStorageSync("travelBuddyStore");
    if (saved) {
      Object.assign(state, JSON.parse(saved));
    }
  } catch (e) {
    common_vendor.index.__f__("log", "at store/index.js:14", "Store init error:", e);
  }
}
function saveState() {
  try {
    common_vendor.index.setStorageSync("travelBuddyStore", JSON.stringify(state));
  } catch (e) {
  }
}
function saveToInviteCodeMap(code, personality, traits) {
  try {
    var raw = common_vendor.index.getStorageSync("travelBuddy_inviteMap");
    var map = raw ? JSON.parse(raw) : {};
    map[code] = { personality, traits: traits || {} };
    common_vendor.index.setStorageSync("travelBuddy_inviteMap", JSON.stringify(map));
  } catch (e) {
    common_vendor.index.__f__("log", "at store/index.js:27", "Save inviteMap error:", e);
  }
}
function findByInviteCode(code) {
  if (code === "888888")
    return { personality: "特种兵", traits: {} };
  try {
    var raw = common_vendor.index.getStorageSync("travelBuddy_inviteMap");
    var map = raw ? JSON.parse(raw) : {};
    return map[code] || null;
  } catch (e) {
    return null;
  }
}
function hasMatchedBefore(inviteCode) {
  try {
    var raw = common_vendor.index.getStorageSync("travelBuddy_matchedCodes");
    var matched = raw ? JSON.parse(raw) : [];
    return matched.indexOf(inviteCode) !== -1;
  } catch (e) {
    return false;
  }
}
function markMatched(inviteCode) {
  try {
    var raw = common_vendor.index.getStorageSync("travelBuddy_matchedCodes");
    var matched = raw ? JSON.parse(raw) : [];
    if (matched.indexOf(inviteCode) === -1) {
      matched.push(inviteCode);
    }
    common_vendor.index.setStorageSync("travelBuddy_matchedCodes", JSON.stringify(matched));
  } catch (e) {
  }
}
function setQuizResult(answers, result) {
  state.hasTakenQuiz = true;
  state.answers = answers;
  state.myResult = result;
  state.inviteCode = utils_inviteCode.generateInviteCode();
  saveToInviteCodeMap(state.inviteCode, result.personality, result.traits);
  saveState();
}
function setMatch(matchData) {
  state.currentMatch = matchData;
  state.matchStatus = "matched";
  state.matchHistory.unshift({ date: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN"), ...matchData });
  saveState();
}
exports.findByInviteCode = findByInviteCode;
exports.hasMatchedBefore = hasMatchedBefore;
exports.initStore = initStore;
exports.markMatched = markMatched;
exports.setMatch = setMatch;
exports.setQuizResult = setQuizResult;
exports.state = state;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
