"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const data_personalities = require("../../data/personalities.js");
const utils_inviteCode = require("../../utils/invite-code.js");
const data_relationships = require("../../data/relationships.js");
const data_destinations = require("../../data/destinations.js");
const _sfc_main = {
  data() {
    return { store: store_index.state, matchCode: "", traitKeys: data_personalities.traitDefinitions };
  },
  computed: {
    pInfo() {
      if (!store_index.state.myResult)
        return null;
      return data_personalities.personalities.find(function(p) {
        return p.id === store_index.state.myResult.personality;
      });
    },
    pColor() {
      if (!this.pInfo)
        return { bg: "#E8E8E8", text: "#999" };
      return { bg: this.pInfo.bgColor, text: this.pInfo.textColor };
    }
  },
  methods: {
    goQuiz() {
      common_vendor.index.navigateTo({ url: "/pages/quiz/index" });
    },
    copyCode() {
      if (!store_index.state.inviteCode)
        return;
      common_vendor.index.setClipboardData({ data: store_index.state.inviteCode, success: function() {
        common_vendor.index.showToast({ title: "复制成功", icon: "none" });
      } });
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
    getTraitColor(id) {
      var colors = { action: "#FF6B35", planning: "#4361EE", photo: "#F72585", spontaneity: "#06D6A0", food: "#B8860B", budget: "#5C4D3C" };
      return colors[id] || "#999";
    },
    saveCard() {
      var that = this;
      if (!store_index.state.myResult || !store_index.state.inviteCode) {
        common_vendor.index.showToast({ title: "暂无内容", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "生成卡片中…" });
      var pName = store_index.state.myResult.personality || "";
      var inviteCode = store_index.state.inviteCode || "";
      var pDataUrl = that.imgToDataUrl(that.pInfo ? that.pInfo.imageCropped : "");
      var qrDataUrl = that.imgToDataUrl("/static/images/qr-code.jpg");
      var query = common_vendor.index.createSelectorQuery().in(that);
      query.select("#homeCardCanvas").node(function(res) {
        if (!res || !res.node) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "画布初始化失败", icon: "none" });
          return;
        }
        var canvas = res.node, ctx = canvas.getContext("2d");
        var W = 600, H = 950, CX = 300;
        canvas.width = W;
        canvas.height = H;
        var personImg = null, qrImg = null, loaded = { person: false, qr: false };
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
          ctx.fillStyle = "#FFF8F4";
          roundRect(0, 0, W, H, 24);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          roundRect(24, 24, W - 48, H - 48, 24);
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
          var imgY = 130;
          if (personImg) {
            var ps = Math.min(200, Math.min(personImg.width, personImg.height));
            ctx.save();
            ctx.beginPath();
            ctx.arc(CX, imgY + ps / 2, ps / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(personImg, CX - ps / 2, imgY, ps, ps);
            ctx.restore();
            imgY = imgY + ps + 24;
          }
          ctx.font = "28px sans-serif";
          ctx.fillStyle = "#1A1A2E";
          ctx.fillText(pName, CX, imgY);
          imgY = imgY + 50;
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, imgY);
          ctx.lineTo(520, imgY);
          ctx.stroke();
          imgY = imgY + 40;
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("邀请码", CX, imgY);
          imgY = imgY + 32;
          ctx.font = "36px sans-serif";
          ctx.fillStyle = "#FF6B35";
          var chars = String(inviteCode).split("");
          var spacing = 28;
          var totalW = chars.length * spacing;
          var sx = CX - totalW / 2;
          ctx.textAlign = "left";
          for (var i = 0; i < chars.length; i++) {
            ctx.fillText(chars[i], sx + i * spacing, imgY);
          }
          ctx.textAlign = "center";
          imgY = imgY + 10;
          imgY = imgY + 40;
          ctx.strokeStyle = "#EFEBE6";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, imgY);
          ctx.lineTo(520, imgY);
          ctx.stroke();
          imgY = imgY + 40;
          var qrSize = 160;
          if (qrImg) {
            ctx.drawImage(qrImg, CX - qrSize / 2, imgY, qrSize, qrSize);
          }
          imgY = imgY + qrSize + 24;
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#8B8B9E";
          ctx.fillText("长按扫码 测测你的搭子类型", CX, imgY);
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
          }, 100);
        }
        if (pDataUrl) {
          var pImg = canvas.createImage();
          pImg.src = pDataUrl;
          pImg.onload = function() {
            personImg = pImg;
            loaded.person = true;
            if (loaded.person && loaded.qr)
              doDraw();
          };
          pImg.onerror = function() {
            loaded.person = true;
            if (loaded.person && loaded.qr)
              doDraw();
          };
        } else {
          loaded.person = true;
        }
        if (qrDataUrl) {
          var qImg = canvas.createImage();
          qImg.src = qrDataUrl;
          qImg.onload = function() {
            qrImg = qImg;
            loaded.qr = true;
            if (loaded.person && loaded.qr)
              doDraw();
          };
          qImg.onerror = function() {
            loaded.qr = true;
            if (loaded.person && loaded.qr)
              doDraw();
          };
        } else {
          loaded.qr = true;
        }
        if (loaded.person && loaded.qr)
          doDraw();
      }).exec();
    },
    doMatch() {
      var code = this.matchCode.trim().toUpperCase();
      if (!utils_inviteCode.isValidInviteCode(code)) {
        common_vendor.index.showToast({ title: "请输入6位有效邀请码", icon: "none" });
        return;
      }
      if (code === store_index.state.inviteCode) {
        common_vendor.index.showToast({ title: "不能和自己匹配", icon: "none" });
        return;
      }
      if (code !== "888888" && store_index.hasMatchedBefore(code)) {
        common_vendor.index.showToast({ title: "你们已经匹配过了", icon: "none" });
        return;
      }
      if (!store_index.state.hasTakenQuiz || !store_index.state.myResult) {
        common_vendor.index.showToast({ title: "请先完成答题", icon: "none" });
        return;
      }
      var partnerInfo = store_index.findByInviteCode(code);
      if (!partnerInfo) {
        common_vendor.index.showToast({ title: "邀请码不存在，请分享小程序邀请好友答题", icon: "none" });
        return;
      }
      var rel = data_relationships.findRelationship(store_index.state.myResult.personality, partnerInfo.personality);
      if (rel) {
        var dests = data_destinations.recommendDestination(rel, store_index.state.myResult.personality, partnerInfo.personality, [], store_index.state.myResult.traits, partnerInfo.traits);
        var destName = dests && dests.length > 0 ? dests[0].name : "";
        store_index.setMatch({ partnerName: "好友", partnerPersonality: partnerInfo.personality, partnerInviteCode: code, relationship: rel.name, destination: destName });
        if (code !== "888888") {
          store_index.markMatched(code);
        }
        common_vendor.index.navigateTo({ url: "/pages/result/index?inviteCode=" + code + "&matched=true" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.store.hasTakenQuiz
  }, !$data.store.hasTakenQuiz ? {
    b: common_vendor.o((...args) => $options.goQuiz && $options.goQuiz(...args))
  } : {}, {
    c: $data.store.hasTakenQuiz
  }, $data.store.hasTakenQuiz ? common_vendor.e({
    d: common_vendor.o((...args) => $options.copyCode && $options.copyCode(...args)),
    e: common_vendor.o((...args) => $options.saveCard && $options.saveCard(...args)),
    f: common_vendor.t($data.store.inviteCode),
    g: $data.store.myResult
  }, $data.store.myResult ? {
    h: $options.pInfo ? $options.pInfo.imageCropped : "",
    i: common_vendor.t($data.store.myResult.personality),
    j: $options.pColor.bg,
    k: $options.pColor.text,
    l: common_vendor.t($options.pInfo ? $options.pInfo.description : "")
  } : {}, {
    m: $data.store.myResult
  }, $data.store.myResult ? {
    n: common_vendor.f($data.traitKeys, (t, k0, i0) => {
      return {
        a: common_vendor.t(t.name),
        b: common_vendor.t($data.store.myResult.traits[t.id]),
        c: $data.store.myResult.traits[t.id] + "%",
        d: $options.getTraitColor(t.id),
        e: common_vendor.t(t.desc),
        f: t.id
      };
    })
  } : {}, {
    o: $data.matchCode,
    p: common_vendor.o(($event) => $data.matchCode = $event.detail.value),
    q: common_vendor.o((...args) => $options.doMatch && $options.doMatch(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
