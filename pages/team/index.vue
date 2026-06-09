<template>
  <view class="team-page safe-top">
    <view class="page-header"><text class="page-title">组队</text></view>
    <view class="page-inner">
      <view class="card join-section">
        <text class="section-title">加入组队</text>
        <view class="join-row">
          <input class="join-input" v-model="joinCode" placeholder="输入8位数字组队码" maxlength="8" />
          <view class="join-btn" @tap="doJoin">查看</view>
        </view>
        <text class="join-hint">输入好友的组队码，测测你是否适合加入</text>
      </view>
      <view v-if="createdTeams.length > 0" class="card history-section">
        <text class="section-title">我的队伍</text>
        <view class="team-list">
          <view class="team-item" v-for="(t, idx) in createdTeams" :key="idx">
            <view class="team-top">
              <view class="team-title-area">
                <text class="team-name" v-if="t.name">{{ t.name }}</text>
                <text class="team-rel">{{ t.relationshipName }}</text>
                <text class="team-dest" v-if="t.destinationName">· {{ t.destinationName }}</text>
              </view>
              <view class="team-code-actions">
                <text class="team-code-text">{{ t.code }}</text>
                <text class="team-copy-btn" @tap.stop="showCode=t.code">复制</text>
              </view>
            </view>
            <view class="team-members" v-if="t.members && t.members.length > 0">
              <view class="tm-label"><text class="tm-label-text">已加入：</text><text class="tm-count">{{ countFit(t.members) }}人合适</text></view>
              <view class="tm-avatars">
                <view class="tm-member" v-for="(m, mi) in t.members" :key="mi">
                  <image class="tm-avatar" :src="getMemberAvatar(m)" mode="aspectFill"></image>
                  <text class="tm-name">{{ m.nickName || m.personality }}</text>
                  <text class="tm-fit-tag" :class="'tag-' + m.fit">{{ m.fit==="yes" ? "适合" : m.fit==="ok" ? "还行" : "不适合" }}</text>
                </view>
              </view>
            </view>
            <view class="team-members-empty" v-else><text class="tm-empty-text">暂无成员加入</text></view>
          </view>
        </view>
      </view>
      <view v-if="hasMatches" class="card create-section">
        <text class="section-title">创建组队</text>
        <text class="section-subtitle">从匹配记录中选择一个生成组队码</text>
        <view class="match-list">
          <view class="match-item" v-for="(item, idx) in store.matchHistory" :key="idx" @tap="showNameModalFor(idx)">
            <view class="match-left">
              <image class="match-avatar" :src="getPImage(item.partnerPersonality)" mode="aspectFill"></image>
              <view class="match-info">
                <text class="match-relation">{{ item.relationship }}</text>
                <text class="match-partner">和 {{ item.partnerName || "好友" }}</text>
              </view>
            </view>
            <text class="match-code-btn">{{ teamCodes[idx] ? "已生成" : "生成码" }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 队伍名称输入弹窗 -->
    <view class="overlay" v-if="showNameModal" @tap="showNameModal=false">
      <view class="modal" @tap.stop>
        <text class="modal-title">设置队伍名称</text>
        <text class="modal-desc">给你的队伍起个名字吧</text>
        <input class="modal-input" v-model="teamNameInput" placeholder="输入队伍名称" maxlength="20" />
        <view class="modal-actions">
          <view class="modal-btn" @tap="createTeamWithName">确认创建</view>
          <view class="modal-btn secondary" @tap="showNameModal=false">取消</view>
        </view>
      </view>
    </view>
    <!-- 组队码展示弹窗 -->
    <view class="overlay" v-if="showCode" @tap="showCode=''">
      <view class="modal" @tap.stop>
        <text class="modal-title">组队码</text>
        <text class="modal-desc">将组队码发给好友测合拍</text>
        <view class="modal-code">{{ showCode }}</view>
        <view class="modal-actions">
          <view class="modal-btn" @tap="copyCode">复制组队码</view>
          <view class="modal-btn secondary" @tap="showCode=''">关闭</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import store from "../../store/index.js"
  import { personalities } from "../../data/personalities.js"
  import { getOrCreateTeam, getTeam, getAllTeamCodes, getJoinedTeamCodes } from "../../utils/team-store.js"
  export default {
    data() {
      return {
        store, joinCode: "", showCode: "", teamCodes: {}, createdTeams: [],
        showNameModal: false, teamNameInput: "", creatingMatchIdx: -1
      }
    },
    computed: { hasMatches() { return store.matchHistory && store.matchHistory.length > 0 } },
    onShow() { this.loadTeams() },
    methods: {
      getPImage(id) { if (!id) return ""; var p = personalities.find(function(x) { return x.id === id }); return p ? p.imageCropped : "" },
      getMemberAvatar(m) {
        if (m.avatarUrl) return m.avatarUrl
        var p = personalities.find(function(x) { return x.id === m.personality })
        return p ? p.imageCropped : ""
      },
      countFit(members) { var n = 0; members.forEach(function(m) { if (m.fit === "yes" || m.fit === "ok") n++ }); return n },
      async loadTeams() {
        var idxMap = getAllTeamCodes(); var codes = {}; var seen = {}; var list = []
        for (var i = 0; i < idxMap.length; i++) {
          var item = idxMap[i]
          codes[item.matchIndex] = item.code
          if (!seen[item.code]) {
            seen[item.code] = true
            var team = await getTeam(item.code)
            if (team) { team.code = item.code; list.push(team) }
          }
        }
        var joinedCodes = getJoinedTeamCodes()
        for (var j = 0; j < joinedCodes.length; j++) {
          var jc = joinedCodes[j]
          if (!seen[jc]) {
            seen[jc] = true
            var jt = await getTeam(jc)
            if (jt) { jt.code = jc; list.push(jt) }
          }
        }
        this.teamCodes = codes; this.createdTeams = list
      },
      showNameModalFor(idx) {
        if (this.teamCodes[idx]) { uni.showToast({ title: "已生成组队码", icon: "none" }); return }
        this.creatingMatchIdx = idx
        this.teamNameInput = ""
        this.showNameModal = true
      },
      async createTeamWithName() {
        var idx = this.creatingMatchIdx
        if (idx < 0) return
        var item = store.matchHistory[idx]
        var teamName = this.teamNameInput.trim() || (item.relationship || "队伍") + "的队伍"
        var code = await getOrCreateTeam(idx, {
          destination: item.destinationName,
          destinationId: item.destinationId,
          relationship: item.relationship,
          myPersonality: store.myResult.personality,
          myTraits: store.myResult.traits,
          partnerPersonality: item.partnerPersonality,
          partnerTraits: item.partnerTraits || {}
        }, teamName)
        if (code) {
          this.teamCodes[idx] = code
          this.showNameModal = false
          this.showCode = code
          this.loadTeams()
        }
      },
      doJoin() {
        var code = this.joinCode.replace(/\s/g, "")
        if (code.length !== 8 || !/^\d+$/.test(code)) { uni.showToast({ title: "请输入8位数字组队码", icon: "none" }); return }
        uni.navigateTo({ url: "/pages/team-join/index?code=" + code })
      },
      copyCode() {
        if (!this.showCode) return
        uni.setClipboardData({ data: this.showCode, success: function() { uni.showToast({ title: "已复制", icon: "none" }) } })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .team-page { background: #F8F6F4; min-height: 100vh; }
  .page-header { padding: 30rpx 24rpx 10rpx; }
  .page-title { font-size: 36rpx; font-weight: 700; }
  .page-inner { padding: 0 24rpx 40rpx; }
  .section-title { font-size: 28rpx; font-weight: 600; color: #1A1A2E; display: block; margin-bottom: 16rpx; }
  .section-subtitle { font-size: 22rpx; color: #8B8B9E; display: block; margin-bottom: 16rpx; margin-top: -10rpx; }
  .join-section { margin-bottom: 24rpx; }
  .join-row { display: flex; gap: 16rpx; align-items: center; margin-bottom: 12rpx; }
  .join-input { flex: 1; height: 80rpx; border: 2rpx solid #EFEBE6; border-radius: 14rpx; padding: 0 20rpx; font-size: 36rpx; letter-spacing: 8rpx; text-align: center; font-weight: 700; background: #F8F6F4; }
  .join-btn { padding: 20rpx 36rpx; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; border-radius: 14rpx; font-size: 28rpx; font-weight: 600; flex-shrink: 0; }
  .join-hint { font-size: 22rpx; color: #8B8B9E; display: block; }
  .history-section { margin-bottom: 24rpx; }
  .team-list { display: flex; flex-direction: column; gap: 16rpx; }
  .team-item { padding: 20rpx; background: #FFFFFF; border-radius: 16rpx; border: 1rpx solid #EFEBE6; }
  .team-top { display: flex; align-items: flex-start; gap: 12rpx; margin-bottom: 12rpx; }
  .team-title-area { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8rpx; }
  .team-name { font-size: 28rpx; font-weight: 700; color: #1A1A2E; display: block; width: 100%; }
  .team-rel { font-size: 24rpx; font-weight: 500; color: #6B7280; }
  .team-dest { font-size: 22rpx; color: #8B8B9E; }
  .team-code-actions { display: flex; align-items: center; gap: 8rpx; flex-shrink: 0; padding-top: 4rpx; }
  .team-code-text { font-size: 24rpx; font-weight: 700; letter-spacing: 2rpx; color: #FF6B35; font-family: monospace; }
  .team-copy-btn { font-size: 20rpx; color: #4361EE; padding: 4rpx 12rpx; border: 1rpx solid #4361EE; border-radius: 8rpx; }
  .tm-label { display: flex; align-items: center; gap: 8rpx; margin-bottom: 10rpx; }
  .tm-label-text { font-size: 22rpx; color: #6B7280; }
  .tm-count { font-size: 22rpx; color: #06D6A0; font-weight: 600; }
  .tm-avatars { display: flex; flex-wrap: wrap; gap: 12rpx; }
  .tm-member { display: flex; flex-direction: column; align-items: center; gap: 4rpx; width: 96rpx; }
  .tm-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; background: #EFEBE6; }
  .tm-name { font-size: 20rpx; color: #1A1A2E; display: block; text-align: center; overflow: hidden; text-overflow: ellipsis; width: 96rpx; white-space: nowrap; }
  .tm-fit-tag { font-size: 18rpx; padding: 2rpx 10rpx; border-radius: 8rpx; font-weight: 500; }
  .tag-yes { background: #E0F7EC; color: #006838; } .tag-ok { background: #FFF8E1; color: #8B6914; } .tag-no { background: #FDE8F0; color: #8A0038; }
  .tm-empty-text { font-size: 22rpx; color: #8B8B9E; }
  .create-section { margin-bottom: 24rpx; }
  .match-list { display: flex; flex-direction: column; gap: 12rpx; }
  .match-item { display: flex; align-items: center; justify-content: space-between; padding: 20rpx; background: #FFFFFF; border-radius: 16rpx; border: 1rpx solid #EFEBE6; }
  .match-left { display: flex; align-items: center; gap: 14rpx; }
  .match-avatar { width: 56rpx; height: 56rpx; border-radius: 14rpx; background: #EFEBE6; flex-shrink: 0; }
  .match-info { }
  .match-relation { font-size: 26rpx; font-weight: 600; display: block; }
  .match-partner { font-size: 22rpx; color: #8B8B9E; display: block; }
  .match-code-btn { font-size: 24rpx; padding: 8rpx 20rpx; border-radius: 10rpx; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; flex-shrink: 0; }
  .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; }
  .modal { background: #FFFFFF; border-radius: 28rpx; padding: 48rpx 40rpx; width: 80%; max-width: 560rpx; text-align: center; }
  .modal-title { font-size: 36rpx; font-weight: 700; color: #1A1A2E; display: block; margin-bottom: 12rpx; }
  .modal-desc { font-size: 26rpx; color: #6B7280; line-height: 1.6; display: block; margin-bottom: 28rpx; }
  .modal-code { font-size: 56rpx; font-weight: 700; letter-spacing: 12rpx; color: #FF6B35; padding: 24rpx; background: #FFF8F4; border-radius: 16rpx; border: 2rpx dashed #FF6B35; font-family: monospace; margin-bottom: 28rpx; }
  .modal-input { height: 80rpx; border: 2rpx solid #EFEBE6; border-radius: 14rpx; padding: 0 20rpx; font-size: 30rpx; text-align: center; background: #F8F6F4; width: 80%; margin: 0 auto 28rpx; }
  .modal-actions { display: flex; flex-direction: column; gap: 16rpx; }
  .modal-btn { padding: 24rpx 0; border-radius: 14rpx; font-size: 30rpx; font-weight: 600; text-align: center; background: linear-gradient(135deg, #FF6B35, #F72585); color: #FFFFFF; }
  .modal-btn.secondary { background: #FFFFFF; color: #6B7280; border: 1rpx solid #EFEBE6; }
</style>
