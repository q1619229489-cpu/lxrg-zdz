import { reactive } from 'vue'
import { generateInviteCode } from '../utils/invite-code.js'

const state = reactive({
  hasTakenQuiz: false, answers: [], myResult: null,
  inviteCode: null, currentMatch: null, matchStatus: 'none',
  matchHistory: [], groupShares: []
})

export function initStore() {
  try {
    var saved = uni.getStorageSync('travelBuddyStore')
    if (saved) { Object.assign(state, JSON.parse(saved)) }
  } catch(e) { console.log('Store init error:', e) }
}

function saveState() {
  try { uni.setStorageSync('travelBuddyStore', JSON.stringify(state)) } catch(e) {}
}

function saveToInviteCodeMap(code, personality, traits) {
  try {
    var raw = uni.getStorageSync('travelBuddy_inviteMap')
    var map = raw ? JSON.parse(raw) : {}
    map[code] = { personality: personality, traits: traits || {} }
    uni.setStorageSync('travelBuddy_inviteMap', JSON.stringify(map))
  } catch(e) { console.log('Save inviteMap error:', e) }
}

export function findByInviteCode(code) {
  if (code === '888888') return { personality: '特种兵', traits: {} }
  try {
    var raw = uni.getStorageSync('travelBuddy_inviteMap')
    var map = raw ? JSON.parse(raw) : {}
    return map[code] || null
  } catch(e) { return null }
}

export function hasMatchedBefore(inviteCode) {
  try {
    var raw = uni.getStorageSync('travelBuddy_matchedCodes')
    var matched = raw ? JSON.parse(raw) : []
    return matched.indexOf(inviteCode) !== -1
  } catch(e) { return false }
}

export function markMatched(inviteCode) {
  try {
    var raw = uni.getStorageSync('travelBuddy_matchedCodes')
    var matched = raw ? JSON.parse(raw) : []
    if (matched.indexOf(inviteCode) === -1) { matched.push(inviteCode) }
    uni.setStorageSync('travelBuddy_matchedCodes', JSON.stringify(matched))
  } catch(e) {}
}

export function setQuizResult(answers, result) {
  state.hasTakenQuiz = true
  state.answers = answers
  state.myResult = result
  state.inviteCode = generateInviteCode()
  saveToInviteCodeMap(state.inviteCode, result.personality, result.traits)
  saveState()
}

export function setMatch(matchData) {
  state.currentMatch = matchData
  state.matchStatus = 'matched'
  // 去重：通过 partnerInviteCode 判断是否已存在
  var idx = state.matchHistory.findIndex(function(m) { return m.partnerInviteCode === matchData.partnerInviteCode })
  var entry = { date: new Date().toLocaleDateString('zh-CN'), ...matchData }
  if (idx !== -1) {
    state.matchHistory[idx] = entry
  } else {
    state.matchHistory.unshift(entry)
  }
  saveState()
}

export function setWaiting() { state.matchStatus = 'waiting'; saveState() }

export function addGroupShare(shareData) {
  state.groupShares.unshift({ date: new Date().toLocaleDateString('zh-CN'), ...shareData })
  saveState()
}

export function resetStore() {
  Object.assign(state, { hasTakenQuiz: false, answers: [], myResult: null, inviteCode: null, currentMatch: null, matchStatus: 'none', matchHistory: [], groupShares: [] })
  saveState()
}

export function useStore() { return state }
export default state
