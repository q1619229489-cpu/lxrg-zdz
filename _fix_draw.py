<template>
  <view class="result-page safe-top">
    <view class="result-bg"></view>
    <view class="result-scroll">
      <view class="relation-card-wrap" v-if="matchResult">
        <text class="section-label">你们的搭子关系</text>
        <view class="relation-card">
          <image class="relation-image" :src="'/static/images/zuhe/' + matchResult.relationship.name + getZuheExt(matchResult.relationship.name)" mode="aspectFit" :style="relImgStyle" @load="onRelImgLoad"></image>
          <view class="relation-card-foot">
            <text class="relation-name">{{ matchResult.relationship.name }}</text>
            <view class="relation-desc">{{ matchResult.relationship.desc }}</view>
          </view>
        </view>
      </view>
      <view class="dual-card">
        <view class="personality-card left" v-if="myInfo">
          <image class="pc-avatar" :src="myInfo.imageCropped" mode="aspectFill"></image>
          <text class="pc-name">{{ myInfo.name }}</text>
          <text class="pc-tag">我</text>
        </view>
        <view class="vs-divider"><text class="vs-text">VS</text></view>
        <view class="personality-card right" v-if="partnerInfo">
          <image class="pc-avatar" :src="partnerInfo.imageCropped" mode="aspectFill"></image>
          <text class="pc-name">{{ partnerInfo.name }}</text>
          <text class="pc-tag">TA</text>
        </view>
      </view>
      <view class="rarity-card" v-if="matchResult">
        <view class="rarity-number"><text class="rarity-count">全平台 {{ matchResult.rarityCount }} 对</text><text class="rarity-text">触发此组合</text></view>
        <view class="rarity-analogy"><text class="rarity-analogy-text">{{ matchResult.rarityText }}</text></view>
      </view>
      <view class="destinations-card" v-if="matchResult && matchResult.destinations && matchResult.destinations.length">
        <text class="section-title">推荐一起去的地方</text>
        <view class="dest-list">
          <view class="dest-item" v-for="(dest, idx) in matchResult.destinations" :key="idx">
            <view class="dest-rank" :class="'rank-' + (idx + 1)"><text class="dest-rank-text">{{ idx + 1 }}</text></view>
            <view class="dest-info"><text class="dest-name">{{ dest.name }}</text><text class="dest-desc">{{ dest.desc }}</text></view>
          </view>
        </view>
      </view>
      <view class="result-actions">
        <view class="action-btn primary" @tap="goTeam">测测谁合适一起去</view>
        <view class="action-btn secondary" @tap="saveResultCard">保存结果卡片</view>
        <view class="action-btn text-btn" @tap="goHome">返回首页</view>
      </view>
      <canvas type="2d" id="saveCardCanvas" style="width:300px;height:475px;position:fixed;left:0;top:0;z-index:1;opacity:0.01;pointer-events:none;"></canvas>
    </view>
  </view>
