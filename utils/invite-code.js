export function generateInviteCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  var code = ''
  for (var i = 0; i < 6; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)) }
  return code
}

export function isValidInviteCode(code) { return /^[A-Z0-9]{6}$/.test(code) }
