<template>
  <view class="team-join-page safe-top">
    <view class="page-header"><text class="page-title">组队结果</text></view>
    <view class="page-container">
      <view class="card result-section">
        <image class="result-avatar" :src="personalityImg" mode="aspectFill" v-if="personalityImg"></image>
        <text class="result-pname">{{ personalityName }}</text>
        <text class="result-pdesc">{{ personalityDesc }}</text>
        <view class="result-fit-badge" :class="'fit-' + fitResult"><text class="fit-text">{{ fitLabel }}</text></view>
        <text class="fit-reason">{{ fitReason }}</text>
        <view class="result-actions"><view class="action-btn primary" @tap="goTeam">返回组队</view></view>
      </view>
    </view>
  </view>
</template>
<script>
  import { personalities } from "../../data/personalities.js"
  import { checkDestinationFit } from "../../utils/destination-fit.js"
  import { getTeam, joinTeam, addJoinedTeam } from "../../utils/team-store.js"
  import store from "../../store/index.js"
  export default {
    data() { return { personalityName: "", personalityDesc: "", personalityImg: "", fitResult: "no", fitLabel: "", fitReason: "" } },
    async onLoad(options) {
      var code = options.code || ""
      if (!code) { uni.showToast({ title: "组队码无效", icon: "none" }); return }
      var teamData = await getTeam(code)
      if (!teamData) { uni.showToast({ title: "组队码不存在", icon: "none" }); return }
      if (!store.hasTakenQuiz || !store.myResult) { uni.showToast({ title: "请先完成答题", icon: "none" }); return }
      var p = personalities.find(function(x) { return x.id === store.myResult.personality })
      this.personalityName = p ? p.name : store.myResult.personality
      this.personalityDesc = p ? p.description : ""
      this.personalityImg = p ? p.imageCropped : ""
      var fitInfo = checkDestinationFit(store.myResult, teamData.destinationName || teamData.destinationId, null)
      this.fitResult = fitInfo.fit; this.fitReason = fitInfo.reason
      this.fitLabel = fitInfo.fit === "yes" ? "适合组队" : fitInfo.fit === "ok" ? "还行" : "不适合"
      await joinTeam(code, { nickName: "", avatarUrl: "", personality: store.myResult.personality, fit: fitInfo.fit, fitReason: fitInfo.reason })
      addJoinedTeam(code)
    },
    methods: { goTeam() { uni.switchTab({ url: "/pages/team/index" }) } }
  }
</script>
<style lang="scss" scoped>
  .page-header { padding: 30rpx 24rpx 10rpx; }
  .page-title { font-size: 36rpx; font-weight: 700; display: block; }
  .result-section { text-align: center; padding: 40rpx 30rpx; }
  .result-avatar { width: 140rpx; height: 140rpx; border-radius: 28rpx; margin: 0 auto 16rpx; display: block; background: #F8F6F4; }
  .result-pname { font-size: 36rpx; font-weight: 700; color: #1A1A2E; display: block; margin-bottom: 6rpx; }
  .result-pdesc { font-size: 24rpx; color: #6B7280; line-height: 1.6; display: block; margin-bottom: 24rpx; }
  .result-fit-badge { width: 160rpx; height: 160rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20rpx; }
  .fit-yes { background: #06D6A0; } .fit-ok { background: #FFB800; } .fit-no { background: #F72585; }
  .fit-text { font-size: 32rpx; font-weight: 700; color: #FFFFFF; }
  .fit-reason { font-size: 26rpx; color: #6B7280; line-height: 1.6; display: block; margin-bottom: 32rpx; }
  .result-actions { display: flex; flex-direction: column; gap: 16rpx; }
  .action-btn { padding: 26rpx 0; border-radius: 16rpx; font-size: 28rpx; font-weight: 600; text-align: center; }
  .action-btn.primary { background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; }
</style>
