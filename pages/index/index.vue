<template>
  <view class="page safe-top">
    <view class="header">
      <text class="header-title">旅行搭子匹配器</text>
      <text class="header-sub">测测你和TA的旅行人格有多搭</text>
    </view>

    <view v-if="!store.hasTakenQuiz" class="welcome-card card">
      <view class="welcome-icon"><text class="welcome-icon-text">出发</text></view>
      <text class="welcome-title">还没测过你的旅行人格？</text>
      <text class="welcome-desc">30道题测出你的旅行人格标签</text>
      <view class="welcome-btn" @tap="goQuiz">开始答题</view>
    </view>

    <view v-if="store.hasTakenQuiz">
      <view class="card invite-card" id="inviteCard">
        <view class="invite-header">
          <text class="invite-label">我的邀请码</text>
          <view class="invite-actions">
            <text class="invite-action" @tap="copyCode">复制</text>
            <text class="invite-action" @tap="saveCard">保存图片</text>
          </view>
        </view>
        <view class="invite-code">{{ store.inviteCode }}</view>
        <view class="invite-hint">邀请好友解锁旅行搭子类型</view>
      </view>

      <view class="card personality-card" v-if="store.myResult">
        <view class="personality-header"><text class="personality-label">我的旅行人格</text></view>
        <view class="personality-content">
          <image class="personality-avatar" :src="pInfo ? pInfo.imageCropped : ''" mode="aspectFill"></image>
          <view class="personality-text">
            <text class="personality-badge" :style="{ background: pColor.bg, color: pColor.text }">{{ store.myResult.personality }}</text>
            <text class="personality-desc">{{ pInfo ? pInfo.description : '' }}</text>
          </view>
        </view>
      </view>

      <view class="card traits-card" v-if="store.myResult">
        <text class="section-title">旅行特质分布</text>
        <view class="traits-list">
          <view class="trait-item" v-for="t in traitKeys" :key="t.id">
            <view class="trait-header"><text class="trait-name">{{ t.name }}</text><text class="trait-value">{{ store.myResult.traits[t.id] }}%</text></view>
            <view class="trait-bar"><view class="trait-fill" :style="{ width: store.myResult.traits[t.id] + '%', background: getTraitColor(t.id) }"></view></view>
            <text class="trait-desc">{{ t.desc }}</text>
          </view>
        </view>
      </view>

      <view class="card match-card">
        <text class="section-title">匹配好友</text>
        <view class="match-input-row">
          <input class="match-input" v-model="matchCode" placeholder="输入好友邀请码" maxlength="6" />
          <view class="match-btn" @tap="doMatch">匹配</view>
        </view>
      </view>
    </view>

    <view style="height: 40rpx"></view>
    <canvas type="2d" id="homeCardCanvas" style="width:600px;height:950px;position:fixed;left:-9999px;top:0;z-index:-1;"></canvas>
  </view>
</template>

