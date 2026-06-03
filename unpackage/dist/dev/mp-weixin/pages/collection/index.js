"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_relationships = require("../../data/relationships.js");
const _sfc_main = {
  data() {
    return { store: store_index.state, relationships: data_relationships.relationships };
  },
  methods: {
    isRelationUnlocked(rel) {
      if (!store_index.state.myResult)
        return false;
      return store_index.state.matchHistory.some(function(item) {
        return item.relationship === rel.name;
      });
    },
    previewRelation(r) {
      if (!this.isRelationUnlocked(r))
        return;
      common_vendor.index.showToast({ title: r.name + ": " + r.desc, icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.relationships, (r, k0, i0) => {
      return common_vendor.e({
        a: $options.isRelationUnlocked(r)
      }, $options.isRelationUnlocked(r) ? {
        b: "/static/images/裁剪后/" + r.name + ".png",
        c: common_vendor.t(r.name)
      } : {}, {
        d: r.id,
        e: $options.isRelationUnlocked(r) ? 1 : "",
        f: common_vendor.o(($event) => $options.previewRelation(r), r.id)
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7e535635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/index.js.map
