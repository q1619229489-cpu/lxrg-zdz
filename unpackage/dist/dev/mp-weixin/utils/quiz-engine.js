"use strict";
const data_questions = require("../data/questions.js");
const data_personalities = require("../data/personalities.js");
function calculateResult(answers) {
  var scores = {};
  data_personalities.personalities.forEach(function(p) {
    scores[p.id] = 0;
  });
  var traits = { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 };
  var foodPrefs = [], destPrefs = [], pacePrefs = [];
  answers.forEach(function(selectedIndices, qIndex) {
    var question = data_questions.allQuestions[qIndex];
    if (!question)
      return;
    var selections = Array.isArray(selectedIndices) ? selectedIndices : [selectedIndices];
    selections.forEach(function(idx) {
      var option = question.options[idx];
      if (!option)
        return;
      if (scores[option.personality] !== void 0)
        scores[option.personality]++;
      if (option.traits) {
        Object.keys(option.traits).forEach(function(t) {
          if (traits[t] !== void 0)
            traits[t] += option.traits[t];
        });
      }
      if (question.multi) {
        if (qIndex === 9)
          foodPrefs.push(option.personality);
        else if (qIndex === 19)
          destPrefs.push(option.personality);
        else if (qIndex === 29)
          destPrefs.push(option.personality);
      }
    });
  });
  var maxScore = -1, topPersonalities = [];
  Object.entries(scores).forEach(function(_ref) {
    var p = _ref[0], score = _ref[1];
    if (score > maxScore) {
      maxScore = score;
      topPersonalities = [p];
    } else if (score === maxScore) {
      topPersonalities.push(p);
    }
  });
  var personality = topPersonalities.length > 1 ? topPersonalities[Math.floor(Math.random() * topPersonalities.length)] : topPersonalities[0];
  var normalizedTraits = {};
  Object.keys(traits).forEach(function(key) {
    normalizedTraits[key] = Math.max(0, Math.min(100, Math.round((traits[key] + 90) / 180 * 100)));
  });
  return { personality, scores, maxScore, traits: normalizedTraits, rawTraits: traits, foodPrefs, destPrefs, pacePrefs };
}
exports.calculateResult = calculateResult;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/quiz-engine.js.map
