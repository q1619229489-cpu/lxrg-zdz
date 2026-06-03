"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/quiz/index.js";
  "./pages/invite/index.js";
  "./pages/result/index.js";
  "./pages/records/index.js";
  "./pages/collection/index.js";
  "./pages/team/index.js";
  "./pages/team-join/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    store_index.initStore();
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
function createApp() {
  var app = common_vendor.createSSRApp(_sfc_main);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
