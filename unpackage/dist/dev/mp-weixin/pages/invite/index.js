"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_personalities = require("../../data/personalities.js");
const _sfc_main = {
  data() {
    return { store: store_index.state };
  },
  computed: {
    pImage() {
      if (!store_index.state.myResult)
        return "";
      var p = data_personalities.personalities.find(function(x) {
        return x.id === store_index.state.myResult.personality;
      });
      return p ? p.image : "";
    }
  },
  methods: {
    copyCode() {
      if (!store_index.state.inviteCode)
        return;
      common_vendor.index.setClipboardData({ data: store_index.state.inviteCode, success: function() {
        common_vendor.index.showToast({ title: "复制成功", icon: "none" });
      } });
    },
    goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.store.myResult
  }, $data.store.myResult ? {
    b: $options.pImage
  } : {}, {
    c: common_vendor.t($data.store.inviteCode),
    d: common_vendor.o((...args) => $options.copyCode && $options.copyCode(...args)),
    e: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e54fd6d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/invite/index.js.map
