<template>
  <view class="records-page safe-top">
    <view class="page-header"><text class="page-title">匹配记录</text></view>
    <view class="page-container">
      <view v-if="store.matchHistory.length > 0" class="records-list">
        <view class="record-item card" v-for="(item, idx) in store.matchHistory" :key="idx" @tap="viewDetail(item)">
          <view class="record-top">
            <view class="record-personalities">
              <image class="record-avatar-sm" :src="getPersonalityImage(store.myResult?.personality)" mode="aspectFill"></image>
              <text class="record-vs">x</text>
              <image class="record-avatar-sm" :src="getPersonalityImage(item.partnerPersonality)" mode="aspectFill"></image>
            </view>
            <text class="record-date">{{ item.date }}</text>
          </view>
          <view class="record-partner-row">
            <view class="record-partner-info">
              <text class="record-partner-label">和</text>
              <text class="record-partner-name">{{ item.partnerName || '好友' }}</text>
              <text class="record-partner-edit" @tap.stop="editPartnerName(idx)">改备注</text>
            </view>
          </view>
          <view class="record-relation"><text class="record-relation-name">{{ item.relationship }}</text></view>
          <view class="record-bottom" v-if="item.destination">
            <text class="record-dest">推荐：{{ item.destination }}</text>
            <view class="record-actions"><text class="record-action" @tap.stop="saveRecordCard(item)">保存卡片</text></view>
          </view>
        </view>
      </view>
      <view v-else class="empty-state card">
        <view class="empty-icon"><text class="empty-icon-text">记录</text></view>
        <text class="empty-title">还没有匹配记录</text>
        <text class="empty-desc">完成答题并匹配好友后，记录会显示在这里</text>
      </view>
    </view>
    <canvas type="2d" id="recordCardCanvas" style="width:600px;height:950px;position:fixed;left:-9999px;top:0;z-index:-1;"></canvas>
  </view>
