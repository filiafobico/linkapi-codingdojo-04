const { t, addCustomTypes } = require('typy');

/**
 * @see IUser
 */
addCustomTypes({
  isCpf: (input) => (t(input).isString && /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g.test(String(input))),
  isObjectId: (input) => (t(input).isString && /^[\w\d]{24}$/g.test(String(input))),
});