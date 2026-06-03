<template>
  <view class="complete-page safe-top">
    <view class="complete-content">
      <view class="complete-icon"><text class="complete-icon-text">完成</text></view>
      <text class="complete-title">答题完成！</text>
      <text class="complete-desc">你的旅行人格已生成，快来解锁你的旅行标签</text>
      <view class="personality-card" v-if="store.myResult">
        <image class="pc-full" :src="pImage" mode="aspectFit"></image>
      </view>
      <view class="invite-box">
        <text class="invite-label">你的邀请码</text>
        <text class="invite-code">{{ store.inviteCode }}</text>
        <text class="invite-hint">将此邀请码发给好友，匹配你们的旅行搭子关系</text>
      </view>
      <view class="complete-actions">
        <view class="action-btn primary" @tap="copyCode">复制邀请码</view>
        <view class="action-btn secondary" @tap="goHome">返回首页</view>
      </view>
    </view>
  </view>
</template>
<script>
  import store from "../../store/index.js"
  import { personalities } from "../../data/personalities.js"
  export default {
    data() { return { store } },
    computed: {
      pImage() {
        if (!store.myResult) return ""
        var p = personalities.find(function(x) { return x.id === store.myResult.personality })
        return p ? p.image : ""
      }
    },
    methods: {
      copyCode() {
        if (!store.inviteCode) return
        uni.setClipboardData({ data: store.inviteCode, success: function() { uni.showToast({ title: "复制成功", icon: "none" }) } })
      },
      goHome() { uni.switchTab({ url: "/pages/index/index" }) }
    }
  }
</script>
<style lang="scss" scoped>
  .complete-page { min-height: 100vh; background: #FFF8F4; display: flex; align-items: center; justify-content: center; }
  .complete-content { text-align: center; padding: 40rpx; width: 100%; }
  .complete-icon { width: 120rpx; height: 120rpx; border-radius: 50%; background: linear-gradient(135deg, #06D6A0, #00B894); display: flex; align-items: center; justify-content: center; margin: 0 auto 24rpx; }
  .complete-icon-text { font-size: 36rpx; font-weight: 700; color: #FFFFFF; }
  .complete-title { font-size: 36rpx; font-weight: 700; color: #1A1A2E; display: block; margin-bottom: 12rpx; }
  .complete-desc { font-size: 26rpx; color: #6B7280; display: block; margin-bottom: 40rpx; line-height: 1.6; }
  .personality-card { width: 80%; margin: 0 auto 32rpx; border-radius: 24rpx; overflow: hidden; background: #FFFFFF; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08); }
  .pc-full { width: 100%; display: block; }
  .invite-box { background: #FFFFFF; border-radius: 20rpx; padding: 32rpx; margin: 0 auto 32rpx; width: 80%; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.05); }
  .invite-label { font-size: 24rpx; color: #8B8B9E; display: block; margin-bottom: 12rpx; }
  .invite-code { font-size: 48rpx; font-weight: 700; letter-spacing: 10rpx; color: #FF6B35; display: block; margin-bottom: 12rpx; font-family: monospace; }
  .invite-hint { font-size: 22rpx; color: #8B8B9E; display: block; line-height: 1.5; }
  .complete-actions { display: flex; flex-direction: column; gap: 16rpx; width: 80%; margin: 0 auto; }
  .action-btn { padding: 26rpx 0; border-radius: 16rpx; font-size: 28rpx; font-weight: 600; text-align: center; }
  .action-btn.primary { background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; }
  .action-btn.secondary { background: #FFFFFF; color: #6B7280; border: 1rpx solid #EFEBE6; }
</style>
