const { expect } = require('chai');

const { encrPwd, checkPwd } = require('../../src/util/pwdUtil');

describe('pwdUtil', () => {
  describe('#encrPwd()', () => {
    it('should encypt the given password', async () => {
      const pwd = 'test_password';
      const pwdHash = await encrPwd(pwd);
      expect(pwdHash).to.not.equal(pwd);
    });
  });
  describe('#checkPwd()', () => {
    it('should match the correct password', async () => {
      const pwd = 'test_password';
      const pwdHash = await encrPwd(pwd);
      const checkResult = await checkPwd(pwd, pwdHash);
      expect(checkResult.valid).to.be.true;
    });
    it('should not match the wrong password', async () => {
      const pwd = 'test_password';
      const pwdHash = await encrPwd(pwd);
      const checkResult = await checkPwd('another_password', pwdHash);
      expect(checkResult.valid).to.be.false;
    });
  });
});