</template>
<script>
  import store from "../../store/index.js"
  import { personalities } from "../../data/personalities.js"
  export default {
    data() { return { store, refreshKey: 0, _savingItem: null } },
    onShow() {
      if (store.matchHistory.length > 0) {
        store.matchHistory.forEach(function(item, idx) {
          var saved = uni.getStorageSync('travelBuddy_partnerName_' + idx)
          if (saved) item.partnerName = saved
        })
        this.refreshKey = Date.now()
      }
    },
    methods: {
      getPersonalityImage(id) { if (!id) return ""; var p = personalities.find(function(x) { return x.id === id }); return p ? p.imageCropped : "" },
      getPersonalityObj(id) { return personalities.find(function(x) { return x.id === id }) || null },
      getMime(ext) { return ext === '.png' ? 'image/png' : 'image/jpeg' },
      imgToDataUrl(path) { try { var fs = wx.getFileSystemManager(); var parts = path.split('.'); var ext = '.' + parts[parts.length - 1]; return 'data:' + this.getMime(ext) + ';base64,' + fs.readFileSync(path, 'base64') } catch(e) { return null } },
      viewDetail(item) { uni.showToast({ title: item.relationship, icon: "none" }) },
      saveRecordCard(item) {
        var that = this
        if (!store.myResult) { uni.showToast({ title: "请先完成答题", icon: "none" }); return }
        uni.showLoading({ title: '生成卡片中…' })
        var myP = that.getPersonalityObj(store.myResult.personality)
        var partnerP = that.getPersonalityObj(item.partnerPersonality)
        var myImgPath = myP ? myP.imageCropped : null
        var partnerImgPath = partnerP ? partnerP.imageCropped : null
        var qrPath = 'https://cdn.jsdelivr.net/gh/q1619229489-cpu/travel-buddy-images@main/qr-code.jpg'
        var relName = item.relationship || '未知组合'; var destName = item.destination || ''
        var partnerLabel = item.partnerName || '好友'; var myName = myP ? myP.name : store.myResult.personality; var partnerName = partnerP ? partnerP.name : item.partnerPersonality
        var myDataUrl = myImgPath ? that.imgToDataUrl(myImgPath) : null; var partnerDataUrl = partnerImgPath ? that.imgToDataUrl(partnerImgPath) : null; var qrDataUrl = that.imgToDataUrl(qrPath)
        var query = uni.createSelectorQuery().in(that)
        query.select('#recordCardCanvas').node(function(res) {
          if (!res || !res.node) { uni.hideLoading(); uni.showToast({ title: '画布初始化失败', icon: 'none' }); return }
          var canvas = res.node, ctx = canvas.getContext('2d')
          canvas.width = 600; canvas.height = 950; var CX = 300; var myImg = null; var partnerImg = null; var qrImg = null; var drawn = false
          function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath() }
          function doDraw() {
            if (drawn) return; drawn = true
            ctx.fillStyle = '#FFF8F4'; roundRect(0, 0, 600, 950, 24); ctx.fill()
            ctx.fillStyle = '#FFFFFF'; roundRect(24, 24, 552, 902, 24); ctx.fill(); ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.stroke()
            var grad = ctx.createLinearGradient(24, 24, 576, 88); grad.addColorStop(0, '#FF6B35'); grad.addColorStop(1, '#F72585')
            ctx.beginPath(); ctx.moveTo(48, 24); ctx.lineTo(552, 24); ctx.quadraticCurveTo(576, 24, 576, 48); ctx.lineTo(576, 88); ctx.lineTo(24, 88); ctx.lineTo(24, 48); ctx.quadraticCurveTo(24, 24, 48, 24); ctx.closePath()
            ctx.fillStyle = grad; ctx.fill()
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '22px sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.fillText('🎋 旅行搭子匹配器', CX, 56)
            var curY = 130
            if (myImg) { ctx.save(); ctx.beginPath(); ctx.arc(130, curY + 50, 50, 0, Math.PI * 2); ctx.closePath(); ctx.clip(); ctx.drawImage(myImg, 80, curY, 100, 100); ctx.restore() }
            ctx.font = '14px sans-serif'; ctx.fillStyle = '#1A1A2E'; ctx.fillText(myName, 130, curY + 115)
            if (partnerImg) { ctx.save(); ctx.beginPath(); ctx.arc(470, curY + 50, 50, 0, Math.PI * 2); ctx.closePath(); ctx.clip(); ctx.drawImage(partnerImg, 420, curY, 100, 100); ctx.restore() }
            ctx.fillText(partnerName, 470, curY + 115)
            ctx.font = '28px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('VS', CX, curY + 55)
            curY = curY + 150
            ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, curY); ctx.lineTo(520, curY); ctx.stroke()
            curY = curY + 40
            ctx.font = '18px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('搭子关系', CX, curY)
            curY = curY + 36
            ctx.font = '28px sans-serif'; ctx.fillStyle = '#FF6B35'; ctx.fillText(relName, CX, curY)
            curY = curY + 50
            if (destName) { ctx.font = '16px sans-serif'; ctx.fillStyle = '#6B7280'; ctx.fillText('推荐：' + destName, CX, curY); curY = curY + 40 }
            ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, curY); ctx.lineTo(520, curY); ctx.stroke()
            curY = curY + 50
            ctx.font = '14px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('我们', CX, curY)
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('和 ' + partnerLabel, CX, curY + 28)
            curY = curY + 80
            var qrSize = 160
            if (qrImg) { ctx.drawImage(qrImg, CX - qrSize / 2, curY, qrSize, qrSize) }
            curY = curY + qrSize + 24
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('长按扫码 测测你的搭子类型', CX, curY)
            setTimeout(function() {
              try {
                uni.canvasToTempFilePath({ canvas: canvas, x: 0, y: 0, width: 600, height: 950, destWidth: 600, destHeight: 950, fileType: 'jpg', quality: 1,
                  success: function(res) { uni.previewImage({ urls: [res.tempFilePath], success: function() { uni.hideLoading(); uni.showToast({ title: '长按图片可保存', icon: 'none' }) }, fail: function() { uni.hideLoading(); uni.showToast({ title: '预览失败', icon: 'none' }) } }) },
                  fail: function(er1) { uni.hideLoading(); uni.showToast({ title: '导出失败:' + (er1.errMsg||''), icon: 'none' }) } })
              } catch(e) { uni.hideLoading(); uni.showToast({ title: '异常:' + e.message, icon: 'none' }) }
            }, 300)
          }
          if (myDataUrl) { var m = canvas.createImage(); m.src = myDataUrl; m.onload = function() { myImg = m; doDraw() }; m.onerror = function() { doDraw() } } else { doDraw() }
          if (partnerDataUrl) { var p = canvas.createImage(); p.src = partnerDataUrl; p.onload = function() { partnerImg = p; doDraw() }; p.onerror = function() { doDraw() } }
          if (qrDataUrl) { var q = canvas.createImage(); q.src = qrDataUrl; q.onload = function() { qrImg = q; doDraw() }; q.onerror = function() { doDraw() } }
        }).exec()
      },
      editPartnerName(idx) {
        var item = this.store.matchHistory[idx]; var oldName = item.partnerName || '好友'
        uni.showModal({ title: '修改备注', content: '请输入你和TA的关系备注', editable: true, placeholderText: oldName, success: function(res) { if (res.confirm && res.content && res.content.trim()) { item.partnerName = res.content.trim(); uni.setStorageSync('travelBuddy_partnerName_' + idx, res.content.trim()); uni.showToast({ title: '已修改', icon: 'none' }) } } })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-header { padding: 30rpx 24rpx 20rpx; } .page-title { font-size: 36rpx; font-weight: 700; }
  .records-list { display: flex; flex-direction: column; gap: 0; }
  .record-item { } .record-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
  .record-personalities { display: flex; align-items: center; gap: 8rpx; }
  .record-avatar-sm { width: 48rpx; height: 48rpx; border-radius: 14rpx; background: #F8F6F4; display: block; }
  .record-vs { font-size: 20rpx; color: #8B8B9E; } .record-date { font-size: 22rpx; color: #8B8B9E; }
  .record-partner-row { margin-bottom: 8rpx; display: flex; align-items: center; justify-content: space-between; }
  .record-partner-info { display: flex; align-items: center; gap: 6rpx; }
  .record-partner-label { font-size: 24rpx; color: #8B8B9E; } .record-partner-name { font-size: 28rpx; font-weight: 600; color: #1A1A2E; }
  .record-partner-edit { font-size: 22rpx; color: #4361EE; padding: 2rpx 12rpx; border: 1rpx solid #4361EE; border-radius: 8rpx; margin-left: 8rpx; }
  .record-relation { margin-bottom: 12rpx; } .record-relation-name { font-size: 32rpx; font-weight: 700; background: linear-gradient(135deg, #FF6B35, #F72585); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .record-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 12rpx; border-top: 1rpx solid #EFEBE6; }
  .record-dest { font-size: 24rpx; color: #6B7280; } .record-actions { display: flex; gap: 12rpx; }
  .record-action { font-size: 22rpx; color: #FF6B35; font-weight: 500; padding: 4rpx 14rpx; border: 1rpx solid #FF6B35; border-radius: 8rpx; }
  .empty-state { text-align: center; padding: 80rpx 30rpx; }
  .empty-icon { width: 120rpx; height: 120rpx; border-radius: 50%; background: #EFEBE6; display: flex; align-items: center; justify-content: center; margin: 0 auto 24rpx; }
  .empty-icon-text { font-size: 36rpx; font-weight: 600; color: #8B8B9E; }
  .empty-title { font-size: 30rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 8rpx; }
  .empty-desc { font-size: 24rpx; color: #8B8B9E; display: block; line-height: 1.6; }
</style>
