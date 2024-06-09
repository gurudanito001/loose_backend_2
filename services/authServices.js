const bcrypt  = require('bcrypt');


async function hashPassword(password, salt = 8) {
  return bcrypt.hash(password, salt);
};

async function isPasswordMatch (providePassword, userPassword) {
  return bcrypt.compare(providePassword, userPassword);
};

function generateRandomString (length = 4, digitOnly = true)  {
  let result = '';
  const characters = digitOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  hashPassword,
  isPasswordMatch,
  generateRandomString
}