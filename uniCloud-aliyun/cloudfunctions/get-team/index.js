const db = uniCloud.database()

exports.main = async (event, context) => {
  const { code } = event

  if (!code) {
    return { code: -1, message: "组队码不能为空" }
  }

  const collection = db.collection("teams")

  // 先查字符串类型
  var res = await collection.where({ code: code }).get()

  // 如果查不到，试一下数字类型（防止存储时类型不一致）
  if (res.data.length === 0) {
    var numCode = parseInt(code)
    if (!isNaN(numCode)) {
      res = await collection.where({ code: numCode }).get()
    }
  }

  // 如果还查不到，取最新的10条记录看看结构
  if (res.data.length === 0) {
    var samples = await collection.orderBy("createdAt", "desc").limit(10).get()
    return {
      code: -2,
      message: "组队码不存在",
      debug: {
        searchedCode: code,
        searchedCodeType: typeof code,
        totalDocs: samples.data.length,
        docs: samples.data.map(function(d) {
          return {
            id: d._id,
            code: d.code,
            codeType: typeof d.code,
            destinationName: d.destinationName,
            createdAt: d.createdAt
          }
        })
      }
    }
  }

  var team = res.data[0]

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
