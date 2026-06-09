const db = uniCloud.database()

exports.main = async (event, context) => {
  const { code, name, destinationName, destinationId, pairA, pairB, relationshipName } = event

  if (!code || !destinationName || !pairA || !pairB || !relationshipName) {
    return { code: -1, message: '参数不完整' }
  }

  // 查重：组队码不能重复
  const collection = db.collection('teams')
  const existing = await collection.where({ code }).get()
  if (existing.data.length > 0) {
    return { code: -3, message: '组队码已存在，请重试' }
  }

  const res = await collection.add({
    code,
    name: name || '',
    destinationName,
    destinationId: destinationId || 1,
    pairA,
    pairB,
    relationshipName,
    members: [],
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  return {
    code: 0,
    message: '创建成功',
    data: { id: res.id, code }
  }
}
