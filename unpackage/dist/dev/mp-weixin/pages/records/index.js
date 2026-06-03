"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_personalities = require("../../data/personalities.js");
const _sfc_main = {
  data() {
    return { store: store_index.state, refreshKey: 0, _savingItem: null };
  },
  onShow() {
    if (store_index.state.matchHistory.length > 0) {
      store_index.state.matchHistory.forEach(function(item, idx) {
        var saved = common_vendor.index.getStorageSync("travelBuddy_partnerName_" + idx);
        if (saved)
          item.partnerName = saved;
      });
      this.refreshKey = Date.now();
    }
  },
  methods: {
    getPersonalityImage(id) {
      if (!id)
        return "";
      var p = data_personalities.personalities.find(function(x) {
        return x.id === id;
      });
      return p ? p.imageCropped : "";
    },
    getPersonalityObj(id) {
      return data_personalities.personalities.find(function(x) {
        return x.id === id;
      }) || null;
    },
    getMime(ext) {
      return ext === ".png" ? "image/png" : "image/jpeg";
    },
    imgToDataUrl(path) {
      try {
        var fs = common_vendor.wx$1.getFileSystemManager();
        var parts = path.split(".");
        var ext = "." + parts[parts.length - 1];
        return "data:" + this.getMime(ext) + ";base64," + fs.readFileSync(path, "base64");
      } catch (e) {
        return null;
      }
    },
    viewDetail(item) {
      common_vendor.index.showToast({ title: item.relationship, icon: "none" });
    },
    saveRecordCard(item) {
      var that = this;
      if (!store_index.state.myResult) {
        common_vendor.index.showToast({ title: "请先完成答题", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "生成卡片中…" });
      var myP = that.getPersonalityObj(store_index.state.myResult.personality);
      var partnerP = that.getPersonalityObj(item.partnerPersonality);
      var myImgPath = myP ? myP.imageCropped : null;
      var partnerImgPath = partnerP ? partnerP.imageCropped : null;
      var qrPath = "/static/images/qr-code.jpg";
      var relName = item.relationship || "未知组合";
      var destName = item.destination || "";
      var partnerLabel = item.partnerName || "好友";
      var myName = myP ? myP.name : store_index.state.myResult.personality;
      var partnerName = partnerP ? partnerP.name : item.partnerPersonality;
      var myDataUrl = myImgPath ? that.imgToDataUrl(myImgPath) : null;
      var partnerDataUrl = partnerImgPath ? that.imgToDataUrl(partnerImgPath) : null;
      var qrDataUrl = that.imgToDataUrl(qrPath);
      var query = common_vendor.index.createSelectorQuery().in(that);
      query.select("#recordCardCanvas").node(function(res) {
        if (!res || !res.node) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "画布初始化失败", icon: "none" });
          return;
        }
        var canvas = res.node, ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 950;
        var CX = 300;
        var myImg = null;
        var partnerImg = null;
        var qrImg = null;
        var drawn = false;
        function roundRect(x, y, w, h, r) {
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        }
        function doDraw() {
          if (drawn)
            return;
          drawn = true;
          ctx.fillStyle = "#FFF8F4";
          roundRect(0, 0, 600, 950, 24);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          roundRect(24, 24, 552, 902, 24);
          ctx.fill();
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.stroke();
          var grad = ctx.createLinearGradient(24, 24, 576, 88);
          grad.addColorStop(0, "#FF6B35");
          grad.addColorStop(1, "#F72585");
          ctx.beginPath();
          ctx.moveTo(48, 24);
          ctx.lineTo(552, 24);
          ctx.quadraticCurveTo(576, 24, 576, 48);
          ctx.lineTo(576, 88);
          ctx.lineTo(24, 88);
          ctx.lineTo(24, 48);
          ctx.quadraticCurveTo(24, 24, 48, 24);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "22px sans-serif";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText("🎋 旅行搭子匹配器", CX, 56);
          var curY = 130;
          if (myImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(130, curY + 50, 50, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(myImg, 80, curY, 100, 100);
            ctx.restore();
          }
          ctx.font = "14px sans-serif";
          ctx.fillStyle = "#1A1A2E";
          ctx.fillText(myName, 130, curY + 115);
          if (partnerImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(470, curY + 50, 50, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(partnerImg, 420, curY, 100, 100);
            ctx.restore();
          }
          ctx.fillText(partnerName, 470, curY + 115);
          ctx.font = "28px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("VS", CX, curY + 55);
          curY = curY + 150;
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, curY);
          ctx.lineTo(520, curY);
          ctx.stroke();
          curY = curY + 40;
          ctx.font = "18px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("搭子关系", CX, curY);
          curY = curY + 36;
          ctx.font = "28px sans-serif";
          ctx.fillStyle = "#FF6B35";
          ctx.fillText(relName, CX, curY);
          curY = curY + 50;
          if (destName) {
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#6B7280";
            ctx.fillText("推荐：" + destName, CX, curY);
            curY = curY + 40;
          }
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, curY);
          ctx.lineTo(520, curY);
          ctx.stroke();
          curY = curY + 50;
          ctx.font = "14px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("我们", CX, curY);
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("和 " + partnerLabel, CX, curY + 28);
          curY = curY + 80;
          var qrSize = 160;
          if (qrImg) {
            ctx.drawImage(qrImg, CX - qrSize / 2, curY, qrSize, qrSize);
          }
          curY = curY + qrSize + 24;
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("长按扫码 测测你的搭子类型", CX, curY);
          setTimeout(function() {
            try {
              common_vendor.index.canvasToTempFilePath({
                canvas,
                x: 0,
                y: 0,
                width: 600,
                height: 950,
                destWidth: 600,
                destHeight: 950,
                fileType: "jpg",
                quality: 1,
                success: function(res2) {
                  common_vendor.index.previewImage({ urls: [res2.tempFilePath], success: function() {
                    common_vendor.index.hideLoading();
                    common_vendor.index.showToast({ title: "长按图片可保存", icon: "none" });
                  }, fail: function() {
                    common_vendor.index.hideLoading();
                    common_vendor.index.showToast({ title: "预览失败", icon: "none" });
                  } });
                },
                fail: function(er1) {
                  common_vendor.index.hideLoading();
                  common_vendor.index.showToast({ title: "导出失败:" + (er1.errMsg || ""), icon: "none" });
                }
              });
            } catch (e) {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "异常:" + e.message, icon: "none" });
            }
          }, 300);
        }
        if (myDataUrl) {
          var m = canvas.createImage();
          m.src = myDataUrl;
          m.onload = function() {
            myImg = m;
            doDraw();
          };
          m.onerror = function() {
            doDraw();
          };
        } else {
          doDraw();
        }
        if (partnerDataUrl) {
          var p = canvas.createImage();
          p.src = partnerDataUrl;
          p.onload = function() {
            partnerImg = p;
            doDraw();
          };
          p.onerror = function() {
            doDraw();
          };
        }
        if (qrDataUrl) {
          var q = canvas.createImage();
          q.src = qrDataUrl;
          q.onload = function() {
            qrImg = q;
            doDraw();
          };
          q.onerror = function() {
            doDraw();
          };
        }
      }).exec();
    },
    editPartnerName(idx) {
      var item = this.store.matchHistory[idx];
      var oldName = item.partnerName || "好友";
      common_vendor.index.showModal({ title: "修改备注", content: "请输入你和TA的关系备注", editable: true, placeholderText: oldName, success: function(res) {
        if (res.confirm && res.content && res.content.trim()) {
          item.partnerName = res.content.trim();
          common_vendor.index.setStorageSync("travelBuddy_partnerName_" + idx, res.content.trim());
          common_vendor.index.showToast({ title: "已修改", icon: "none" });
        }
      } });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return common_vendor.e({
    a: $data.store.matchHistory.length > 0
  }, $data.store.matchHistory.length > 0 ? {
    b: common_vendor.f($data.store.matchHistory, (item, idx, i0) => {
      return common_vendor.e({
        a: $options.getPersonalityImage(item.partnerPersonality),
        b: common_vendor.t(item.date),
        c: common_vendor.t(item.partnerName || "好友"),
        d: common_vendor.o(($event) => $options.editPartnerName(idx), idx),
        e: common_vendor.t(item.relationship),
        f: item.destination
      }, item.destination ? {
        g: common_vendor.t(item.destination),
        h: common_vendor.o(($event) => $options.saveRecordCard(item), idx)
      } : {}, {
        i: idx,
        j: common_vendor.o(($event) => $options.viewDetail(item), idx)
      });
    }),
    c: $options.getPersonalityImage((_a = $data.store.myResult) == null ? void 0 : _a.personality)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f1512143"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/records/index.js.map
