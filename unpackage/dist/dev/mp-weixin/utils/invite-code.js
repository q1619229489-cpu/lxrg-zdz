"use strict";
function generateInviteCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var code = "";
  for (var i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
function isValidInviteCode(code) {
  return /^[A-Z0-9]{6}$/.test(code);
}
exports.generateInviteCode = generateInviteCode;
exports.isValidInviteCode = isValidInviteCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/invite-code.js.map