<script>
  import store from "../../store/index.js"
  import { personalities } from "../../data/personalities.js"
  import { traitDefinitions } from "../../data/personalities.js"
  import { isValidInviteCode } from "../../utils/invite-code.js"
  import { findRelationship } from "../../data/relationships.js"
  import { recommendDestination } from "../../data/destinations.js"
  import { setMatch, findByInviteCode, hasMatchedBefore, markMatched } from "../../store/index.js"

  export default {
    data() { return { store, matchCode: "", traitKeys: traitDefinitions, _myChecked: false } },
    computed: {
      pInfo() {
        if (!store.myResult) return null
        return personalities.find(function(p) { return p.id === store.myResult.personality })
      },
      pColor() {
        if (!this.pInfo) return { bg: "#E8E8E8", text: "#999" }
        return { bg: this.pInfo.bgColor, text: this.pInfo.textColor }
      }
    },
    onShow() {
      // 创建方：进入首页时检查自己的邀请码是否已被对方匹配
      var myCode = store.inviteCode
      if (!myCode || !store.hasTakenQuiz || this._myChecked) return
      var alreadyInHistory = store.matchHistory.some(function(m) { return m.partnerInviteCode === myCode })
      if (alreadyInHistory) { this._myChecked = true; return }
      var _this = this
      uniCloud.callFunction({
        name: 'get-result',
        data: { inviteCode: myCode }
      }).then(function(res) {
        _this._myChecked = true
        if (res.result && res.result.code === 0 && res.result.data && res.result.data.status === 'matched') {
          var data = res.result.data
          var rel = data.result && data.result.relationship
          var dests = data.result && data.result.destinations
          var destName = (dests && dests.length > 0) ? dests[0].name : ''
          var joinerP = data.joiner ? data.joiner.personality : ''
          setMatch({ partnerName: '好友', partnerPersonality: joinerP, partnerInviteCode: myCode, relationship: rel ? rel.name : '', destination: destName })
          uni.showToast({ title: '有新匹配结果！', icon: 'none' })
        }
      }).catch(function(err) { console.log('check match result error:', err) })
    },
    methods: {
      goQuiz() { uni.navigateTo({ url: "/pages/quiz/index" }) },
      copyCode() { if (!store.inviteCode) return; uni.setClipboardData({ data: store.inviteCode, success: function() { uni.showToast({ title: "复制成功", icon: "none" }) } }) },
      getMime(ext) { return ext === '.png' ? 'image/png' : 'image/jpeg' },
      imgToDataUrl(path) { try { var fs = wx.getFileSystemManager(); var parts = path.split('.'); var ext = '.' + parts[parts.length - 1]; return 'data:' + this.getMime(ext) + ';base64,' + fs.readFileSync(path, 'base64') } catch(e) { return null } },
      getTraitColor(id) { var colors = { action: "#FF6B35", planning: "#4361EE", photo: "#F72585", spontaneity: "#06D6A0", food: "#B8860B", budget: "#5C4D3C" }; return colors[id] || "#999" },
      saveCard() {
        var that = this
        if (!store.myResult || !store.inviteCode) { uni.showToast({ title: "暂无内容", icon: "none" }); return }
        uni.showLoading({ title: '生成卡片中…' })
        var pName = store.myResult.personality || '';
        var inviteCode = store.inviteCode || '';
        var pDataUrl = that.imgToDataUrl(that.pInfo ? that.pInfo.imageCropped : '');
        var qrDataUrl = that.imgToDataUrl('https://cdn.jsdelivr.net/gh/q1619229489-cpu/travel-buddy-images@main/qr-code.jpg');
        var query = uni.createSelectorQuery().in(that);
        query.select('#homeCardCanvas').node(function(res) {
          if (!res || !res.node) { uni.hideLoading(); uni.showToast({ title: '画布初始化失败', icon: 'none' }); return }
          var canvas = res.node, ctx = canvas.getContext('2d');
          var W = 600, H = 950, CX = 300; canvas.width = W; canvas.height = H
          var personImg = null, qrImg = null, loaded = { person: false, qr: false }
          function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath() }
          function doDraw() {
            ctx.fillStyle = '#FFF8F4'; roundRect(0, 0, W, H, 24); ctx.fill()
            ctx.fillStyle = '#FFFFFF'; roundRect(24, 24, W - 48, H - 48, 24); ctx.fill(); ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.stroke()
            var grad = ctx.createLinearGradient(24, 24, W - 24, 88); grad.addColorStop(0, '#FF6B35'); grad.addColorStop(1, '#F72585');
            ctx.beginPath(); ctx.moveTo(48, 24); ctx.lineTo(W - 48, 24); ctx.quadraticCurveTo(W - 24, 24, W - 24, 48); ctx.lineTo(W - 24, 88); ctx.lineTo(24, 88); ctx.lineTo(24, 48); ctx.quadraticCurveTo(24, 24, 48, 24); ctx.closePath()
            ctx.fillStyle = grad; ctx.fill(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '22px sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.fillText('🎋 旅行搭子匹配器', CX, 56)
            var imgY = 130
            if (personImg) { var ps = Math.min(200, Math.min(personImg.width, personImg.height)); ctx.save(); ctx.beginPath(); ctx.arc(CX, imgY + ps / 2, ps / 2, 0, Math.PI * 2); ctx.closePath(); ctx.clip(); ctx.drawImage(personImg, CX - ps / 2, imgY, ps, ps); ctx.restore(); imgY = imgY + ps + 24 }
            ctx.font = '28px sans-serif'; ctx.fillStyle = '#1A1A2E'; ctx.fillText(pName, CX, imgY); imgY = imgY + 50
            ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, imgY); ctx.lineTo(520, imgY); ctx.stroke(); imgY = imgY + 40
            ctx.font = '12px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('邀请码', CX, imgY); imgY = imgY + 32
            ctx.font = '36px sans-serif'; ctx.fillStyle = '#FF6B35'; var chars = String(inviteCode).split(''); var spacing = 28; var totalW = chars.length * spacing; var sx = CX - totalW / 2; ctx.textAlign = 'left'
            for (var i = 0; i < chars.length; i++) { ctx.fillText(chars[i], sx + i * spacing, imgY) }; ctx.textAlign = 'center'; imgY = imgY + 10
            imgY = imgY + 40; ctx.strokeStyle = '#EFEBE6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(80, imgY); ctx.lineTo(520, imgY); ctx.stroke(); imgY = imgY + 40
            var qrSize = 160
            if (qrImg) { ctx.drawImage(qrImg, CX - qrSize / 2, imgY, qrSize, qrSize) }
            imgY = imgY + qrSize + 24; ctx.font = '12px sans-serif'; ctx.fillStyle = '#8B8B9E'; ctx.fillText('长按扫码 测测你的搭子类型', CX, imgY)
            setTimeout(function() {
              try { uni.canvasToTempFilePath({ canvas: canvas, x: 0, y: 0, width: 600, height: 950, destWidth: 600, destHeight: 950, fileType: 'jpg', quality: 1, success: function(res) { uni.previewImage({ urls: [res.tempFilePath], success: function() { uni.hideLoading(); uni.showToast({ title: '长按图片可保存', icon: 'none' }) }, fail: function() { uni.hideLoading(); uni.showToast({ title: '预览失败', icon: 'none' }) } }) }, fail: function(er1) { uni.hideLoading(); uni.showToast({ title: '导出失败:' + (er1.errMsg||''), icon: 'none' }) } }) } catch(e) { uni.hideLoading(); uni.showToast({ title: '异常:' + e.message, icon: 'none' }) }
            }, 100)
          }
          if (pDataUrl) { var pImg = canvas.createImage(); pImg.src = pDataUrl; pImg.onload = function() { personImg = pImg; loaded.person = true; if (loaded.person && loaded.qr) doDraw() }; pImg.onerror = function() { loaded.person = true; if (loaded.person && loaded.qr) doDraw() } } else { loaded.person = true }
          if (qrDataUrl) { var qImg = canvas.createImage(); qImg.src = qrDataUrl; qImg.onload = function() { qrImg = qImg; loaded.qr = true; if (loaded.person && loaded.qr) doDraw() }; qImg.onerror = function() { loaded.qr = true; if (loaded.person && loaded.qr) doDraw() } } else { loaded.qr = true }
          if (loaded.person && loaded.qr) doDraw()
        }).exec()
      },
      doMatch() {
        var code = this.matchCode.trim().toUpperCase()
        if (!isValidInviteCode(code)) { uni.showToast({ title: "请输入6位有效邀请码", icon: "none" }); return }
        if (code === store.inviteCode) { uni.showToast({ title: "不能和自己匹配", icon: "none" }); return }
        if (code !== "888888" && hasMatchedBefore(code)) { uni.showToast({ title: "你们已经匹配过了", icon: "none" }); return }
        if (!store.hasTakenQuiz || !store.myResult) { uni.showToast({ title: "请先完成答题", icon: "none" }); return }
        // 测试码 888888 走本地匹配
        if (code === '888888') {
          var partnerInfo = findByInviteCode(code)
          if (!partnerInfo) { uni.showToast({ title: "邀请码不存在", icon: "none" }); return }
          var rel = findRelationship(store.myResult.personality, partnerInfo.personality)
          if (rel) {
            var dests = recommendDestination(rel, store.myResult.personality, partnerInfo.personality, [], store.myResult.traits, partnerInfo.traits)
            var destName = (dests && dests.length > 0) ? dests[0].name : ""
            setMatch({ partnerName: "好友", partnerPersonality: partnerInfo.personality, partnerInviteCode: code, relationship: rel.name, destination: destName })
            uni.navigateTo({ url: "/pages/result/index?inviteCode=" + code + "&matched=true" })
          }
          return
        }
        // 调用云函数进行匹配
        var _this = this
        uni.showLoading({ title: '匹配中…', mask: true })
        uniCloud.callFunction({
          name: 'join-matching',
          data: {
            inviteCode: code,
            userResult: {
              answers: store.answers,
              personality: store.myResult.personality,
              traits: store.myResult.traits
            }
          }
        }).then(function(res) {
          uni.hideLoading()
          if (res.result && res.result.code === 0) {
            var data = res.result.data
            var rel = data.result && data.result.relationship
            var dests = data.result && data.result.destinations
            var destName = (dests && dests.length > 0) ? dests[0].name : ''
            var partnerPersonality = data.creator ? data.creator.personality : ''
            setMatch({ partnerName: "好友", partnerPersonality: partnerPersonality, partnerInviteCode: code, relationship: rel ? rel.name : '', destination: destName })
            markMatched(code)
            uni.navigateTo({ url: "/pages/result/index?inviteCode=" + code + "&matched=true" })

          } else {
            var cloudMsg = (res.result && res.result.message) || "云端匹配失败"
            uni.showToast({ title: cloudMsg, icon: "none" })
          }
        }).catch(function(err) {
          uni.hideLoading()
          console.log("cloud match error:", err)
          uni.showToast({ title: "网络错误，请稍后重试", icon: "none" })
        })
        var partnerInfo = findByInviteCode(code)
        if (!partnerInfo) { uni.showToast({ title: "邀请码不存在", icon: "none" }); return }
        var rel = findRelationship(store.myResult.personality, partnerInfo.personality)
        if (rel) {
          var dests = recommendDestination(rel, store.myResult.personality, partnerInfo.personality, [], store.myResult.traits, partnerInfo.traits)
          var destName = (dests && dests.length > 0) ? dests[0].name : ""
          setMatch({ partnerName: "好友", partnerPersonality: partnerInfo.personality, partnerInviteCode: code, relationship: rel.name, destination: destName })
          markMatched(code)
          uni.navigateTo({ url: "/pages/result/index?inviteCode=" + code + "&matched=true" })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header { padding: 40rpx 24rpx 30rpx; text-align: center; }
  .header-title { font-size: 40rpx; font-weight: 700; color: #1A1A2E; display: block; }
  .header-sub { font-size: 26rpx; color: #8B8B9E; margin-top: 8rpx; display: block; }
  .welcome-card { text-align: center; padding: 60rpx 30rpx; }
  .welcome-icon { width: 120rpx; height: 120rpx; border-radius: 50%; background: linear-gradient(135deg, #FF6B35, #F72585); display: flex; align-items: center; justify-content: center; margin: 0 auto 24rpx; }
  .welcome-icon-text { font-size: 36rpx; font-weight: 700; color: #FFFFFF; }
  .welcome-title { font-size: 32rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 12rpx; }
  .welcome-desc { font-size: 26rpx; color: #8B8B9E; display: block; margin-bottom: 36rpx; }
  .welcome-btn { width: 60%; margin: 0 auto; padding: 24rpx 0; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; border-radius: 16rpx; font-size: 30rpx; font-weight: 600; text-align: center; }
  .section-title { font-size: 28rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 20rpx; }
  .invite-card { text-align: center; }
  .invite-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
  .invite-label { font-size: 28rpx; font-weight: 600; }
  .invite-actions { display: flex; gap: 16rpx; }
  .invite-action { font-size: 24rpx; color: #FF6B35; font-weight: 500; padding: 6rpx 16rpx; border: 1rpx solid #FF6B35; border-radius: 10rpx; }
  .invite-code { font-size: 56rpx; font-weight: 700; letter-spacing: 10rpx; color: #1A1A2E; padding: 20rpx; background: #F8F6F4; border-radius: 14rpx; border: 2rpx dashed #EFEBE6; font-family: monospace; margin-bottom: 16rpx; }
  .invite-hint { font-size: 24rpx; color: #6B7280; margin-bottom: 20rpx; }
  .personality-header { margin-bottom: 16rpx; }
  .personality-label { font-size: 26rpx; color: #6B7280; }
  .personality-content { display: flex; align-items: center; gap: 24rpx; }
  .personality-avatar { width: 120rpx; height: 120rpx; border-radius: 24rpx; flex-shrink: 0; background: #F8F6F4; }
  .personality-text { flex: 1; }
  .personality-badge { display: inline-block; padding: 6rpx 24rpx; border-radius: 30rpx; font-size: 30rpx; font-weight: 700; margin-bottom: 8rpx; }
  .personality-desc { font-size: 24rpx; color: #6B7280; line-height: 1.6; display: block; }
  .trait-item { margin-bottom: 20rpx; }
  .trait-header { display: flex; justify-content: space-between; margin-bottom: 8rpx; }
  .trait-name { font-size: 26rpx; font-weight: 600; color: #1A1A2E; }
  .trait-value { font-size: 24rpx; font-weight: 600; color: #8B8B9E; }
  .trait-bar { height: 12rpx; background: #EFEBE6; border-radius: 6rpx; overflow: hidden; }
  .trait-fill { height: 100%; border-radius: 6rpx; transition: width 0.6s ease; }
  .trait-desc { font-size: 22rpx; color: #8B8B9E; margin-top: 6rpx; display: block; }
  .match-input-row { display: flex; gap: 16rpx; align-items: center; }
  .match-input { flex: 1; height: 80rpx; border: 2rpx solid #EFEBE6; border-radius: 14rpx; padding: 0 20rpx; font-size: 28rpx; letter-spacing: 6rpx; text-transform: uppercase; background: #F8F6F4; }
  .match-btn { padding: 20rpx 36rpx; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; border-radius: 14rpx; font-size: 28rpx; font-weight: 600; }
</style>




