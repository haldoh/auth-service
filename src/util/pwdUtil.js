const securePassword = require('secure-password');

const checkResult = {};
checkResult[securePassword.INVALID_UNRECOGNIZED_HASH] = false;
checkResult[securePassword.INVALID] = false;
checkResult[securePassword.VALID] = true;
checkResult[securePassword.VALID_NEEDS_REHASH] = true;

async function encrPwd(password) {
  const pwd = securePassword();
  const passwordBuf = Buffer.from(password);
  return pwd.hash(passwordBuf);
}

async function checkPwd(password, hash) {
  const pwd = securePassword();
  const passwordBuf = Buffer.from(password);
  const result = await pwd.verify(passwordBuf, hash);
  return {
    valid: checkResult[result],
    hash: result === securePassword.VALID_NEEDS_REHASH ? encrPwd(password) : undefined,
  };
}

module.exports = {
  encrPwd,
  checkPwd,
};
