<template>
  <view class="quiz-page safe-top">
    <view class="quiz-header">
      <view class="quiz-top">
        <text class="quiz-back" @tap="goBack">返回</text>
        <view class="quiz-progress"><view class="quiz-progress-bar" :style="{ width: progressPercent + '%' }"></view></view>
        <text class="quiz-step">{{ currentIndex + 1 }}/{{ totalQuestions }}</text>
      </view>
    </view>
    <view class="quiz-body">
      <view class="multi-hint" v-if="isMulti"><text class="multi-hint-text">此题可多选</text></view>
      <text class="question-text">{{ currentQuestion.text }}</text>
      <view class="options-list">
        <view v-for="(option, idx) in currentQuestion.options" :key="idx" class="option-item"
          :class="{ 'option-selected': isSelected(idx), 'option-multi': isMulti }" @tap="toggleOption(idx)">
          <text class="option-label">{{ labelText(idx) }}</text>
          <text class="option-text">{{ option.text }}</text>
          <view class="option-check" v-if="isSelected(idx)"><text class="check-mark">?</text></view>
        </view>
      </view>
    </view>
    <view class="quiz-footer">
      <view class="quiz-next-btn" :class="{ 'btn-disabled': !hasSelection }" @tap="goNext">{{ isLast ? '完成答题' : '下一题' }}</view>
    </view>
  </view>
</template>
<script>
  import { allQuestions } from '../../data/questions.js'
  import { calculateResult } from '../../utils/quiz-engine.js'
  import store, { setQuizResult, setMatch, markMatched } from '../../store/index.js'
  import { findRelationship } from '../../data/relationships.js'
  import { recommendDestination } from '../../data/destinations.js'
  export default {
    data() { return { currentIndex: 0, answers: [], totalQuestions: allQuestions.length, allQuestions } },
    computed: {
      currentQuestion() { return this.allQuestions[this.currentIndex] },
      isMulti() { return this.currentQuestion && this.currentQuestion.multi },
      isLast() { return this.currentIndex >= this.totalQuestions - 1 },
      progressPercent() { return ((this.currentIndex + 1) / this.totalQuestions) * 100 },
      hasSelection() { var ans = this.answers[this.currentIndex]; return ans && ans.length > 0 }
    },
    onLoad(options) {
      if (options.inviteCode) { uni.setStorageSync('pendingInviteCode', options.inviteCode) }
      var _this = this
      this.allQuestions.forEach(function() { _this.answers.push([]) })
    },
    methods: {
      labelText(idx) { return String.fromCharCode(65 + idx) },
      isSelected(idx) { var ans = this.answers[this.currentIndex]; return ans && ans.indexOf(idx) !== -1 },
      toggleOption(idx) {
        var ans = this.answers[this.currentIndex]
        if (this.isMulti) {
          var pos = ans.indexOf(idx); if (pos > -1) { ans.splice(pos, 1) } else { ans.push(idx) }
        } else { this.answers[this.currentIndex] = [idx]; this.$forceUpdate() }
      },
      goNext() {
        if (!this.hasSelection) return
        if (this.isLast) { this.finishQuiz() } else { this.currentIndex++ }
      },
      finishQuiz() {
        var result = calculateResult(this.answers)
        setQuizResult(this.answers, result)
        var inviteCode = uni.getStorageSync('pendingInviteCode')
        if (inviteCode) {
          uni.removeStorageSync('pendingInviteCode')
          try {
            var map = JSON.parse(uni.getStorageSync('travelBuddy_inviteMap') || '{}')
            var partnerInfo = map[inviteCode]
            if (partnerInfo) {
              var rel = findRelationship(result.personality, partnerInfo.personality)
              if (rel) {
                var dests = recommendDestination(rel, result.personality, partnerInfo.personality, [], result.traits, partnerInfo.traits)
                var destName = (dests && dests.length > 0) ? dests[0].name : ''
                setMatch({ partnerName: '好友', partnerPersonality: partnerInfo.personality, partnerInviteCode: inviteCode, relationship: rel.name, destination: destName })
                markMatched(inviteCode)
              }
            }
          } catch(e) { console.log('auto match error:', e) }
          uni.redirectTo({ url: '/pages/result/index?inviteCode=' + inviteCode + '&matched=true' })
        } else { uni.redirectTo({ url: '/pages/invite/index' }) }
      },
      goBack() { uni.navigateBack() }
    }
  }
</script>
<style lang="scss" scoped>
  .quiz-page { min-height: 100vh; background: #F8F6F4; display: flex; flex-direction: column; }
  .quiz-header { padding: 20rpx 24rpx 10rpx; background: #FFFFFF; border-bottom: 1rpx solid #EFEBE6; }
  .quiz-top { display: flex; align-items: center; gap: 20rpx; }
  .quiz-back { font-size: 26rpx; color: #6B7280; font-weight: 500; }
  .quiz-progress { flex: 1; height: 10rpx; background: #EFEBE6; border-radius: 5rpx; overflow: hidden; }
  .quiz-progress-bar { height: 100%; background: linear-gradient(135deg, #FF6B35, #F72585); border-radius: 5rpx; transition: width 0.3s ease; }
  .quiz-step { font-size: 24rpx; font-weight: 600; color: #8B8B9E; }
  .quiz-body { flex: 1; padding: 30rpx 24rpx; overflow-y: auto; }
  .multi-hint { margin-bottom: 16rpx; }
  .multi-hint-text { font-size: 22rpx; color: #FF6B35; font-weight: 600; padding: 4rpx 16rpx; background: #FFF0E6; border-radius: 8rpx; }
  .question-text { font-size: 32rpx; font-weight: 600; color: #1A1A2E; line-height: 1.6; margin-bottom: 32rpx; }
  .options-list { display: flex; flex-direction: column; gap: 16rpx; }
  .option-item { background: #FFFFFF; border: 2rpx solid #EFEBE6; border-radius: 16rpx; padding: 28rpx 24rpx; display: flex; align-items: center; gap: 16rpx; position: relative; transition: all 0.2s; }
  .option-item:active { transform: scale(0.98); }
  .option-selected { border-color: #FF6B35; background: #FFF8F4; }
  .option-multi.option-selected { border-color: #4361EE; background: #F0F4FF; }
  .option-label { width: 44rpx; height: 44rpx; border-radius: 50%; background: #F8F6F4; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 600; color: #6B7280; flex-shrink: 0; }
  .option-selected .option-label { background: #FF6B35; color: #FFFFFF; }
  .option-multi.option-selected .option-label { background: #4361EE; }
  .option-text { flex: 1; font-size: 28rpx; color: #1A1A2E; line-height: 1.5; }
  .option-check { width: 36rpx; height: 36rpx; border-radius: 50%; background: #FF6B35; display: flex; align-items: center; justify-content: center; }
  .option-multi .option-check { background: #4361EE; }
  .check-mark { font-size: 20rpx; color: #FFFFFF; font-weight: 700; }
  .quiz-footer { padding: 20rpx 24rpx 40rpx; background: #FFFFFF; border-top: 1rpx solid #EFEBE6; }
  .quiz-next-btn { width: 100%; padding: 26rpx 0; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; border-radius: 16rpx; font-size: 30rpx; font-weight: 600; text-align: center; }
  .btn-disabled { opacity: 0.4; }
</style>
