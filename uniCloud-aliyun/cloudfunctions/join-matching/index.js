const db = uniCloud.database()

exports.main = async (event, context) => {
  const { inviteCode, userResult } = event

  if (!inviteCode || !userResult) {
    return { code: -1, message: '参数不完整' }
  }

  const collection = db.collection('matchings')
  const res = await collection.where({
    inviteCode,
    status: 'waiting'
  }).get()

  if (res.data.length === 0) {
    return { code: -2, message: '邀请码无效或已过期' }
  }

  const record = res.data[0]

  // 导入匹配计算
  const { findRelationship } = require('../../data/relationships.js')
  const { recommendDestination } = require('../../data/destinations.js')

  const relationship = findRelationship(record.creator.personality, userResult.personality)
  const destinations = recommendDestination(
    relationship,
    record.creator.traits,
    userResult.traits,
    []
  )

  // 更新匹配记录
  await collection.doc(record._id).update({
    joiner: {
      answers: userResult.answers,
      personality: userResult.personality,
      traits: userResult.traits,
      createdAt: Date.now()
    },
    result: {
      relationship: relationship ? {
        name: relationship.name,
        desc: relationship.desc,
        rarity: relationship.rarity,
        rarityText: relationship.rarityText
      } : null,
      destinations: destinations.slice(0, 3)
    },
    status: 'matched',
    updatedAt: Date.now()
  })

  return {
    code: 0,
    message: '匹配成功',
    data: {
      creator: record.creator,
      result: {
        relationship: relationship ? {
          name: relationship.name,
          desc: relationship.desc,
          rarity: relationship.rarity,
          rarityText: relationship.rarityText
        } : null,
        destinations: destinations.slice(0, 3)
      }
    }
  }
}
