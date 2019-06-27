const { User } = require('./models');

var validateFunc = function(decoded) {
  const user_id = decoded.user_id;

  return User.findById(user_id)
    .then(user => {
      if (user) {
        decoded['user'] = user.email;
        return { isValid: true, credentials: decoded };
      } else {
        return { isValid: false };
      }
    })
    .catch(err => {
      return { isValid: false };
    });
};

module.exports = validateFunc;
