const db = uniCloud.database()

exports.main = async (event, context) => {
  const { inviteCode } = event

  if (!inviteCode) {
    return { code: -1, message: '邀请码不能为空' }
  }

  const collection = db.collection('matchings')
  const res = await collection.where({
    inviteCode
  }).get()

  if (res.data.length === 0) {
    return { code: -2, message: '匹配记录不存在' }
  }

  const record = res.data[0]

  return {
    code: 0,
    data: {
      status: record.status,
      creator: record.status === 'matched' ? record.creator : null,
      result: record.result
    }
  }
}
