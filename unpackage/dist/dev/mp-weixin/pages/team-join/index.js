"use strict";
const common_vendor = require("../../common/vendor.js");
const data_personalities = require("../../data/personalities.js");
const utils_destinationFit = require("../../utils/destination-fit.js");
const utils_teamStore = require("../../utils/team-store.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  data() {
    return { personalityName: "", personalityDesc: "", personalityImg: "", fitResult: "no", fitLabel: "", fitReason: "" };
  },
  onLoad(options) {
    var code = options.code || "";
    if (!code) {
      common_vendor.index.showToast({ title: "组队码无效", icon: "none" });
      return;
    }
    var teamData = utils_teamStore.getTeam(code);
    if (!teamData) {
      common_vendor.index.showToast({ title: "组队码不存在", icon: "none" });
      return;
    }
    if (!store_index.state.hasTakenQuiz || !store_index.state.myResult) {
      common_vendor.index.showToast({ title: "请先完成答题", icon: "none" });
      return;
    }
    var p = data_personalities.personalities.find(function(x) {
      return x.id === store_index.state.myResult.personality;
    });
    this.personalityName = p ? p.name : store_index.state.myResult.personality;
    this.personalityDesc = p ? p.description : "";
    this.personalityImg = p ? p.imageCropped : "";
    var fitInfo = utils_destinationFit.checkDestinationFit(store_index.state.myResult, teamData.destinationName || teamData.destinationId);
    this.fitResult = fitInfo.fit;
    this.fitReason = fitInfo.reason;
    this.fitLabel = fitInfo.fit === "yes" ? "适合组队" : fitInfo.fit === "ok" ? "还行" : "不适合";
    utils_teamStore.joinTeam(code, { nickName: "", avatarUrl: "", personality: store_index.state.myResult.personality, fit: fitInfo.fit, fitReason: fitInfo.reason });
  },
  methods: { goTeam() {
    common_vendor.index.switchTab({ url: "/pages/team/index" });
  } }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.personalityImg
  }, $data.personalityImg ? {
    b: $data.personalityImg
  } : {}, {
    c: common_vendor.t($data.personalityName),
    d: common_vendor.t($data.personalityDesc),
    e: common_vendor.t($data.fitLabel),
    f: common_vendor.n("fit-" + $data.fitResult),
    g: common_vendor.t($data.fitReason),
    h: common_vendor.o((...args) => $options.goTeam && $options.goTeam(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3f9ff6dd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/team-join/index.js.map
