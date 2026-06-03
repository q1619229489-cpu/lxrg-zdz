"use strict";
const common_vendor = require("../../common/vendor.js");
const data_questions = require("../../data/questions.js");
const utils_quizEngine = require("../../utils/quiz-engine.js");
const store_index = require("../../store/index.js");
const data_relationships = require("../../data/relationships.js");
const data_destinations = require("../../data/destinations.js");
const _sfc_main = {
  data() {
    return { currentIndex: 0, answers: [], totalQuestions: data_questions.allQuestions.length, allQuestions: data_questions.allQuestions };
  },
  computed: {
    currentQuestion() {
      return this.allQuestions[this.currentIndex];
    },
    isMulti() {
      return this.currentQuestion && this.currentQuestion.multi;
    },
    isLast() {
      return this.currentIndex >= this.totalQuestions - 1;
    },
    progressPercent() {
      return (this.currentIndex + 1) / this.totalQuestions * 100;
    },
    hasSelection() {
      var ans = this.answers[this.currentIndex];
      return ans && ans.length > 0;
    }
  },
  onLoad(options) {
    if (options.inviteCode) {
      common_vendor.index.setStorageSync("pendingInviteCode", options.inviteCode);
    }
    var _this = this;
    this.allQuestions.forEach(function() {
      _this.answers.push([]);
    });
  },
  methods: {
    labelText(idx) {
      return String.fromCharCode(65 + idx);
    },
    isSelected(idx) {
      var ans = this.answers[this.currentIndex];
      return ans && ans.indexOf(idx) !== -1;
    },
    toggleOption(idx) {
      var ans = this.answers[this.currentIndex];
      if (this.isMulti) {
        var pos = ans.indexOf(idx);
        if (pos > -1) {
          ans.splice(pos, 1);
        } else {
          ans.push(idx);
        }
      } else {
        this.answers[this.currentIndex] = [idx];
        this.$forceUpdate();
      }
    },
    goNext() {
      if (!this.hasSelection)
        return;
      if (this.isLast) {
        this.finishQuiz();
      } else {
        this.currentIndex++;
      }
    },
    finishQuiz() {
      var result = utils_quizEngine.calculateResult(this.answers);
      store_index.setQuizResult(this.answers, result);
      var inviteCode = common_vendor.index.getStorageSync("pendingInviteCode");
      if (inviteCode) {
        common_vendor.index.removeStorageSync("pendingInviteCode");
        try {
          var map = JSON.parse(common_vendor.index.getStorageSync("travelBuddy_inviteMap") || "{}");
          var partnerInfo = map[inviteCode];
          if (partnerInfo) {
            var rel = data_relationships.findRelationship(result.personality, partnerInfo.personality);
            if (rel) {
              var dests = data_destinations.recommendDestination(rel, result.personality, partnerInfo.personality, [], result.traits, partnerInfo.traits);
              var destName = dests && dests.length > 0 ? dests[0].name : "";
              store_index.setMatch({ partnerName: "好友", partnerPersonality: partnerInfo.personality, partnerInviteCode: inviteCode, relationship: rel.name, destination: destName });
              store_index.markMatched(inviteCode);
            }
          }
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/quiz/index.vue:78", "auto match error:", e);
        }
        common_vendor.index.redirectTo({ url: "/pages/result/index?inviteCode=" + inviteCode + "&matched=true" });
      } else {
        common_vendor.index.redirectTo({ url: "/pages/invite/index" });
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $options.progressPercent + "%",
    c: common_vendor.t($data.currentIndex + 1),
    d: common_vendor.t($data.totalQuestions),
    e: $options.isMulti
  }, $options.isMulti ? {} : {}, {
    f: common_vendor.t($options.currentQuestion.text),
    g: common_vendor.f($options.currentQuestion.options, (option, idx, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.labelText(idx)),
        b: common_vendor.t(option.text),
        c: $options.isSelected(idx)
      }, $options.isSelected(idx) ? {} : {}, {
        d: idx,
        e: $options.isSelected(idx) ? 1 : "",
        f: common_vendor.o(($event) => $options.toggleOption(idx), idx)
      });
    }),
    h: $options.isMulti ? 1 : "",
    i: common_vendor.t($options.isLast ? "完成答题" : "下一题"),
    j: !$options.hasSelection ? 1 : "",
    k: common_vendor.o((...args) => $options.goNext && $options.goNext(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e8795f1c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quiz/index.js.map
