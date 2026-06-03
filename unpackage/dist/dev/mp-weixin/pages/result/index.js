"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_personalities = require("../../data/personalities.js");
const data_relationships = require("../../data/relationships.js");
const data_destinations = require("../../data/destinations.js");
const _sfc_main = {
  data() {
    return { store: store_index.state, myInfo: null, partnerInfo: null, matchResult: null, relImgStyle: {} };
  },
  onLoad(options) {
    options.matched === "true";
    if (store_index.state.currentMatch && store_index.state.currentMatch.partnerPersonality) {
      this.partnerInfo = data_personalities.personalities.find(function(x) {
        return x.id === store_index.state.currentMatch.partnerPersonality;
      });
    } else if (options.inviteCode) {
      try {
        var map = JSON.parse(common_vendor.index.getStorageSync("travelBuddy_inviteMap") || "{}");
        var info = map[options.inviteCode];
        if (info && info.personality) {
          this.partnerInfo = data_personalities.personalities.find(function(x) {
            return x.id === info.personality;
          });
        }
      } catch (e) {
      }
    }
    if (!this.partnerInfo) {
      this.partnerInfo = data_personalities.personalities.find(function(x) {
        return x.id === "卡皮巴适";
      }) || data_personalities.personalities[1];
    }
    if (store_index.state.myResult) {
      this.myInfo = data_personalities.personalities.find(function(x) {
        return x.id === store_index.state.myResult.personality;
      });
    }
    var myP = store_index.state.myResult ? store_index.state.myResult.personality : "特种兵";
    var pP = this.partnerInfo ? this.partnerInfo.id : "卡皮巴适";
    var rel = data_relationships.findRelationship(myP, pP);
    if (rel) {
      var tA = store_index.state.myResult ? store_index.state.myResult.traits : {};
      var dests = data_destinations.recommendDestination(rel, myP, pP, [], tA, {});
      this.matchResult = { relationship: rel, destinations: dests || [], rarityCount: rel.rarity, rarityText: rel.rarityText };
    }
  },
  methods: {
    onRelImgLoad(e) {
      var w = e.detail.width, h = e.detail.height;
      if (w && h) {
        var maxW = common_vendor.index.getSystemInfoSync().windowWidth - 100;
        var rw = Math.min(maxW, w);
        var rh = rw / w * h;
        this.relImgStyle = { width: rw + "px", height: rh + "px" };
      }
    },
    getZuheExt(name) {
      var map = { "快到模糊组": ".jpeg", "松弛与急迫组": ".jpeg", "步数排行榜冠亚军": ".jpeg", "难以望其项背": ".jpg" };
      return map[name] || ".png";
    },
    getMime(ext) {
      return ext === ".png" ? "image/png" : "image/jpeg";
    },
    imgToDataUrl(path) {
      try {
        var fs = common_vendor.wx$1.getFileSystemManager();
        var base64 = fs.readFileSync(path, "base64");
        if (!base64 || base64.length < 20)
          return null;
        var ext = path.split(".").pop().toLowerCase();
        return "data:" + (ext === "png" ? "image/png" : "image/jpeg") + ";base64," + base64;
      } catch (e) {
        return null;
      }
    },
    saveResultCard() {
      var that = this;
      var rel = that.matchResult && that.matchResult.relationship;
      if (!rel) {
        common_vendor.index.showToast({ title: "暂无匹配结果", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "生成卡片中…" });
      var zuhePath = "/static/images/zuhe/" + rel.name + that.getZuheExt(rel.name);
      var qrPath = "/static/images/qr-code.jpg";
      var inviteCode = that.store.inviteCode || "------";
      var zuheDataUrl = that.imgToDataUrl(zuhePath);
      var qrDataUrl = that.imgToDataUrl(qrPath);
      var query = common_vendor.index.createSelectorQuery().in(that);
      query.select("#saveCardCanvas").node(function(res) {
        if (!res || !res.node) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "画布初始化失败", icon: "none" });
          return;
        }
        var canvas = res.node, ctx = canvas.getContext("2d");
        var W = 600, H = 950, CX = 300;
        canvas.width = W;
        canvas.height = H;
        var zuheImg = null, qrImg = null;
        var drawn = false;
        function rr(x, y, w, h, r) {
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
          rr(0, 0, W, H, 24);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          rr(24, 24, W - 48, H - 48, 24);
          ctx.fill();
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.stroke();
          var grad = ctx.createLinearGradient(24, 24, W - 24, 88);
          grad.addColorStop(0, "#FF6B35");
          grad.addColorStop(1, "#F72585");
          ctx.beginPath();
          ctx.moveTo(48, 24);
          ctx.lineTo(W - 48, 24);
          ctx.quadraticCurveTo(W - 24, 24, W - 24, 48);
          ctx.lineTo(W - 24, 88);
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
          var curY = 140;
          if (zuheImg) {
            var zs = 400;
            ctx.drawImage(zuheImg, CX - zs / 2, curY, zs, zs * zuheImg.height / zuheImg.width);
            curY = curY + zs * zuheImg.height / zuheImg.width + 20;
          }
          ctx.font = "24px sans-serif";
          ctx.fillStyle = "#1A1A2E";
          ctx.fillText(rel.name, CX, curY);
          curY = curY + 50;
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, curY);
          ctx.lineTo(W - 80, curY);
          ctx.stroke();
          curY = curY + 40;
          ctx.font = "14px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("邀请码", CX, curY);
          curY = curY + 32;
          ctx.font = "36px sans-serif";
          ctx.fillStyle = "#FF6B35";
          ctx.textAlign = "left";
          var chars = String(inviteCode).split("");
          var spacing = 28;
          var totalW = chars.length * spacing;
          var sx = CX - totalW / 2;
          for (var i = 0; i < chars.length; i++) {
            ctx.fillText(chars[i], sx + i * spacing, curY);
          }
          ctx.textAlign = "center";
          curY = curY + 50;
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, curY);
          ctx.lineTo(W - 80, curY);
          ctx.stroke();
          curY = curY + 50;
          var qrSize = 160;
          if (qrImg) {
            ctx.drawImage(qrImg, CX - qrSize / 2, curY, qrSize, qrSize);
          } else {
            ctx.strokeStyle = "#D1D5DB";
            ctx.lineWidth = 2;
            rr(CX - qrSize / 2, curY, qrSize, qrSize, 12);
            ctx.stroke();
            ctx.font = "14px sans-serif";
            ctx.fillStyle = "#9CA3AF";
            ctx.fillText("小程序码", CX, curY + qrSize / 2 - 4);
            ctx.fillText("待申请", CX, curY + qrSize / 2 + 16);
          }
          curY = curY + qrSize + 24;
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("长按扫码 测测你的搭子类型", CX, curY);
          setTimeout(function() {
            try {
              common_vendor.index.canvasToTempFilePath({ canvas, x: 0, y: 0, width: 600, height: 950, destWidth: 600, destHeight: 950, fileType: "jpg", quality: 1, success: function(res2) {
                common_vendor.index.previewImage({ urls: [res2.tempFilePath], success: function() {
                  common_vendor.index.hideLoading();
                  common_vendor.index.showToast({ title: "长按图片可保存", icon: "none" });
                }, fail: function() {
                  common_vendor.index.hideLoading();
                  common_vendor.index.showToast({ title: "预览失败", icon: "none" });
                } });
              }, fail: function(er1) {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "导出失败:" + (er1.errMsg || ""), icon: "none" });
              } });
            } catch (e) {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "异常:" + e.message, icon: "none" });
            }
          }, 300);
        }
        var timer = setTimeout(function() {
          doDraw();
        }, 3e3);
        if (zuheDataUrl) {
          var zi = canvas.createImage();
          zi.onload = function() {
            zuheImg = zi;
            clearTimeout(timer);
            doDraw();
          };
          zi.onerror = function() {
            clearTimeout(timer);
            doDraw();
          };
          zi.src = zuheDataUrl;
        } else {
          doDraw();
          clearTimeout(timer);
        }
        if (qrDataUrl) {
          var qi = canvas.createImage();
          qi.onload = function() {
            qrImg = qi;
            clearTimeout(timer);
            doDraw();
          };
          qi.onerror = function() {
            clearTimeout(timer);
            doDraw();
          };
          qi.src = qrDataUrl;
        }
      }).exec();
    },
    goTeam() {
      common_vendor.index.switchTab({ url: "/pages/team/index" });
    },
    goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.matchResult
  }, $data.matchResult ? {
    b: "/static/images/zuhe/" + $data.matchResult.relationship.name + $options.getZuheExt($data.matchResult.relationship.name),
    c: common_vendor.s($data.relImgStyle),
    d: common_vendor.o((...args) => $options.onRelImgLoad && $options.onRelImgLoad(...args)),
    e: common_vendor.t($data.matchResult.relationship.name),
    f: common_vendor.t($data.matchResult.relationship.desc)
  } : {}, {
    g: $data.myInfo
  }, $data.myInfo ? {
    h: $data.myInfo.imageCropped,
    i: common_vendor.t($data.myInfo.name)
  } : {}, {
    j: $data.partnerInfo
  }, $data.partnerInfo ? {
    k: $data.partnerInfo.imageCropped,
    l: common_vendor.t($data.partnerInfo.name)
  } : {}, {
    m: $data.matchResult
  }, $data.matchResult ? {
    n: common_vendor.t($data.matchResult.rarityCount),
    o: common_vendor.t($data.matchResult.rarityText)
  } : {}, {
    p: $data.matchResult && $data.matchResult.destinations && $data.matchResult.destinations.length
  }, $data.matchResult && $data.matchResult.destinations && $data.matchResult.destinations.length ? {
    q: common_vendor.f($data.matchResult.destinations, (dest, idx, i0) => {
      return {
        a: common_vendor.t(idx + 1),
        b: common_vendor.n("rank-" + (idx + 1)),
        c: common_vendor.t(dest.name),
        d: common_vendor.t(dest.desc),
        e: idx
      };
    })
  } : {}, {
    r: common_vendor.o((...args) => $options.goTeam && $options.goTeam(...args)),
    s: common_vendor.o((...args) => $options.saveResultCard && $options.saveResultCard(...args)),
    t: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-196a383f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/result/index.js.map
