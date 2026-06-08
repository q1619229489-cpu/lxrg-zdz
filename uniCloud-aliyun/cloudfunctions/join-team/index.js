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

  const member = {
    nickName: memberData.nickName || '',
    avatarUrl: memberData.avatarUrl || '',
    personality: memberData.personality || '',
    fit: memberData.fit || 'no',
    fitReason: memberData.fitReason || ''
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
