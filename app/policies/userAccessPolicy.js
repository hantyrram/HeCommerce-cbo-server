const UserMustHaveValidPermission = require('./rules/UserMustHaveValidPermission');
const UserMustBeLoggedIn = require('./rules/UserMustBeLoggedIn');
module.exports = [
 new UserMustBeLoggedIn(),
];