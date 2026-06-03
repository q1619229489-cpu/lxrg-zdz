<template>
  <view class="collection-page safe-top">
    <view class="page-header"><text class="page-title">图鉴</text></view>
    <view class="page-container">
      <view class="section">
        <text class="section-title">关系图鉴</text>
        <text class="section-subtitle">已解锁的关系组合会亮起</text>
        <view class="relationship-grid">
          <view class="relation-cell" v-for="r in relationships" :key="r.id" :class="{ unlocked: isRelationUnlocked(r) }" @tap="previewRelation(r)">
            <view v-if="isRelationUnlocked(r)" class="relation-image-wrap">
              <image class="relation-image" :src="'/static/images/裁剪后/' + r.name + '.png'" mode="aspectFill"></image>
              <view class="relation-overlay"><text class="relation-overlay-name">{{ r.name }}</text></view>
            </view>
            <view v-else class="locked-content">
              <view class="locked-icon"><text class="locked-icon-text">?</text></view>
              <text class="locked-text">未解锁</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import store from "../../store/index.js"
  import { relationships } from "../../data/relationships.js"
  export default {
    data() { return { store, relationships } },
    methods: {
      isRelationUnlocked(rel) {
        if (!store.myResult) return false
        return store.matchHistory.some(function(item) { return item.relationship === rel.name })
      },
      previewRelation(r) {
        if (!this.isRelationUnlocked(r)) return
        uni.showToast({ title: r.name + ": " + r.desc, icon: "none" })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-header { padding: 30rpx 24rpx 10rpx; }
  .page-title { font-size: 36rpx; font-weight: 700; }
  .section { margin-bottom: 40rpx; }
  .section-title { font-size: 28rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 6rpx; }
  .section-subtitle { font-size: 22rpx; color: #8B8B9E; display: block; margin-bottom: 16rpx; }
  .relationship-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
  .relation-cell { background: #FFFFFF; border-radius: 20rpx; border: 2rpx solid #EFEBE6; min-height: 200rpx; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .relation-cell.unlocked { border-color: #F72585; box-shadow: 0 2rpx 16rpx rgba(247,37,133,0.1); }
  .relation-image-wrap { position: relative; width: 100%; height: 100%; min-height: 200rpx; display: flex; align-items: flex-end; }
  .relation-image { width: 100%; min-height: 200rpx; border-radius: 18rpx; display: block; }
  .relation-overlay { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); border-radius: 0 0 18rpx 18rpx; padding: 40rpx 16rpx 14rpx; }
  .relation-overlay-name { font-size: 26rpx; font-weight: 700; color: #FFFFFF; display: block; text-align: center; }
  .locked-content { text-align: center; }
  .locked-icon { width: 60rpx; height: 60rpx; border-radius: 50%; background: #EFEBE6; display: flex; align-items: center; justify-content: center; margin: 0 auto 8rpx; }
  .locked-icon-text { font-size: 28rpx; font-weight: 600; color: #8B8B9E; }
  .locked-text { font-size: 22rpx; color: #8B8B9E; }
</style>
