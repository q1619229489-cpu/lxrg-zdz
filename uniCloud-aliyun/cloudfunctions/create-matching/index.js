const db = uniCloud.database()

exports.main = async (event, context) => {
  const { inviteCode, userResult } = event

  if (!inviteCode || !userResult) {
    return { code: -1, message: '参数不完整' }
  }

  const collection = db.collection('matchings')

  // 创建匹配记录
  const res = await collection.add({
    inviteCode,
    creator: {
      answers: userResult.answers,
      personality: userResult.personality,
      traits: userResult.traits,
      createdAt: Date.now()
    },
    joiner: null,
    result: null,
    status: 'waiting', // waiting | matched
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  return {
    code: 0,
    message: '创建成功',
    data: {
      id: res.id,
      inviteCode
    }
  }
}
