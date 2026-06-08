const db = uniCloud.database()

exports.main = async (event, context) => {
  const { code } = event

  if (!code) {
    return { code: -1, message: '组队码不能为空' }
  }

  const collection = db.collection('teams')
  const res = await collection.where({ code }).get()

  if (res.data.length === 0) {
    return { code: -2, message: '组队码不存在' }
  }

  const team = res.data[0]

  return {
    code: 0,
    data: {
      id: team._id,
      code: team.code,
      destinationName: team.destinationName,
      destinationId: team.destinationId,
      pairA: team.pairA,
      pairB: team.pairB,
      relationshipName: team.relationshipName,
      members: team.members || [],
      status: team.status,
      createdAt: team.createdAt
    }
  }
}
