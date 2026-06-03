"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_personalities = require("../../data/personalities.js");
const utils_teamStore = require("../../utils/team-store.js");
const _sfc_main = {
  data() {
    return { store: store_index.state, joinCode: "", showCode: "", teamCodes: {}, createdTeams: [] };
  },
  computed: { hasMatches() {
    return store_index.state.matchHistory && store_index.state.matchHistory.length > 0;
  } },
  onShow() {
    this.loadTeams();
  },
  methods: {
    getPImage(id) {
      if (!id)
        return "";
      var p = data_personalities.personalities.find(function(x) {
        return x.id === id;
      });
      return p ? p.imageCropped : "";
    },
    countFit(members) {
      var n = 0;
      members.forEach(function(m) {
        if (m.fit === "yes" || m.fit === "ok")
          n++;
      });
      return n;
    },
    loadTeams() {
      var idxMap = utils_teamStore.getAllTeamCodes();
      var codes = {};
      var list = [];
      var seen = {};
      idxMap.forEach(function(item) {
        codes[item.matchIndex] = item.code;
        if (!seen[item.code]) {
          seen[item.code] = true;
          var team = utils_teamStore.getTeam(item.code);
          if (team) {
            team.code = item.code;
            list.push(team);
          }
        }
      });
      this.teamCodes = codes;
      this.createdTeams = list;
    },
    createTeamForMatch(idx) {
      var item = store_index.state.matchHistory[idx];
      if (!item)
        return;
      if (this.teamCodes[idx]) {
        this.showCode = this.teamCodes[idx];
        return;
      }
      var code = utils_teamStore.getOrCreateTeam(idx, { destination: item.destination || "", myPersonality: store_index.state.myResult ? store_index.state.myResult.personality : "", myTraits: store_index.state.myResult ? store_index.state.myResult.traits : {}, partnerPersonality: item.partnerPersonality, partnerTraits: {}, relationship: item.relationship });
      this.teamCodes[idx] = code;
      this.showCode = code;
      this.loadTeams();
    },
    doJoin() {
      var code = this.joinCode.trim();
      if (!/^\d{8}$/.test(code)) {
        common_vendor.index.showToast({ title: "请输入8位数字组队码", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/team-join/index?code=" + code });
    },
    copyCode() {
      if (!this.showCode)
        return;
      common_vendor.index.setClipboardData({ data: this.showCode, success: function() {
        common_vendor.index.showToast({ title: "已复制", icon: "none" });
      } });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.joinCode,
    b: common_vendor.o(($event) => $data.joinCode = $event.detail.value),
    c: common_vendor.o((...args) => $options.doJoin && $options.doJoin(...args)),
    d: $data.createdTeams.length > 0
  }, $data.createdTeams.length > 0 ? {
    e: common_vendor.f($data.createdTeams, (t, idx, i0) => {
      return common_vendor.e({
        a: common_vendor.t(t.relationshipName),
        b: t.destinationName
      }, t.destinationName ? {
        c: common_vendor.t(t.destinationName)
      } : {}, {
        d: common_vendor.t(t.code),
        e: common_vendor.o(($event) => $data.showCode = t.code, idx),
        f: t.members && t.members.length > 0
      }, t.members && t.members.length > 0 ? {
        g: common_vendor.t($options.countFit(t.members)),
        h: common_vendor.f(t.members, (m, mi, i1) => {
          return {
            a: m.avatarUrl,
            b: common_vendor.t(m.nickName),
            c: common_vendor.t(m.fit === "yes" ? "适合" : m.fit === "ok" ? "还行" : "不适合"),
            d: common_vendor.n("tag-" + m.fit),
            e: mi
          };
        })
      } : {}, {
        i: idx
      });
    })
  } : {}, {
    f: $options.hasMatches
  }, $options.hasMatches ? {
    g: common_vendor.f($data.store.matchHistory, (item, idx, i0) => {
      return {
        a: $options.getPImage(item.partnerPersonality),
        b: common_vendor.t(item.relationship),
        c: common_vendor.t(item.partnerName || "好友"),
        d: common_vendor.t($data.teamCodes[idx] ? "已生成" : "生成码"),
        e: idx,
        f: common_vendor.o(($event) => $options.createTeamForMatch(idx), idx)
      };
    })
  } : {}, {
    h: $data.showCode
  }, $data.showCode ? {
    i: common_vendor.t($data.showCode),
    j: common_vendor.o((...args) => $options.copyCode && $options.copyCode(...args)),
    k: common_vendor.o(($event) => $data.showCode = ""),
    l: common_vendor.o(() => {
    }),
    m: common_vendor.o(($event) => $data.showCode = "")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1e67a536"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/team/index.js.map
