const db = uniCloud.database()

exports.main = async (event, context) => {
  const { code, memberData } = event

  if (!code || !memberData) {
    return { code: -1, message: '参数不完整' }
  }

  const collection = db.collection('teams')
  const res = await collection.where({ code, status: 'active' }).get()

  if (res.data.length === 0) {
    return { code: -2, message: '组队码无效或已过期' }
  }

  const team = res.data[0]
  const members = team.members || []

  // 服务端去重：同一 inviteCode 不能重复加入
  if (memberData.inviteCode) {
    var exists = members.some(function(m) { return m.inviteCode === memberData.inviteCode })
    if (exists) {
      return { code: -4, message: '你已经加入过该队伍' }
    }
  }

  const member = {
    nickName: memberData.nickName || '',
    avatarUrl: memberData.avatarUrl || '',
    personality: memberData.personality || '',
    fit: memberData.fit || 'no',
    fitReason: memberData.fitReason || '',
    inviteCode: memberData.inviteCode || ''
  }

  members.push(member)

  await collection.doc(team._id).update({
    members,
    updatedAt: Date.now()
  })

  return {
    code: 0,
    message: '加入成功'
  }
}
