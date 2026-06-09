const { checkDestinationFit } = require('matching-data')

exports.main = async (event, context) => {
  const { personality, destinationId, relationship } = event

  if (!personality || !destinationId) {
    return { code: -1, message: '参数不完整' }
  }

  const result = checkDestinationFit(
    { personality },
    destinationId,
    relationship
  )

  return {
    code: 0,
    data: result
  }
}