</template>
<script>
  import store from "../../store/index.js"
  import { personalities } from "../../data/personalities.js"
  import { findRelationship } from "../../data/relationships.js"
  import { recommendDestination } from "../../data/destinations.js"
  export default {
    data() { return { store, myInfo: null, partnerInfo: null, matchResult: null, relImgStyle: {} } },
    onLoad(options) {
      var matched = options.matched === "true"
      if (store.currentMatch && store.currentMatch.partnerPersonality) {
        this.partnerInfo = personalities.find(function(x) { return x.id === store.currentMatch.partnerPersonality })
      } else if (options.inviteCode) {
        try { var map = JSON.parse(uni.getStorageSync("travelBuddy_inviteMap") || "{}"); var info = map[options.inviteCode]; if (info && info.personality) { this.partnerInfo = personalities.find(function(x) { return x.id === info.personality }) } } catch(e) {}
      }
      if (!this.partnerInfo) { this.partnerInfo = personalities.find(function(x) { return x.id === "卡皮巴适" }) || personalities[1] }
      if (store.myResult) { this.myInfo = personalities.find(function(x) { return x.id === store.myResult.personality }) }
      var myP = store.myResult ? store.myResult.personality : "特种兵"
      var pP = this.partnerInfo ? this.partnerInfo.id : "卡皮巴适"
      var rel = findRelationship(myP, pP)
      if (rel) { var tA = store.myResult ? store.myResult.traits : {}; var dests = recommendDestination(rel, myP, pP, [], tA, {}); this.matchResult = { relationship: rel, destinations: dests || [], rarityCount: rel.rarity, rarityText: rel.rarityText } }
    },
    methods: {
      onRelImgLoad(e) { var w = e.detail.width, h = e.detail.height; if (w && h) { var maxW = uni.getSystemInfoSync().windowWidth - 100; var rw = Math.min(maxW, w); var rh = (rw / w) * h; this.relImgStyle = { width: rw + 'px', height: rh + 'px' } } },
      getZuheExt(name) {
        var map = { '快到模糊组': '.jpeg', '松弛与急迫组': '.jpeg', '步数排行榜冠亚军': '.jpeg', '难以望其项背': '.jpg' }
        return map[name] || '.png'
      },
      saveResultCard() {
        var that = this; var rel = that.matchResult && that.matchResult.relationship
        if (!rel) { uni.showToast({ title: '暂无匹配结果', icon: 'none' }); return }
        uni.showLoading({ title: '生成卡片中…' })
        var zuhePath = '/static/images/zuhe/' + rel.name + that.getZuheExt(rel.name)
        var inviteCode = that.store.inviteCode || '------'
        var query = uni.createSelectorQuery().in(that)
        query.select('#saveCardCanvas').node(function(res) {
          if (!res || !res.node) { uni.hideLoading(); uni.showToast({ title: '画布初始化失败', icon: 'none' }); return }
          var canvas = res.node, ctx = canvas.getContext('2d'); var W = 600, H = 950, CX = 300; canvas.width = W; canvas.height = H; var zuheImg = null, qrImg = null; var drawn = false
          function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath() }
          function loadCanvasImg(src, cb) { if (!src) { cb(null); return }
            var img;
            // #ifdef H5
            img = new window.Image();
            img.crossOrigin = 'anonymous';
            // #endif
            // #ifndef H5
            img = canvas.createImage();
            // #endif
            img.onload = function() { cb(img) }; img.onerror = function() { console.log('canvas img fail:', src); cb(null) }
            img.src = src
          }
          function doSave(tempPath) {
            uni.hideLoading()
            // #ifdef H5
            // Use toBlob for reliable download (avoids data URL size limits)
            canvas.toBlob(function(blob) {
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a'); a.href = url; a.download = 'travel-buddy-card.png'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
              setTimeout(function() { URL.revokeObjectURL(url) }, 1000);
              uni.showToast({ title: '已保存', icon: 'success' })
            }, 'image/png')
            // #endif
            // #ifndef H5
            uni.previewImage({ urls: [tempPath], success: function() { uni.showToast({ title: '长按图片可保存', icon: 'none' }) }, fail: function() { uni.showToast({ title: '预览失败', icon: 'none' }) } })
            // #endif
          }
          function doDraw() {
            if (drawn) return; drawn = true
            try {
              ctx.fillStyle = '#FFF8F4'; rr(0, 0, W, H, 24); ctx.fill()
              ctx.fillStyle = '#FFFFFF'; rr(24, 24, W - 48, H - 48, 24); ctx.fill(); ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.stroke()
              var curY = 40
              if (zuheImg) { var zs = 460; var zh = zs * zuheImg.height / zuheImg.width; ctx.drawImage(zuheImg, CX - zs/2, curY, zs, zh); curY = curY + zh + 24 }
              
              ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, curY); ctx.lineTo(W - 80, curY); ctx.stroke(); curY = curY + 40
              ctx.font = '14px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('邀请码', CX, curY); curY = curY + 32
              ctx.font = '36px sans-serif'; ctx.fillStyle = '#FF6B35'; ctx.textAlign = 'left'; var chars = String(inviteCode).split(''); var spacing = 28; var totalW = chars.length * spacing; var sx = CX - totalW / 2
              for (var i = 0; i < chars.length; i++) { ctx.fillText(chars[i], sx + i * spacing, curY) }; ctx.textAlign = 'center'; curY = curY + 50
              ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, curY); ctx.lineTo(W - 80, curY); ctx.stroke(); curY = curY + 44
              var qrSize = 120; ctx.fillStyle = '#F8F6F4'; ctx.fillRect(CX - qrSize/2, curY, qrSize, qrSize); ctx.strokeStyle = '#D1D5DB'; ctx.lineWidth = 2; ctx.setLineDash([8,8]); rr(CX - qrSize/2, curY, qrSize, qrSize, 12); ctx.stroke(); ctx.setLineDash([])
              ctx.font = '14px sans-serif'; ctx.fillStyle = '#9CA3AF'; ctx.fillText('小程序码', CX, curY + qrSize/2 - 4); ctx.fillText('待申请', CX, curY + qrSize/2 + 16)
              if (qrImg) { ctx.clearRect(CX - qrSize/2, curY, qrSize, qrSize); ctx.drawImage(qrImg, CX - qrSize/2, curY, qrSize, qrSize) }
              curY = curY + qrSize + 24; ctx.font = '12px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('长按扫码 测测你的搭子类型', CX, curY)
              setTimeout(function() {
                uni.canvasToTempFilePath({ canvas: canvas, x: 0, y: 0, width: 600, height: 950, destWidth: 600, destHeight: 950, fileType: 'png', quality: 1, success: function(res) { doSave(res.tempFilePath || res) }, fail: function(er1) { uni.hideLoading(); uni.showToast({ title: '导出失败:' + (er1.errMsg||''), icon: 'none' }) } })
              }, 300)
            } catch(e) { uni.hideLoading(); uni.showToast({ title: '绘制异常:' + e.message, icon: 'none' }) }
          }
          var total = 2, loadedCnt = 0;
          var fallbackTimer = setTimeout(function() { console.log('saveResultCard timeout fallback'); doDraw() }, 5000); function doneOne() { loadedCnt++; if (loadedCnt >= total) { clearTimeout(fallbackTimer); doDraw() } }
          loadCanvasImg(zuhePath, function(img) { zuheImg = img; doneOne() })
          loadCanvasImg('/static/images/qr-code.jpg', function(img) { qrImg = img; doneOne() })
        }).exec()
      },
