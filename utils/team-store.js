function getIndexKey() { return "travelBuddy_teamIndex" }
function getJoinedKey() { return "travelBuddy_joinedTeams" }

function getTeamIndex() {
  try { var raw = uni.getStorageSync(getIndexKey()); return raw ? JSON.parse(raw) : {} }
  catch(e) { return {} }
}
function saveTeamIndex(idxMap) { try { uni.setStorageSync(getIndexKey(), JSON.stringify(idxMap)) } catch(e) {} }

function getJoinedTeams() {
  try { var raw = uni.getStorageSync(getJoinedKey()); return raw ? JSON.parse(raw) : [] }
  catch(e) { return [] }
}
function saveJoinedTeams(list) { try { uni.setStorageSync(getJoinedKey(), JSON.stringify(list)) } catch(e) {} }

function generateCode() {
  var code = ""
  for (var i = 0; i < 8; i++) { code += Math.floor(Math.random() * 10).toString() }
  return code
}

export async function getOrCreateTeam(matchIndex, matchData, teamName) {
  var idxMap = getTeamIndex()
  if (idxMap[matchIndex]) return idxMap[matchIndex]
  var code = generateCode()
  try {
    var res = await uniCloud.callFunction({
      name: "create-team",
      data: {
        code: code,
        name: teamName || '',
        destinationName: matchData.destination || "",
        destinationId: matchData.destinationId || 1,
        pairA: { personality: matchData.myPersonality || "", traits: matchData.myTraits || {} },
        pairB: { personality: matchData.partnerPersonality || "", traits: matchData.partnerTraits || {} },
        relationshipName: matchData.relationship || ""
      }
    })
    if (res.result.code !== 0) {
      return getOrCreateTeam(matchIndex, matchData)
    }
    idxMap[matchIndex] = code
    saveTeamIndex(idxMap)
    return code
  } catch(e) {
    console.error("create-team error:", e)
    return null
  }
}

export async function getTeam(teamCode) {
  try {
    var res = await uniCloud.callFunction({
      name: "get-team",
      data: { code: teamCode }
    })
    if (res.result.code === 0) return res.result.data
    // 有调试信息就打印出来
    if (res.result.debug) {
      console.log("get-team debug:", JSON.stringify(res.result.debug, null, 2))
    }
    return null
  } catch(e) {
    console.error("get-team error:", e)
    return null
  }
}

export async function joinTeam(teamCode, memberData) {
  try {
    var res = await uniCloud.callFunction({
      name: "join-team",
      data: { code: teamCode, memberData: memberData }
    })
    return res.result.code === 0
  } catch(e) {
    console.error("join-team error:", e)
    return false
  }
}

export function getAllTeamCodes() {
  var idxMap = getTeamIndex()
  return Object.keys(idxMap).map(function(k) { return { matchIndex: parseInt(k), code: idxMap[k] } })
}

export function getJoinedTeamCodes() {
  return getJoinedTeams()
}

export function addJoinedTeam(code) {
  var list = getJoinedTeams()
  if (list.indexOf(code) === -1) { list.push(code); saveJoinedTeams(list) }
}

export default { getOrCreateTeam: getOrCreateTeam, getTeam: getTeam, joinTeam: joinTeam, getAllTeamCodes: getAllTeamCodes, getJoinedTeamCodes: getJoinedTeamCodes, addJoinedTeam: addJoinedTeam }