goTeam() { uni.switchTab({ url: "/pages/team/index" }) },
      goHome() { uni.switchTab({ url: "/pages/index/index" }) }
    }
  }
</script>
<style lang="scss" scoped>
  .result-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, #FFF8F4 0%, #F8F6F4 100%); z-index: 0; }
  .result-scroll { position: relative; padding: 60rpx 24rpx 60rpx; }
  .section-label { font-size: 24rpx; color: #8B8B9E; display: block; margin-bottom: 16rpx; text-align: center; }
  .relation-card-wrap { margin-bottom: 32rpx; }
  .relation-card { background: #FFFFFF; border-radius: 28rpx; padding: 24rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.08); border: 1rpx solid #EFEBE6; overflow: hidden; }
  .relation-image { width: 80%; border-radius: 16rpx; margin: 0 auto; display: block; background: #F8F6F4; border: 2rpx solid #E8E0D8; }
  .relation-card-foot { padding-top: 20rpx; text-align: center; }
  .relation-name { font-size: 40rpx; font-weight: 800; background: linear-gradient(135deg, #FF6B35, #F72585); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: block; margin-bottom: 8rpx; letter-spacing: 4rpx; }
  .relation-desc { font-size: 26rpx; color: #6B7280; line-height: 1.6; display: block; padding: 0 10rpx; }
  .dual-card { display: flex; align-items: center; gap: 20rpx; margin-bottom: 32rpx; }
  .personality-card { flex: 1; background: #FFFFFF; border-radius: 20rpx; padding: 24rpx; text-align: center; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.05); border: 1rpx solid #EFEBE6; }
  .pc-avatar { width: 110rpx; height: 110rpx; border-radius: 50%; margin: 0 auto 12rpx; display: block; background: #F8F6F4; }
  .pc-name { font-size: 28rpx; font-weight: 700; display: block; margin-bottom: 6rpx; }
  .pc-tag { font-size: 20rpx; color: #8B8B9E; padding: 2rpx 16rpx; background: #F8F6F4; border-radius: 20rpx; }
  .vs-divider { width: 60rpx; height: 60rpx; border-radius: 50%; background: linear-gradient(135deg, #FF6B35, #F72585); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .vs-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; }
  .rarity-card { background: linear-gradient(135deg, #1A1A2E, #2A2A4E); border-radius: 20rpx; padding: 36rpx 30rpx; text-align: center; margin-bottom: 24rpx; }
  .rarity-count { font-size: 36rpx; font-weight: 700; color: #FF6B35; } .rarity-text { font-size: 28rpx; color: #FFFFFF; margin-left: 8rpx; }
  .rarity-analogy { padding-top: 12rpx; border-top: 1rpx solid rgba(255,255,255,0.1); }
  .rarity-analogy-text { font-size: 24rpx; color: rgba(255,255,255,0.7); }
  .destinations-card { background: #FFFFFF; border-radius: 20rpx; padding: 28rpx; margin-bottom: 32rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.05); border: 1rpx solid #EFEBE6; }
  .section-title { font-size: 28rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 20rpx; }
  .dest-list { display: flex; flex-direction: column; gap: 16rpx; } .dest-item { display: flex; gap: 16rpx; align-items: center; }
  .dest-rank { width: 44rpx; height: 44rpx; border-radius: 10rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rank-1 { background: linear-gradient(135deg, #FF6B35, #F72585); } .rank-2 { background: #4361EE; } .rank-3 { background: #06D6A0; }
  .dest-rank-text { font-size: 22rpx; font-weight: 700; color: #FFFFFF; } .dest-info { flex: 1; }
  .dest-name { font-size: 28rpx; font-weight: 600; display: block; margin-bottom: 4rpx; }
  .dest-desc { font-size: 22rpx; color: #8B8B9E; line-height: 1.4; display: block; }
  .result-actions { display: flex; flex-direction: column; gap: 16rpx; padding-bottom: 40rpx; }
  .action-btn { padding: 26rpx 0; border-radius: 16rpx; font-size: 28rpx; font-weight: 600; text-align: center; }
  .action-btn.primary { background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; }
  .action-btn.secondary { background: #FFFFFF; color: #FF6B35; border: 2rpx solid #FF6B35; }
  .action-btn.text-btn { background: transparent; color: #6B7280; border: 1rpx solid #EFEBE6; }
</style>

















